// Shared contact-email logic used by both the Vercel serverless function
// (api/contact.js) and the Vite dev middleware (vite.config.js), so the form
// works the same in local dev and in production.

const escapeHtml = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ))

const isEmail = (s = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)

/**
 * Validate a contact submission and send it via Postmark's outbound Email API.
 * @returns {Promise<{status:number, body:object}>}
 */
export async function sendContactEmail(input, env = process.env) {
  const { name = '', email = '', subject = '', message = '' } = input || {}

  if (!String(name).trim() || !String(message).trim()) {
    return { status: 400, body: { error: 'Please provide your name and a message.' } }
  }
  if (!isEmail(email)) {
    return { status: 400, body: { error: 'Please provide a valid email address.' } }
  }

  const token = env.POSTMARK_SERVER_TOKEN
  const to = env.CONTACT_TO_EMAIL || 'info@livecrib.pro'
  const from = env.CONTACT_FROM_EMAIL || 'info@livecrib.pro'
  const stream = env.POSTMARK_MESSAGE_STREAM || 'outbound'

  if (!token) {
    return { status: 500, body: { error: 'Email service is not configured. Please try again later.' } }
  }

  const cleanSubject = subject.trim() ? subject.trim() : `New enquiry from ${name.trim()}`
  const textBody =
    `New message from the LiveCrib website contact form\n\n` +
    `Name:    ${name}\n` +
    `Email:   ${email}\n` +
    `Subject: ${subject || '(none)'}\n\n` +
    `Message:\n${message}\n`

  const htmlBody = `
    <h2 style="margin:0 0 12px;font-family:Arial,sans-serif">New contact form message</h2>
    <table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">
      <tr><td style="padding:4px 12px 4px 0;color:#7b8199">Name</td><td><b>${escapeHtml(name)}</b></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#7b8199">Email</td><td>${escapeHtml(email)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#7b8199">Subject</td><td>${escapeHtml(subject) || '(none)'}</td></tr>
    </table>
    <p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap;margin-top:16px">${escapeHtml(message)}</p>
  `

  try {
    const pmRes = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': token,
      },
      body: JSON.stringify({
        From: from,
        To: to,
        ReplyTo: `${name.trim()} <${email.trim()}>`,
        Subject: `[Contact] ${cleanSubject}`,
        HtmlBody: htmlBody,
        TextBody: textBody,
        MessageStream: stream,
      }),
    })

    if (!pmRes.ok) {
      const detail = await pmRes.json().catch(() => ({}))
      console.error('Postmark error:', pmRes.status, detail)
      return { status: 502, body: { error: 'We could not send your message. Please email us directly.' } }
    }

    return { status: 200, body: { ok: true } }
  } catch (err) {
    console.error('Contact endpoint error:', err)
    return { status: 500, body: { error: 'Unexpected error sending your message.' } }
  }
}
