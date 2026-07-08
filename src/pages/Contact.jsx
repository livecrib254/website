import { useState } from 'react'
import Reveal from '../components/Reveal.jsx'
import { brand } from '../data/site.js'

const EMPTY = { name: '', email: '', subject: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
      setStatus('sent')
    } catch (err) {
      setStatus('error')
      setError(err.message || 'Unable to send your message right now.')
    }
  }

  const details = [
    { ic: '✉️', label: 'Email', value: brand.email, href: `mailto:${brand.email}` },
    { ic: '📞', label: 'Phone', value: brand.phone, href: `tel:${brand.phone.replace(/[^+\d]/g, '')}` },
    { ic: '📍', label: 'Address', value: brand.address },
    { ic: '🕘', label: 'Hours', value: brand.hours },
  ]

  const sending = status === 'sending'

  return (
    <>
      <section className="border-b border-line bg-linear-to-b from-soft to-canvas pb-8 pt-20 md:pb-14">
        <div className="shell">
          <span className="eyebrow">Contact us</span>
          <h1 className="text-4xl md:text-5xl">Let's start a conversation</h1>
          <p className="mt-4 max-w-[640px] text-lg text-ink-soft">
            We would love to hear from you. Tell us about your project and we'll get back within one business day.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell grid items-start gap-12 lg:grid-cols-[0.9fr_1.3fr]">
          {/* Details */}
          <Reveal>
            <h2 className="text-3xl">Get in touch</h2>
            <ul className="mt-5 flex flex-col gap-5">
              {details.map((d) => (
                <li key={d.label} className="flex items-start gap-3.5">
                  <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-soft text-xl">{d.ic}</span>
                  <div>
                    <b className="mb-0.5 block text-[0.82rem] uppercase tracking-[0.06em] text-ink-muted">{d.label}</b>
                    {d.href
                      ? <a href={d.href} className="hover:text-accent">{d.value}</a>
                      : <span>{d.value}</span>}
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Form */}
          <Reveal delay={120} className="rounded-xl2 border border-line bg-surface p-9 shadow-soft">
            {status === 'sent' ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-[#e7f9ef] text-3xl text-[#14a05a]">✓</div>
                <h3 className="text-2xl">Thanks, {form.name || 'there'}!</h3>
                <p className="text-ink-muted">
                  Your message is on its way to our team. We'll reply to {form.email || 'your email'} shortly.
                </p>
                <button
                  className="btn btn-outline mt-2"
                  onClick={() => { setStatus('idle'); setForm(EMPTY) }}
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-[18px]">
                <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
                  <label className="field">
                    <span>Name</span>
                    <input required value={form.name} onChange={update('name')} placeholder="Jane Doe" disabled={sending} />
                  </label>
                  <label className="field">
                    <span>Email</span>
                    <input required type="email" value={form.email} onChange={update('email')} placeholder="jane@company.com" disabled={sending} />
                  </label>
                </div>
                <label className="field">
                  <span>Subject</span>
                  <input value={form.subject} onChange={update('subject')} placeholder="What can we help with?" disabled={sending} />
                </label>
                <label className="field">
                  <span>Message</span>
                  <textarea required rows={5} value={form.message} onChange={update('message')} placeholder="Tell us about your project…" disabled={sending} />
                </label>

                {status === 'error' && (
                  <p className="m-0 rounded-[10px] bg-[#fdecec] px-3 py-2.5 text-[0.88rem] text-[#d63031]">{error}</p>
                )}

                <button type="submit" className="btn btn-primary btn-lg disabled:cursor-wait disabled:opacity-70" disabled={sending}>
                  {sending ? 'Sending…' : 'Send message →'}
                </button>
                <p className="m-0 text-[0.82rem] text-ink-muted">
                  Your message is delivered straight to {brand.email} via Postmark.
                </p>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </>
  )
}
