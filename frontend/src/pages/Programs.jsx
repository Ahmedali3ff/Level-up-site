import { useSearchParams } from 'react-router-dom';
import Async from '../components/Async.jsx';
import ProgramCard from '../components/ProgramCard.jsx';
import { Container, PageHeader, Section } from '../components/ui.jsx';
import { useApi } from '../hooks/useApi.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { activityTypes, categoryKeys, programStatuses } from '../lib/constants.js';
import { formatDate, localized } from '../lib/format.js';

const selectClass = 'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-fg focus:border-accent';
const PAGE_SIZE = 9;

function FilterSelect({ label, value, onChange, options }) {
  const { t } = useLanguage();
  return (
    <label className='block text-sm'>
      <span className='mb-1 block text-muted'>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={selectClass}>
        <option value=''>{t('programsPage.all')}</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

export default function Programs() {
  const { t, lang } = useLanguage();
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || '';
  const status = params.get('status') || '';
  const type = params.get('activity_type') || '';
  const page = Math.max(Number(params.get('page')) || 1, 1);

  const qs = new URLSearchParams({ limit: String(PAGE_SIZE), page: String(page) });
  if (category) qs.set('category', category);
  if (status) qs.set('status', status);
  if (type) qs.set('activity_type', type);

  const programs = useApi(`/programs?${qs.toString()}`);
  const opportunities = useApi('/opportunities?limit=20');
  const categories = t('categories');

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    setParams(next);
  };

  return (
    <>
      <PageHeader title={t('programsPage.title')} subtitle={t('programsPage.intro')} />

      <Section>
        <div className='mb-8 grid gap-4 sm:grid-cols-3'>
          <FilterSelect
            label={t('programsPage.category')}
            value={category}
            onChange={(v) => setParam('category', v)}
            options={categoryKeys.map((k, i) => ({ value: k, label: categories[i].title }))}
          />
          <FilterSelect
            label={t('programsPage.status')}
            value={status}
            onChange={(v) => setParam('status', v)}
            options={programStatuses.map((s) => ({ value: s, label: t(`status.${s}`) }))}
          />
          <FilterSelect
            label={t('programsPage.activityType')}
            value={type}
            onChange={(v) => setParam('activity_type', v)}
            options={activityTypes.map((a) => ({ value: a, label: t(`activityTypes.${a}`) }))}
          />
        </div>

        <Async state={programs} emptyText={t('programsPage.empty')}>
          {(items, data) => {
            const pages = Math.ceil(data.total / PAGE_SIZE);
            return (
              <>
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                  {items.map((p) => <ProgramCard key={p.id} program={p} />)}
                </div>
                {pages > 1 && (
                  <div className='mt-8 flex items-center justify-center gap-4 text-sm'>
                    <button type='button' disabled={page <= 1} onClick={() => setParam('page', String(page - 1))} className='rounded-md border border-border px-4 py-2 disabled:opacity-40'>
                      {t('programsPage.previous')}
                    </button>
                    <span className='text-muted'>{page} / {pages}</span>
                    <button type='button' disabled={page >= pages} onClick={() => setParam('page', String(page + 1))} className='rounded-md border border-border px-4 py-2 disabled:opacity-40'>
                      {t('programsPage.next')}
                    </button>
                  </div>
                )}
              </>
            );
          }}
        </Async>
      </Section>

      <Section title={t('programsPage.opportunities')} className='border-t border-border'>
        <Async state={opportunities} emptyText={t('programsPage.opportunitiesEmpty')}>
          {(items) => (
            <div className='grid gap-4 sm:grid-cols-2'>
              {items.map((o) => (
                <article key={o.id} className='rounded-xl border border-border bg-surface p-5'>
                  <h3 className='font-semibold'>{localized(o, 'title', lang)}</h3>
                  <p className='mt-2 whitespace-pre-line text-sm text-muted'>{localized(o, 'description', lang)}</p>
                  <div className='mt-4 flex flex-wrap items-center justify-between gap-2 text-sm'>
                    {o.deadline && <span className='text-muted'>{t('programsPage.deadline')}: {formatDate(o.deadline, lang)}</span>}
                    {o.external_url && (
                      <a href={o.external_url} target='_blank' rel='noopener noreferrer' className='text-accent hover:underline'>{t('programsPage.openLink')}</a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </Async>
      </Section>
    </>
  );
}
