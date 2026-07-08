import { useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import { CtaBand } from './Home.jsx'
import { portfolio } from '../data/site.js'

const categories = ['All', ...Array.from(new Set(portfolio.map((p) => p.category)))]

export default function Portfolio() {
  const [filter, setFilter] = useState('All')
  const items = filter === 'All' ? portfolio : portfolio.filter((p) => p.category === filter)

  return (
    <>
      <section className="border-b border-line bg-linear-to-b from-soft to-canvas pb-8 pt-20 md:pb-14">
        <div className="shell">
          <span className="eyebrow">Portfolio</span>
          <h1 className="text-4xl md:text-5xl">Selected work & case studies</h1>
          <p className="mt-4 max-w-[640px] text-lg text-ink-soft">
            A look at the software, brands, and experiences we've shipped — from full SaaS platforms to
            conversion-focused websites.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          {/* Filters */}
          <div className="mb-10 flex flex-wrap justify-center gap-2.5">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full border px-[18px] py-2.5 text-[0.92rem] font-semibold transition-colors ${
                  filter === c
                    ? 'border-accent bg-accent text-white'
                    : 'border-line bg-surface text-ink-soft hover:border-accent hover:text-accent'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p, i) => (
              <Reveal
                key={p.title}
                delay={i * 60}
                className="group overflow-hidden rounded-xl2 border border-line bg-surface transition-all duration-200 hover:-translate-y-1.5 hover:shadow-card"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {p.featured && (
                    <span className="absolute right-3 top-3 rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
                      Our product
                    </span>
                  )}
                  <span className="absolute inset-0 bg-linear-to-t from-black/25 to-transparent" />
                </div>
                <div className="p-6">
                  <span className="pill">{p.category}</span>
                  <h3 className="mb-2 mt-3 text-xl">{p.title}</h3>
                  <p className="text-[0.95rem] text-ink-muted">{p.text}</p>
                  <div className="mt-3.5 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="text-[0.78rem] font-semibold text-accent">#{t}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Want to see your project here?" sub="We'd love to build the next case study with you.">
        <Link to="/contact" className="btn btn-light btn-lg">Start a project</Link>
      </CtaBand>
    </>
  )
}
