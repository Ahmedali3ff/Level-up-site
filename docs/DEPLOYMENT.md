# Deployment, Admin Access and Content Guide

## Architecture

- `frontend/`: static React app (build output in `frontend/dist`).
- `backend/`: Node.js API.
- PostgreSQL database.

The front-end and API should be served from the same site (for example a reverse proxy, or subdomains of one domain) so session cookies work with `SameSite=Lax`. If they are on different sites, set `COOKIE_SAMESITE=none` in the backend and `VITE_API_URL` in the front-end.

## Free hosting options

Free tiers change often. Check each provider's current limits before launch and re-check periodically. Nothing in this project requires a paid plan, and nothing upgrades automatically.

| Part | Possible free option | Things to verify |
| --- | --- | --- |
| Front-end | Cloudflare Pages, Vercel (free tier) or GitHub Pages | Bandwidth and build limits. GitHub Pages is static only. |
| API | A free Node web service tier | Whether it sleeps when idle (first request can be slow), monthly hours, memory |
| Database | Supabase free Postgres, or another free Postgres | Storage size, connection limits, whether idle projects are paused, backup availability |

If a free quota is reached, the API returns errors instead of upgrading. The front-end shows a friendly message when content cannot be loaded.

## First-time setup

1. Create the database and set `DATABASE_URL` (and `DATABASE_SSL=true` for hosted databases).
2. Set `JWT_SECRET`, `CLIENT_URL`, Google credentials and `SUPER_ADMIN_*` in the backend environment. Never commit `.env`.
3. Run `npm run db:migrate` and `npm run db:seed-admin` in `backend/`.
4. Build the front-end with `npm run build` in `frontend/` and publish `dist/`.

## Admin access

- Sign in at `/admin/login` with email and password, or with Google (the Google email must already be an admin).
- The seeded Super Admin can add more admins under Admin Users and choose their role:
  - Super Admin: everything, including admin accounts.
  - Admin: all content plus contact messages and partnership inquiries.
  - Content Manager: content only.
- Admins created without a password can only sign in with Google.

## Updating content

- Programs, Activities, Announcements, Opportunities: add or edit in the dashboard. Items stay hidden until published (programs: Published; activities and announcements: status Published; opportunities: any status except Draft).
- Program status (Coming Soon, Open, Ongoing, Closed, Completed, Postponed) is changed in the program form.
- Statistics: add, edit or remove numbers manually. Only verified figures should be entered.
- Social Links: add platform and URL, and toggle visibility.
- Website Content: choose a section, a language (English or Arabic) and write the text. Saving the same section and language again updates it.
- Contact Messages and Partnership Inquiries: read, mark as read, set status, add internal notes, delete.

## Testing checklist

- Pages and navigation, English and Arabic (RTL), mobile and desktop.
- Forms: empty fields, invalid email, success message, rate limit.
- Login, logout, Google sign-in, protected routes, role restrictions.
- Create, edit, publish, unpublish and delete for every content type.
- Browsers: Chrome, Edge, Firefox, Android and iOS browsers.

Automated: `npm test` in `backend/` (utility unit tests). Full end-to-end and security testing still needs to be done on a running environment.
