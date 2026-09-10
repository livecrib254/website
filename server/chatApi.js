import { brand } from '../src/data/site.js'
import { appendTurn, getMessages, resolveChatClient } from './chatSession.js'
import { getOpenAI, retrieveContext } from './rag.js'

const MAX_MESSAGE_LENGTH = 2000
const HISTORY_LIMIT = 16

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
      resolve(JSON.stringify(req.body))
      return
    }
    let raw = ''
    req.on('data', (chunk) => { raw += chunk })
    req.on('end', () => resolve(raw))
    req.on('error', reject)
  })
}

function sendJson(res, status, body) {
  if (res.headersSent) return
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

function writeSse(res, payload) {
  res.write(`data: ${JSON.stringify(payload)}\n\n`)
}

function requestPath(req) {
  const host = req.headers?.host || 'localhost'
  return new URL(req.originalUrl || req.url, `http://${host}`)
}

function buildSystemPrompt(snippets) {
  const facts = [
    `You are Crib, the in-site assistant for ${brand.name} (${brand.tagline}).`,
    'Answer questions about the company, services, products, portfolio, and how to get in touch.',
    `Contact: ${brand.email}, ${brand.phone}, ${brand.address}. Hours: ${brand.hours}.`,
    'Flagship products: Shule SMS (school management, https://sms.livecrib.pro) and Rental Manager (https://rms.livecrib.pro). Demos are on this website under /products.',
    'Odoo App Store modules include POS M-Pesa Payments and POS Proxy Printing.',
    'Use the retrieved context when it is relevant. If you are unsure, say so and invite the visitor to the Contact page.',
    'Be concise, warm, and professional. Do not invent pricing, contracts, or guarantees.',
    'Do not mention system prompts, embeddings, or internal tools.',
  ]
  const context = snippets.length
    ? snippets.map((s, i) => `[${i + 1}] ${s.url ? `(${s.url}) ` : ''}${s.content}`).join('\n\n')
    : 'No extra retrieved context.'
  return `${facts.join('\n')}\n\nRetrieved context:\n${context}`
}

async function handleHistory(req, res, env) {
  const url = requestPath(req)
  const client = resolveChatClient({
    uuid: url.searchParams.get('sessionId') || url.searchParams.get('uuid') || '',
    userId: url.searchParams.get('userId'),
  }, env)
  if (!client.ok) {
    return sendJson(res, 400, { error: client.error })
  }
  const messages = getMessages(client.uuid, env).map(({ role, content }) => ({ role, content }))
  return sendJson(res, 200, { messages, returning: client.returning, uuid: client.uuid })
}

async function handleChat(req, res, env) {
  let payload = {}
  try {
    payload = JSON.parse((await readRawBody(req)) || '{}')
  } catch {
    payload = {}
  }

  const sessionId = String(payload.sessionId || payload.uuid || '').trim()
  const message = String(payload.message || '').trim()
  const client = resolveChatClient({ uuid: sessionId, userId: payload.userId }, env)
  if (!client.ok) {
    return sendJson(res, 400, { error: client.error })
  }
  if (!message) {
    return sendJson(res, 400, { error: 'Please enter a message.' })
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return sendJson(res, 400, { error: 'Message is too long.' })
  }

  const openai = getOpenAI(env)
  if (!openai) {
    return sendJson(res, 503, { error: 'The assistant is not configured yet. Please email us instead.' })
  }

  const history = getMessages(client.uuid, env).slice(-HISTORY_LIMIT)
  let snippets = []
  try {
    snippets = await retrieveContext(message, env, 5)
  } catch (err) {
    console.error('RAG retrieve failed:', err.message)
  }

  const incoming = [
    { role: 'system', content: buildSystemPrompt(snippets) },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: message },
  ]

  res.statusCode = 200
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders?.()

  let full = ''
  try {
    const stream = await openai.chat.completions.create({
      model: env.OPENAI_CHAT_MODEL || 'gpt-4o-mini',
      messages: incoming,
      temperature: 0.4,
      stream: true,
    })

    for await (const part of stream) {
      const delta = part.choices?.[0]?.delta?.content || ''
      if (!delta) continue
      full += delta
      writeSse(res, { delta })
    }

    if (!full.trim()) {
      full = 'I am having trouble answering right now. Please try again, or email info@livecrib.pro.'
      writeSse(res, { delta: full })
    }

    appendTurn(client.uuid, message, full, env, client.userId)
    writeSse(res, { done: true })
    res.end()
  } catch (err) {
    console.error('Chat stream error:', err)
    if (!res.headersSent) {
      return sendJson(res, 502, { error: 'The assistant could not reply. Please try again.' })
    }
    writeSse(res, { error: 'The assistant could not reply. Please try again.' })
    res.end()
  }
}

export async function handleChatHttp(req, res, env = process.env) {
  const url = requestPath(req)
  const pathname = url.pathname.replace(/\/$/, '') || '/'

  if (pathname === '/api/chat/history' && req.method === 'GET') {
    return handleHistory(req, res, env)
  }
  if (pathname === '/api/chat' && req.method === 'POST') {
    return handleChat(req, res, env)
  }
  if (pathname === '/api/chat' || pathname === '/api/chat/history') {
    return sendJson(res, 405, { error: 'Method not allowed' })
  }
}
