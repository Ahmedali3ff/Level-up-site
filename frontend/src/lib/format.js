export function formatDate(value, lang) {
  if (!value) return '';
  const text = String(value);
  const date = new Date(text.length === 10 ? `${text}T12:00:00` : text);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Returns the Arabic field (field_ar) when the page is in Arabic and it exists, otherwise the English one.
export const localized = (item, field, lang) => (lang === 'ar' && item[`${field}_ar`]) || item[field];
