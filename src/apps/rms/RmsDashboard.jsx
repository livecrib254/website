import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppShell from '../AppShell.jsx'
import { DashHead, StatGrid, Panel, BarChart, Feed, DashTable } from '../DashKit.jsx'

const ACCENT = '#4f46e5'

const stats = [
  { label: 'Total Properties', value: '6', delta: '13 units occupied', icon: '🏢' },
  { label: 'Active Tenants', value: '18', delta: '1 lease renewal due', icon: '👥' },
  { label: 'Rent Collected', value: 'KES 620K', delta: 'July 2026', icon: '💰' },
  { label: 'Vacant / Maint.', value: '7 / 1', delta: 'Units to fill', icon: '🔑' },
]

const nav = [
  'Dashboard', 'Property Management', 'Tenant Management', 'Lease Management', 'Property Inquiries',
  'Rent Collection', 'Maintenance', 'Financial Reports', 'Document Management', 'Communication', 'Admin Settings',
]

const leases = [
  { unit: 'SandalWood Villas · Karen', tenant: 'Grace Muthoni', rent: 'KES 120,000', status: 'Paid', due: 'Jul 01' },
  { unit: 'Garden View Flats · Westlands', tenant: 'Daniel Kariuki', rent: 'KES 32,000', status: 'Pending', due: 'Jul 05' },
  { unit: 'Sky Tower Condo · Upper Hill', tenant: 'Aisha Hassan', rent: 'KES 85,000', status: 'Paid', due: 'Jul 01' },
  { unit: 'Riverside Apt · Kilimani', tenant: 'Peter Omondi', rent: 'KES 45,000', status: 'Overdue', due: 'Jun 28' },
]

const tickets = [
  { t: '20 min ago', text: 'Leaking tap reported — Garden View Flats 2A', tag: 'Maintenance', urgent: true },
  { t: '2 hrs ago', text: 'Rent payment received — SandalWood Villas (KES 120,000)', tag: 'Rent Collection' },
  { t: 'Today', text: 'Lease renewal signed — Sky Tower Condo', tag: 'Lease' },
  { t: 'Yesterday', text: 'New tenant onboarded — Riverside Apt, Kilimani', tag: 'Tenant' },
]

const bars = [62, 74, 68, 82, 79, 88, 84, 91, 86, 93, 90, 95]
const monthLabels = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']

const badgeClass = (s) => (s === 'Paid' ? 'badge-ok' : s === 'Pending' ? 'badge-warn' : 'badge-bad')

export default function RmsDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('rental_user')
    if (!raw) { navigate('/apps/rms/login'); return }
    setUser(JSON.parse(raw))
  }, [navigate])

  if (!user) return null

  return (
    <AppShell
      appName="Rental Manager"
      appIcon="🏢"
      accent={ACCENT}
      nav={nav}
      user={user}
      onLogout={() => { sessionStorage.removeItem('rental_user'); navigate('/apps/rms/login') }}
    >
      <DashHead title="Portfolio overview" sub="Every property, lease and payment at a glance.">
        <button className="btn btn-outline px-[18px] py-2.5">Statements</button>
        <button className="btn btn-primary px-[18px] py-2.5" style={{ background: ACCENT }}>+ Add property</button>
      </DashHead>

      <StatGrid stats={stats} accent={ACCENT} />

      <div className="mb-[22px] grid gap-[18px] lg:grid-cols-[1.5fr_1fr]">
        <Panel title="Rent collection · 2026" right={<span className="pill">Monthly</span>}>
          <BarChart bars={bars} labels={monthLabels} accent={ACCENT} />
        </Panel>
        <Panel title="Recent activity">
          <Feed items={tickets} accent={ACCENT} />
        </Panel>
      </div>

      <Panel title="Leases & rent status" right={<Link to="#" className="text-[0.9rem] font-semibold" style={{ color: ACCENT }}>View all →</Link>}>
        <DashTable head={['Unit', 'Tenant', 'Rent', 'Due', 'Status']}>
          {leases.map((l) => (
            <tr key={l.unit}>
              <td className="border-b border-sunken px-3 py-3.5 text-[0.92rem]"><strong>{l.unit}</strong></td>
              <td className="border-b border-sunken px-3 py-3.5 text-[0.92rem]">{l.tenant}</td>
              <td className="border-b border-sunken px-3 py-3.5 text-[0.92rem]">{l.rent}</td>
              <td className="border-b border-sunken px-3 py-3.5 text-[0.92rem]">{l.due}</td>
              <td className="border-b border-sunken px-3 py-3.5 text-[0.92rem]">
                <span className={`badge ${badgeClass(l.status)}`}>{l.status}</span>
              </td>
            </tr>
          ))}
        </DashTable>
      </Panel>
    </AppShell>
  )
}
