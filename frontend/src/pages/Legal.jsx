import { PageHeader, Section } from '../components/ui.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

function LegalPage({ titleKey }) {
  const { t } = useLanguage();
  return (
    <>
      <PageHeader title={t(titleKey)} />
      <Section>
        <p className='text-muted'>{t('legal.placeholder')}</p>
      </Section>
    </>
  );
}

export const Privacy = () => <LegalPage titleKey='legal.privacy' />;
export const Terms = () => <LegalPage titleKey='legal.terms' />;
