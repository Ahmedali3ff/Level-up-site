import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Async from '../components/Async.jsx';
import { Container, PageHeader, Section } from '../components/ui.jsx';
import { useApi } from '../hooks/useApi.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { localized } from '../lib/format.js';

// Where each result type lives on the site.
const targets = { program: (r) => `/programs/${r.slug}`, activity: () => '/activities', announcement: () => '/', opportunity: () => '/programs' };

export default function Search() {
  const { t, lang } = useLanguage();
  const [params, setParams] = useSearchParams();
  const q = (params.get('q') || '').trim();
  const [input, setInput] = useState(q);
  const state = useApi(q.length >= 2 ? `/search?q=${encodeURIComponent(q)}` : null);

  const onSubmit = (event) => {
    event.preventDefault();
    setParams(input.trim() ? { q: input.trim() } : {});
  };

  return (
    <>
      <PageHeader title={t('search.title')} />
      <Section>
        <form onSubmit={onSubmit} role='search' className='mb-8 flex flex-col gap-3 sm:flex-row'>
          <input
            type='search'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('search.placeholder')}
            aria-label={t('search.title')}
            maxLength={100}
            className='w-full flex-1 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-fg placeholder:text-muted focus:border-accent'
          />
          <button type='submit' className='rounded-lg bg-brand px-6 py-3 text-sm font-medium text-white hover:bg-brand/90'>{t('search.button')}</button>
        </form>

        {q && q.length < 2 && <p className='text-muted'>{t('search.minChars')}</p>}
        {q.length >= 2 && (
          <Async state={state} emptyText={t('search.none')}>
            {(items) => (
              <ul className='space-y-3'>
                {items.map((r) => (
                  <li key={`${r.type}-${r.id}`}>
                    <Link to={targets[r.type](r)} className='block rounded-xl border border-border bg-surface p-5 hover:border-brand/60'>
                      <span className='text-xs uppercase tracking-wide text-accent'>{t(`search.types.${r.type}`)}</span>
                      <span className='mt-1 block font-medium'>{localized(r, 'title', lang)}</span>
                      {r.description && <span className='mt-1 block text-sm text-muted'>{r.description}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Async>
        )}
      </Section>
    </>
  );
}
