import { z } from 'zod';
import { clean, stripTags } from '../utils/text.js';

export const CATEGORIES = ['scholarships', 'competitions', 'programs', 'volunteering', 'digital_skills', 'english', 'technology', 'research'];
export const ACTIVITY_TYPES = ['program', 'competition', 'challenge', 'project', 'hackathon', 'workshop', 'team_experience', 'showcase'];
export const PROGRAM_STATUSES = ['coming_soon', 'open', 'ongoing', 'closed', 'completed', 'postponed'];
export const ORG_TYPES = ['university', 'company', 'nonprofit', 'government', 'individual', 'other'];
export const INTERESTS = ['programs', 'competitions', 'scholarships', 'speaking', 'other'];
export const PARTNERSHIP_STATUSES = ['new', 'in_review', 'accepted', 'declined', 'archived'];
export const ROLES = ['super_admin', 'admin', 'content_manager'];

// Fields missing from the request stay undefined, so partial updates never overwrite other columns.
const keep = (value, fn) => (value === undefined ? undefined : fn(value));

const reqText = (max) => z.string().trim().min(1).max(max).transform(clean);
const optText = (max) =>
  z.string().max(max).nullish().transform((v) => keep(v, (x) => (x ? clean(x) || null : null)));

const isHttp = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

// Only http(s) links are accepted, which blocks javascript: URLs.
const optUrl = z.string().max(2048).nullish()
  .refine((v) => !v || isHttp(v), 'Must be an http(s) URL')
  .transform((v) => keep(v, (x) => x || null));

const optImage = z.string().max(2048).nullish()
  .refine((v) => !v || isHttp(v) || (v.startsWith('/') && !v.startsWith('//')), 'Must be an http(s) URL or a /path')
  .transform((v) => keep(v, (x) => x || null));

const optDate = z.string().nullish()
  .refine((v) => !v || !Number.isNaN(Date.parse(v)), 'Invalid date')
  .transform((v) => keep(v, (x) => x || null));

const optId = z.number().int().positive().nullish().transform((v) => keep(v, (x) => x ?? null));
const optEnum = (values) => z.enum(values).nullish().transform((v) => keep(v, (x) => x ?? null));

const SLUG_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789-';
const slugField = z.string().trim().toLowerCase().max(120).nullish()
  .refine((v) => !v || [...v].every((c) => SLUG_CHARS.includes(c)), 'Use lowercase letters, numbers and dashes')
  .transform((v) => keep(v, (x) => x || null));

// Public form text: HTML tags are stripped before storing.
const pubText = (max) =>
  z.string().trim().min(1).max(max).transform((v) => clean(stripTags(v))).refine((v) => v.length > 0, 'Required');
const email = z.string().trim().toLowerCase().email().max(254);

const program = z.object({
  title: reqText(200),
  title_ar: optText(200),
  slug: slugField,
  short_description: optText(500),
  short_description_ar: optText(500),
  full_description: optText(20000),
  full_description_ar: optText(20000),
  objectives: optText(5000),
  eligibility: optText(5000),
  duration: optText(200),
  category: optEnum(CATEGORIES),
  activity_type: optEnum(ACTIVITY_TYPES),
  initiative: z.enum(['levelup', 'next']).optional(),
  cover_image: optImage,
  target_audience: optText(500),
  start_date: optDate,
  end_date: optDate,
  registration_deadline: optDate,
  registration_url: optUrl,
  status: z.enum(PROGRAM_STATUSES).optional(),
  is_published: z.boolean().optional(),
  is_featured: z.boolean().optional(),
});

const activity = z.object({
  title: reqText(200),
  title_ar: optText(200),
  description: optText(5000),
  description_ar: optText(5000),
  category: optEnum(CATEGORIES),
  activity_type: optEnum(ACTIVITY_TYPES),
  initiative: z.enum(['levelup', 'next']).optional(),
  image: optImage,
  program_id: optId,
  status: z.enum(['draft', 'published']).optional(),
});

const announcement = z.object({
  title: reqText(200),
  title_ar: optText(200),
  content: optText(20000),
  content_ar: optText(20000),
  publication_date: optDate,
  cover_image: optImage,
  program_id: optId,
  status: z.enum(['draft', 'published']).optional(),
});

const opportunity = z.object({
  title: reqText(200),
  title_ar: optText(200),
  description: optText(5000),
  description_ar: optText(5000),
  category: optEnum(CATEGORIES),
  deadline: optDate,
  external_url: optUrl,
  status: z.enum(['draft', 'open', 'closed', 'expired']).optional(),
});

const statistic = z.object({
  name: reqText(200),
  name_ar: optText(200),
  value: reqText(100),
  description: optText(1000),
  display_order: z.number().int().min(0).max(100000).optional(),
});

const socialLink = z.object({
  platform: reqText(100),
  url: z.string().max(2048).refine(isHttp, 'Must be an http(s) URL'),
  is_visible: z.boolean().optional(),
});

const siteContent = z.object({
  section_name: reqText(100),
  language: z.enum(['en', 'ar']),
  content: reqText(20000),
});

const contact = z.object({
  fullName: pubText(200),
  email,
  subject: pubText(300),
  message: pubText(5000),
});

const partnership = z.object({
  fullName: pubText(200),
  organization: pubText(200),
  email,
  organizationType: z.enum(ORG_TYPES),
  partnershipInterest: z.enum(INTERESTS),
  message: pubText(5000),
});

const messageUpdate = z.object({ is_read: z.boolean() });

const partnershipUpdate = z.object({
  status: z.enum(PARTNERSHIP_STATUSES).optional(),
  internal_notes: optText(5000),
});

const userCreate = z.object({
  full_name: reqText(200),
  email,
  role: z.enum(ROLES),
  password: z.string().min(12).max(200).nullish(),
});

const userUpdate = z
  .object({
    full_name: reqText(200),
    role: z.enum(ROLES),
    status: z.enum(['active', 'disabled']),
    password: z.string().min(12).max(200).nullish(),
  })
  .partial();

export const schemas = {
  program, activity, announcement, opportunity, statistic, socialLink, siteContent,
  contact, partnership, messageUpdate, partnershipUpdate, userCreate, userUpdate,
};
