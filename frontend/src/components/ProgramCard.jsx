import { Link } from 'react-router-dom';
import { Arrow } from './ui.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { localized } from '../lib/format.js';

const badgeColors = {
  open: 'bg-green-500/15 text-green-300',
  ongoing: 'bg-blue-500/15 text-blue-300',
  coming_soon: 'bg-amber-500/15 text-amber-300',
  closed: 'bg-zinc-500/20 text-zinc-300',
  completed: 'bg-zinc-500/20 text-zinc-300',
  postponed: 'bg-red-500/15 text-red-300',
};

export function StatusBadge({ status }) {
  const { t } = useLanguage();
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${badgeColors[status] || badgeColors.closed}`}>
      {t(`status.${status}`)}
    </span>
  );
}

export default function ProgramCard({ program }) {
  const { t, lang } = useLanguage();
  return (
    <article className='flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-brand/60'>
      {program.cover_image ? (
        <img src={program.cover_image} alt='' loading='lazy' className='h-40 w-full object-cover' />
      ) : (
        <div className='h-40 bg-border/40' aria-hidden='true' />
      )}
      <div className='flex flex-1 flex-col p-5'>
        <div><StatusBadge status={program.status} /></div>
        <h3 className='mt-3 font-semibold'>{localized(program, 'title', lang)}</h3>
        <p className='mt-2 flex-1 text-sm text-muted'>{localized(program, 'short_description', lang)}</p>
        <Link to={`/programs/${program.slug}`} className='mt-4 inline-flex items-center gap-2 text-sm text-accent hover:underline'>
          {t('common.viewDetails')} <Arrow />
        </Link>
      </div>
    </article>
  );
}
