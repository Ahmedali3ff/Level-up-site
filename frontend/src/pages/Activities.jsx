import { Link } from 'react-router-dom';
import { Arrow, PageHeader, Section, textLinkClass } from '../components/ui.jsx';
import { useApi } from '../hooks/useApi.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { categoryKeys } from '../lib/constants.js';
import { localized } from '../lib/format.js';

export default function Activities() {
  const { t, lang } = useLanguage();
  const programs = useApi('/programs?limit=100');
  const activities = useApi('/activities?limit=100');
  const categories = t('categories');

  return (
    <>
      <PageHeader title={t('activitiesPage.title')} subtitle={t('activitiesPage.intro')} />
      <Section>
        <div className='grid gap-4 md:grid-cols-2'>
          {categoryKeys.map((key, i) => {
            const relatedPrograms = (programs.data?.items ?? []).filter((p) => p.category === key);
            const relatedActivities = (activities.data?.items ?? []).filter((a) => a.category === key);
            const hasRelated = relatedPrograms.length + relatedActivities.length > 0;
            return (
              <article key={key} className='rounded-xl border border-border bg-surface p-6'>
                <h2 className='text-lg font-semibold'>{categories[i].title}</h2>
                <p className='mt-2 text-sm text-muted'>{categories[i].desc}</p>
                {hasRelated ? (
                  <ul className='mt-4 space-y-2 border-t border-border pt-4 text-sm'>
                    {relatedPrograms.map((p) => (
                      <li key={`p${p.id}`}>
                        <Link to={`/programs/${p.slug}`} className='text-accent hover:underline'>{localized(p, 'title', lang)}</Link>
                      </li>
                    ))}
                    {relatedActivities.map((a) => (
                      <li key={`a${a.id}`} className='text-muted'>{localized(a, 'title', lang)}</li>
                    ))}
                  </ul>
                ) : (
                  <p className='mt-4 border-t border-border pt-4 text-sm text-muted'>{t('activitiesPage.related')}</p>
                )}
              </article>
            );
          })}
        </div>
        <Link to='/programs' className={textLinkClass}>{t('programsPage.viewAll')} <Arrow /></Link>
      </Section>
    </>
  );
}
