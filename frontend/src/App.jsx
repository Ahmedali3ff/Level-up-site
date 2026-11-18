import { lazy, Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { useLanguage } from './i18n/LanguageContext.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Activities from './pages/Activities.jsx';
import Next from './pages/Next.jsx';
import Impact from './pages/Impact.jsx';
import Partner from './pages/Partner.jsx';
import Contact from './pages/Contact.jsx';
import Programs from './pages/Programs.jsx';
import ProgramDetail from './pages/ProgramDetail.jsx';
import Search from './pages/Search.jsx';
import { Privacy, Terms } from './pages/Legal.jsx';
import NotFound from './pages/NotFound.jsx';

const AdminLogin = lazy(() => import('./pages/admin/Login.jsx'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard.jsx'));

// Auth is only loaded on admin routes, so public visitors never trigger /api/auth/me.
function AdminShell() {
  const { t } = useLanguage();
  return (
    <AuthProvider>
      <Suspense fallback={<p className='p-8 text-muted'>{t('common.loading')}</p>}>
        <Outlet />
      </Suspense>
    </AuthProvider>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='about' element={<About />} />
        <Route path='activities' element={<Activities />} />
        <Route path='programs' element={<Programs />} />
        <Route path='programs/:slug' element={<ProgramDetail />} />
        <Route path='next' element={<Next />} />
        <Route path='impact' element={<Impact />} />
        <Route path='partner' element={<Partner />} />
        <Route path='contact' element={<Contact />} />
        <Route path='search' element={<Search />} />
        <Route path='privacy' element={<Privacy />} />
        <Route path='terms' element={<Terms />} />
        <Route path='*' element={<NotFound />} />
      </Route>

      <Route element={<AdminShell />}>
        <Route path='admin/login' element={<AdminLogin />} />
        <Route
          path='admin'
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
