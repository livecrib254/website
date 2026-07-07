# LiveCrib Solutions — Vite + React

A modern, responsive rebuild of the [LiveCrib Solutions](https://wp.livecrib.pro/) website, plus
interactive demos of two products the agency has built:

- **Shule SMS** — a School Management System (production: https://sms.livecrib.pro/)
- **Rental Manager** — a Rental Management System (production: https://rms.livecrib.pro/)

Both product demos include **trial credentials printed right on the login screen** — click any
credential row to autofill, then sign in.

## Tech stack

- [Vite](https://vitejs.dev/) 5 + [React](https://react.dev/) 18
- [Tailwind CSS](https://tailwindcss.com/) v4 (via `@tailwindcss/vite`) — design tokens defined in
  `@theme`, a small component layer (`btn`, `card`, `field`, …) built with `@apply`, utilities in markup
- [React Router](https://reactrouter.com/) 6 for client-side routing
- Real imagery pulled from the original LiveCrib site, stored in `public/images/`
- Zero backend: the login and contact forms are handled client-side for demo purposes

## Getting started

```bash
npm install
npm run dev      # start the dev server at http://localhost:5173
npm run build    # production build to /dist
npm run preview  # preview the production build
```

> Note: this project was scaffolded in an environment where Node couldn't execute, so it has not
> been run here. Run `npm install && npm run dev` locally — it's a standard Vite app.

## Routes

| Path | Page |
| --- | --- |
| `/` | Home — hero, services, product showcase, process, testimonials |
| `/about` | About — mission, values, team, stats |
| `/products` | Products — deep dive on Shule SMS & Rental Manager with live-demo links |
| `/portfolio` | Portfolio — filterable case studies |
| `/contact` | Contact — details + demo contact form |
| `/apps/sms/login` | **Shule SMS** login (trial credentials on screen) |
| `/apps/sms/dashboard` | Shule SMS demo dashboard |
| `/apps/rms/login` | **Rental Manager** login (trial credentials on screen) |
| `/apps/rms/dashboard` | Rental Manager demo dashboard |

## Trial credentials

These mirror the real demo credentials shown on the live apps' login screens.

**Shule SMS** (`/apps/sms/login`) — logs in with a **username**
- Admin — `admin` / `m0t0m0t0`

**Rental Manager** (`/apps/rms/login`) — logs in with an **email**
- Admin — `testadmin@email.com` / `pass1234`
- Tenant — `njeri@email.com` / `pass1234`

## Project structure

```
src/
  main.jsx            # entry + Tailwind CSS import
  App.jsx             # routes (marketing layout + standalone app demos)
  index.css           # Tailwind import, @theme tokens, component layer
  data/site.js        # all site copy + image paths (edit content here)
  components/         # Navbar, Footer, ScrollToTop, Reveal
  pages/              # Home, About, Products, Portfolio, Contact, NotFound
  apps/
    AppShell.jsx      # shared dashboard chrome (sidebar + topbar)
    LoginScreen.jsx   # shared login screen (trial creds on screen)
    DashKit.jsx       # shared dashboard widgets (stats, chart, feed, table)
    sms/              # Shule SMS login + dashboard
    rms/              # Rental Manager login + dashboard
public/
  logo.png            # brand logo (favicon + nav)
  images/             # photos/illustrations from the original LiveCrib site
```

## Editing content

All marketing copy and image paths live in `src/data/site.js` — brand info, services, solutions,
stats, process, values, team, products, portfolio, testimonials, and the `img` map. Change it there
without touching components. Design tokens (colors, radii, shadows, font) live in the `@theme` block
of `src/index.css`.
