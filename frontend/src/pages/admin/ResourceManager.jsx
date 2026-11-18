import { useCallback, useEffect, useState } from 'react';
import { api } from '../../lib/api.js';

const inputClass = 'w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg focus:border-accent';
const errorText = (e) => (e.details?.length ? e.details.map((d) => `${d.field}: ${d.message}`).join(', ') : e.message);

function toForm(fields, item) {
  const values = {};
  for (const f of fields) {
    const v = item ? item[f.name] : undefined;
    if (f.type === 'checkbox') values[f.name] = Boolean(v ?? f.default ?? false);
    else if (f.type === 'date') values[f.name] = v ? String(v).slice(0, 10) : '';
    else values[f.name] = v ?? f.default ?? '';
  }
  return values;
}

function toBody(fields, values, isNew) {
  const body = {};
  for (const f of fields) {
    if (f.createOnly && !isNew) continue;
    if (f.editOnly && isNew) continue;
    const v = values[f.name];
    if (f.type === 'checkbox') body[f.name] = v;
    else if (f.type === 'number') body[f.name] = v === '' ? null : Number(v);
    else {
      const s = String(v).trim();
      body[f.name] = s === '' ? null : s;
    }
  }
  return body;
}

function Field({ field, value, onChange }) {
  const id = `f-${field.name}`;
  if (field.type === 'checkbox') {
    return (
      <label className='flex items-center gap-2 text-sm'>
        <input type='checkbox' checked={value} onChange={(e) => onChange(e.target.checked)} /> {field.label}
      </label>
    );
  }
  return (
    <div>
      <label htmlFor={id} className='mb-1 block text-sm font-medium'>{field.label}{field.required && ' *'}</label>
      {field.type === 'textarea' && <textarea id={id} rows={4} className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} />}
      {field.type === 'select' && (
        <select id={id} className={inputClass} value={value} onChange={(e) => onChange(e.target.value)}>
          <option value=''>-</option>
          {field.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      )}
      {field.type !== 'textarea' && field.type !== 'select' && (
        <input
          id={id}
          type={['number', 'date', 'password'].includes(field.type) ? field.type : 'text'}
          autoComplete={field.type === 'password' ? 'new-password' : 'off'}
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

// Generic list + create/edit/delete screen driven by a module definition (see config.js).
export default function ResourceManager({ title, listPath, writePath, fields, columns, canDelete = true }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // null | 'new' | item
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api(`${listPath}?limit=100`);
      setItems(data.items);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setLoading(false);
    }
  }, [listPath]);

  useEffect(() => {
    load();
  }, [load]);

  const visibleFields = fields.filter((f) => (editing === 'new' ? !f.editOnly : !f.createOnly));

  const openNew = () => {
    setError('');
    setValues(toForm(fields, null));
    setEditing('new');
  };

  const openEdit = (item) => {
    setError('');
    setValues(toForm(fields, item));
    setEditing(item);
  };

  const save = async (event) => {
    event.preventDefault();
    const isNew = editing === 'new';
    const missing = visibleFields.find((f) => f.required && f.type !== 'checkbox' && !String(values[f.name]).trim());
    if (missing) {
      setError(`${missing.label} is required`);
      return;
    }
    setSaving(true);
    setError('');
    try {
      const body = toBody(fields, values, isNew);
      if (isNew) await api(writePath, { method: 'POST', body });
      else await api(`${writePath}/${editing.id}`, { method: 'PUT', body });
      setEditing(null);
      await load();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    if (!window.confirm('Delete this item? This cannot be undone.')) return;
    try {
      await api(`${writePath}/${item.id}`, { method: 'DELETE' });
      await load();
    } catch (e) {
      setError(errorText(e));
    }
  };

  const cell = (item, col) => {
    if (col.render) return col.render(item);
    const v = item[col.key];
    if (typeof v === 'boolean') return v ? 'Yes' : 'No';
    return v == null ? '' : String(v);
  };

  return (
    <section>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>{title}</h2>
        {!editing && <button type='button' onClick={openNew} className='rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90'>Add new</button>}
      </div>

      {error && <p role='alert' className='mb-4 rounded-lg border border-red-400/40 p-3 text-sm text-red-400'>{error}</p>}

      {editing ? (
        <form onSubmit={save} className='space-y-4 rounded-xl border border-border bg-surface p-5'>
          <h3 className='font-semibold'>{editing === 'new' ? 'Add new' : 'Edit'}</h3>
          <div className='grid gap-4 md:grid-cols-2'>
            {visibleFields.map((f) => (
              <div key={f.name} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                <Field field={f} value={values[f.name]} onChange={(v) => setValues({ ...values, [f.name]: v })} />
              </div>
            ))}
          </div>
          <div className='flex gap-3'>
            <button type='submit' disabled={saving} className='rounded-lg bg-brand px-5 py-2 text-sm font-medium text-white hover:bg-brand/90 disabled:opacity-60'>{saving ? 'Saving...' : 'Save'}</button>
            <button type='button' onClick={() => setEditing(null)} className='rounded-lg border border-border px-5 py-2 text-sm hover:border-accent'>Cancel</button>
          </div>
        </form>
      ) : loading ? (
        <p className='text-muted'>Loading...</p>
      ) : items.length === 0 ? (
        <p className='rounded-xl border border-dashed border-border p-8 text-center text-muted'>Nothing here yet.</p>
      ) : (
        <div className='overflow-x-auto rounded-xl border border-border'>
          <table className='w-full text-start text-sm'>
            <thead className='bg-surface text-muted'>
              <tr>
                {columns.map((c) => <th key={c.key} className='px-4 py-3 text-start font-medium'>{c.label}</th>)}
                <th className='px-4 py-3' />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className='border-t border-border'>
                  {columns.map((c) => <td key={c.key} className='max-w-xs truncate px-4 py-3'>{cell(item, c)}</td>)}
                  <td className='whitespace-nowrap px-4 py-3 text-end'>
                    <button type='button' onClick={() => openEdit(item)} className='me-3 text-accent hover:underline'>Edit</button>
                    {canDelete && <button type='button' onClick={() => remove(item)} className='text-red-400 hover:underline'>Delete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
