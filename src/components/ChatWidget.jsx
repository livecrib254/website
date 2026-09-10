import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const SESSION_KEY = 'livecrib-chat-uuid'
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function isUuid(value) {
  return typeof value === 'string' && UUID_RE.test(value)
}

function newUuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

/** Returning visitors are recognized by this browser UUID only (no login yet). */
function getClientUuid() {
  try {
    const existing = localStorage.getItem(SESSION_KEY)
    if (isUuid(existing)) return existing
    const id = newUuid()
    localStorage.setItem(SESSION_KEY, id)
    return id
  } catch {
    return newUuid()
  }
}

const SUGGESTIONS = [
  'What does LiveCrib do?',
  'Tell me about Shule SMS',
  'How can I get in touch?',
]

function renderText(text) {
  const nodes = []
  const pattern = /(https?:\/\/[^\s]+)|([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi
  let last = 0
  let match
  let key = 0
  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index))
    const value = match[0]
    if (value.startsWith('http')) {
      nodes.push(
        <a key={key++} href={value.replace(/[.,)]$/, '')} target="_blank" rel="noreferrer">
          {value}
        </a>,
      )
    } else {
      nodes.push(<a key={key++} href={`mailto:${value}`}>{value}</a>)
    }
    last = match.index + value.length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

async function readSse(response, onDelta) {
  if (!response.body) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || 'No response from assistant')
  }
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const parts = buffer.split('\n\n')
    buffer = parts.pop() || ''
    for (const part of parts) {
      const line = part.split('\n').find((l) => l.startsWith('data: '))
      if (!line) continue
      let payload = {}
      try { payload = JSON.parse(line.slice(6)) } catch { continue }
      if (payload.error) throw new Error(payload.error)
      if (payload.delta) onDelta(payload.delta)
    }
  }
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [sessionId] = useState(getClientUuid)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [returning, setReturning] = useState(false)
  const listRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToEnd = useCallback(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [])

  useEffect(() => { scrollToEnd() }, [messages, busy, scrollToEnd])

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    if (loaded) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/api/chat/history?sessionId=${encodeURIComponent(sessionId)}`)
        const data = await res.json().catch(() => ({ messages: [] }))
        if (!cancelled && Array.isArray(data.messages)) {
          setMessages(data.messages)
          setReturning(Boolean(data.returning && data.messages.length))
        }
      } catch {
        if (!cancelled) setMessages([])
      } finally {
        if (!cancelled) setLoaded(true)
      }
    })()
    return () => { cancelled = true }
  }, [open, loaded, sessionId])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const send = async (text) => {
    const message = (text ?? input).trim()
    if (!message || busy) return
    setInput('')
    setError('')
    setBusy(true)
    setMessages((prev) => [...prev, { role: 'user', content: message }, { role: 'assistant', content: '' }])
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, sessionId }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Could not reach the assistant.')
      }
      let assembled = ''
      await readSse(res, (delta) => {
        assembled += delta
        setMessages((prev) => {
          const next = [...prev]
          next[next.length - 1] = { role: 'assistant', content: assembled }
          return next
        })
      })
      if (!assembled) throw new Error('The assistant returned an empty reply.')
    } catch (err) {
      setError(err.message || 'Something went wrong.')
      setMessages((prev) => {
        const next = [...prev]
        const last = next[next.length - 1]
        if (last?.role === 'assistant' && !last.content) next.pop()
        return next
      })
    } finally {
      setBusy(false)
    }
  }

  const empty = useMemo(() => messages.length === 0, [messages])

  return (
    <div className="chat-widget">
      {open && (
        <section className="chat-panel" role="dialog" aria-label="LiveCrib assistant">
          <header className="chat-panel-head">
            <div className="flex items-center gap-3">
              <span className="chat-avatar" aria-hidden="true">✦</span>
              <div>
                <p className="m-0 text-sm font-extrabold text-white">Crib Assistant</p>
                <p className="m-0 text-xs text-white/70">
                  {returning ? 'Welcome back — picking up where you left off' : 'Ask about products, services, or contact'}
                </p>
              </div>
            </div>
            <button type="button" className="chat-icon-btn" aria-label="Close chat" onClick={() => setOpen(false)}>
              ×
            </button>
          </header>

          <div ref={listRef} className="chat-log">
            {empty && (
              <div className="chat-intro">
                <p className="m-0 font-bold text-ink">Hi — I&apos;m Crib.</p>
                <p className="mt-1 mb-3 text-sm text-ink-muted">
                  I can help you explore LiveCrib Solutions, Shule SMS, Rental Manager, and our Odoo modules.
                </p>
                <div className="flex flex-col gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} type="button" className="chat-chip" onClick={() => send(s)} disabled={busy}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={`${m.role}-${i}`} className={`chat-bubble ${m.role}`}>
                {m.content ? renderText(m.content) : (busy && i === messages.length - 1 ? <span className="chat-typing">Thinking</span> : null)}
              </div>
            ))}
            {error && <p className="chat-error">{error}</p>}
          </div>

          <form
            className="chat-composer"
            onSubmit={(e) => { e.preventDefault(); send() }}
          >
            <label className="sr-only" htmlFor="crib-chat-input">Message</label>
            <input
              id="crib-chat-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              maxLength={2000}
              disabled={busy}
              autoComplete="off"
            />
            <button type="submit" className="chat-send" disabled={busy || !input.trim()} aria-label="Send">
              ↑
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className={`chat-fab ${open ? 'is-open' : ''}`}
        aria-expanded={open}
        aria-label={open ? 'Close assistant' : 'Open assistant'}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? '×' : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7A2.5 2.5 0 0 1 16.5 16H10l-4.2 3.2A.8.8 0 0 1 4.5 18.6V6.5Z" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="9" cy="10" r="1" fill="currentColor" />
            <circle cx="12" cy="10" r="1" fill="currentColor" />
            <circle cx="15" cy="10" r="1" fill="currentColor" />
          </svg>
        )}
      </button>
    </div>
  )
}
