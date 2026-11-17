import { useCallback, useEffect, useState } from 'react';
import { api } from '../../lib/api.js';
import { formatDate } from '../../lib/format.js';

const inputClass = 'w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg focus:border-accent';
const partnershipStatuses = ['new', 'in_review', 'accepted', 'declined', 'archived'];

function Line({ label, children }) {
  return (
    <p className='text-sm'>
      <span className='text-muted'>{label}: </span>
      {children}
    </p>
  );
}

function MessageRow({ item, onPatch, onDelete }) {
  return (
    <details
      className='rounded-xl border border-border bg-surface p-4'
      onToggle={(e) => {
        if (e.currentTarget.open && !item.is_read) onPatch(item, { is_read: true });
      }}
    >
      <summary className='cursor-pointer'>
        <span className={item.is_read ? 'text-muted' : 'font-semibold'}>{item.subject}</span>
        <span className='ms-3 text-sm text-muted'>{item.full_name} - {formatDate(item.submitted_at, 'en')}</span>
        {!item.is_read && <span className='ms-3 rounded-full bg-brand px-2 py-0.5 text-xs text-white'>New</span>}
      </summary>
      <div className='mt-4 space-y-2'>
        <Line label='Email'>{item.email}</Line>
        <p className='whitespace-pre-line rounded-lg bg-bg p-3 text-sm'>{item.message}</p>
        <div className='flex gap-4 pt-2 text-sm'>
          <button type='button' onClick={() => onPatch(item, { is_read: !item.is_read })} className='text-accent hover:underline'>
            Mark as {item.is_read ? 'unread' : 'read'}
          </button>
          <button type='button' onClick={() => onDelete(item)} className='text-red-400 hover:underline'>Delete</button>
        </div>
      </div>
    </details>
  );
}

function PartnershipRow({ item, onPatch, onDelete }) {
  const [status, setStatus] = useState(item.status);
  const [notes, setNotes] = useState(item.internal_notes || '');

  return (
    <details className='rounded-xl border border-border bg-surface p-4'>
      <summary className='cursor-pointer'>
        <span className='font-semibold'>{item.organization}</span>
        <span className='ms-3 text-sm text-muted'>{item.full_name} - {formatDate(item.submitted_at, 'en')}</span>
        <span className='ms-3 rounded-full border border-border px-2 py-0.5 text-xs'>{item.status.split('_').join(' ')}</span>
      </summary>
      <div className='mt-4 space-y-2'>
        <Line label='Email'>{item.email}</Line>
        <Line label='Organization type'>{item.organization_type}</Line>
        <Line label='Interest'>{item.partnership_interest}</Line>
        <p className='whitespace-pre-line rounded-lg bg-bg p-3 text-sm'>{item.message}</p>
        <div className='grid gap-3 pt-2 md:grid-cols-2'>
          <label className='block text-sm'>
            <span className='mb-1 block font-medium'>Status</span>
            <select className={inputClass} value={status} onChange={(e) => setStatus(e.target.value)}>
              {partnershipStatuses.map((s) => <option key={s} value={s}>{s.split('_').join(' ')}</option>)}
            </select>
          </label>
          <label className='block text-sm md:col-span-2'>
            <span className='mb-1 block font-medium'>Internal notes</span>
            <textarea rows={3} className={inputClass} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
        </div>
        <div className='flex gap-4 pt-2 text-sm'>
          <button type='button' onClick={() => onPatch(item, { status, internal_notes: notes.trim() || null })} className='rounded-lg bg-brand px-4 py-2 font-medium text-white hover:bg-brand/90'>Save</button>
          <button type='button' onClick={() => onDelete(item)} className='text-red-400 hover:underline'>Delete</button>
        </div>
      </div>
    </details>
  );
}

// kind: 'messages' | 'partnerships'
export default function InboxManager({ kind }) {
  const isMessages = kind === 'messages';
  const path = `/admin/${kind}`;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setItems((await api(`${path}?limit=100`)).items);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    load();
  }, [load]);

  const patch = async (item, body) => {
    try {
      const updated = await api(`${path}/${item.id}`, { method: 'PUT', body });
      setItems((list) => list.map((x) => (x.id === item.id ? updated : x)));
    } catch (e) {
      setError(e.message);
    }
  };

  const remove = async (item) => {
    if (!window.confirm('Delete permanently?')) return;
    try {
      await api(`${path}/${item.id}`, { method: 'DELETE' });
      setItems((list) => list.filter((x) => x.id !== item.id));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <section>
      <h2 className='mb-4 text-xl font-semibold'>{isMessages ? 'Contact Messages' : 'Partnership Inquiries'}</h2>
      {error && <p role='alert' className='mb-4 rounded-lg border border-red-400/40 p-3 text-sm text-red-400'>{error}</p>}
      {loading ? (
        <p className='text-muted'>Loading...</p>
      ) : items.length === 0 ? (
        <p className='rounded-xl border border-dashed border-border p-8 text-center text-muted'>Nothing here yet.</p>
      ) : (
        <div className='space-y-3'>
          {items.map((item) =>
            isMessages ? (
              <MessageRow key={item.id} item={item} onPatch={patch} onDelete={remove} />
            ) : (
              <PartnershipRow key={item.id} item={item} onPatch={patch} onDelete={remove} />
            )
          )}
        </div>
      )}
    </section>
  );
}
