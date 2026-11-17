import rateLimit from 'express-rate-limit';

const base = { standardHeaders: true, legacyHeaders: false };

export const apiLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 300,
  message: { error: 'Too many requests, please try again later' },
});

// Only failed attempts count, so legitimate admins are not locked out.
export const loginLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  message: { error: 'Too many login attempts, please try again in 15 minutes' },
});

// Contact and partnership forms: a few submissions per hour per IP.
export const formLimiter = rateLimit({
  ...base,
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: { error: 'Too many submissions, please try again later' },
});
