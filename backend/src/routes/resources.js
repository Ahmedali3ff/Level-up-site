import { Router } from 'express';
import { createCrud } from '../controllers/crud.js';
import { query } from '../config/db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { schemas } from '../validation/schemas.js';

const editors = [requireAuth, requireRole('admin', 'content_manager')];

// Public: GET (published content only). Protected: POST / PUT / DELETE.
// The matching admin router (mounted under /api/admin) lists everything including drafts.
function build(name, config) {
  const crud = createCrud(config);
  const pub = Router();
  const admin = Router();

  pub.get('/', crud.publicList);
  pub.get('/:id', crud.publicGet);
  pub.post('/', ...editors, crud.create);
  pub.put('/:id', ...editors, crud.update);
  pub.delete('/:id', ...editors, crud.remove);

  admin.get('/', crud.adminList);
  admin.get('/:id', crud.adminGet);

  return { name, pub, admin };
}

const programs = build('programs', {
  table: 'programs',
  schema: schemas.program,
  columns: [
    'title', 'title_ar', 'slug', 'short_description', 'short_description_ar', 'full_description',
    'full_description_ar', 'objectives', 'eligibility', 'duration', 'category', 'activity_type',
    'initiative', 'cover_image', 'target_audience', 'start_date', 'end_date', 'registration_deadline',
    'registration_url', 'status', 'is_published', 'is_featured',
  ],
  publicWhere: 'is_published = true',
  filters: ['category', 'status', 'activity_type', 'initiative', 'is_featured'],
  searchCols: ['title', 'title_ar', 'short_description'],
  orderBy: 'start_date DESC NULLS LAST, id DESC',
  slug: true,
  hasUpdatedAt: true,
});

const activities = build('activities', {
  table: 'activities',
  schema: schemas.activity,
  columns: ['title', 'title_ar', 'description', 'description_ar', 'category', 'activity_type', 'initiative', 'image', 'program_id', 'status'],
  publicWhere: "status = 'published'",
  filters: ['category', 'activity_type', 'initiative', 'program_id'],
  searchCols: ['title', 'title_ar', 'description'],
});

const announcements = build('announcements', {
  table: 'announcements',
  schema: schemas.announcement,
  columns: ['title', 'title_ar', 'content', 'content_ar', 'publication_date', 'cover_image', 'program_id', 'status'],
  publicWhere: "status = 'published' AND publication_date <= now()",
  filters: ['program_id'],
  searchCols: ['title', 'title_ar', 'content'],
  orderBy: 'publication_date DESC, id DESC',
});

const opportunities = build('opportunities', {
  table: 'opportunities',
  schema: schemas.opportunity,
  columns: ['title', 'title_ar', 'description', 'description_ar', 'category', 'deadline', 'external_url', 'status'],
  publicWhere: "status <> 'draft'",
  filters: ['category', 'status'],
  searchCols: ['title', 'title_ar', 'description'],
  orderBy: 'deadline ASC NULLS LAST, id DESC',
});

// Statistics are entered manually by admins; nothing is generated automatically.
const statistics = build('statistics', {
  table: 'statistics',
  schema: schemas.statistic,
  columns: ['name', 'name_ar', 'value', 'description', 'display_order'],
  orderBy: 'display_order ASC, id ASC',
  hasUpdatedAt: true,
});

const socialLinks = build('social-links', {
  table: 'social_links',
  schema: schemas.socialLink,
  columns: ['platform', 'url', 'is_visible'],
  publicWhere: 'is_visible = true',
  orderBy: 'id ASC',
});

// POST /api/content is an upsert on (section_name, language).
const content = build('content', {
  table: 'website_content',
  schema: schemas.siteContent,
  columns: ['section_name', 'language', 'content'],
  orderBy: 'section_name ASC, language ASC',
  hasUpdatedAt: true,
  upsertOn: ['section_name', 'language'],
});

// GET /api/content/map -> { en: { section: text }, ar: { section: text } }
const contentMap = Router();
contentMap.get('/map', async (req, res, next) => {
  try {
    const { rows } = await query('SELECT section_name, language, content FROM website_content');
    const out = { en: {}, ar: {} };
    for (const row of rows) out[row.language][row.section_name] = row.content;
    return res.json(out);
  } catch (err) {
    return next(err);
  }
});
contentMap.use(content.pub);
content.pub = contentMap;

export const resources = [programs, activities, announcements, opportunities, statistics, socialLinks, content];
