import { Card, PageHeader, Section } from '../components/ui.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function About() {
  const { t } = useLanguage();
  return (
    <>
      <PageHeader title={t('about.title')} subtitle={t('about.intro')} />
      <Section>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {t('about.sections').map((title) => (
            <Card key={title} title={title}>{t('common.placeholder')}</Card>
          ))}
        </div>
      </Section>
    </>
  );
}
