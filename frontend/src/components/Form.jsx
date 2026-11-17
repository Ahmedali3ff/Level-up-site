import { useState } from 'react';
import { api } from '../lib/api.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const inputClass =
  'w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-fg placeholder:text-muted focus:border-accent';

function isEmail(value) {
  const [local, domain, ...rest] = value.split('@');
  return (
    rest.length === 0 && Boolean(local) && Boolean(domain) && !value.includes(' ') &&
    domain.includes('.') && !domain.startsWith('.') && !domain.endsWith('.')
  );
}

// fields: [{ name, label, type: 'text' | 'email' | 'textarea' | 'select', options?, max? }]
export default function Form({ fields, endpoint }) {
  const { t } = useLanguage();
  const initial = Object.fromEntries(fields.map((f) => [f.name, '']));
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [trap, setTrap] = useState(''); // honeypot: real users never fill this

  const validate = () => {
    const result = {};
    for (const f of fields) {
      const v = values[f.name].trim();
      if (!v) result[f.name] = t('common.required');
      else if (f.type === 'email' && !isEmail(v)) result[f.name] = t('common.invalidEmail');
      else if (v.length > (f.max || 200)) result[f.name] = t('common.tooLong');
    }
    return result;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (status === 'loading') return;

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    if (trap) {
      setStatus('success');
      return;
    }

    setStatus('loading');
    try {
      const body = Object.fromEntries(fields.map((f) => [f.name, values[f.name].trim()]));
      await api(endpoint, { method: 'POST', body });
      setValues(initial);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const onChange = (name) => (event) => setValues({ ...values, [name]: event.target.value });

  return (
    <form onSubmit={onSubmit} noValidate className='space-y-5'>
      {fields.map((f) => {
        const common = {
          id: f.name,
          value: values[f.name],
          onChange: onChange(f.name),
          className: inputClass,
          'aria-invalid': Boolean(errors[f.name]),
          'aria-describedby': errors[f.name] ? `${f.name}-error` : undefined,
        };
        return (
          <div key={f.name}>
            <label htmlFor={f.name} className='mb-1.5 block text-sm font-medium'>{f.label}</label>
            {f.type === 'textarea' && <textarea rows={5} {...common} />}
            {f.type === 'select' && (
              <select {...common}>
                <option value='' disabled>{t('common.select')}</option>
                {f.options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            )}
            {f.type !== 'textarea' && f.type !== 'select' && (
              <input type={f.type === 'email' ? 'email' : 'text'} {...common} />
            )}
            {errors[f.name] && (
              <p id={`${f.name}-error`} className='mt-1 text-sm text-red-400'>{errors[f.name]}</p>
            )}
          </div>
        );
      })}

      <div aria-hidden='true' className='hidden'>
        <input tabIndex={-1} autoComplete='off' name='website' value={trap} onChange={(e) => setTrap(e.target.value)} />
      </div>

      <button
        type='submit'
        disabled={status === 'loading'}
        className='rounded-lg bg-brand px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand/90 disabled:opacity-60'
      >
        {status === 'loading' ? t('common.sending') : t('forms.send')}
      </button>

      {status === 'success' && <p role='status' className='text-sm text-green-400'>{t('forms.success')}</p>}
      {status === 'error' && <p role='alert' className='text-sm text-red-400'>{t('forms.error')}</p>}
    </form>
  );
}
