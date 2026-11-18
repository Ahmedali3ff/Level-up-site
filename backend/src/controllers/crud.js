import { query } from '../config/db.js';
import { escapeLike, slugify } from '../utils/text.js';

const isId = (value) => value !== '' && [...String(value)].every((c) => c >= '0' && c <= '9');

export const invalid = (res, error) =>
  res.status(400).json({
    error: 'Validation failed',
    details: error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
  });

function dbError(err, res, next) {
  if (err.code === '23505') return res.status(409).json({ error: 'A record with the same unique value already exists' });
  if (err.code === '23503') return res.status(400).json({ error: 'Related record not found or still in use' });
  if (['22P02', '22007', '22003'].includes(err.code)) return res.status(400).json({ error: 'Invalid value' });
  return next(err);
}

// Generic CRUD handlers. Table and column names come only from trusted config;
// all values go through parameterized queries.
export function createCrud(config) {
  const {
    table, columns = [], schema, publicWhere = null, filters = [], searchCols = [],
    orderBy = 'id DESC', slug = false, hasUpdatedAt = false, upsertOn = null,
  } = config;

  const pick = (data) => Object.entries(data).filter(([key, value]) => value !== undefined && columns.includes(key));

  const list = (adminMode) => async (req, res, next) => {
    try {
      const where = [];
      const params = [];
      if (!adminMode && publicWhere) where.push(`(${publicWhere})`);

      for (const col of filters) {
        const value = req.query[col];
        if (typeof value === 'string' && value !== '') {
          params.push(value);
          where.push(`${col}::text = $${params.length}`);
        }
      }

      const q = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 100) : '';
      if (q && searchCols.length) {
        params.push(escapeLike(q));
        const n = params.length;
        where.push(`(${searchCols.map((c) => `${c} ILIKE '%' || $${n} || '%' ESCAPE '!'`).join(' OR ')})`);
      }

      const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), 100);
      const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
      const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

      const total = (await query(`SELECT count(*)::int AS n FROM ${table} ${whereSql}`, params)).rows[0].n;
      const { rows } = await query(
        `SELECT * FROM ${table} ${whereSql} ORDER BY ${orderBy} LIMIT ${limit} OFFSET ${(page - 1) * limit}`,
        params
      );
      return res.json({ items: rows, total, page, limit });
    } catch (err) {
      return dbError(err, res, next);
    }
  };

  const get = (adminMode) => async (req, res, next) => {
    try {
      const { id } = req.params;
      const byId = isId(id);
      if (!byId && !slug) return res.status(400).json({ error: 'Invalid id' });
      const where = [byId ? 'id = $1' : 'slug = $1'];
      if (!adminMode && publicWhere) where.push(`(${publicWhere})`);
      const { rows } = await query(`SELECT * FROM ${table} WHERE ${where.join(' AND ')}`, [id]);
      if (!rows[0]) return res.status(404).json({ error: 'Not found' });
      return res.json(rows[0]);
    } catch (err) {
      return dbError(err, res, next);
    }
  };

  const insert = async (entries) => {
    const cols = entries.map(([key]) => key);
    const values = entries.map(([, value]) => value);
    const placeholders = cols.map((_, i) => `$${i + 1}`);
    let sql = `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${placeholders.join(', ')})`;
    if (upsertOn) {
      const updates = cols.filter((c) => !upsertOn.includes(c)).map((c) => `${c} = EXCLUDED.${c}`);
      if (hasUpdatedAt) updates.push('updated_at = now()');
      sql += ` ON CONFLICT (${upsertOn.join(', ')}) DO UPDATE SET ${updates.join(', ')}`;
    }
    const { rows } = await query(`${sql} RETURNING *`, values);
    return rows[0];
  };

  const create = async (req, res, next) => {
    try {
      const parsed = schema.safeParse(req.body ?? {});
      if (!parsed.success) return invalid(res, parsed.error);
      const data = { ...parsed.data };

      const autoSlug = slug && !data.slug;
      if (autoSlug) data.slug = slugify(data.title || '') || `item-${Date.now().toString(36)}`;
      const baseSlug = data.slug;

      for (let attempt = 0; attempt < 4; attempt += 1) {
        if (attempt > 0) data.slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;
        try {
          return res.status(201).json(await insert(pick(data)));
        } catch (err) {
          if (!(autoSlug && err.code === '23505' && attempt < 3)) throw err;
        }
      }
      return next(new Error('Could not create record'));
    } catch (err) {
      return dbError(err, res, next);
    }
  };

  const update = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!isId(id)) return res.status(400).json({ error: 'Invalid id' });
      const parsed = schema.partial().safeParse(req.body ?? {});
      if (!parsed.success) return invalid(res, parsed.error);

      const entries = pick(parsed.data);
      if (entries.length === 0) return res.status(400).json({ error: 'Nothing to update' });

      const sets = entries.map(([key], i) => `${key} = $${i + 1}`);
      if (hasUpdatedAt) sets.push('updated_at = now()');
      const params = [...entries.map(([, value]) => value), id];
      const { rows } = await query(
        `UPDATE ${table} SET ${sets.join(', ')} WHERE id = $${params.length} RETURNING *`,
        params
      );
      if (!rows[0]) return res.status(404).json({ error: 'Not found' });
      return res.json(rows[0]);
    } catch (err) {
      return dbError(err, res, next);
    }
  };

  const remove = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!isId(id)) return res.status(400).json({ error: 'Invalid id' });
      const { rowCount } = await query(`DELETE FROM ${table} WHERE id = $1`, [id]);
      if (!rowCount) return res.status(404).json({ error: 'Not found' });
      return res.json({ message: 'Deleted' });
    } catch (err) {
      return dbError(err, res, next);
    }
  };

  return {
    publicList: list(false),
    adminList: list(true),
    publicGet: get(false),
    adminGet: get(true),
    create,
    update,
    remove,
  };
}
