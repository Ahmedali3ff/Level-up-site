import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { pool } from '../src/config/db.js';

const dbDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'db');

// Runs schema.sql, then every file in db/migrations in name order. All files are idempotent.
try {
  await pool.query(await readFile(path.join(dbDir, 'schema.sql'), 'utf8'));
  const migrations = (await readdir(path.join(dbDir, 'migrations'))).filter((f) => f.endsWith('.sql')).sort();
  for (const file of migrations) {
    await pool.query(await readFile(path.join(dbDir, 'migrations', file), 'utf8'));
    console.log(`Applied ${file}`);
  }
  console.log('Database is up to date.');
} catch (err) {
  console.error('Migration failed:', err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
