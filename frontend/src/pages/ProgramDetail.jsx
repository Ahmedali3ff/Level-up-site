import { Link, useParams } from 'react-router-dom';
import Async from '../components/Async.jsx';
import { StatusBadge } from '../components/ProgramCard.jsx';
import { Arrow, ButtonLink, Container, EmptyState, PageHeader, Section } from '../components/ui.jsx';
import { useApi } from '../hooks/useApi.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { formatDate, localized } from '../lib/format.js';

function Info({ label, children }) {
  if (!children) return null;
  return (
    <div className='rounded-xl border border-border bg-surface p-4'>
      <p className='text-xs uppercase tracking-wide text-muted'>{label}</p>
      <p className='mt-1 whitespace-pre-line text-sm'>{children}</p>
    </div>
  );
}

export default function ProgramDetail() {
  const { slug } = useParams();
  const { t, lang } = useLanguage();
  const state = useApi(`/programs/${encodeURIComponent(slug)}`);
  const program = state.data;
  const news = useApi(program ? `/announcements?program_id=${program.id}&limit=5` : null);
  const activities = useApi(program ? `/activities?program_id=${program.id}&limit=20` : null);

  if (state.loading) return <Container className='py-16'><p className='text-muted'>{t('common.loading')}</p></Container>;
  if (state.error) {
    return (
      <Container className='py-16'>
        <EmptyState>{state.error.status === 404 ? t('detail.notFound') : t('ui.error')}</EmptyState>
        <div className='mt-6 text-center'><ButtonLink to='/programs' variant='secondary'>{t('detail.back')}</ButtonLink></div>
      </Container>
    );
  }

  const canRegister = program.registration_url && ['open', 'ongoing'].includes(program.status);

  return (
    <>
      <PageHeader title={localized(program, 'title', lang)} subtitle={localized(program, 'short_description', lang)}>
        <div className='mt-6 flex flex-wrap items-center gap-4'>
          <StatusBadge status={program.status} />
          {canRegister && (
            <a href={program.registration_url} target='_blank' rel='noopener noreferrer' className='rounded-lg bg-brand px-5 py-3 text-sm font-medium text-white hover:bg-brand/90'>
              {t('detail.register')}
            </a>
          )}
        </div>
      </PageHeader>

      <Section>
        <Link to='/programs' className='mb-8 inline-flex items-center gap-2 text-sm text-accent hover:underline'>
          <span aria-hidden='true' className='inline-block rotate-180 rtl:rotate-0'>&rarr;</span> {t('detail.back')}
        </Link>

        {program.cover_image && <img src={program.cover_image} alt='' loading='lazy' className='mb-8 max-h-96 w-full rounded-xl object-cover' />}

        <h2 className='mb-3 text-xl font-semibold'>{t('detail.about')}</h2>
        <p className='mb-8 max-w-3xl whitespace-pre-line text-muted'>{localized(program, 'full_description', lang) || localized(program, 'short_description', lang)}</p>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          <Info label={t('detail.objectives')}>{program.objectives}</Info>
          <Info label={t('detail.audience')}>{program.target_audience}</Info>
          <Info label={t('detail.eligibility')}>{program.eligibility}</Info>
          <Info label={t('detail.duration')}>{program.duration}</Info>
          <Info label={t('detail.start')}>{formatDate(program.start_date, lang)}</Info>
          <Info label={t('detail.end')}>{formatDate(program.end_date, lang)}</Info>
          <Info label={t('detail.deadline')}>{formatDate(program.registration_deadline, lang)}</Info>
        </div>
      </Section>

      {(news.data?.items?.length ?? 0) > 0 && (
        <Section title={t('detail.announcements')} className='border-t border-border'>
          <Async state={news} emptyText=''>
            {(items) => (
              <div className='space-y-3'>
                {items.map((a) => (
                  <details key={a.id} className='rounded-xl border border-border bg-surface p-5'>
                    <summary className='cursor-pointer font-medium'>
                      {localized(a, 'title', lang)}
                      <span className='ms-3 text-sm font-normal text-muted'>{formatDate(a.publication_date, lang)}</span>
                    </summary>
                    <p className='mt-3 whitespace-pre-line text-sm text-muted'>{localized(a, 'content', lang)}</p>
                  </details>
                ))}
              </div>
            )}
          </Async>
        </Section>
      )}

      {(activities.data?.items?.length ?? 0) > 0 && (
        <Section title={t('detail.activities')} className='border-t border-border'>
          <ul className='space-y-2 text-sm text-muted'>
            {activities.data.items.map((a) => <li key={a.id}>{localized(a, 'title', lang)}</li>)}
          </ul>
        </Section>
      )}
    </>
  );
}
