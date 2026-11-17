import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

// UI-level guard only. The backend enforces real authorization on every admin request.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const { t } = useLanguage();

  if (loading) return <p className='p-8 text-muted'>{t('common.loading')}</p>;
  if (!user) return <Navigate to='/admin/login' replace />;
  return children;
}
