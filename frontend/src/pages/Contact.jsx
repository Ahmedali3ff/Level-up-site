import Form from '../components/Form.jsx';
import { PageHeader, Section } from '../components/ui.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function Contact() {
  const { t } = useLanguage();

  const fields = [
    { name: 'fullName', label: t('forms.fullName'), type: 'text' },
    { name: 'email', label: t('forms.email'), type: 'email', max: 254 },
    { name: 'subject', label: t('forms.subject'), type: 'text', max: 300 },
    { name: 'message', label: t('forms.message'), type: 'textarea', max: 5000 },
  ];

  return (
    <>
      <PageHeader title={t('contact.title')} subtitle={t('contact.intro')} />
      <Section>
        <div className='grid gap-12 lg:grid-cols-3'>
          <div className='lg:col-span-2'>
            <h2 className='mb-6 text-xl font-semibold'>{t('contact.formTitle')}</h2>
            <Form fields={fields} endpoint='/contact' />
          </div>
          <aside>
            <h2 className='mb-4 text-xl font-semibold'>{t('contact.socialTitle')}</h2>
            <p className='text-sm text-muted'>{t('contact.socialEmpty')}</p>
          </aside>
        </div>
      </Section>
    </>
  );
}
