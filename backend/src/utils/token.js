import jwt from 'jsonwebtoken';
import { env, isProd } from '../config/env.js';

export const AUTH_COOKIE = 'levelup_token';

const cookieOptions = () => ({
  httpOnly: true,
  secure: isProd || env.cookieSameSite === 'none',
  sameSite: env.cookieSameSite,
  path: '/',
});

export const signToken = (user) =>
  jwt.sign({ sub: String(user.id), role: user.role }, env.jwtSecret, {
    algorithm: 'HS256',
    expiresIn: `${env.sessionHours}h`,
  });

export const setAuthCookie = (res, token) =>
  res.cookie(AUTH_COOKIE, token, { ...cookieOptions(), maxAge: env.sessionHours * 60 * 60 * 1000 });

export const clearAuthCookie = (res) => res.clearCookie(AUTH_COOKIE, cookieOptions());
