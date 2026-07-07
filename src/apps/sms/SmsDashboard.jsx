import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppShell from '../AppShell.jsx'
import { DashHead, StatGrid, Panel, BarChart, Feed, DashTable } from '../DashKit.jsx'

const ACCENT = '#2563eb'

const stats = [
  { label: 'Students Enrolled', value: '55', delta: '30 boys · 25 girls', icon: '👨‍🎓' },
  { label: 'Teaching Staff', value: '15', delta: '9 male · 6 female', icon: '👩‍🏫' },
  { label: 'Library Copies', value: '116', delta: '66 available · 52 out', icon: '📚' },
  { label: 'Upcoming Events', value: '1', delta: 'Sports Day · 10 Jul', icon: '📅' },
]

const nav = [
  'Overview', 'Student Management', 'Teacher Management', 'Timetable', 'Exam Grading',
  'Library', 'Disciplinary', 'Finance', 'Inventory & Assets', 'Communication', 'Hostel & Transport',
]

const classes = [
  { name: 'Form 4 Arts', students: 32, teacher: 'Samuel Kiprop', attendance: 96 },
  { name: 'JSS 1 Alpha', students: 28, teacher: 'Jane Wambui', attendance: 91 },
  { name: 'Grade 6 Alpha', students: 24, teacher: 'Esther Adhiambo', attendance: 98 },
  { name: 'Form 3 Science', students: 30, teacher: 'Daniel Ochieng', attendance: 89 },
]

const activity = [
  { t: '10 min ago', text: 'Term 1 report cards published for Form 4 Arts', tag: 'Exam Grading' },
  { t: '1 hr ago', text: 'Fee payment received — KES 45,000 (Invoice #2043)', tag: 'Finance' },
  { t: '3 hrs ago', text: 'New student admitted: Brian Mwangi (Form 1)', tag: 'Students' },
  { t: 'Today', text: '23 library titles currently borrowed — chase overdue copies', tag: 'Library' },
]

const bars = [88, 92, 85, 96, 90, 94, 91]
const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export default function SmsDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('shule_user')
    if (!raw) { navigate('/apps/sms/login'); return }
    setUser(JSON.parse(raw))
  }, [navigate])

  if (!user) return null

  return (
    <AppShell
      appName="Shule SMS"
      appIcon="🎓"
      accent={ACCENT}
      nav={nav}
      user={user}
      onLogout={() => { sessionStorage.removeItem('shule_user'); navigate('/apps/sms/login') }}
    >
      <DashHead title="Good morning 👋" sub="Here's what's happening at your school today.">
        <button className="btn btn-outline px-[18px] py-2.5">Export</button>
        <button className="btn btn-primary px-[18px] py-2.5" style={{ background: ACCENT }}>+ Add student</button>
      </DashHead>

      <StatGrid stats={stats} accent={ACCENT} />

      <div className="mb-[22px] grid gap-[18px] lg:grid-cols-[1.5fr_1fr]">
        <Panel title="Weekly attendance" right={<span className="pill">Mon – Sun</span>}>
          <BarChart bars={bars} labels={dayLabels} accent={ACCENT} />
        </Panel>
        <Panel title="Recent activity">
          <Feed items={activity} accent={ACCENT} />
        </Panel>
      </div>

      <Panel title="Classes overview" right={<Link to="#" className="text-[0.9rem] font-semibold" style={{ color: ACCENT }}>View all →</Link>}>
        <DashTable head={['Class', 'Students', 'Class teacher', 'Attendance']}>
          {classes.map((c) => (
            <tr key={c.name}>
              <td className="border-b border-sunken px-3 py-3.5 text-[0.92rem]"><strong>{c.name}</strong></td>
              <td className="border-b border-sunken px-3 py-3.5 text-[0.92rem]">{c.students}</td>
              <td className="border-b border-sunken px-3 py-3.5 text-[0.92rem]">{c.teacher}</td>
              <td className="border-b border-sunken px-3 py-3.5 text-[0.92rem]">
                <span className="mr-2 inline-block h-[7px] w-[90px] overflow-hidden rounded bg-sunken align-middle">
                  <span className="block h-full rounded" style={{ width: `${c.attendance}%`, background: ACCENT }} />
                </span>
                <small>{c.attendance}%</small>
              </td>
            </tr>
          ))}
        </DashTable>
      </Panel>
    </AppShell>
  )
}
