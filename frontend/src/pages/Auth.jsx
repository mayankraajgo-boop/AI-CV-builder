import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, clearError } from '../store/authSlice';
import toast from 'react-hot-toast';

const Auth = () => {
  const [params] = useSearchParams();
  const [isLogin, setIsLogin] = useState(params.get('mode') !== 'register');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((s) => s.auth);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    const action = isLogin
      ? login({ email: form.email, password: form.password })
      : register(form);
    const result = await dispatch(action);
    if (!result.error) {
      toast.success(isLogin ? 'Welcome back!' : 'Account created!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-root">
      {/* Animated mesh background */}
      <div className="auth-bg-orb auth-orb-1" />
      <div className="auth-bg-orb auth-orb-2" />
      <div className="auth-bg-orb auth-orb-3" />
      <div className="auth-grid-overlay" />

      <div className="auth-card-wrapper">
        {/* Logo */}
        <div className="text-center mb-4 auth-logo-block">
          <Link to="/" className="d-inline-flex align-items-center gap-2 text-decoration-none mb-3">
            <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(79,70,229,0.45)' }}>
              <svg width="26" height="26" viewBox="0 0 40 40" fill="none">
                <path d="M11 13h10M11 18h16M11 23h12M11 28h8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="30" cy="13" r="4" fill="white" fillOpacity="0.9"/>
                <path d="M28.5 13l1 1 2-2" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.6rem', color: '#E2E8F0' }}>CV<span style={{ color: '#818CF8' }}>Pilot</span></span>
          </Link>
          <h2 className="auth-title">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: 0 }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setIsLogin(!isLogin); setForm({ name: '', email: '', password: '' }); }}
              style={{ background: 'none', border: 'none', color: '#818CF8', cursor: 'pointer', fontWeight: 600, padding: 0, transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#A5B4FC'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#818CF8'}
            >
              {isLogin ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
        </div>

        <div className="auth-card">
          <form onSubmit={handleSubmit} noValidate>
            {!isLogin && (
              <div className="mb-3 auth-field">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-user auth-field-icon"></i>
                  <input type="text" className="form-control auth-input" style={{ paddingLeft: 42 }}
                    placeholder="John Doe" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} required autoComplete="name" />
                </div>
              </div>
            )}

            <div className="mb-3 auth-field">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <i className="fas fa-envelope auth-field-icon"></i>
                <input type="email" className="form-control auth-input" style={{ paddingLeft: 42 }}
                  placeholder="you@example.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} required autoComplete="email" />
              </div>
            </div>

            <div className="mb-4 auth-field">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <i className="fas fa-lock auth-field-icon"></i>
                <input type={showPass ? 'text' : 'password'} className="form-control auth-input"
                  style={{ paddingLeft: 42, paddingRight: 44 }}
                  placeholder={isLogin ? 'Your password' : 'Min. 6 characters'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })} required
                  autoComplete={isLogin ? 'current-password' : 'new-password'} />
                <button type="button" onClick={() => setShowPass((p) => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: 4, transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#818CF8'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}>
                  <i className={'fas fa-eye' + (showPass ? '-slash' : '')}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 auth-submit" disabled={loading}>
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2"></span>Please wait...</>
                : <><i className={'fas fa-' + (isLogin ? 'sign-in-alt' : 'user-plus') + ' me-2'}></i>{isLogin ? 'Sign In' : 'Create Account'}</>}
            </button>
          </form>

          {!isLogin && (
            <p style={{ color: '#475569', fontSize: '0.75rem', textAlign: 'center', marginTop: 16, marginBottom: 0 }}>
              By creating an account, you agree to our Terms of Service.
            </p>
          )}
        </div>

        <p style={{ color: '#475569', fontSize: '0.78rem', textAlign: 'center', marginTop: 20 }}>
          <i className="fas fa-check-circle me-1" style={{ color: '#10B981' }}></i>100% Free — No credit card required
        </p>
      </div>

      <style>{`
        .auth-root {
          min-height: 100vh;
          background: #080E1A;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        /* Animated background orbs */
        .auth-bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          animation: orbFloat 8s ease-in-out infinite;
        }
        .auth-orb-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(79,70,229,0.18), transparent 70%);
          top: -100px; left: -100px;
          animation-delay: 0s;
        }
        .auth-orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%);
          bottom: -80px; right: -80px;
          animation-delay: -3s;
        }
        .auth-orb-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(16,185,129,0.08), transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: -5s;
        }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          33%       { transform: translateY(-20px) scale(1.05); }
          66%       { transform: translateY(10px) scale(0.97); }
        }
        .auth-orb-3 {
          animation-name: orbFloat3;
        }
        @keyframes orbFloat3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50%       { transform: translate(-50%, -55%) scale(1.1); }
        }

        /* Subtle grid overlay */
        .auth-grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(79,70,229,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(79,70,229,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        /* Card wrapper animation */
        .auth-card-wrapper {
          width: 100%;
          max-width: 440px;
          position: relative;
          z-index: 1;
          animation: authSlideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes authSlideUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Logo block */
        .auth-logo-block {
          animation: authSlideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.05s both;
        }

        /* Title */
        .auth-title {
          color: #E2E8F0;
          font-weight: 700;
          font-size: 1.5rem;
          margin-bottom: 6px;
          background: linear-gradient(135deg, #E2E8F0, #A5B4FC);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Card */
        .auth-card {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(79,70,229,0.2);
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(79,70,229,0.1);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          animation: authSlideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
        }

        /* Field stagger */
        .auth-field {
          animation: authSlideUp 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .auth-field:nth-child(1) { animation-delay: 0.15s; }
        .auth-field:nth-child(2) { animation-delay: 0.2s; }
        .auth-field:nth-child(3) { animation-delay: 0.25s; }

        /* Input icon */
        .auth-field-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #475569;
          pointer-events: none;
          transition: color 0.2s;
          font-size: 0.85rem;
        }
        .auth-input:focus ~ .auth-field-icon,
        .auth-input:focus + .auth-field-icon { color: #818CF8; }

        /* Submit button */
        .auth-submit {
          padding: 13px;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.3px;
          animation: authSlideUp 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;
          position: relative;
          overflow: hidden;
        }
        .auth-submit::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .auth-submit:hover::after { opacity: 1; }
      `}</style>
    </div>
  );
};

export default Auth;
