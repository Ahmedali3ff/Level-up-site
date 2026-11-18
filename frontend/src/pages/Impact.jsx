import StatGrid from '../components/StatGrid.jsx';
import { Card, PageHeader, Section } from '../components/ui.jsx';
import { useSiteData } from '../context/SiteDataContext.jsx';
import { useApi } from '../hooks/useApi.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

// Same order as impact.sections[1..5] in the translation files.
const keys = ['programs', 'community', 'events', 'partnerships', 'achievements'];

// Only manually entered (verified) statistics are shown here.
export default function Impact() {
  const { t } = useLanguage();
  const { text } = useSiteData();
  const stats = useApi('/statistics');
  const sections = t('impact.sections');

  return (
    <>
      <PageHeader title={t('impact.title')} subtitle={text('impact.intro', t('impact.intro'))} />

      <Section title={sections[0]}>
        {stats.loading ? <p className='text-muted'>{t('common.loading')}</p> : <StatGrid items={stats.data?.items} empty={t('home.impactEmpty')} />}
      </Section>

      <Section className='border-t border-border'>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {keys.map((key, i) => (
            <Card key={key} title={sections[i + 1]}>{text(`impact.${key}`, t('home.impactEmpty'))}</Card>
          ))}
        </div>
      </Section>
    </>
  );
}
