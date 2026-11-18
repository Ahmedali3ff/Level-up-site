import { query } from '../config/db.js';
import { schemas } from '../validation/schemas.js';
import { escapeLike } from '../utils/text.js';

const failed = (res, error) =>
  res.status(400).json({
    error: 'Please check the form fields',
    details: error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
  });

// POST /api/contact
export async function submitContact(req, res, next) {
  try {
    const parsed = schemas.contact.safeParse(req.body ?? {});
    if (!parsed.success) return failed(res, parsed.error);
    const d = parsed.data;
    await query(
      'INSERT INTO contact_messages (full_name, email, subject, message) VALUES ($1, $2, $3, $4)',
      [d.fullName, d.email, d.subject, d.message]
    );
    return res.status(201).json({ message: 'Message received' });
  } catch (err) {
    return next(err);
  }
}

// POST /api/partnerships
export async function submitPartnership(req, res, next) {
  try {
    const parsed = schemas.partnership.safeParse(req.body ?? {});
    if (!parsed.success) return failed(res, parsed.error);
    const d = parsed.data;
    await query(
      `INSERT INTO partnership_inquiries (full_name, organization, email, organization_type, partnership_interest, message)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [d.fullName, d.organization, d.email, d.organizationType, d.partnershipInterest, d.message]
    );
    return res.status(201).json({ message: 'Inquiry received' });
  } catch (err) {
    return next(err);
  }
}

// GET /api/search?q=...  (searches only this website's own published content)
export async function search(req, res, next) {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 100) : '';
    if (q.length < 2) return res.json({ items: [] });

    const m = (col) => `${col} ILIKE '%' || $1 || '%' ESCAPE '!'`;
    const sql = `
      SELECT 'program' AS type, id, title, title_ar, left(short_description, 200) AS description, slug
        FROM programs WHERE is_published = true AND (${m('title')} OR ${m('title_ar')} OR ${m('short_description')})
      UNION ALL
      SELECT 'activity', id, title, title_ar, left(description, 200), NULL::text
        FROM activities WHERE status = 'published' AND (${m('title')} OR ${m('title_ar')} OR ${m('description')})
      UNION ALL
      SELECT 'announcement', id, title, title_ar, left(content, 200), NULL::text
        FROM announcements WHERE status = 'published' AND publication_date <= now() AND (${m('title')} OR ${m('title_ar')} OR ${m('content')})
      UNION ALL
      SELECT 'opportunity', id, title, title_ar, left(description, 200), NULL::text
        FROM opportunities WHERE status <> 'draft' AND (${m('title')} OR ${m('title_ar')} OR ${m('description')})
      LIMIT 30`;
    const { rows } = await query(sql, [escapeLike(q)]);
    return res.json({ items: rows });
  } catch (err) {
    return next(err);
  }
}
