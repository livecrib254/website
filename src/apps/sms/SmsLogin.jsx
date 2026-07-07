import LoginScreen from '../LoginScreen.jsx'

// Real demo credentials from the live Shule SMS app.
const TRIAL = [
  { role: 'Admin Account', id: 'admin', password: 'm0t0m0t0' },
]

export default function SmsLogin() {
  return (
    <LoginScreen
      appName="Shule SMS"
      kicker="School Management System"
      icon="🎓"
      accent="#2563eb"
      accent2="#38bdf8"
      identifierLabel="Username"
      identifierType="text"
      blurb="Run your whole school from one dashboard — students, teachers, timetables, exams, finance, library and communication, all in one place."
      points={[
        'Student & teacher management',
        'Timetable & exam grading',
        'Finance, fees & library',
        'Communication & notifications',
      ]}
      trials={TRIAL}
      storageKey="shule_user"
      redirect="/apps/sms/dashboard"
      placeholder="admin"
    />
  )
}
