import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

/**
 * Shared login screen for the product demos.
 * Trial credentials are listed on-screen and clickable to autofill.
 */
export default function LoginScreen({
  appName, kicker, icon, blurb, points, accent, accent2,
  trials, storageKey, redirect, placeholder,
  identifierLabel = 'Email', identifierType = 'email',
}) {
  const nav = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const fill = (c) => { setIdentifier(c.id); setPassword(c.password); setError('') }

  const submit = (e) => {
    e.preventDefault()
    setError('')
    const match = trials.find((c) => c.id === identifier.trim() && c.password === password)
    if (!match) {
      setError('Invalid credentials. Use one of the trial logins listed below.')
      return
    }
    setLoading(true)
    sessionStorage.setItem(storageKey, JSON.stringify({ id: match.id, role: match.role }))
    setTimeout(() => nav(redirect), 500)
  }

  return (
    <div data-theme="light" className="grid min-h-screen md:grid-cols-2">
      {/* Brand panel */}
      <aside
        className="relative flex flex-col justify-between overflow-hidden p-8 text-white sm:p-10"
        style={{ background: `radial-gradient(120% 120% at 20% 0%, ${accent} 0%, #0a0f1f 75%)` }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(50% 40% at 90% 90%, ${accent2}73, transparent 70%)` }}
          aria-hidden="true"
        />
        <Link to="/products" className="relative z-10 text-sm font-semibold opacity-90 hover:opacity-100">
          ← LiveCrib Products
        </Link>
        <div className="relative z-10 max-w-[400px]">
          <span className="mb-4 block text-[2.6rem]">{icon}</span>
          <h1 className="mb-1 text-4xl text-white">{appName}</h1>
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.12em] opacity-85">{kicker}</p>
          <p className="mb-6 text-[1.05rem] text-white/90">{blurb}</p>
          <ul className="hidden flex-col gap-2.5 text-white/90 sm:flex">
            {points.map((p) => <li key={p}>✓ {p}</li>)}
          </ul>
        </div>
        <p className="relative z-10 m-0 text-[0.82rem] opacity-70">A LiveCrib Solutions product</p>
      </aside>

      {/* Form panel */}
      <main className="grid place-items-center bg-soft px-6 py-10">
        <div className="w-full max-w-[420px] rounded-xl2 border border-line bg-white p-9 shadow-card">
          <h2 className="mb-1 text-2xl">Welcome back</h2>
          <p className="mb-6 text-ink-muted">Sign in to your {appName} account.</p>

          {/* Trial credentials */}
          <div
            className="mb-6 rounded-card border border-dashed p-3.5"
            style={{ borderColor: `color-mix(in srgb, ${accent} 45%, #e6e9f2)`, background: `color-mix(in srgb, ${accent} 6%, #fff)` }}
          >
            <div className="mb-2.5 text-[0.82rem] font-bold text-ink-soft">🔑 Trial credentials — click to autofill</div>
            {trials.map((c) => (
              <button
                type="button"
                key={c.id}
                onClick={() => fill(c)}
                className="mb-1.5 flex w-full flex-col items-start gap-0.5 rounded-[10px] border border-transparent bg-white px-3 py-2.5 text-left transition-all last:mb-0 hover:translate-x-0.5"
                style={{ borderColor: 'transparent' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = accent)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
              >
                <span className="text-[0.88rem] font-bold text-ink">{c.role}</span>
                <span className="font-mono text-[0.82rem] text-ink-muted">{c.id} · {c.password}</span>
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="flex flex-col gap-4">
            <label className="field">
              <span>{identifierLabel}</span>
              <input
                type={identifierType}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={placeholder}
                autoComplete="username"
              />
            </label>
            <label className="field">
              <span>Password</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
            </label>

            {error && (
              <p className="m-0 rounded-[10px] bg-[#fdecec] px-3 py-2.5 text-[0.88rem] text-[#d63031]">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-lg w-full text-white disabled:cursor-wait disabled:opacity-70"
              style={{ background: `linear-gradient(120deg, ${accent}, ${accent2})` }}
            >
              {loading ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>

          <p className="mt-5 text-center text-[0.9rem] text-ink-muted">
            Trouble signing in? <Link to="/contact" className="font-semibold" style={{ color: accent }}>Contact support</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
