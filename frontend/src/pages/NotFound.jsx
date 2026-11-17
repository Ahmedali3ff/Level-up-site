import { Container, ButtonLink } from '../components/ui.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <Container className='py-24 text-center'>
      <p className='text-6xl font-bold text-accent'>404</p>
      <h1 className='mt-4 text-3xl font-semibold'>{t('notFound.title')}</h1>
      <p className='mt-3 text-muted'>{t('notFound.text')}</p>
      <div className='mt-8'>
        <ButtonLink to='/'>{t('notFound.back')}</ButtonLink>
      </div>
    </Container>
  );
}
