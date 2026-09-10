import cron from 'node-cron'
import { runIngest } from './ingest.js'
import { pruneExpiredSessions } from './chatSession.js'

let started = false

export function startScheduler(env = process.env) {
  if (started) return
  started = true

  // Weekly knowledge refresh (Sunday 00:00 server time) plus session TTL cleanup.
  cron.schedule('0 0 * * 0', async () => {
    console.log('Running weekly vector knowledge sync...')
    try {
      await runIngest(env)
      const removed = pruneExpiredSessions(env)
      if (removed) console.log(`Pruned ${removed} expired chat session(s).`)
    } catch (err) {
      console.error('Scheduled sync failed:', err.message)
    }
  })
}
