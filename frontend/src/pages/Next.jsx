import ProgramCard from '../components/ProgramCard.jsx';
import { Card, PageHeader, Section } from '../components/ui.jsx';
import { useSiteData } from '../context/SiteDataContext.jsx';
import { useApi } from '../hooks/useApi.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { activityTypes } from '../lib/constants.js';
import { localized } from '../lib/format.js';

const introKeys = ['next.about', 'next.vision', 'next.approach'];

export default function Next() {
  const { t, lang } = useLanguage();
  const { text } = useSiteData();
  const activities = useApi('/activities?initiative=next&limit=100');
  const programs = useApi('/programs?initiative=next&limit=100');
  const sections = t('next.sections');

  return (
    <>
      <PageHeader title={t('next.title')} subtitle={text('next.intro', t('next.intro'))}>
        <p className='mt-6 text-sm font-semibold uppercase tracking-widest text-accent'>{t('next.slogan')}</p>
      </PageHeader>

      <Section>
        <div className='grid gap-4 sm:grid-cols-3'>
          {introKeys.map((key, i) => (
            <Card key={key} title={sections[i]}>{text(key, t('common.placeholder'))}</Card>
          ))}
        </div>
      </Section>

      {activityTypes.map((type, i) => {
        const items = (activities.data?.items ?? []).filter((a) => a.activity_type === type);
        const typePrograms = type === 'program' ? (programs.data?.items ?? []) : [];
        const empty = items.length + typePrograms.length === 0;
        return (
          <Section key={type} title={sections[3 + i]} className='border-t border-border'>
            {typePrograms.length > 0 && (
              <div className='mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {typePrograms.map((p) => <ProgramCard key={p.id} program={p} />)}
              </div>
            )}
            <div className='space-y-3'>
              {items.map((a) => (
                <details key={a.id} className='rounded-xl border border-border bg-surface p-5'>
                  <summary className='cursor-pointer font-medium'>{localized(a, 'title', lang)}</summary>
                  {a.image && <img src={a.image} alt='' loading='lazy' className='mt-4 max-h-64 w-full rounded-lg object-cover' />}
                  <p className='mt-3 whitespace-pre-line text-sm text-muted'>{localized(a, 'description', lang)}</p>
                </details>
              ))}
            </div>
            {empty && !activities.loading && <p className='text-sm text-muted'>{t('ui.soon')}</p>}
          </Section>
        );
      })}
    </>
  );
}
