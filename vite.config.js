import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { sendContactEmail } from './server/contactCore.js'

// Dev-only middleware so POST /api/contact works under `npm run dev`
// (in production this route is the Vercel serverless function in /api/contact.js).
function contactApiDev(env) {
  return {
    name: 'contact-api-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/contact', (req, res, next) => {
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
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load all env vars (no prefix filter) from .env files for the dev middleware.
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss(), contactApiDev(env)],
    server: {
      port: 5173,
      open: true,
    },
  }
})
