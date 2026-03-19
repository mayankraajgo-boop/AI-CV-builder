import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, clearError } from '../store/authSlice';
import toast from 'react-hot-toast';

/**
 * Popup login/register modal.
 * Usage: <LoginModal show={show} onClose={() => setShow(false)} onSuccess={cb} />
 */
export default function LoginModal({ show, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error, dispatch]);

  // Reset form when modal opens
  useEffect(() => {
    if (show) { setForm({ name: '', email: '', password: '' }); setIsLogin(true); }
  }, [show]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (show) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [show, onClose]);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && form.password.length < 6) {
      toast.error('Password must be at least 6 characters'); return;
    }
    const action = isLogin
      ? login({ email: form.email, password: form.password })
      : register(form);
    const result = await dispatch(action);
    if (!result.error) {
      toast.success(isLogin ? 'Welcome back!' : 'Account created!');
      onClose();
      if (onSuccess) onSuccess();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 1050,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(6px)',
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1051, width: '100%', maxWidth: 420, padding: '0 16px',
        animation: 'authSlideUp 0.3s cubic-bezier(0.22,1,0.36,1)',
      }}>
        <div style={{
          background: '#1E293B',
          border: '1px solid rgba(79,70,229,0.25)',
          borderRadius: 16,
          padding: 28,
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        }}>
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 style={{ color: '#E2E8F0', fontWeight: 700, marginBottom: 2 }}>
                {isLogin ? 'Sign in to CVPilot' : 'Create your account'}
              </h5>
              <p style={{ color: '#64748B', fontSize: '0.82rem', marginBottom: 0 }}>
                {isLogin ? "Don't have an account? " : 'Already have one? '}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  style={{ background: 'none', border: 'none', color: '#818CF8', cursor: 'pointer', fontWeight: 600, padding: 0, fontSize: '0.82rem' }}
                >
                  {isLogin ? 'Sign up free' : 'Sign in'}
                </button>
              </p>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'rgba(51,65,85,0.5)', border: 'none', color: '#94A3B8', cursor: 'pointer', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#EF4444'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(51,65,85,0.5)'; e.currentTarget.style.color = '#94A3B8'; }}
            >
              <i className="fas fa-times" style={{ fontSize: 13 }} />
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {!isLogin && (
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-user" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#475569', fontSize: 13 }} />
                  <input type="text" className="form-control" style={{ paddingLeft: 38 }}
                    placeholder="John Doe" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Email</label>
              <div style={{ position: 'relative' }}>
                <i className="fas fa-envelope" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#475569', fontSize: 13 }} />
                <input type="email" className="form-control" style={{ paddingLeft: 38 }}
                  placeholder="you@example.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <i className="fas fa-lock" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#475569', fontSize: 13 }} />
                <input type={showPass ? 'text' : 'password'} className="form-control"
                  style={{ paddingLeft: 38, paddingRight: 42 }}
                  placeholder={isLogin ? 'Your password' : 'Min. 6 characters'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: 4, zIndex: 2, lineHeight: 1 }}>
                  <i className={`fas fa-eye${showPass ? '-slash' : ''}`} style={{ fontSize: 14 }} />
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}
              style={{ padding: '12px', fontWeight: 600 }}>
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2" />Please wait...</>
                : <><i className={`fas fa-${isLogin ? 'sign-in-alt' : 'user-plus'} me-2`} />{isLogin ? 'Sign In' : 'Create Account'}</>}
            </button>
          </form>

          <p style={{ color: '#475569', fontSize: '0.72rem', textAlign: 'center', marginTop: 14, marginBottom: 0 }}>
            <i className="fas fa-check-circle me-1" style={{ color: '#10B981' }} />100% Free — No credit card required
          </p>
        </div>
      </div>
    </>
  );
}
