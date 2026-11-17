import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../../components/ui.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import InboxManager from './InboxManager.jsx';
import Overview from './Overview.jsx';
import ResourceManager from './ResourceManager.jsx';
import { modules } from './config.js';

// roles: 'all' = every admin, 'staff' = admin and super_admin, 'super' = super_admin only.
// The API enforces the same rules; this only hides tabs a user cannot use.
const tabs = [
  { id: 'overview', label: 'Overview', access: 'all', render: () => <Overview /> },
  { id: 'programs', label: 'Programs', access: 'all', render: () => <ResourceManager {...modules.programs} /> },
  { id: 'activities', label: 'Activities', access: 'all', render: () => <ResourceManager {...modules.activities} /> },
  { id: 'announcements', label: 'Announcements', access: 'all', render: () => <ResourceManager {...modules.announcements} /> },
  { id: 'opportunities', label: 'Opportunities', access: 'all', render: () => <ResourceManager {...modules.opportunities} /> },
  { id: 'statistics', label: 'Statistics', access: 'all', render: () => <ResourceManager {...modules.statistics} /> },
  { id: 'social', label: 'Social Links', access: 'all', render: () => <ResourceManager {...modules.social} /> },
  { id: 'content', label: 'Website Content', access: 'all', render: () => <ResourceManager {...modules.content} /> },
  { id: 'messages', label: 'Messages', access: 'staff', render: () => <InboxManager kind='messages' /> },
  { id: 'partnerships', label: 'Partnerships', access: 'staff', render: () => <InboxManager kind='partnerships' /> },
  { id: 'users', label: 'Admin Users', access: 'super', render: () => <ResourceManager {...modules.users} /> },
];

const allowed = (tab, role) =>
  role === 'super_admin' || tab.access === 'all' || (tab.access === 'staff' && role === 'admin');

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState('overview');

  const visible = tabs.filter((tab) => allowed(tab, user.role));
  const current = visible.find((tab) => tab.id === active) || visible[0];

  const onLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <main>
      <header className='border-b border-border bg-surface'>
        <Container className='flex h-16 items-center justify-between gap-3'>
          <h1 className='text-lg font-semibold'>Admin Dashboard</h1>
          <div className='flex items-center gap-3 text-sm'>
            <span className='hidden text-muted sm:inline'>{user.fullName} ({user.role.split('_').join(' ')})</span>
            <a href='/' className='rounded-md border border-border px-3 py-2 hover:border-accent'>View site</a>
            <button type='button' onClick={onLogout} className='rounded-md border border-border px-3 py-2 hover:border-accent'>Log out</button>
          </div>
        </Container>
      </header>

      <Container className='py-8'>
        <nav aria-label='Dashboard sections' className='mb-8 flex gap-2 overflow-x-auto pb-2'>
          {visible.map((tab) => (
            <button
              key={tab.id}
              type='button'
              onClick={() => setActive(tab.id)}
              aria-current={tab.id === current.id ? 'page' : undefined}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm transition-colors ${tab.id === current.id ? 'bg-brand text-white' : 'border border-border text-muted hover:text-fg'}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div key={current.id}>{current.render()}</div>
      </Container>
    </main>
  );
}
