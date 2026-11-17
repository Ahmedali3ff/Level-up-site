import { Card, PageHeader, Section } from '../components/ui.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function Next() {
  const { t } = useLanguage();
  return (
    <>
      <PageHeader title={t('next.title')} subtitle={t('next.intro')}>
        <p className='mt-6 text-sm font-semibold uppercase tracking-widest text-accent'>{t('next.slogan')}</p>
      </PageHeader>
      <Section>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {t('next.sections').map((title) => (
            <Card key={title} title={title}>{t('common.placeholder')}</Card>
          ))}
        </div>
      </Section>
    </>
  );
}
