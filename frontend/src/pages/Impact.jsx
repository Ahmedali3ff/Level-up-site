import { Card, PageHeader, Section } from '../components/ui.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

// Only manually verified statistics (managed from the dashboard) may be shown here.
export default function Impact() {
  const { t } = useLanguage();
  return (
    <>
      <PageHeader title={t('impact.title')} subtitle={t('impact.intro')} />
      <Section>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {t('impact.sections').map((title) => (
            <Card key={title} title={title}>{t('home.impactEmpty')}</Card>
          ))}
        </div>
      </Section>
    </>
  );
}
