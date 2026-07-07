import { Link } from 'react-router-dom'
import { brand, nav, products } from '../data/site.js'

export default function Footer() {
  const year = 2026
  return (
    <footer className="bg-brand-900 pt-16 pb-6 text-[#cfd5e8]">
      <div className="shell grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
        <div>
          <div className="mb-3.5 flex items-center gap-2.5 text-xl font-extrabold text-white">
            <img src="/logo.png" alt="" className="h-[30px] w-[30px] rounded-md object-contain" />
            <span>LiveCrib</span>
          </div>
          <p className="max-w-[34ch] text-[#9aa3c0]">{brand.blurb}</p>
          <p className="mt-3 font-bold text-grad">{brand.tagline}</p>
        </div>

        <FooterCol title="Company">
          {nav.map((n) => (
            <li key={n.to}><Link to={n.to} className="hover:text-white">{n.label}</Link></li>
          ))}
        </FooterCol>

        <FooterCol title="Products">
          {products.map((p) => (
            <li key={p.id}><Link to={p.demoPath} className="hover:text-white">{p.name}</Link></li>
          ))}
          <li><Link to="/products" className="hover:text-white">All products</Link></li>
        </FooterCol>

        <FooterCol title="Get in touch">
          <li><a href={`mailto:${brand.email}`} className="hover:text-white">{brand.email}</a></li>
          <li><a href={`tel:${brand.phone.replace(/[^+\d]/g, '')}`} className="hover:text-white">{brand.phone}</a></li>
          <li>{brand.address}</li>
          <li className="text-[#737c9c]">{brand.hours}</li>
        </FooterCol>
      </div>

      <div className="shell mt-11 flex flex-wrap items-center justify-between gap-2.5 border-t border-white/10 pt-5 text-sm text-[#737c9c]">
        <span>© {year} {brand.name}. All rights reserved.</span>
      </div>
    </footer>
  )
}

function FooterCol({ title, children }) {
  return (
    <div>
      <h4 className="mb-4 text-[0.95rem] font-bold uppercase tracking-[0.08em] text-white">{title}</h4>
      <ul className="flex flex-col gap-2.5">{children}</ul>
    </div>
  )
}
