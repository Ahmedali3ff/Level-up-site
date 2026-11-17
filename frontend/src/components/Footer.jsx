import { Link } from 'react-router-dom';
import { Container } from './ui.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { useSiteData } from '../context/SiteDataContext.jsx';

const quickLinks = [
  ['/about', 'nav.about'],
  ['/activities', 'nav.activities'],
  ['/next', 'nav.next'],
  ['/impact', 'nav.impact'],
  ['/partner', 'nav.partner'],
  ['/contact', 'nav.contact'],
];

export default function Footer() {
  const { t } = useLanguage();
  const { social } = useSiteData();
  const linkClass = 'text-sm text-muted hover:text-fg';

  return (
    <footer className='border-t border-border bg-surface'>
      <Container className='grid gap-8 py-12 sm:grid-cols-3'>
        <div>
          <p className='text-lg font-bold'>{t('brand.name')}</p>
          <p className='mt-2 text-sm text-muted'>{t('brand.tagline')}</p>
          {social.length > 0 && (
            <ul className='mt-4 flex flex-wrap gap-x-4 gap-y-2'>
              {social.map((s) => (
                <li key={s.id}>
                  <a href={s.url} target='_blank' rel='noopener noreferrer' className={linkClass}>{s.platform}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <p className='mb-3 text-sm font-semibold'>{t('footer.quick')}</p>
          <ul className='space-y-2'>
            {quickLinks.map(([to, key]) => (
              <li key={to}>
                <Link to={to} className={linkClass}>{t(key)}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className='mb-3 text-sm font-semibold'>{t('footer.legal')}</p>
          <ul className='space-y-2'>
            <li><Link to='/privacy' className={linkClass}>{t('legal.privacy')}</Link></li>
            <li><Link to='/terms' className={linkClass}>{t('legal.terms')}</Link></li>
          </ul>
        </div>
      </Container>
      <div className='border-t border-border py-4 text-center text-xs text-muted'>
        &copy; {new Date().getFullYear()} {t('brand.name')}. {t('footer.rights')}
      </div>
    </footer>
  );
}
