import { useState } from 'react'
import Reveal from '../components/Reveal.jsx'
import { brand } from '../data/site.js'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const submit = (e) => { e.preventDefault(); setSent(true) }

  const details = [
    { ic: '✉️', label: 'Email', value: brand.email, href: `mailto:${brand.email}` },
    { ic: '📞', label: 'Phone', value: brand.phone, href: `tel:${brand.phone.replace(/[^+\d]/g, '')}` },
    { ic: '📍', label: 'Address', value: brand.address },
    { ic: '🕘', label: 'Hours', value: brand.hours },
  ]

  return (
    <>
      <section className="border-b border-line bg-linear-to-b from-soft to-white pb-8 pt-20 md:pb-14">
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
          <Reveal delay={120} className="rounded-xl2 border border-line bg-white p-9 shadow-soft">
            {sent ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-[#e7f9ef] text-3xl text-[#14a05a]">✓</div>
                <h3 className="text-2xl">Thanks, {form.name || 'there'}!</h3>
                <p className="text-ink-muted">Your message has been received. We'll be in touch at {form.email || 'your email'} shortly.</p>
                <button
                  className="btn btn-outline mt-2"
                  onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-[18px]">
                <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
                  <label className="field">
                    <span>Name</span>
                    <input required value={form.name} onChange={update('name')} placeholder="Jane Doe" />
                  </label>
                  <label className="field">
                    <span>Email</span>
                    <input required type="email" value={form.email} onChange={update('email')} placeholder="jane@company.com" />
                  </label>
                </div>
                <label className="field">
                  <span>Subject</span>
                  <input value={form.subject} onChange={update('subject')} placeholder="What can we help with?" />
                </label>
                <label className="field">
                  <span>Message</span>
                  <textarea required rows={5} value={form.message} onChange={update('message')} placeholder="Tell us about your project…" />
                </label>
                <button type="submit" className="btn btn-primary btn-lg">Send message →</button>
                <p className="m-0 text-[0.82rem] text-ink-muted">This is a demo form — submissions are handled client-side only.</p>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </>
  )
}
