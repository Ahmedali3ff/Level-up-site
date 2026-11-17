import pg from 'pg';
import { env } from './env.js';

// Keep DATE columns as plain 'YYYY-MM-DD' strings (avoids timezone shifts in the front-end).
pg.types.setTypeParser(1082, (value) => value);

export const pool = new pg.Pool({
  connectionString: env.databaseUrl,
  // Hosted Postgres (e.g. Supabase) requires TLS.
  ssl: env.databaseSsl ? { rejectUnauthorized: false } : false,
  max: 10,
});

// Always use parameterized queries ($1, $2, ...) to prevent SQL injection.
export const query = (text, params) => pool.query(text, params);
