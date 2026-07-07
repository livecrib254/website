// Reusable dashboard building blocks shared by the SMS & RMS demos.

export function DashHead({ title, sub, children }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="mb-0.5 text-2xl font-extrabold">{title}</h1>
        <p className="m-0 text-ink-muted">{sub}</p>
      </div>
      <div className="flex gap-2.5">{children}</div>
    </div>
  )
}

export function StatGrid({ stats, accent }) {
  return (
    <div className="mb-5 grid grid-cols-2 gap-[18px] lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col rounded-card border border-line bg-white p-5 shadow-soft">
          <span className="mb-2.5 text-[1.4rem]">{s.icon}</span>
          <span className="text-[1.8rem] font-extrabold tracking-tight" style={{ color: accent }}>{s.value}</span>
          <span className="text-[0.9rem] font-semibold text-ink-soft">{s.label}</span>
          <span className="mt-1 text-[0.8rem] text-ink-muted">{s.delta}</span>
        </div>
      ))}
    </div>
  )
}

export function Panel({ title, right, children, className = '' }) {
  return (
    <section className={`rounded-card border border-line bg-white p-[22px] shadow-soft ${className}`}>
      <div className="mb-[18px] flex items-center justify-between">
        <h2 className="m-0 text-[1.15rem]">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  )
}

export function BarChart({ bars, labels, accent }) {
  return (
    <div className="flex h-[190px] items-end gap-2.5">
      {bars.map((h, i) => (
        <div key={i} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
          <div
            className="relative w-full max-w-[34px] rounded-t-lg transition-[filter] hover:brightness-110"
            style={{ height: `${h}%`, background: `linear-gradient(180deg, ${accent}, color-mix(in srgb, ${accent} 45%, #fff))` }}
          >
            <em className="absolute -top-5 left-1/2 -translate-x-1/2 text-[0.68rem] font-bold not-italic text-ink-soft opacity-0 transition-opacity group-hover:opacity-100">
              {h}%
            </em>
          </div>
          <span className="text-[0.72rem] font-semibold text-ink-muted">{labels[i]}</span>
        </div>
      ))}
    </div>
  )
}

export function Feed({ items, accent }) {
  return (
    <ul className="flex flex-col">
      {items.map((a, i) => (
        <li key={i} className="flex gap-3 border-b border-sunken py-2.5 last:border-0">
          <span
            className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full"
            style={
              a.urgent
                ? { background: '#d63031', boxShadow: '0 0 0 4px rgba(214,48,49,0.15)' }
                : { background: accent }
            }
          />
          <div>
            <p className="m-0 text-[0.92rem]">{a.text}</p>
            <span className="text-[0.78rem] text-ink-muted">
              {a.t} · <em className="font-semibold not-italic" style={{ color: accent }}>{a.tag}</em>
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}

export function DashTable({ head, children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse">
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} className="border-b border-line px-3 py-2.5 text-left text-[0.78rem] uppercase tracking-[0.05em] text-ink-muted">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}
