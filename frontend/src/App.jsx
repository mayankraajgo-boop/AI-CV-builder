import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { getMe } from './store/authSlice';

import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Builder from './pages/BuilderPageV2';
import Templates from './pages/Templates';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((s) => s.auth);
  return token ? children : <Navigate to="/auth" replace />;
};

export default function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((s) => s.auth);

  useEffect(() => { if (token) dispatch(getMe()); }, []);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1E293B', color: '#E2E8F0', border: '1px solid #334155' },
          success: { iconTheme: { primary: '#10B981', secondary: '#1E293B' } },
          error:   { iconTheme: { primary: '#EF4444', secondary: '#1E293B' } },
        }}
      />
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/auth"       element={<Auth />} />
        <Route path="/templates"  element={<Templates />} />
        <Route path="/pricing"    element={<Navigate to="/" replace />} />
        <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/resumes" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/builder/:id" element={<ProtectedRoute><Builder /></ProtectedRoute>} />
        <Route path="/builder"    element={<ProtectedRoute><Builder /></ProtectedRoute>} />
        <Route path="/settings"   element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="*"           element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
