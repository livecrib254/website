import crypto from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import 'dotenv/config'
import * as cheerio from 'cheerio'
import {
  brand, services, solutions, process as processSteps, values, team,
  products, odooModules, portfolio, testimonials,
} from '../src/data/site.js'
import { getDb } from './db.js'
import { embedTexts } from './rag.js'

const DEFAULT_SITE_URL = 'https://www.livecrib.pro'
const PAGE_PATHS = ['/', '/about', '/products', '/portfolio', '/contact']

function generateHash(text) {
  return crypto.createHash('md5').update(text).digest('hex')
}

function chunkText(text, maxLength = 800) {
  const words = String(text).split(/\s+/).filter(Boolean)
  const chunks = []
  let current = []
  let length = 0
  for (const word of words) {
    current.push(word)
    length += word.length + 1
    if (length >= maxLength) {
      chunks.push(current.join(' '))
      current = []
      length = 0
    }
  }
  if (current.length) chunks.push(current.join(' '))
  return chunks
}

function localDocuments() {
  const docs = []
  docs.push({
    id: 'local_brand',
    source: 'site.js',
    url: '/',
    content: [
      `${brand.name} — ${brand.tagline}`,
      brand.blurb,
      `Email: ${brand.email}`,
      `Phone: ${brand.phone}`,
      `Address: ${brand.address}`,
      `Hours: ${brand.hours}`,
      'Website: https://www.livecrib.pro',
    ].join('\n'),
  })
  docs.push({
    id: 'local_services',
    source: 'site.js',
    url: '/',
    content: 'Services: ' + services.map((s) => `${s.title}. ${s.text}`).join(' '),
  })
  docs.push({
    id: 'local_solutions',
    source: 'site.js',
    url: '/',
    content: 'Solutions: ' + solutions.map((s) => `${s.title}. ${s.text}`).join(' '),
  })
  docs.push({
    id: 'local_process',
    source: 'site.js',
    url: '/about',
    content: 'How we work: ' + processSteps.map((s) => `${s.step} ${s.title}: ${s.text}`).join(' '),
  })
  docs.push({
    id: 'local_values_team',
    source: 'site.js',
    url: '/about',
    content: [
      'Values: ' + values.map((v) => `${v.title}: ${v.text}`).join(' '),
      'Team: ' + team.map((m) => `${m.name}, ${m.role}. ${m.bio}`).join(' '),
    ].join('\n'),
  })
  for (const p of products) {
    docs.push({
      id: `local_product_${p.id}`,
      source: 'site.js',
      url: '/products',
      content: [
        `${p.name} (${p.kicker}): ${p.tagline}`,
        p.text,
        `Features: ${p.features.join(', ')}`,
        `Live site: ${p.live}`,
        `In-site demo: ${p.demoPath}`,
      ].join('\n'),
    })
  }
  for (const m of odooModules) {
    docs.push({
      id: `local_odoo_${m.id}`,
      source: 'site.js',
      url: '/products',
      content: [
        `Odoo module: ${m.name} (${m.kicker}, ${m.version}, ${m.price})`,
        m.tagline,
        m.text,
        `Features: ${m.features.join(', ')}`,
        `Store: ${m.store}`,
      ].join('\n'),
    })
  }
  docs.push({
    id: 'local_portfolio',
    source: 'site.js',
    url: '/portfolio',
    content: 'Portfolio: ' + portfolio.map((item) => `${item.title} (${item.category}): ${item.text}`).join(' '),
  })
  docs.push({
    id: 'local_testimonials',
    source: 'site.js',
    url: '/',
    content: 'Testimonials: ' + testimonials.map((t) => `"${t.quote}" — ${t.name}, ${t.org}`).join(' '),
  })
  return docs
}

