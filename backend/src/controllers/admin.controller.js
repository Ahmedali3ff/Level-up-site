import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';
import { invalid } from './crud.js';
import { schemas } from '../validation/schemas.js';

const USER_FIELDS = 'id, full_name, email, role, status, created_at';
const isId = (value) => value !== '' && [...String(value)].every((c) => c >= '0' && c <= '9');

// GET /api/admin/dashboard
export async function dashboard(req, res, next) {
  try {
    const { rows } = await query(`
      SELECT
        (SELECT count(*) FROM programs)::int AS total_programs,
        (SELECT count(*) FROM programs WHERE is_published = true AND status IN ('open', 'ongoing'))::int AS active_programs,
        (SELECT count(*) FROM activities)::int AS total_activities,
        (SELECT count(*) FROM announcements)::int AS total_announcements,
        (SELECT count(*) FROM contact_messages WHERE is_read = false)::int AS new_messages,
        (SELECT count(*) FROM partnership_inquiries WHERE status = 'new')::int AS pending_partnerships`);
    return res.json(rows[0]);
  } catch (err) {
    return next(err);
  }
}

// Super Admin only: GET /api/admin/users
export async function listUsers(req, res, next) {
  try {
    const { rows } = await query(`SELECT ${USER_FIELDS} FROM admin_users ORDER BY id ASC`);
    return res.json({ items: rows, total: rows.length });
  } catch (err) {
    return next(err);
  }
}

// POST /api/admin/users. No password means Google-only sign-in.
export async function createUser(req, res, next) {
  try {
    const parsed = schemas.userCreate.safeParse(req.body ?? {});
    if (!parsed.success) return invalid(res, parsed.error);
    const d = parsed.data;
    const hash = d.password ? await bcrypt.hash(d.password, 12) : null;
    const { rows } = await query(
      `INSERT INTO admin_users (full_name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING ${USER_FIELDS}`,
      [d.full_name, d.email, hash, d.role]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'An admin with this email already exists' });
    return next(err);
  }
}

// PUT /api/admin/users/:id
export async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    if (!isId(id)) return res.status(400).json({ error: 'Invalid id' });
    const parsed = schemas.userUpdate.safeParse(req.body ?? {});
    if (!parsed.success) return invalid(res, parsed.error);
    const d = parsed.data;

    if (String(id) === String(req.user.id) && (d.role !== undefined || d.status !== undefined)) {
      return res.status(400).json({ error: 'You cannot change your own role or status' });
    }

    const sets = [];
    const params = [];
    const add = (column, value) => {
      params.push(value);
      sets.push(`${column} = $${params.length}`);
    };
    if (d.full_name !== undefined) add('full_name', d.full_name);
    if (d.role !== undefined) add('role', d.role);
    if (d.status !== undefined) add('status', d.status);
    if (d.password) add('password_hash', await bcrypt.hash(d.password, 12));
    if (sets.length === 0) return res.status(400).json({ error: 'Nothing to update' });

    params.push(id);
    const { rows } = await query(
      `UPDATE admin_users SET ${sets.join(', ')} WHERE id = $${params.length} RETURNING ${USER_FIELDS}`,
      params
    );
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    return res.json(rows[0]);
  } catch (err) {
    return next(err);
  }
}
