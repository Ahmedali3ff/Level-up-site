import { useApi } from '../../hooks/useApi.js';

const cards = [
  ['total_programs', 'Total Programs'],
  ['active_programs', 'Active Programs'],
  ['total_activities', 'Total Activities'],
  ['total_announcements', 'Total Announcements'],
  ['new_messages', 'New Contact Messages'],
  ['pending_partnerships', 'Pending Partnership Requests'],
];

export default function Overview() {
  const { data, loading, error } = useApi('/admin/dashboard');
  if (loading) return <p className='text-muted'>Loading...</p>;
  if (error) return <p role='alert' className='text-red-400'>{error.message}</p>;
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {cards.map(([key, label]) => (
        <div key={key} className='rounded-xl border border-border bg-surface p-5'>
          <p className='text-3xl font-bold text-accent'>{data[key]}</p>
          <p className='mt-1 text-sm text-muted'>{label}</p>
        </div>
      ))}
    </div>
  );
}
