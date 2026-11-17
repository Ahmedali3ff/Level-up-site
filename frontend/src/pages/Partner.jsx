import Form from '../components/Form.jsx';
import { Card, Container, PageHeader, Section } from '../components/ui.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function Partner() {
  const { t } = useLanguage();

  const fields = [
    { name: 'fullName', label: t('forms.fullName'), type: 'text' },
    { name: 'organization', label: t('forms.organization'), type: 'text' },
    { name: 'email', label: t('forms.email'), type: 'email', max: 254 },
    { name: 'organizationType', label: t('forms.organizationType'), type: 'select', options: t('forms.orgTypes') },
    { name: 'partnershipInterest', label: t('forms.partnershipInterest'), type: 'select', options: t('forms.interests') },
    { name: 'message', label: t('forms.message'), type: 'textarea', max: 5000 },
  ];

  return (
    <>
      <PageHeader title={t('partner.title')} subtitle={t('partner.intro')} />

      <Section title={t('partner.whyTitle')}>
        <p className='max-w-3xl text-muted'>{t('partner.whyText')}</p>
      </Section>

      <Section title={t('partner.areasTitle')} className='border-t border-border'>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {t('partner.areas').map((area) => (
            <Card key={area} title={area} />
          ))}
        </div>
      </Section>

      <Section title={t('partner.formTitle')} className='border-t border-border'>
        <Container className='max-w-2xl px-0 sm:px-0'>
          <Form fields={fields} endpoint='/partnerships' />
        </Container>
      </Section>
    </>
  );
}
