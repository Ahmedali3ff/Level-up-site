import 'dotenv/config';

const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

const nodeEnv = process.env.NODE_ENV || 'development';
export const isProd = nodeEnv === 'production';

const jwtSecret = required('JWT_SECRET');
if (jwtSecret.length < 32) throw new Error('JWT_SECRET must be at least 32 characters');

const cookieSameSite = (process.env.COOKIE_SAMESITE || 'lax').toLowerCase();
if (!['lax', 'strict', 'none'].includes(cookieSameSite)) {
  throw new Error('COOKIE_SAMESITE must be lax, strict or none');
}

const clientUrl = required('CLIENT_URL');

const google = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
};

export const env = {
  nodeEnv,
  port: Number(process.env.PORT) || 4000,
  databaseUrl: required('DATABASE_URL'),
  databaseSsl: process.env.DATABASE_SSL === 'true',
  jwtSecret,
  sessionHours: Number(process.env.SESSION_HOURS) || 8,
  clientOrigin: new URL(clientUrl).origin,
  cookieSameSite,
  google,
  googleEnabled: Boolean(google.clientId && google.clientSecret && google.redirectUri),
};
