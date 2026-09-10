import { OpenAI } from 'openai'
import { getDb } from './db.js'

export function getOpenAI(env = process.env) {
  const apiKey = env.OPENAI_API_KEY
  if (!apiKey) return null
  return new OpenAI({ apiKey })
}

export function cosineSimilarity(a, b) {
  if (!a?.length || !b?.length || a.length !== b.length) return 0
  let dot = 0
  let na = 0
  let nb = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb)
  return denom ? dot / denom : 0
}

function keywordScore(query, text) {
  const terms = String(query).toLowerCase().split(/\W+/).filter((t) => t.length > 2)
  if (!terms.length) return 0
  const hay = String(text).toLowerCase()
  let hits = 0
  for (const term of terms) {
    if (hay.includes(term)) hits += 1
  }
  return hits / terms.length
}

export async function embedTexts(texts, env = process.env) {
  const openai = getOpenAI(env)
  if (!openai || !texts.length) return texts.map(() => [])
  const model = env.OPENAI_EMBED_MODEL || 'text-embedding-3-small'
  const response = await openai.embeddings.create({ model, input: texts })
  return response.data
    .sort((a, b) => a.index - b.index)
    .map((row) => row.embedding)
}

export async function retrieveContext(query, env = process.env, k = 5) {
  const db = getDb(env)
  const rows = db.prepare('SELECT id, source, url, content, embedding FROM knowledge_chunks').all()
  if (!rows.length) return []

  let queryVec = []
  try {
    const [vec] = await embedTexts([query], env)
    queryVec = vec || []
  } catch (err) {
    console.error('Query embedding failed, falling back to keywords:', err.message)
  }

  const ranked = rows.map((row) => {
    let embedding = []
    try { embedding = JSON.parse(row.embedding || '[]') } catch { embedding = [] }
    const vectorScore = queryVec.length ? cosineSimilarity(queryVec, embedding) : 0
    const textScore = keywordScore(query, row.content)
    return {
      id: row.id,
      source: row.source,
      url: row.url,
      content: row.content,
      score: vectorScore * 0.85 + textScore * 0.15,
    }
  })

  ranked.sort((a, b) => b.score - a.score)
  return ranked.filter((row) => row.score > 0).slice(0, k)
}
