import { Link } from 'react-router-dom';
import Async from '../components/Async.jsx';
import ProgramCard from '../components/ProgramCard.jsx';
import StatGrid from '../components/StatGrid.jsx';
import { Arrow, ButtonLink, Card, CardGrid, Container, Section, textLinkClass } from '../components/ui.jsx';
import { useSiteData } from '../context/SiteDataContext.jsx';
import { useApi } from '../hooks/useApi.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { formatDate, localized } from '../lib/format.js';

export default function Home() {
  const { t, lang } = useLanguage();
  const { text } = useSiteData();
  const featured = useApi('/programs?is_featured=true&limit=3');
  const news = useApi('/announcements?limit=3');
  const stats = useApi('/statistics');

  return (
    <>
      <section className='hero-glow'>
        <Container className='py-20 text-center sm:py-32'>
          <h1 className='mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl'>{t('home.heroTitle')}</h1>
          <p className='mx-auto mt-6 max-w-2xl whitespace-pre-line text-lg text-muted'>{text('home.hero_text', t('home.heroText'))}</p>
          <div className='mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row'>
            <ButtonLink to='/activities'>{t('home.ctaActivities')}</ButtonLink>
            <ButtonLink to='/next' variant='secondary'>{t('home.ctaNext')}</ButtonLink>
          </div>
        </Container>
      </section>

      <Section title={t('home.aboutTitle')}>
        <p className='max-w-3xl whitespace-pre-line text-muted'>{text('home.about_text', t('home.aboutText'))}</p>
        <Link to='/about' className={textLinkClass}>{t('common.learnMore')} <Arrow /></Link>
      </Section>

      <Section title={t('home.whatWeDo')} className='border-t border-border'>
        <CardGrid>
          {t('categories').map((c) => (
            <Card key={c.title} title={c.title}>{c.desc}</Card>
          ))}
        </CardGrid>
      </Section>

      <Section title={t('home.featured')} className='border-t border-border'>
        <Async state={featured} emptyText={t('home.featuredEmpty')}>
          {(items) => (
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {items.map((p) => <ProgramCard key={p.id} program={p} />)}
            </div>
          )}
        </Async>
        <Link to='/programs' className={textLinkClass}>{t('programsPage.viewAll')} <Arrow /></Link>
      </Section>

      <Section className='border-t border-border bg-surface'>
        <p className='text-sm font-semibold uppercase tracking-widest text-accent'>{t('next.slogan')}</p>
        <h2 className='mt-3 text-2xl font-semibold sm:text-3xl'>{t('home.nextTitle')}</h2>
        <p className='mt-4 max-w-2xl whitespace-pre-line text-muted'>{text('home.next_text', t('home.nextText'))}</p>
        <Link to='/next' className={textLinkClass}>{t('home.ctaNext')} <Arrow /></Link>
      </Section>

      <Section title={t('home.announcements')}>
        <Async state={news} emptyText={t('home.announcementsEmpty')}>
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

      <Section title={t('home.impact')} className='border-t border-border'>
        {stats.loading ? <p className='text-muted'>{t('common.loading')}</p> : <StatGrid items={stats.data?.items} empty={t('home.impactEmpty')} />}
        <Link to='/impact' className={textLinkClass}>{t('common.learnMore')} <Arrow /></Link>
      </Section>

      <Section className='border-t border-border bg-surface text-center'>
        <h2 className='text-3xl font-semibold'>{t('home.ctaTitle')}</h2>
        <p className='mx-auto mt-4 max-w-xl text-muted'>{t('home.ctaText')}</p>
        <div className='mt-8'>
          <ButtonLink to='/contact'>{t('home.ctaButton')}</ButtonLink>
        </div>
      </Section>
    </>
  );
}
