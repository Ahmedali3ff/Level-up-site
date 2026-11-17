# LevelUp & NEXT - Backend API

Node.js + Express + PostgreSQL. Everything used here is free and open source.

## Quick start

1. `cd backend && npm install`
2. `cp .env.example .env` and fill it in (see below).
3. `npm run db:migrate` creates all tables from `db/schema.sql`.
4. `npm run db:seed-admin` creates the first Super Admin from `SUPER_ADMIN_*` in `.env`.
5. `npm run dev` starts the API on http://localhost:4000.

## Database (free options)

- Local PostgreSQL, or
- Supabase free-tier Postgres: copy the connection string into `DATABASE_URL` and set `DATABASE_SSL=true`.

Check the provider's current free-tier limits before deploying. If a quota is reached the API should fail gracefully instead of upgrading automatically.

## Authentication

- Sessions use a signed JWT stored in an `httpOnly` cookie (not readable by JavaScript). Default lifetime is 8 hours (`SESSION_HOURS`).
- Passwords are hashed with bcrypt (cost 12). Login attempts are rate limited.
- Every protected request re-checks the admin in the database, so disabling an account or changing a role takes effect immediately.
- Roles: `super_admin`, `admin`, `content_manager`. Use `requireAuth` then `requireRole('admin')` on routes. `super_admin` always passes.
- Logout clears the cookie. Tokens are stateless, so they are not revoked server-side before they expire.
- CSRF: state-changing requests must come from `CLIENT_URL` (Origin check) and cookies are `SameSite=Lax` by default.

### Endpoints

| Method | Path | Description |
| --- | --- | --- |
| POST | `/api/auth/login` | Body: `{ email, password }`. Sets the session cookie. |
| POST | `/api/auth/logout` | Clears the session cookie. |
| GET | `/api/auth/me` | Current admin (requires login). |
| GET | `/api/auth/google` | Starts Google sign-in (browser redirect). |
| GET | `/api/auth/google/callback` | Google redirects back here, then to `/admin`. |
| GET | `/api/health` | Health check. |

### Google sign-in setup (free)

1. Open Google Cloud Console, create a project, then configure the OAuth consent screen.
2. Credentials > Create credentials > OAuth client ID > Web application.
3. Add the authorized redirect URI: `http://localhost:4000/api/auth/google/callback` (and your deployed API URL + `/api/auth/google/callback` later).
4. Copy the client ID and secret into `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`.

Google sign-in only works for admins who already exist in `admin_users` (matched by verified Google email). Unknown accounts are rejected with `?error=not_authorized` on `/admin/login`. Add admins by inserting them into `admin_users` (or through the dashboard once it exists).

### Front-end integration

```js
// Email + password
await fetch(`${API}/api/auth/login`, {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});

// Google: a normal link or redirect
window.location.href = `${API}/api/auth/google`;

// Current user / logout
await fetch(`${API}/api/auth/me`, { credentials: 'include' });
await fetch(`${API}/api/auth/logout`, { method: 'POST', credentials: 'include' });
```

The front-end needs an `/admin/login` page (it receives `?error=` codes from Google sign-in) and an `/admin` page.

If the front-end and API are on different sites, set `COOKIE_SAMESITE=none` (HTTPS required).

## Project structure

```
backend/
  db/schema.sql            all tables
  scripts/                 migrate.js, seed-admin.js
  src/
    config/                env.js, db.js
    controllers/           request handlers
    middleware/            auth, rate limit, origin check, errors
    routes/                route definitions
    utils/                 token helpers
    app.js, server.js
```
