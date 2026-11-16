import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { OAuth2Client } from 'google-auth-library';
import { query } from '../config/db.js';
import { env, isProd } from '../config/env.js';
import { signToken, setAuthCookie, clearAuthCookie } from '../utils/token.js';

const STATE_COOKIE = 'levelup_oauth_state';
const STATE_PATH = '/api/auth/google';
const LOGIN_URL = `${env.clientOrigin}/admin/login`;
const USER_COLUMNS = 'id, full_name, email, role, status';

// Compared against when the email is unknown, so response time does not reveal which emails exist.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(200),
});

export const publicUser = (u) => ({ id: u.id, fullName: u.full_name, email: u.email, role: u.role });

const safeEqual = (a, b) => {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

const googleClient = () => new OAuth2Client(env.google.clientId, env.google.clientSecret, env.google.redirectUri);

// POST /api/auth/login
export async function login(req, res, next) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'A valid email and password are required' });
    const { email, password } = parsed.data;

    const { rows } = await query(`SELECT ${USER_COLUMNS}, password_hash FROM admin_users WHERE email = $1`, [email]);
    const user = rows[0];
    const passwordOk = await bcrypt.compare(password, user?.password_hash || DUMMY_HASH);

    if (!user || !user.password_hash || !passwordOk || user.status !== 'active') {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    setAuthCookie(res, signToken(user));
    return res.json({ user: publicUser(user) });
  } catch (err) {
    return next(err);
  }
}

// POST /api/auth/logout
export function logout(req, res) {
  clearAuthCookie(res);
  return res.json({ message: 'Logged out' });
}

// GET /api/auth/me
export function me(req, res) {
  return res.json({ user: publicUser(req.user) });
}

// GET /api/auth/google  -> redirects the browser to Google
export function googleStart(req, res) {
  if (!env.googleEnabled) return res.status(503).json({ error: 'Google sign-in is not configured' });

  const state = crypto.randomBytes(24).toString('hex');
  res.cookie(STATE_COOKIE, state, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 10 * 60 * 1000,
    path: STATE_PATH,
  });

  const url = googleClient().generateAuthUrl({
    scope: ['openid', 'email', 'profile'],
    state,
    prompt: 'select_account',
  });
  return res.redirect(url);
}

// GET /api/auth/google/callback  -> Google redirects back here
// Only admins that already exist in admin_users can sign in; nobody is auto-created.
export async function googleCallback(req, res) {
  const fail = (code) => res.redirect(`${LOGIN_URL}?error=${code}`);

  try {
    if (!env.googleEnabled) return fail('google_unavailable');

    const { code, state, error } = req.query;
    const expectedState = req.cookies?.[STATE_COOKIE];
    res.clearCookie(STATE_COOKIE, { path: STATE_PATH });

    if (error) return fail('google_cancelled');
    if (typeof code !== 'string' || typeof state !== 'string' || !expectedState || !safeEqual(state, expectedState)) {
      return fail('invalid_state');
    }

    const client = googleClient();
    const { tokens } = await client.getToken(code);
    const ticket = await client.verifyIdToken({ idToken: tokens.id_token, audience: env.google.clientId });
    const profile = ticket.getPayload();
    if (!profile?.email || !profile.email_verified) return fail('email_not_verified');

    const email = profile.email.toLowerCase();
    let user = (await query(`SELECT ${USER_COLUMNS} FROM admin_users WHERE google_id = $1`, [profile.sub])).rows[0];

    if (!user) {
      user = (await query(`SELECT ${USER_COLUMNS} FROM admin_users WHERE email = $1 AND google_id IS NULL`, [email])).rows[0];
      if (user) await query('UPDATE admin_users SET google_id = $1 WHERE id = $2', [profile.sub, user.id]);
    }

    if (!user || user.status !== 'active') return fail('not_authorized');

    setAuthCookie(res, signToken(user));
    return res.redirect(`${env.clientOrigin}/admin`);
  } catch (err) {
    console.error('Google sign-in failed:', err.message);
    return fail('google_failed');
  }
}
