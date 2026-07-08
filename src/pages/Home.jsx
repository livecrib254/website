import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import {
  brand, services, solutions, stats, process, products, testimonials, img,
} from '../data/site.js'

export default function Home() {
  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="bg-hero relative overflow-hidden text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              'radial-gradient(40% 50% at 12% 20%, rgba(108,92,231,0.5), transparent 70%), radial-gradient(38% 45% at 88% 25%, rgba(0,210,255,0.4), transparent 70%)',
          }}
          aria-hidden="true"
        />
        <div className="shell relative grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="mb-6 inline-block rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-semibold tracking-wide">
              Digital Software & Marketing Agency
            </span>
            <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-[3.6rem]">
              Empowering Ideas.<br />
              <span className="text-grad">Engineering Digital Growth.</span>
            </h1>
            <p className="mt-5 max-w-[46ch] text-lg text-[#b9c0da]">{brand.blurb}</p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <Link to="/contact" className="btn btn-primary btn-lg">Get a Free Consultation</Link>
              <Link to="/products" className="btn btn-ghost btn-lg">Explore our products →</Link>
            </div>
          </div>

          <Reveal className="relative">
            <div
              className="absolute inset-0 -z-0 mx-auto max-w-[440px] rounded-full blur-2xl"
              style={{ background: 'radial-gradient(circle, rgba(108,92,231,0.55), transparent 70%)' }}
              aria-hidden="true"
            />
            <img
              src={img.heroPerson}
              alt="LiveCrib marketing professional"
              className="relative z-10 mx-auto max-h-[460px] w-auto drop-shadow-2xl"
              loading="eager"
            />
          </Reveal>
        </div>

        {/* Stats strip */}
        <div className="shell relative pb-16 md:pb-20">
          <div className="grid grid-cols-2 gap-5 border-t border-white/10 pt-8 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <strong className="block text-3xl font-extrabold text-white sm:text-4xl">{s.value}</strong>
                <span className="text-sm text-[#8f98bb]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Services ---------------- */}
      <section className="section">
        <div className="shell">
          <SectionHead
            eyebrow="What we do"
            title="End-to-end digital solutions, under one roof"
            sub="From the first line of code to the campaign that fills your pipeline — we cover the whole journey."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.title} className="card" delay={i * 80}>
                <div className="icon-badge">{s.icon}</div>
                <h3 className="mb-2 text-xl">{s.title}</h3>
                <p className="m-0 text-ink-muted">{s.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Marketing feature (with imagery) ---------------- */}
      <section className="section bg-soft">
        <div className="shell grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="eyebrow">Marketing that moves the needle</span>
            <h2 className="text-3xl md:text-4xl">Data-driven campaigns, measurable growth</h2>
            <p className="mt-3 text-lg text-ink-soft">
              We pair sharp creative with analytics so every shilling of spend works harder — building
              awareness, engagement, and loyalty across every channel your customers use.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-5">
              <FeatureStat value="150%" label="Average brand awareness lift" />
              <FeatureStat value="35%" label="Improvement in retention" />
            </div>
            <Link to="/contact" className="btn btn-dark mt-7">Grow with us →</Link>
          </Reveal>

          <Reveal delay={120} className="relative">
            <img
              src={img.marketing}
              alt="Team reviewing marketing analytics"
              className="w-full rounded-xl2 border border-line shadow-hi"
              loading="lazy"
            />
            <img
              src={img.analytics}
              alt="Mobile analytics dashboard"
              className="absolute -bottom-8 -left-6 hidden w-40 rounded-2xl border-4 border-white shadow-hi sm:block"
              loading="lazy"
            />
          </Reveal>
        </div>
      </section>

      {/* ---------------- Products showcase ---------------- */}
      <section className="section">
        <div className="shell">
          <SectionHead
            eyebrow="Software we've built"
            title="Products powering real businesses"
            sub="Explore live demos of our flagship platforms — trial credentials are provided right on each login screen."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {products.map((p, i) => (
              <Reveal
                key={p.id}
                delay={i * 100}
                className="flex flex-col overflow-hidden rounded-xl2 border border-line bg-surface shadow-soft transition-all duration-200 hover:-translate-y-1.5 hover:shadow-hi"
              >
                {/* Screenshot preview */}
                <div className="relative overflow-hidden border-b border-line" style={{ background: p.color }}>
                  <img
                    src={p.shots[0]}
                    alt={`${p.name} preview`}
                    className="block h-52 w-full object-cover object-top"
                    loading="lazy"
                  />
                  <span
                    className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-white backdrop-blur"
                    style={{ background: `${p.color}cc` }}
                  >
                    {p.kicker}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-8">
                  <div>
                    <h3 className="mb-1 text-2xl">{p.name}</h3>
                    <p className="m-0 font-medium" style={{ color: p.color }}>{p.tagline}</p>
                  </div>
                  <p className="m-0 text-ink-soft">{p.text}</p>
                  <ul className="grid grid-cols-1 gap-2 text-[0.92rem] text-ink-soft sm:grid-cols-2">
                    {p.features.slice(0, 4).map((f) => <li key={f}>✓ {f}</li>)}
                  </ul>
                  <div className="mt-auto flex flex-wrap gap-2.5">
                    <Link to={p.demoPath} className="btn btn-primary">Try live demo</Link>
                    <Link to="/products" className="btn btn-outline">Learn more</Link>
                  </div>
                  <p className="m-0 text-sm text-ink-muted">🔑 Trial login credentials shown on the demo screen.</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Solutions ---------------- */}
      <section className="section bg-soft">
        <div className="shell">
          <SectionHead eyebrow="Solutions" title="Built for where you're headed" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {solutions.map((s, i) => (
              <Reveal
                key={s.title}
                delay={i * 70}
                className="rounded-card border border-line bg-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-card"
              >
                <div className="mb-3.5 grid h-11 w-11 place-items-center rounded-xl bg-sunken text-xl">{s.icon}</div>
                <h3 className="mb-1 text-lg">{s.title}</h3>
                <p className="m-0 text-[0.95rem] text-ink-muted">{s.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Process ---------------- */}
      <section className="section">
        <div className="shell">
          <SectionHead eyebrow="How we work" title="A simple, transparent process" />
          <div className="grid gap-6 md:grid-cols-3">
            {process.map((p, i) => (
              <Reveal key={p.step} delay={i * 90} className="rounded-card border border-line bg-surface p-8">
                <span className="mb-3 block text-4xl font-extrabold text-grad">{p.step}</span>
                <h3 className="mb-2 text-xl">{p.title}</h3>
                <p className="m-0 text-ink-muted">{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Testimonials ---------------- */}
      <section className="section bg-soft">
        <div className="shell grid gap-6 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal key={i} delay={i * 100} className="rounded-xl2 border border-line bg-surface p-9">
              <p className="m-0 font-serif text-5xl leading-[0.5] text-accent">“</p>
              <p className="mt-4 text-lg font-medium text-ink">{t.quote}</p>
              <p className="m-0 text-[0.95rem] text-ink-muted"><strong>{t.name}</strong> · {t.org}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <CtaBand
        title="Let's build something that grows your business."
        sub="Tell us about your idea — we'll turn it into a plan and then into reality."
      >
        <Link to="/contact" className="btn btn-light btn-lg">Get Started</Link>
        <Link to="/portfolio" className="btn btn-ghost btn-lg">See our work</Link>
      </CtaBand>
    </>
  )
}

/* ---- Small shared bits ---- */
function SectionHead({ eyebrow, title, sub }) {
  return (
    <div className="mx-auto mb-12 max-w-[680px] text-center">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="text-3xl md:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-[1.08rem] text-ink-muted">{sub}</p>}
    </div>
  )
}

function FeatureStat({ value, label }) {
  return (
    <div className="rounded-card border border-line bg-surface p-5">
      <strong className="block text-3xl font-extrabold text-grad">{value}</strong>
      <span className="text-sm text-ink-muted">{label}</span>
    </div>
  )
}

export function CtaBand({ title, sub, children }) {
  return (
    <section className="bg-deep py-16 text-white md:py-20">
      <div className="shell mx-auto max-w-[680px] text-center">
        <h2 className="text-3xl text-white md:text-4xl">{title}</h2>
        <p className="mb-7 mt-3 text-lg text-[#b9c0da]">{sub}</p>
        <div className="flex flex-wrap justify-center gap-3.5">{children}</div>
      </div>
    </section>
  )
}
