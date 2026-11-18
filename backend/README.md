# LevelUp & NEXT - Backend API

Node.js + Express + PostgreSQL. Everything used here is free and open source.

## Quick start

1. `cd backend && npm install`
2. `cp .env.example .env` and fill it in.
3. `npm run db:migrate` creates all tables (`db/schema.sql` plus `db/migrations/*.sql`).
4. `npm run db:seed-admin` creates the first Super Admin from `SUPER_ADMIN_*` in `.env`.
5. `npm run dev` starts the API on http://localhost:4000.
6. `npm test` runs the unit tests.

## Database (free options)

- Local PostgreSQL, or
- Supabase free-tier Postgres: copy the connection string into `DATABASE_URL` and set `DATABASE_SSL=true`.

All tables have Row Level Security enabled, so the database cannot be read through a public REST layer. The API connects with a privileged role.

## Authentication

- Signed JWT in an `httpOnly` cookie, 8 hours by default (`SESSION_HOURS`). Passwords are hashed with bcrypt (cost 12).
- Every protected request re-checks the admin in the database, so disabling an account or changing a role takes effect immediately.
- Roles: `super_admin` (everything, including admin accounts), `admin` (content, inbox), `content_manager` (content only).
- Google sign-in only works for admins that already exist in `admin_users` (matched by verified email).
- CSRF: state-changing requests must come from `CLIENT_URL` (Origin check); cookies are `SameSite=Lax` by default.

### Google sign-in setup (free)

1. Google Cloud Console: create a project and configure the OAuth consent screen.
2. Credentials > Create credentials > OAuth client ID > Web application.
3. Authorized redirect URI: `http://localhost:4000/api/auth/google/callback` (plus your deployed API URL later).
4. Put the client ID and secret in `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

## API

JSON bodies use snake_case column names, except the two public forms which use camelCase. List endpoints return `{ items, total, page, limit }` and accept `page`, `limit` (max 100) and `q` (search) plus the filters listed below.

### Public

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/programs`, `/api/programs/:idOrSlug` | Published only. Filters: `category`, `status`, `activity_type`, `initiative`, `is_featured` |
| GET | `/api/activities` | Published only. Filters: `category`, `activity_type`, `initiative`, `program_id` |
| GET | `/api/announcements` | Published and already dated. Filter: `program_id` |
| GET | `/api/opportunities` | Non-draft. Filters: `category`, `status` |
| GET | `/api/statistics` | Manually entered statistics |
| GET | `/api/social-links` | Visible links |
| GET | `/api/content/map` | `{ en: { section: text }, ar: { ... } }` |
| GET | `/api/search?q=` | Searches this site only (min 2 chars) |
| POST | `/api/contact` | `{ fullName, email, subject, message }`, rate limited |
| POST | `/api/partnerships` | `{ fullName, organization, email, organizationType, partnershipInterest, message }`, rate limited |

### Authentication

`POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`, `GET /api/auth/google`, `GET /api/auth/google/callback`.

### Content management (admin, content_manager)

`POST /api/<resource>`, `PUT /api/<resource>/:id`, `DELETE /api/<resource>/:id` for `programs`, `activities`, `announcements`, `opportunities`, `statistics`, `social-links`, `content`. `POST /api/content` is an upsert on `(section_name, language)`. Drafts are listed through `GET /api/admin/<resource>`.

### Admin only

| Method | Path | Role |
| --- | --- | --- |
| GET | `/api/admin/dashboard` | any admin |
| GET, PUT, DELETE | `/api/admin/messages[/:id]` | admin |
| GET, PUT, DELETE | `/api/admin/partnerships[/:id]` | admin |
| GET, POST, PUT | `/api/admin/users[/:id]` | super_admin |

See `docs/DEPLOYMENT.md` for hosting, admin access and content update instructions.
