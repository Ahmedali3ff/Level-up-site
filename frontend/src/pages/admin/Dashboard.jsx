import { useNavigate } from 'react-router-dom';
import { Card, Container } from '../../components/ui.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

export default function AdminDashboard() {
  const { t, lang, setLang } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <main>
      <header className='border-b border-border bg-surface'>
        <Container className='flex h-16 items-center justify-between gap-3'>
          <h1 className='text-lg font-semibold'>{t('admin.dashboardTitle')}</h1>
          <div className='flex items-center gap-2'>
            <button type='button' onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className='rounded-md border border-border px-3 py-2 text-sm hover:border-accent'>
              {t('nav.language')}
            </button>
            <button type='button' onClick={onLogout} className='rounded-md border border-border px-3 py-2 text-sm hover:border-accent'>
              {t('admin.logout')}
            </button>
          </div>
        </Container>
      </header>

      <Container className='py-10'>
        <p className='text-muted'>{t('admin.welcome')}, {user.fullName} ({user.role})</p>
        <div className='mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {t('admin.modules').map((name) => (
            <Card key={name} title={name}>{t('admin.soon')}</Card>
          ))}
        </div>
      </Container>
    </main>
  );
}
