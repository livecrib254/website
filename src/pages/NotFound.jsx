import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="grid min-h-[60vh] place-content-center py-16 text-center">
      <div className="shell">
        <h1 className="text-grad text-[clamp(4rem,14vw,8rem)] font-extrabold leading-none">404</h1>
        <h2 className="text-3xl">Page not found</h2>
        <p className="text-lg text-ink-muted">The page you're looking for doesn't exist or has moved.</p>
        <Link to="/" className="btn btn-primary btn-lg mt-3">Back to home</Link>
      </div>
    </section>
  )
}
