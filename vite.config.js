import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { sendContactEmail } from './server/contactCore.js'
import { handleChatHttp } from './server/chatApi.js'

function livecribApi(env) {
  const contactHandler = (req, res, next) => {
    if (req.method !== 'POST') return next()
    let raw = ''
    req.on('data', (chunk) => { raw += chunk })
    req.on('end', async () => {
      let payload = {}
      try { payload = JSON.parse(raw || '{}') } catch { payload = {} }
      const { status, body } = await sendContactEmail(payload, env)
      res.statusCode = status
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(body))
    })
  }

  const chatHandler = async (req, res, next) => {
    const path = (req.url || '').split('?')[0]
    if (path !== '/api/chat' && path !== '/api/chat/history') return next()
    try {
      await handleChatHttp(req, res, env)
    } catch (err) {
      console.error(err)
      if (!res.headersSent) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'Chat failed' }))
      }
    }
  }

  return {
    name: 'livecrib-api',
    async configureServer(server) {
      server.middlewares.use('/api/contact', contactHandler)
      server.middlewares.use(chatHandler)
      try {
        const { getDb } = await import('./server/db.js')
        const { runIngest } = await import('./server/ingest.js')
        const n = getDb(env).prepare('SELECT COUNT(*) AS n FROM knowledge_chunks').get().n
        if (n === 0) {
          console.log('Knowledge base empty — running initial ingest...')
          runIngest(env).catch((err) => console.warn('Dev ingest failed:', err.message))
        }
      } catch (err) {
        console.warn('Dev chat store init:', err.message)
      }
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/contact', contactHandler)
      server.middlewares.use(chatHandler)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss(), livecribApi(env)],
    server: { port: 5173, open: true },
    preview: { port: 4173 },
    optimizeDeps: { exclude: ['better-sqlite3'] },
  }
})
