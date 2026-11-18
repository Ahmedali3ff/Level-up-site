import { EmptyState } from './ui.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

// Handles loading, error and empty states for a list returned by useApi.
// children(items, data) renders the list.
export default function Async({ state, emptyText, children }) {
  const { t } = useLanguage();
  if (state.loading) return <p className='text-muted'>{t('common.loading')}</p>;
  if (state.error) return <EmptyState>{t('ui.error')}</EmptyState>;
  const items = state.data?.items ?? [];
  if (items.length === 0) return <EmptyState>{emptyText}</EmptyState>;
  return children(items, state.data);
}
