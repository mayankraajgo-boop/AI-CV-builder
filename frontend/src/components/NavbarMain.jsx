import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

const CVPilotLogo = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="10" fill="url(#navLogoGrad)"/>
    <path d="M11 13h10M11 18h16M11 23h12M11 28h8" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
    <circle cx="30" cy="13" r="4" fill="white" fillOpacity="0.9"/>
    <path d="M28.5 13l1 1 2-2" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="navLogoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4F46E5"/>
        <stop offset="1" stopColor="#7C3AED"/>
      </linearGradient>
    </defs>
  </svg>
);

const Navbar = () => {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav
      className="navbar navbar-expand-lg fixed-top"
      style={{
        background: scrolled ? 'rgba(15,23,42,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #334155' : 'none',
        transition: 'all 0.3s ease',
        padding: '12px 0',
      }}
    >
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <CVPilotLogo size={36} />
          <span style={{ fontWeight: 800, fontSize: '1.3rem', color: '#E2E8F0' }}>
            CV<span style={{ color: '#4F46E5' }}>Pilot</span>
          </span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
          aria-label="Toggle navigation"
        >
          <i className="fas fa-bars" style={{ color: '#E2E8F0' }}></i>
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav mx-auto gap-1">
            {[
              { label: 'Features', href: '/#features' },
              { label: 'Templates', href: '/templates' },
            ].map((item) => (
              <li className="nav-item" key={item.label}>
                <Link
                  className="nav-link"
                  to={item.href}
                  style={{ color: '#94A3B8', fontWeight: 500, padding: '8px 16px', borderRadius: 8, transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#E2E8F0'; e.currentTarget.style.background = 'rgba(79,70,229,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'transparent'; }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard" className="btn btn-outline-primary btn-sm">
                  <i className="fas fa-th-large me-2"></i>Dashboard
                </Link>
                <div className="dropdown">
                  <button
                    className="btn d-flex align-items-center gap-2"
                    style={{ background: 'rgba(79,70,229,0.15)', border: '1px solid #4F46E5', borderRadius: 8, color: '#E2E8F0', padding: '6px 14px' }}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{user.name?.split(' ')[0]}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12 }}>
                    <li>
                      <Link className="dropdown-item" to="/settings" style={{ color: '#E2E8F0' }}>
                        <i className="fas fa-cog me-2 text-muted"></i>Settings
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" style={{ borderColor: '#334155' }} /></li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout} style={{ color: '#EF4444' }}>
                        <i className="fas fa-sign-out-alt me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <Link to="/auth" className="btn btn-link" style={{ color: '#94A3B8', textDecoration: 'none', fontWeight: 500 }}>
                  Sign In
                </Link>
                <Link to="/auth?mode=register" className="btn btn-primary btn-sm">
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
