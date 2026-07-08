// Production server for a VPS (or any Node host).
// Serves the built static site in /dist AND handles POST /api/contact.
//
//   npm install
//   npm run build          # produces /dist
//   npm start              # runs this server (reads .env)
//
// Env (via .env on the box, or your process manager / systemd):
//   PORT                    port to listen on (default 8080)
//   POSTMARK_SERVER_TOKEN   required — Postmark Server API token
//   CONTACT_TO_EMAIL        default info@livecrib.pro
//   CONTACT_FROM_EMAIL      verified Postmark sender (default info@livecrib.pro)

import 'dotenv/config'
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { sendContactEmail } from './contactCore.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '../dist')

const app = express()
app.disable('x-powered-by')
app.use(express.json({ limit: '64kb' }))

// --- API ---
app.post('/api/contact', async (req, res) => {
  const { status, body } = await sendContactEmail(req.body || {}, process.env)
  res.status(status).json(body)
})

// Any other /api/* request is a real 404/405 (not the SPA shell)
app.use('/api', (req, res) => {
  res.status(req.method === 'GET' ? 404 : 405).json({ error: 'Not found' })
})

// --- Static site + SPA fallback ---
app.use(express.static(distDir, { index: false, maxAge: '1h' }))

app.use((req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  res.sendFile(path.join(distDir, 'index.html'))
})

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`LiveCrib server listening on http://localhost:${port}`)
})
