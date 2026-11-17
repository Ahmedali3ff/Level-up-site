import { Link } from 'react-router-dom';
import { Arrow, ButtonLink, Card, CardGrid, Container, EmptyState, Section, textLinkClass } from '../components/ui.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function Home() {
  const { t } = useLanguage();
  const categories = t('categories');

  return (
    <>
      <section className='hero-glow'>
        <Container className='py-20 text-center sm:py-32'>
          <h1 className='mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl'>{t('home.heroTitle')}</h1>
          <p className='mx-auto mt-6 max-w-2xl text-lg text-muted'>{t('home.heroText')}</p>
          <div className='mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row'>
            <ButtonLink to='/activities'>{t('home.ctaActivities')}</ButtonLink>
            <ButtonLink to='/next' variant='secondary'>{t('home.ctaNext')}</ButtonLink>
          </div>
        </Container>
      </section>

      <Section title={t('home.aboutTitle')}>
        <p className='max-w-3xl text-muted'>{t('home.aboutText')}</p>
        <Link to='/about' className={textLinkClass}>{t('common.learnMore')} <Arrow /></Link>
      </Section>

      <Section title={t('home.whatWeDo')} className='border-t border-border'>
        <CardGrid>
          {categories.map((c) => (
            <Card key={c.title} title={c.title}>{c.desc}</Card>
          ))}
        </CardGrid>
      </Section>

      <Section title={t('home.featured')} className='border-t border-border'>
        <EmptyState>{t('home.featuredEmpty')}</EmptyState>
      </Section>

      <Section className='border-t border-border bg-surface'>
        <p className='text-sm font-semibold uppercase tracking-widest text-accent'>{t('next.slogan')}</p>
        <h2 className='mt-3 text-2xl font-semibold sm:text-3xl'>{t('home.nextTitle')}</h2>
        <p className='mt-4 max-w-2xl text-muted'>{t('home.nextText')}</p>
        <Link to='/next' className={textLinkClass}>{t('home.ctaNext')} <Arrow /></Link>
      </Section>

      <Section title={t('home.announcements')}>
        <EmptyState>{t('home.announcementsEmpty')}</EmptyState>
      </Section>

      <Section title={t('home.impact')} className='border-t border-border'>
        <EmptyState>{t('home.impactEmpty')}</EmptyState>
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
