import { categoryKeys, categoryLabels, activityTypes, contentSections, programStatuses } from '../../lib/constants.js';

const title = (value) => value.split('_').join(' ');
const options = (values, labels) => values.map((v, i) => ({ value: v, label: labels ? labels[i] : title(v) }));

const categoryOptions = options(categoryKeys, categoryLabels);
const typeOptions = options(activityTypes);
const initiativeOptions = options(['levelup', 'next'], ['LevelUp', 'NEXT']);
const draftPublished = options(['draft', 'published']);

// Admin module definitions used by ResourceManager.
// listPath: GET (includes drafts). writePath: POST / PUT / DELETE.
export const modules = {
  programs: {
    title: 'Programs',
    listPath: '/admin/programs',
    writePath: '/programs',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'status', label: 'Status' },
      { key: 'category', label: 'Category' },
      { key: 'is_published', label: 'Published' },
    ],
    fields: [
      { name: 'title', label: 'Title (English)', required: true },
      { name: 'title_ar', label: 'Title (Arabic)' },
      { name: 'slug', label: 'Slug (auto-generated if empty)' },
      { name: 'short_description', label: 'Short description (English)', type: 'textarea' },
      { name: 'short_description_ar', label: 'Short description (Arabic)', type: 'textarea' },
      { name: 'full_description', label: 'Full description (English)', type: 'textarea' },
      { name: 'full_description_ar', label: 'Full description (Arabic)', type: 'textarea' },
      { name: 'objectives', label: 'Objectives', type: 'textarea' },
      { name: 'target_audience', label: 'Target audience' },
      { name: 'eligibility', label: 'Eligibility requirements', type: 'textarea' },
      { name: 'duration', label: 'Duration' },
      { name: 'category', label: 'Category', type: 'select', options: categoryOptions },
      { name: 'activity_type', label: 'Activity type', type: 'select', options: typeOptions },
      { name: 'initiative', label: 'Belongs to', type: 'select', options: initiativeOptions, default: 'levelup', required: true },
      { name: 'cover_image', label: 'Cover image URL' },
      { name: 'start_date', label: 'Start date', type: 'date' },
      { name: 'end_date', label: 'End date', type: 'date' },
      { name: 'registration_deadline', label: 'Registration deadline', type: 'date' },
      { name: 'registration_url', label: 'Registration link (https://...)' },
      { name: 'status', label: 'Status', type: 'select', options: options(programStatuses), default: 'coming_soon', required: true },
      { name: 'is_published', label: 'Published (visible on the website)', type: 'checkbox' },
      { name: 'is_featured', label: 'Featured on the home page', type: 'checkbox' },
    ],
  },
  activities: {
    title: 'Activities',
    listPath: '/admin/activities',
    writePath: '/activities',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'activity_type', label: 'Type' },
      { key: 'initiative', label: 'Belongs to' },
      { key: 'status', label: 'Status' },
    ],
    fields: [
      { name: 'title', label: 'Title (English)', required: true },
      { name: 'title_ar', label: 'Title (Arabic)' },
      { name: 'description', label: 'Description (English)', type: 'textarea' },
      { name: 'description_ar', label: 'Description (Arabic)', type: 'textarea' },
      { name: 'category', label: 'Category', type: 'select', options: categoryOptions },
      { name: 'activity_type', label: 'Activity type (used by the NEXT page)', type: 'select', options: typeOptions },
      { name: 'initiative', label: 'Belongs to', type: 'select', options: initiativeOptions, default: 'levelup', required: true },
      { name: 'image', label: 'Image URL' },
      { name: 'program_id', label: 'Related program ID', type: 'number' },
      { name: 'status', label: 'Status', type: 'select', options: draftPublished, default: 'draft', required: true },
    ],
  },
  announcements: {
    title: 'Announcements',
    listPath: '/admin/announcements',
    writePath: '/announcements',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'publication_date', label: 'Date', render: (r) => String(r.publication_date || '').slice(0, 10) },
      { key: 'status', label: 'Status' },
    ],
    fields: [
      { name: 'title', label: 'Title (English)', required: true },
      { name: 'title_ar', label: 'Title (Arabic)' },
      { name: 'content', label: 'Content (English)', type: 'textarea' },
      { name: 'content_ar', label: 'Content (Arabic)', type: 'textarea' },
      { name: 'publication_date', label: 'Publication date', type: 'date' },
      { name: 'cover_image', label: 'Cover image URL' },
      { name: 'program_id', label: 'Related program ID', type: 'number' },
      { name: 'status', label: 'Status', type: 'select', options: draftPublished, default: 'draft', required: true },
    ],
  },
  opportunities: {
    title: 'Opportunities',
    listPath: '/admin/opportunities',
    writePath: '/opportunities',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'deadline', label: 'Deadline', render: (r) => String(r.deadline || '').slice(0, 10) },
      { key: 'status', label: 'Status' },
    ],
    fields: [
      { name: 'title', label: 'Title (English)', required: true },
      { name: 'title_ar', label: 'Title (Arabic)' },
      { name: 'description', label: 'Description (English)', type: 'textarea' },
      { name: 'description_ar', label: 'Description (Arabic)', type: 'textarea' },
      { name: 'category', label: 'Category', type: 'select', options: categoryOptions },
      { name: 'deadline', label: 'Deadline', type: 'date' },
      { name: 'external_url', label: 'External link (https://...)' },
      { name: 'status', label: 'Status', type: 'select', options: options(['draft', 'open', 'closed', 'expired']), default: 'draft', required: true },
    ],
  },
  statistics: {
    title: 'Statistics',
    listPath: '/admin/statistics',
    writePath: '/statistics',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'value', label: 'Value' },
      { key: 'display_order', label: 'Order' },
    ],
    fields: [
      { name: 'name', label: 'Name (English)', required: true },
      { name: 'name_ar', label: 'Name (Arabic)' },
      { name: 'value', label: 'Value (verified figures only)', required: true },
      { name: 'description', label: 'Description' },
      { name: 'display_order', label: 'Display order', type: 'number', default: 0 },
    ],
  },
  social: {
    title: 'Social Links',
    listPath: '/admin/social-links',
    writePath: '/social-links',
    columns: [
      { key: 'platform', label: 'Platform' },
      { key: 'url', label: 'URL' },
      { key: 'is_visible', label: 'Visible' },
    ],
    fields: [
      { name: 'platform', label: 'Platform name', required: true },
      { name: 'url', label: 'URL (https://...)', required: true },
      { name: 'is_visible', label: 'Visible on the website', type: 'checkbox', default: true },
    ],
  },
  content: {
    title: 'Website Content',
    listPath: '/admin/content',
    writePath: '/content',
    columns: [
      { key: 'section_name', label: 'Section' },
      { key: 'language', label: 'Language' },
    ],
    fields: [
      { name: 'section_name', label: 'Section', type: 'select', options: contentSections.map((s) => ({ value: s.key, label: s.label })), required: true },
      { name: 'language', label: 'Language', type: 'select', options: [{ value: 'en', label: 'English' }, { value: 'ar', label: 'Arabic' }], default: 'en', required: true },
      { name: 'content', label: 'Text', type: 'textarea', required: true },
    ],
  },
  users: {
    title: 'Admin Users',
    listPath: '/admin/users',
    writePath: '/admin/users',
    canDelete: false,
    columns: [
      { key: 'full_name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Role' },
      { key: 'status', label: 'Status' },
    ],
    fields: [
      { name: 'full_name', label: 'Full name', required: true },
      { name: 'email', label: 'Email (cannot be changed later)', required: true, createOnly: true },
      { name: 'role', label: 'Role', type: 'select', options: options(['super_admin', 'admin', 'content_manager']), default: 'content_manager', required: true },
      { name: 'status', label: 'Status', type: 'select', options: options(['active', 'disabled']), default: 'active', editOnly: true },
      { name: 'password', label: 'Password (min 12 characters; leave empty for Google-only sign-in)', type: 'password' },
    ],
  },
};
