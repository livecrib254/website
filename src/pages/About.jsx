import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import { CtaBand } from './Home.jsx'
import { values, team, stats, img } from '../data/site.js'

export default function About() {
  return (
    <>
      <section className="border-b border-line bg-linear-to-b from-soft to-white pb-8 pt-20 md:pb-14">
        <div className="shell">
          <span className="eyebrow">About us</span>
          <h1 className="max-w-[18ch] text-4xl md:text-5xl">We blend creativity with technology to grow your brand</h1>
          <p className="mt-4 max-w-[640px] text-lg text-ink-soft">
            LiveCrib Solutions is a digital marketing and software agency. We started with a simple idea —
            deliver impactful work that creates meaningful change — and grew into a team building modern
            software and campaigns for clients across many industries.
          </p>
        </div>
      </section>

      {/* Mission + image */}
      <section className="section">
        <div className="shell grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-3xl md:text-4xl">Our mission</h2>
            <p className="mt-3 text-lg text-ink-soft">
              To provide top-notch marketing and software solutions that help you reach your audience effectively.
            </p>
            <p className="text-ink-muted">
              We began in marketing and expanded to cutting-edge software — but our focus never moved:
              your goals shape everything we build. Together, we achieve greatness.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-card border border-line bg-soft p-6">
                  <strong className="block text-3xl font-extrabold text-grad">{s.value}</strong>
                  <span className="text-sm text-ink-muted">{s.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <img
              src={img.team}
              alt="The LiveCrib Solutions team"
              className="w-full rounded-xl2 border border-line object-cover shadow-hi"
              loading="lazy"
            />
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-soft">
        <div className="shell">
          <div className="mx-auto mb-12 max-w-[680px] text-center">
            <span className="eyebrow">Our values</span>
            <h2 className="text-3xl md:text-4xl">What guides our work</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} className="card" delay={i * 70}>
                <div className="icon-badge">{v.icon}</div>
                <h3 className="mb-2 text-lg">{v.title}</h3>
                <p className="m-0 text-ink-muted">{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="shell">
          <div className="mx-auto mb-12 max-w-[680px] text-center">
            <span className="eyebrow">The team</span>
            <h2 className="text-3xl md:text-4xl">Meet our talented team</h2>
          </div>
          <div className="mx-auto grid max-w-[900px] gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m, i) => (
              <Reveal
                key={m.name}
                delay={i * 70}
                className="rounded-xl2 border border-line bg-white p-8 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-card"
              >
                {m.image ? (
                  <img
                    src={m.image}
                    alt={m.name}
                    className="mx-auto mb-4 h-28 w-28 rounded-full object-cover shadow-soft ring-4 ring-sunken"
                    loading="lazy"
                  />
                ) : (
                  <div className="mx-auto mb-4 grid h-28 w-28 place-items-center rounded-full bg-accent-grad text-2xl font-extrabold text-white">
                    {m.initials}
                  </div>
                )}
                <h3 className="mb-0.5 text-lg">{m.name}</h3>
                <p className="m-0 font-semibold text-accent">{m.role}</p>
                {m.bio && <p className="mt-2 text-[0.9rem] text-ink-muted">{m.bio}</p>}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Your success is our mission." sub="Let's talk about where you want to go next.">
        <Link to="/contact" className="btn btn-light btn-lg">Get a Free Consultation</Link>
      </CtaBand>
    </>
  )
}
