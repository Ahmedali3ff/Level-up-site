import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { env } from '../config/env.js';
import { AUTH_COOKIE, clearAuthCookie } from '../utils/token.js';

// Verifies the session cookie and re-checks the admin in the database on every request,
// so disabled accounts and role changes take effect immediately (server-side validation).
export async function requireAuth(req, res, next) {
  const token = req.cookies?.[AUTH_COOKIE];
  if (!token) return res.status(401).json({ error: 'Authentication required' });

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret, { algorithms: ['HS256'] });
  } catch {
    clearAuthCookie(res);
    return res.status(401).json({ error: 'Session expired or invalid' });
  }

  try {
    const { rows } = await query(
      'SELECT id, full_name, email, role, status FROM admin_users WHERE id = $1',
      [payload.sub]
    );
    const user = rows[0];
    if (!user || user.status !== 'active') {
      clearAuthCookie(res);
      return res.status(401).json({ error: 'Account unavailable' });
    }
    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
}

// Usage: router.delete('/programs/:id', requireAuth, requireRole('admin'), handler)
// super_admin is always allowed.
export const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (req.user && (req.user.role === 'super_admin' || roles.includes(req.user.role))) return next();
    return res.status(403).json({ error: 'You do not have permission to perform this action' });
  };
