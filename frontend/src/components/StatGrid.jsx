import { EmptyState } from './ui.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { localized } from '../lib/format.js';

// Shows only statistics entered by admins. Nothing is calculated automatically.
export default function StatGrid({ items, empty }) {
  const { lang } = useLanguage();
  if (!items || items.length === 0) return <EmptyState>{empty}</EmptyState>;
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {items.map((s) => (
        <div key={s.id} className='rounded-xl border border-border bg-surface p-5'>
          <p className='text-3xl font-bold text-accent'>{s.value}</p>
          <p className='mt-1 font-medium'>{localized(s, 'name', lang)}</p>
          {s.description && <p className='mt-1 text-sm text-muted'>{s.description}</p>}
        </div>
      ))}
    </div>
  );
}
