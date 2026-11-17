# LevelUp & NEXT - Front-end

React 18 + Vite + Tailwind CSS (v3). Dark theme, English/Arabic with automatic RTL, responsive.

## Quick start

1. `cd frontend && npm install`
2. `cp .env.example .env` (leave `VITE_API_URL` empty in development)
3. Start the backend (see `backend/README.md`), then `npm run dev` and open http://localhost:5173

In development, `/api` is proxied to `http://localhost:4000`, so login cookies work without extra CORS setup. Set `CLIENT_URL=http://localhost:5173` in the backend `.env`.

## Public site

- Home, About, Our Activities, NEXT, Our Impact, Partner With Us, Contact, Privacy, Terms, custom 404
- Programs list (`/programs`) with category, status and activity type filters plus pagination, program detail pages (`/programs/:slug`) with related announcements and activities, and an opportunities list
- Home shows featured programs, latest announcements and verified statistics; NEXT groups its activities by type with expandable details
- Internal search (`/search`) over the site's own content, using the backend only
- Social links in the footer and on the Contact page
- Text blocks (About sections, intros) are editable from the dashboard; pages fall back to built-in placeholder text when nothing is saved
- Language switcher (EN/AR) flips `dir` and `lang` in place and remembers the choice
- Contact and Partnership forms: validation, honeypot, success and error states

## Admin dashboard (`/admin`)

Sign in at `/admin/login` (email and password, or Continue with Google). Tabs depend on role:

- All admins: Overview, Programs, Activities, Announcements, Opportunities, Statistics, Social Links, Website Content
- Admin and Super Admin: Contact Messages, Partnership Inquiries
- Super Admin: Admin Users

The dashboard UI is English only. The API enforces permissions; hidden tabs are only a convenience.

## For the UI/UX team

- Colors and theme tokens live in `src/index.css` (CSS variables) and `tailwind.config.js`. The current palette is neutral placeholder styling, not the final brand design.
- Shared building blocks are in `src/components/ui.jsx`; restyle those first and every page follows.
- Public text is in `src/i18n/en.js`, `ar.js` and the `*.extra.js` files. Final wording can also be entered from the dashboard (Website Content).
- Use logical Tailwind classes (`ms-`, `me-`, `ps-`, `pe-`, `text-start`) so layouts work in both directions.
- Admin screens are generated from `src/pages/admin/config.js`; adding a field there adds it to the form.

## Build

`npm run build` outputs static files to `dist/`. The backend must be hosted separately (see `docs/DEPLOYMENT.md`).
