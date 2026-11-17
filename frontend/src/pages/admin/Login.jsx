import { useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { googleLoginUrl } from '../../lib/api.js';

const inputClass = 'w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-fg focus:border-accent';
const knownErrors = ['not_authorized', 'google_cancelled', 'google_failed', 'invalid_state', 'email_not_verified', 'google_unavailable'];

export default function AdminLogin() {
  const { t } = useLanguage();
  const { user, loading, login } = useAuth();
  const [params] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const urlError = params.get('error');
  const message = error || (knownErrors.includes(urlError) ? t(`admin.errors.${urlError}`) : '');

  if (!loading && user) return <Navigate to='/admin' replace />;

  const onSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err.status === 429 ? err.message : t('admin.invalid'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className='flex min-h-screen items-center justify-center px-4'>
      <div className='w-full max-w-sm rounded-xl border border-border bg-surface p-6'>
        <h1 className='text-2xl font-semibold'>{t('admin.loginTitle')}</h1>

        {message && <p role='alert' className='mt-4 rounded-lg border border-red-400/40 p-3 text-sm text-red-400'>{message}</p>}

        <form onSubmit={onSubmit} className='mt-6 space-y-4'>
          <div>
            <label htmlFor='email' className='mb-1.5 block text-sm font-medium'>{t('admin.email')}</label>
            <input id='email' type='email' required autoComplete='username' value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor='password' className='mb-1.5 block text-sm font-medium'>{t('admin.password')}</label>
            <input id='password' type='password' required autoComplete='current-password' value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
          </div>
          <button type='submit' disabled={submitting} className='w-full rounded-lg bg-brand px-4 py-3 text-sm font-medium text-white hover:bg-brand/90 disabled:opacity-60'>
            {submitting ? t('admin.signingIn') : t('admin.signIn')}
          </button>
        </form>

        <div className='my-6 flex items-center gap-3 text-xs text-muted'>
          <span className='h-px flex-1 bg-border' />
          {t('admin.or')}
          <span className='h-px flex-1 bg-border' />
        </div>

        <a href={googleLoginUrl} className='flex w-full items-center justify-center rounded-lg border border-border px-4 py-3 text-sm font-medium hover:border-accent'>
          {t('admin.google')}
        </a>
      </div>
    </main>
  );
}
