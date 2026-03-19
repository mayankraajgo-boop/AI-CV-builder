import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { getMe } from './store/authSliceV2';
import PageLoader from './components/PageLoader';
import BackgroundAnimation from './components/BackgroundAnimation';

import Home from './pages/Home';
import Auth from './pages/AuthV2';
import Dashboard from './pages/Dashboard';
import Builder from './pages/BuilderPageV2';
import TemplatesPage from './pages/TemplatesPageV2';
import Settings from './pages/Settings';

const ATSAnalyzer = lazy(() => import('./pages/ATSAnalyzerV2'));

const ProtectedRoute = ({ children }) => {
  const { token, initializing } = useSelector((s) => s.auth);
  const location = useLocation();
  // Wait for token verification before deciding to redirect
  if (initializing) return <PageLoader visible message="Loading..." />;
  if (!token) return <Navigate to="/auth" state={{ from: location }} replace />;
  return children;
};

const AuthRoute = ({ children }) => {
  const { token } = useSelector((s) => s.auth);
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
};

// Shows branded loader between route changes
function RouteLoader() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const prevPath = useState(location.pathname)[0];

  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 600);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return <PageLoader visible={visible} message="Loading..." />;
}

function AnimatedPage({ children }) {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-enter" style={{ minHeight: '100%' }}>
      {children}
    </div>
  );
}

// Top progress bar on navigation
function NavProgressBar() {
  const location = useLocation();

  useEffect(() => {
    const bar = document.createElement('div');
    bar.className = 'nav-progress';
    document.body.appendChild(bar);
    const timer = setTimeout(() => { if (bar.parentNode) bar.parentNode.removeChild(bar); }, 900);
    return () => { clearTimeout(timer); if (bar.parentNode) bar.parentNode.removeChild(bar); };
  }, [location.pathname]);

  return null;
}

export default function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((s) => s.auth);

  useEffect(() => { if (token) dispatch(getMe()); }, []);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <BackgroundAnimation />
      <NavProgressBar />
      <RouteLoader />
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1E293B', color: '#E2E8F0', border: '1px solid #334155' },
          success: { iconTheme: { primary: '#10B981', secondary: '#1E293B' } },
          error:   { iconTheme: { primary: '#EF4444', secondary: '#1E293B' } },
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        <Suspense fallback={<PageLoader visible message="Loading..." />}>
          <Routes>
            <Route path="/"          element={<AnimatedPage><Home /></AnimatedPage>} />
            <Route path="/auth"      element={<AuthRoute><AnimatedPage><Auth /></AnimatedPage></AuthRoute>} />
            <Route path="/templates" element={<AnimatedPage><TemplatesPage /></AnimatedPage>} />
            <Route path="/pricing"   element={<Navigate to="/" replace />} />
            <Route path="/dashboard" element={<ProtectedRoute><AnimatedPage><Dashboard /></AnimatedPage></ProtectedRoute>} />
            <Route path="/dashboard/resumes" element={<ProtectedRoute><AnimatedPage><Dashboard /></AnimatedPage></ProtectedRoute>} />
            <Route path="/builder/:id" element={<ProtectedRoute><AnimatedPage><Builder /></AnimatedPage></ProtectedRoute>} />
            <Route path="/builder"   element={<ProtectedRoute><AnimatedPage><Builder /></AnimatedPage></ProtectedRoute>} />
            <Route path="/settings"  element={<ProtectedRoute><AnimatedPage><Settings /></AnimatedPage></ProtectedRoute>} />
            <Route path="/ats-analyzer" element={<ProtectedRoute><AnimatedPage><ATSAnalyzer /></AnimatedPage></ProtectedRoute>} />
            <Route path="/linkedin-import" element={<Navigate to="/dashboard" replace />} />
            <Route path="*"          element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}
