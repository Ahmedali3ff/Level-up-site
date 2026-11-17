import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import { SiteDataProvider } from '../context/SiteDataContext.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function Layout() {
  const { pathname } = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <SiteDataProvider>
      <div className='flex min-h-screen flex-col'>
        <a
          href='#main'
          className='sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded focus:bg-brand focus:px-3 focus:py-2'
        >
          {t('nav.skip')}
        </a>
        <Navbar />
        <main id='main' className='flex-1'>
          <Outlet />
        </main>
        <Footer />
      </div>
    </SiteDataProvider>
  );
}
