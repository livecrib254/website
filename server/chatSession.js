import { getDb } from './db.js'

export const SESSION_TTL_MS = 14 * 24 * 60 * 60 * 1000
const MAX_MESSAGES = 40

// Browser-generated UUID (RFC 4122). This is the only visitor key until login exists.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function now() {
  return Date.now()
}

export function isClientUuid(value) {
  return typeof value === 'string' && UUID_RE.test(value.trim())
}

function authEnabled(env) {
  const flag = String(env.CHAT_AUTH_ENABLED || '').toLowerCase()
  return flag === '1' || flag === 'true'
}

/**
 * Resolve who this chat belongs to.
 * Today: UUID only (returning browser). Subscriptions/login are not checked.
 * Later: set CHAT_AUTH_ENABLED=true and pass userId from the login session;
 * the UUID thread is then attached to that account.
 */
export function resolveChatClient({ uuid, userId } = {}, env = process.env) {
  const clientUuid = String(uuid || '').trim()
  if (!isClientUuid(clientUuid)) {
    return { ok: false, error: 'Missing or invalid client UUID' }
  }

  pruneExpiredSessions(env)
  const db = getDb(env)
  const claimedUserId = userId != null && String(userId).trim() ? String(userId).trim() : null

  if (authEnabled(env) && claimedUserId) {
    const byUser = db.prepare(
      'SELECT session_id FROM chat_sessions WHERE user_id = ?',
    ).get(claimedUserId)
    if (byUser) {
      return { ok: true, uuid: byUser.session_id, returning: true, userId: claimedUserId }
    }
    const byUuid = db.prepare(
      'SELECT session_id FROM chat_sessions WHERE session_id = ?',
    ).get(clientUuid)
    if (byUuid) {
      db.prepare('UPDATE chat_sessions SET user_id = ? WHERE session_id = ?').run(claimedUserId, clientUuid)
      return { ok: true, uuid: clientUuid, returning: true, userId: claimedUserId }
    }
    return { ok: true, uuid: clientUuid, returning: false, userId: claimedUserId }
  }

  const existing = db.prepare(
    'SELECT session_id FROM chat_sessions WHERE session_id = ?',
  ).get(clientUuid)

  return {
    ok: true,
    uuid: clientUuid,
    returning: Boolean(existing),
    userId: null,
  }
}

export function pruneExpiredSessions(env = process.env) {
  const cutoff = now() - SESSION_TTL_MS
  const info = getDb(env).prepare('DELETE FROM chat_sessions WHERE updated_at < ?').run(cutoff)
  return info.changes
}

export function getMessages(sessionId, env = process.env) {
  const client = resolveChatClient({ uuid: sessionId }, env)
  if (!client.ok || !client.returning) return []
  return getDb(env).prepare(
    `SELECT role, content, created_at AS timestamp
     FROM chat_messages
     WHERE session_id = ?
     ORDER BY id ASC`,
  ).all(client.uuid)
}

export function appendTurn(sessionId, userContent, assistantContent, env = process.env, userId = null) {
  const client = resolveChatClient({ uuid: sessionId, userId }, env)
  if (!client.ok) throw new Error(client.error)

  const db = getDb(env)
  const ts = now()

  const tx = db.transaction(() => {
    const existing = db.prepare('SELECT session_id FROM chat_sessions WHERE session_id = ?').get(client.uuid)
    if (!existing) {
      db.prepare(
        'INSERT INTO chat_sessions (session_id, user_id, created_at, updated_at) VALUES (?, ?, ?, ?)',
      ).run(client.uuid, client.userId, ts, ts)
    } else {
      db.prepare(
        'UPDATE chat_sessions SET updated_at = ?, user_id = COALESCE(?, user_id) WHERE session_id = ?',
      ).run(ts, client.userId, client.uuid)
    }

    const insert = db.prepare(
      'INSERT INTO chat_messages (session_id, role, content, created_at) VALUES (?, ?, ?, ?)',
    )
    insert.run(client.uuid, 'user', userContent, ts)
    insert.run(client.uuid, 'assistant', assistantContent, ts + 1)

    const extras = db.prepare(
      `SELECT id FROM chat_messages WHERE session_id = ? ORDER BY id DESC LIMIT -1 OFFSET ?`,
    ).all(client.uuid, MAX_MESSAGES)
    if (extras.length) {
      const ids = extras.map((row) => row.id)
      db.prepare(`DELETE FROM chat_messages WHERE id IN (${ids.map(() => '?').join(',')})`).run(...ids)
    }
  })

  tx()
}
