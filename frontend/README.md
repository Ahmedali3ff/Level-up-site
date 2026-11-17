# LevelUp & NEXT - Front-end

React 18 + Vite + Tailwind CSS (v3). Dark theme, English/Arabic with automatic RTL, responsive.

## Quick start

1. `cd frontend && npm install`
2. `cp .env.example .env` (leave `VITE_API_URL` empty in development)
3. Start the backend (see `backend/README.md`), then `npm run dev` and open http://localhost:5173

In development, `/api` is proxied to `http://localhost:4000`, so login cookies work without extra CORS setup. Set `CLIENT_URL=http://localhost:5173` in the backend `.env`.

## What is included

- Routing for all public pages: Home, About, Activities, NEXT, Impact, Partner, Contact, Privacy, Terms, custom 404
- Language switcher (EN/AR) that flips `dir` and `lang` in place and remembers the choice
- Responsive navbar (mobile menu), footer, skip link, focus styles, reduced-motion support
- Contact and Partnership forms with validation, honeypot and success/error states (POST `/api/contact`, `/api/partnerships`)
- Admin: `/admin/login` (email + password, Continue with Google) and a protected `/admin` dashboard shell with logout

## For the UI/UX team

- Colors and theme tokens live in `src/index.css` (CSS variables) and `tailwind.config.js`. The current palette is neutral placeholder styling, not the final brand design.
- Shared building blocks are in `src/components/ui.jsx`; restyle those first and every page follows.
- All text is in `src/i18n/en.js` and `src/i18n/ar.js`. It is placeholder copy; final content will later be served from the Admin Dashboard.
- Use logical Tailwind classes (`ms-`, `me-`, `ps-`, `pe-`, `text-start`) so layouts work in both directions.

## Not connected yet

- Featured programs, announcements, statistics and social links show empty states until the matching backend endpoints exist.
- `/api/contact` and `/api/partnerships` are not implemented in the backend yet, so the forms will show the error message until they are.
- Admin modules on the dashboard are placeholders.

## Build

`npm run build` outputs static files to `dist/` (deployable to Cloudflare Pages, Vercel free tier, or GitHub Pages). The backend must be hosted separately.
