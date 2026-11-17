import { Router } from 'express';
import { createCrud } from '../controllers/crud.js';
import { dashboard, listUsers, createUser, updateUser } from '../controllers/admin.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { schemas } from '../validation/schemas.js';
import { resources } from './resources.js';

const router = Router();
router.use(requireAuth);

router.get('/dashboard', dashboard);

// Content lists including drafts (content managers, admins and super admins).
for (const resource of resources) {
  router.use(`/${resource.name}`, requireRole('admin', 'content_manager'), resource.admin);
}

// Inbox: contact messages and partnership inquiries (admins and super admins).
const inbox = [
  ['messages', createCrud({
    table: 'contact_messages',
    columns: ['is_read'],
    schema: schemas.messageUpdate,
    filters: ['is_read'],
    searchCols: ['full_name', 'email', 'subject'],
    orderBy: 'submitted_at DESC',
  })],
  ['partnerships', createCrud({
    table: 'partnership_inquiries',
    columns: ['status', 'internal_notes'],
    schema: schemas.partnershipUpdate,
    filters: ['status'],
    searchCols: ['full_name', 'organization', 'email'],
    orderBy: 'submitted_at DESC',
  })],
];
for (const [path, crud] of inbox) {
  router.get(`/${path}`, requireRole('admin'), crud.adminList);
  router.get(`/${path}/:id`, requireRole('admin'), crud.adminGet);
  router.put(`/${path}/:id`, requireRole('admin'), crud.update);
  router.delete(`/${path}/:id`, requireRole('admin'), crud.remove);
}

// Admin accounts: Super Admin only (requireRole with no roles allows super_admin alone).
router.get('/users', requireRole(), listUsers);
router.post('/users', requireRole(), createUser);
router.put('/users/:id', requireRole(), updateUser);

export default router;
