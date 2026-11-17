import { Card, CardGrid, PageHeader, Section } from '../components/ui.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function Activities() {
  const { t } = useLanguage();
  return (
    <>
      <PageHeader title={t('activitiesPage.title')} subtitle={t('activitiesPage.intro')} />
      <Section>
        <CardGrid>
          {t('categories').map((c) => (
            <Card key={c.title} title={c.title}>{c.desc}</Card>
          ))}
        </CardGrid>
        <p className='mt-8 text-sm text-muted'>{t('activitiesPage.related')}</p>
      </Section>
    </>
  );
}
