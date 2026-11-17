import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Container } from './ui.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const links = [
  ['/', 'nav.home'],
  ['/about', 'nav.about'],
  ['/activities', 'nav.activities'],
  ['/next', 'nav.next'],
  ['/impact', 'nav.impact'],
  ['/partner', 'nav.partner'],
  ['/contact', 'nav.contact'],
];

const linkClass = ({ isActive }) =>
  `block rounded-md px-3 py-2 text-sm transition-colors ${isActive ? 'text-accent' : 'text-muted hover:text-fg'}`;

export default function Navbar() {
  const { t, lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <header className='sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur'>
      <Container className='flex h-16 items-center justify-between gap-4'>
        <Link to='/' className='text-lg font-bold tracking-tight' onClick={() => setOpen(false)}>
          {t('brand.name')}
        </Link>

        <nav aria-label='Main' className='hidden items-center gap-1 lg:flex'>
          {links.map(([to, key]) => (
            <NavLink key={to} to={to} end={to === '/'} className={linkClass}>
              {t(key)}
            </NavLink>
          ))}
        </nav>

        <div className='flex items-center gap-2'>
          <Link
            to='/search'
            aria-label={t('search.title')}
            className='rounded-md border border-border px-3 py-2 text-sm hover:border-accent'
          >
            &#128269;
          </Link>
          <button
            type='button'
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className='rounded-md border border-border px-3 py-2 text-sm hover:border-accent'
          >
            {t('nav.language')}
          </button>
          <button
            type='button'
            aria-expanded={open}
            aria-controls='mobile-menu'
            aria-label={t('nav.menu')}
            onClick={() => setOpen(!open)}
            className='rounded-md border border-border px-3 py-2 text-sm lg:hidden'
          >
            {open ? '\u2715' : '\u2630'}
          </button>
        </div>
      </Container>

      {open && (
        <nav id='mobile-menu' aria-label='Mobile' className='border-t border-border lg:hidden'>
          <Container className='flex flex-col py-2'>
            {links.map(([to, key]) => (
              <NavLink key={to} to={to} end={to === '/'} className={linkClass} onClick={() => setOpen(false)}>
                {t(key)}
              </NavLink>
            ))}
          </Container>
        </nav>
      )}
    </header>
  );
}
