import { env } from '../config/env.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

// CSRF protection: browsers always attach Origin to cross-site state-changing requests,
// so anything not coming from our own front-end is rejected.
export function originCheck(req, res, next) {
  if (SAFE_METHODS.has(req.method)) return next();
  const origin = req.get('origin');
  if (origin && origin !== env.clientOrigin) {
    return res.status(403).json({ error: 'Request origin not allowed' });
  }
  return next();
}