async function scrapeSite(baseUrl) {
  const origin = new URL(baseUrl).origin
  const docs = []

  for (const pagePath of PAGE_PATHS) {
    const url = new URL(pagePath, origin).href
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'LiveCribKnowledgeBot/1.0' }, signal: AbortSignal.timeout(15000) })
      if (!res.ok) continue
      const html = await res.text()
      const $ = cheerio.load(html)
      $('script, style, noscript, svg, iframe').remove()
      const title = $('title').text().trim()
      const bodyText = $('body').text().replace(/\s+/g, ' ').trim()
      if (bodyText.length < 400) continue
      const chunks = chunkText(`${title}. ${bodyText}`)
      chunks.forEach((content, i) => {
        docs.push({
          id: `web_${generateHash(url)}_${i}`,
          source: 'web',
          url,
          content,
        })
      })
    } catch (err) {
      console.warn(`Skip ${url}: ${err.message}`)
    }
  }

  return docs
}

function upsertChunk(db, chunk) {
  const existing = db.prepare('SELECT content_hash, embedding FROM knowledge_chunks WHERE id = ?').get(chunk.id)
  const contentHash = generateHash(chunk.content)
  if (existing && existing.content_hash === contentHash) {
    return { chunk, embeddingJson: existing.embedding, skipEmbed: existing.embedding && existing.embedding !== '[]' }
  }
  return { chunk: { ...chunk, contentHash }, embeddingJson: null, skipEmbed: false }
}

export async function runIngest(env = process.env) {
  const db = getDb(env)
  const siteUrl = env.SITE_URL || DEFAULT_SITE_URL
  const docs = [...localDocuments()]

  try {
    const scraped = await scrapeSite(siteUrl)
    docs.push(...scraped)
  } catch (err) {
    console.warn('Site scrape skipped:', err.message)
  }

  const pending = []
  const planned = []
  for (const doc of docs) {
    const plan = upsertChunk(db, doc)
    planned.push(plan)
    if (!plan.skipEmbed) pending.push(plan)
  }

  const toEmbed = pending.map((p) => p.chunk.content)
  let vectors = pending.map(() => [])
  try {
    vectors = await embedTexts(toEmbed, env)
  } catch (err) {
    console.error('Embedding batch failed:', err.message)
  }

  const write = db.prepare(`
    INSERT INTO knowledge_chunks (id, source, url, content, content_hash, embedding, updated_at)
    VALUES (@id, @source, @url, @content, @content_hash, @embedding, @updated_at)
    ON CONFLICT(id) DO UPDATE SET
      source = excluded.source,
      url = excluded.url,
      content = excluded.content,
      content_hash = excluded.content_hash,
      embedding = excluded.embedding,
      updated_at = excluded.updated_at
  `)

  const ts = Date.now()
  const tx = db.transaction(() => {
    let embedded = 0
    let skipped = 0
    pending.forEach((plan, i) => {
      const embedding = vectors[i]?.length ? JSON.stringify(vectors[i]) : '[]'
      if (vectors[i]?.length) embedded += 1
      write.run({
        id: plan.chunk.id,
        source: plan.chunk.source,
        url: plan.chunk.url || '',
        content: plan.chunk.content,
        content_hash: generateHash(plan.chunk.content),
        embedding,
        updated_at: ts,
      })
    })
    for (const plan of planned) {
      if (plan.skipEmbed) skipped += 1
    }
    return { embedded, skipped, total: docs.length }
  })

  const stats = tx()

  const keepIds = docs.map((d) => d.id)
  if (keepIds.length) {
    const placeholders = keepIds.map(() => '?').join(',')
    db.prepare(
      `DELETE FROM knowledge_chunks WHERE source = 'web' AND id NOT IN (${placeholders})`,
    ).run(...keepIds)
  }

  console.log(`Knowledge sync: ${stats.total} docs, ${stats.embedded} embedded, ${stats.skipped} unchanged.`)
  return stats
}

const isMain = process.argv[1] && path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1])
if (isMain) {
  runIngest().then(() => process.exit(0)).catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
