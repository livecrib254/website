// Serverless endpoint for the contact form — sends an email via Postmark.
//
// Deploy target: Vercel (zero-config for a Vite project — any file in /api
// becomes a serverless function). For local development run `vercel dev`, or
// just `npm run dev` (a Vite middleware in vite.config.js serves the same route).
//
// Required environment variables (set in your host's dashboard, never commit):
//   POSTMARK_SERVER_TOKEN   Postmark Server API token (Server → API Tokens)
//   CONTACT_TO_EMAIL        where messages are delivered (default info@livecrib.pro)
//   CONTACT_FROM_EMAIL      a VERIFIED Postmark sender signature / domain address
//                           on livecrib.pro (default info@livecrib.pro)
//   POSTMARK_MESSAGE_STREAM optional, defaults to "outbound"
//
// Postmark note: "inbound" is for RECEIVING mail; sending a contact message
// uses the outbound Email API. The From address must be a verified Sender
// Signature (or on a verified domain) in your Postmark account.

import { sendContactEmail } from '../server/contactCore.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Vercel parses JSON bodies automatically; guard for other runtimes.
  let body = req.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { body = {} }
  }

  const { status, body: out } = await sendContactEmail(body || {}, process.env)
  return res.status(status).json(out)
}
