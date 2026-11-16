import bcrypt from 'bcryptjs';
import { pool } from '../src/config/db.js';

const email = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
const fullName = process.env.SUPER_ADMIN_NAME?.trim() || 'Super Admin';
const password = process.env.SUPER_ADMIN_PASSWORD;

try {
  if (!email) throw new Error('SUPER_ADMIN_EMAIL is required');
  if (password && password.length < 12) throw new Error('SUPER_ADMIN_PASSWORD must be at least 12 characters');

  const passwordHash = password ? await bcrypt.hash(password, 12) : null;

  await pool.query(
    `INSERT INTO admin_users (full_name, email, password_hash, role, status)
     VALUES ($1, $2, $3, 'super_admin', 'active')
     ON CONFLICT (email) DO UPDATE SET
       full_name = EXCLUDED.full_name,
       role = 'super_admin',
       status = 'active',
       password_hash = COALESCE(EXCLUDED.password_hash, admin_users.password_hash)`,
    [email, fullName, passwordHash]
  );
  console.log(`Super Admin ready: ${email}${passwordHash ? ' (password set)' : ' (Google sign-in only)'}`);
} catch (err) {
  console.error('Seeding failed:', err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
