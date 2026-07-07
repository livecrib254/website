import LoginScreen from '../LoginScreen.jsx'

// Real demo credentials from the live Rental Manager app.
const TRIAL = [
  { role: 'Admin Account', id: 'testadmin@email.com', password: 'pass1234' },
  { role: 'Tenant Account', id: 'njeri@email.com', password: 'pass1234' },
]

export default function RmsLogin() {
  return (
    <LoginScreen
      appName="Rental Manager"
      kicker="Rental Management System"
      icon="🏢"
      accent="#4f46e5"
      accent2="#818cf8"
      identifierLabel="Email"
      identifierType="email"
      blurb="Property, tenants, and rent — handled. Get a clear view of every property, lease and payment, list available units, and automate rent collection."
      points={[
        'Property & unit portfolio',
        'Tenant & lease management',
        'Rent collection & reminders',
        'Maintenance request tickets',
      ]}
      trials={TRIAL}
      storageKey="rental_user"
      redirect="/apps/rms/dashboard"
      placeholder="testadmin@email.com"
    />
  )
}
