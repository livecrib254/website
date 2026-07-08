import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { nav, brand } from '../data/site.js'
import ThemeToggle from './ThemeToggle.jsx'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => setOpen(false), [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClass = ({ isActive }) =>
    `px-3.5 py-2 rounded-full text-[0.96rem] font-semibold transition-colors ${
      isActive ? 'text-accent' : 'text-ink-soft hover:text-ink hover:bg-sunken'
    }`

  return (
    <header
      className={`sticky top-0 z-[100] backdrop-blur-md bg-canvas/80 transition-shadow ${
        scrolled ? 'border-b border-line shadow-[0_4px_20px_rgba(16,24,51,0.05)]' : 'border-b border-transparent'
      }`}
    >
      <div className="shell flex h-[72px] items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight" aria-label={brand.name}>
          <img src="/logo.png" alt="" className="h-9 w-9 rounded-lg object-contain" />
          <span>LiveCrib</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
          <ThemeToggle className="ml-1.5" />
          <Link to="/contact" className="btn btn-primary ml-2.5">Work with Us</Link>
        </nav>

        {/* Mobile: toggle + burger */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            className="flex flex-col gap-[5px] p-2"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`h-0.5 w-6 rounded bg-ink transition-transform ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`h-0.5 w-6 rounded bg-ink transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 w-6 rounded bg-ink transition-transform ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <nav
        className={`md:hidden absolute inset-x-0 top-[72px] flex flex-col gap-1 border-b border-line bg-surface px-5 pb-5 pt-3.5 shadow-card transition-all ${
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0'
        }`}
        aria-label="Mobile"
      >
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `rounded-xl px-3.5 py-3 font-semibold ${isActive ? 'text-accent bg-sunken' : 'text-ink-soft'}`
            }
          >
            {item.label}
          </NavLink>
        ))}
        <Link to="/contact" className="btn btn-primary mt-2 w-full">Work with Us</Link>
      </nav>
    </header>
  )
}
