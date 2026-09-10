// Production server for a VPS (or any Node host).
// Serves the built static site in /dist AND handles POST /api/contact plus the RAG chat API.
//
//   npm install
//   npm run ingest         # optional: build/refresh the SQLite knowledge base
//   npm run build          # produces /dist
//   npm start              # runs this server (reads .env)
//
// Env (via .env on the box, or your process manager / systemd):
//   PORT                    port to listen on (default 8026)
//   SQLITE_PATH             SQLite file (default ./data/livecrib.db)
//   OPENAI_API_KEY          required for the assistant
//   OPENAI_CHAT_MODEL       default gpt-4o-mini
//   OPENAI_EMBED_MODEL      default text-embedding-3-small
//   CHAT_AUTH_ENABLED       set true later to attach login userId to the UUID thread
//   POSTMARK_SERVER_TOKEN   required — Postmark Server API token
//   CONTACT_TO_EMAIL        default info@livecrib.pro
//   CONTACT_FROM_EMAIL      verified Postmark sender (default info@livecrib.pro)

import 'dotenv/config'
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { sendContactEmail } from './contactCore.js'
import { handleChatHttp } from './chatApi.js'
import { runIngest } from './ingest.js'
import { getDb } from './db.js'
import { startScheduler } from './scheduler.js'
import { pruneExpiredSessions } from './chatSession.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '../dist')

const app = express()
app.disable('x-powered-by')
app.use(express.json({ limit: '64kb' }))

app.get('/api/chat/history', (req, res) => handleChatHttp(req, res, process.env))
app.post('/api/chat', (req, res) => handleChatHttp(req, res, process.env))

app.post('/api/contact', async (req, res) => {
  const { status, body } = await sendContactEmail(req.body || {}, process.env)
  res.status(status).json(body)
})

// Any other /api/* request is a real 404/405 (not the SPA shell)
app.use('/api', (req, res) => {
  res.status(req.method === 'GET' ? 404 : 405).json({ error: 'Not found' })
})

app.use(express.static(distDir, { index: false, maxAge: '1h' }))

app.use((req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  res.sendFile(path.join(distDir, 'index.html'))
})

const port = process.env.PORT || 8026
app.listen(port, async () => {
  console.log(`LiveCrib server listening on http://localhost:${port}`)
  try {
    getDb(process.env)
    pruneExpiredSessions(process.env)
    startScheduler(process.env)
    const count = getDb().prepare('SELECT COUNT(*) AS n FROM knowledge_chunks').get().n
    if (count === 0) {
      console.log('Knowledge base empty — running initial ingest...')
      await runIngest(process.env)
    }
  } catch (err) {
    console.error('Startup knowledge/chat init failed:', err.message)
  }
})
