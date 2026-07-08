import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { sendContactEmail } from './server/contactCore.js'

// Serve POST /api/contact from both the dev server (`npm run dev`) and the
// preview server (`npm run preview`), so a local production build can send mail
// too. In real production this route is the Vercel serverless fn (api/contact.js).
function contactApi(env) {
  const handler = (req, res, next) => {
    if (req.method !== 'POST') return next()
    let raw = ''
    req.on('data', (chunk) => (raw += chunk))
    req.on('end', async () => {
      let payload = {}
      try { payload = JSON.parse(raw || '{}') } catch { payload = {} }
      const { status, body } = await sendContactEmail(payload, env)
      res.statusCode = status
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(body))
    })
  }
  return {
    name: 'contact-api',
    configureServer(server) {
      server.middlewares.use('/api/contact', handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/contact', handler)
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load all env vars (no prefix filter) from .env files for the API middleware.
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss(), contactApi(env)],
    server: { port: 5173, open: true },
    preview: { port: 4173 },
  }
})
