import { useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import Lightbox from '../components/Lightbox.jsx'
import { CtaBand } from './Home.jsx'
import { products } from '../data/site.js'

export default function Products() {
  return (
    <>
      <section className="border-b border-line bg-linear-to-b from-soft to-canvas pb-8 pt-20 md:pb-14">
        <div className="shell">
          <span className="eyebrow">Our products</span>
          <h1 className="text-4xl md:text-5xl">Software we've built — try it live</h1>
          <p className="mt-4 max-w-[640px] text-lg text-ink-soft">
            These are real platforms we designed, built, and ship. Each demo comes with trial credentials
            printed right on the login screen, so you can log in and explore instantly.
          </p>
        </div>
      </section>

      {products.map((p, idx) => (
        <section key={p.id} className={`section ${idx % 2 ? 'bg-soft' : ''}`}>
          <div className="shell grid items-center gap-14 lg:grid-cols-2">
            {/* Info */}
            <Reveal className={idx % 2 ? 'lg:order-2' : ''}>
              <span className="pill" style={{ background: `${p.color}1a`, color: p.color }}>{p.kicker}</span>
              <h2 className="mt-3 text-3xl md:text-4xl">{p.name}</h2>
              <p className="mt-2 text-lg text-ink-soft">{p.tagline}</p>
              <p className="text-ink-muted">{p.text}</p>
              <ul className="my-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {p.features.map((f) => <li key={f} className="text-[0.95rem] text-ink-soft">✓ {f}</li>)}
              </ul>
              <div className="flex flex-wrap gap-3">
                <Link to={p.demoPath} className="btn btn-primary btn-lg">Launch demo →</Link>
                <a href={p.live} target="_blank" rel="noreferrer" className="btn btn-outline btn-lg">View production site</a>
              </div>
            </Reveal>

            {/* Real screenshots */}
            <Reveal delay={120} className={idx % 2 ? 'lg:order-1' : ''}>
              <Screenshots product={p} />
            </Reveal>
          </div>
        </section>
      ))}

      <CtaBand
        title="Need a custom platform like these?"
        sub="We build tailored software for schools, property managers, and businesses of every kind."
      >
        <Link to="/contact" className="btn btn-light btn-lg">Talk to us</Link>
      </CtaBand>
    </>
  )
}

function Screenshots({ product: p }) {
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState(null) // index open in lightbox, or null
  const shots = p.shots || []

  return (
    <div>
      {/* Browser frame — click to enlarge */}
      <div className="overflow-hidden rounded-xl2 border border-line bg-surface shadow-hi">
        <div className="flex items-center gap-1.5 border-b border-line bg-sunken px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <em className="ml-3 truncate not-italic text-[0.78rem] text-ink-muted">{p.id}.livecrib.pro</em>
        </div>
        <button
          type="button"
          onClick={() => setZoom(active)}
          className="group relative block w-full cursor-zoom-in"
          aria-label={`Enlarge ${p.name} screenshot`}
        >
          <img src={shots[active]} alt={`${p.name} screenshot`} className="block w-full" loading="lazy" />
          <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/25 group-hover:opacity-100">
            <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-ink shadow-card">🔍 Click to enlarge</span>
          </span>
        </button>
      </div>

      {/* Thumbnails — select + click active to enlarge */}
      {shots.length > 1 && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {shots.map((s, i) => (
            <button
              key={s}
              onClick={() => (i === active ? setZoom(i) : setActive(i))}
              className={`overflow-hidden rounded-lg border-2 transition-all hover:opacity-100 ${
                i === active ? 'shadow-card' : 'border-line opacity-70'
              }`}
              style={i === active ? { borderColor: p.color } : undefined}
              aria-label={`View screenshot ${i + 1}`}
            >
              <img src={s} alt="" className="block h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      <Lightbox
        images={shots}
        index={zoom}
        caption={p.name}
        accent={p.color}
        onClose={() => setZoom(null)}
        onChange={(i) => { setZoom(i); setActive(i) }}
      />
    </div>
  )
}
