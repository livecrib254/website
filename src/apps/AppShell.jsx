import { useState } from 'react'
import { Link } from 'react-router-dom'

// Shared dashboard chrome for the product demos (sidebar + topbar).
export default function AppShell({ appName, appIcon, accent, nav, user, onLogout, children }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-sunken lg:grid lg:grid-cols-[248px_1fr]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-[60] flex w-[260px] flex-col bg-brand-900 p-4 text-[#cfd5e8] transition-transform lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-auto lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-2.5 px-2 pb-5 pt-1.5 text-[1.15rem] font-extrabold text-white">
          <span className="text-2xl">{appIcon}</span>
          <span>{appName}</span>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5">
          {nav.map((item, i) => (
            <a
              key={item}
              href="#"
              onClick={(e) => e.preventDefault()}
              className={`rounded-[10px] px-3.5 py-2.5 text-[0.94rem] font-semibold transition-colors ${
                i === 0 ? 'text-white' : 'text-[#8f98bb] hover:bg-white/5 hover:text-white'
              }`}
              style={i === 0 ? { background: accent, color: '#fff' } : undefined}
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="flex flex-col gap-3 border-t border-white/10 px-2 pt-4">
          <span className="pill w-fit">Demo mode</span>
          <Link to="/products" className="text-[0.88rem] font-semibold text-[#8f98bb] hover:text-white">Exit demo →</Link>
        </div>
      </aside>

      {/* Scrim */}
      {open && <div className="fixed inset-0 z-50 bg-brand-900/50 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main column */}
      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex min-h-[64px] items-center gap-4 border-b border-line bg-white/85 px-6 backdrop-blur-md">
          <button className="text-2xl leading-none lg:hidden" aria-label="Toggle menu" onClick={() => setOpen((v) => !v)}>☰</button>
          <div className="hidden max-w-[420px] flex-1 sm:block">
            <input
              placeholder={`Search ${appName}…`}
              className="w-full rounded-full border border-line bg-soft px-3.5 py-2.5 text-[0.92rem] outline-none focus:border-accent focus:bg-white"
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-[1.1rem]">🔔</span>
            <div className="grid h-9 w-9 place-items-center rounded-full font-bold text-white" style={{ background: accent }}>
              {user.id[0].toUpperCase()}
            </div>
            <div className="hidden leading-tight sm:flex sm:flex-col">
              <strong className="text-[0.9rem]">{user.role}</strong>
              <small className="text-[0.78rem] text-ink-muted">{user.id}</small>
            </div>
            <button
              onClick={onLogout}
              className="rounded-full border border-line px-3.5 py-1.5 text-[0.85rem] font-semibold text-ink-soft transition-colors hover:border-accent hover:text-accent"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="px-6 pb-16 pt-7">{children}</div>
      </div>
    </div>
  )
}
