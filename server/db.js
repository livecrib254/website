import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Database from 'better-sqlite3'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

let db

function migrate(database) {
  const columns = database.prepare('PRAGMA table_info(chat_sessions)').all().map((c) => c.name)
  if (!columns.includes('user_id')) {
    database.exec('ALTER TABLE chat_sessions ADD COLUMN user_id TEXT')
  }
  database.exec('CREATE INDEX IF NOT EXISTS idx_sessions_user ON chat_sessions(user_id)')
}

export function getDb(env = process.env) {
  if (db) return db

  const dbPath = env.SQLITE_PATH || path.join(rootDir, 'data', 'livecrib.db')
  fs.mkdirSync(path.dirname(dbPath), { recursive: true })

  db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  db.exec(`
    CREATE TABLE IF NOT EXISTS chat_sessions (
      session_id TEXT PRIMARY KEY,
      user_id TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL REFERENCES chat_sessions(session_id) ON DELETE CASCADE,
      role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
      content TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_messages_session ON chat_messages(session_id, id);
    CREATE INDEX IF NOT EXISTS idx_sessions_user ON chat_sessions(user_id);

    CREATE TABLE IF NOT EXISTS knowledge_chunks (
      id TEXT PRIMARY KEY,
      source TEXT NOT NULL,
      url TEXT,
      content TEXT NOT NULL,
      content_hash TEXT NOT NULL,
      embedding TEXT NOT NULL DEFAULT '[]',
      updated_at INTEGER NOT NULL
    );
  `)
  migrate(db)

  return db
}
