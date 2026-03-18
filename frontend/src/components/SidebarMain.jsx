import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

const navItems = [
  { path: '/dashboard',         icon: 'fas fa-th-large',    label: 'Dashboard',  exact: true },
  { path: '/dashboard/resumes', icon: 'fas fa-file-alt',    label: 'My Resumes' },
  { path: '/templates',         icon: 'fas fa-layer-group', label: 'Templates' },
  { path: '/builder',           icon: 'fas fa-plus-circle', label: 'New Resume' },
  { path: '/settings',          icon: 'fas fa-cog',         label: 'Settings' },
];

const SidebarMain = ({ mobileOpen, onClose }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const handleLogout = () => { dispatch(logout()); navigate('/'); if (onClose) onClose(); };

  const isActive = (item) =>
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

  const linkStyle = (active) => ({
    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
    borderRadius: 8, marginBottom: 2, textDecoration: 'none',
    color: active ? '#818CF8' : '#94A3B8',
    background: active ? 'rgba(79,70,229,0.15)' : 'transparent',
    borderLeft: active ? '3px solid #4F46E5' : '3px solid transparent',
    fontWeight: active ? 600 : 400, fontSize: '0.875rem',
    transition: 'all 0.2s ease',
  });

  const Nav = () => (
    <aside style={{ width: 240, height: '100%', background: '#1E293B', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <div style={{ padding: '20px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none" onClick={onClose}>
          <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(79,70,229,0.4)' }}>
            <svg width="18" height="18" viewBox="0 0 40 40" fill="none">
              <path d="M11 13h10M11 18h16M11 23h12M11 28h8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#E2E8F0' }}>CV<span style={{ color: '#4F46E5' }}>Pilot</span></span>
        </Link>
        {onClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: 18, padding: 4, borderRadius: 6, transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#E2E8F0'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}>
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>

      {/* User */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155' }}>
        <div className="d-flex align-items-center gap-3">
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0, color: 'white', boxShadow: '0 4px 12px rgba(79,70,229,0.3)' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ color: '#E2E8F0', fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <span style={{ color: '#10B981', fontSize: '0.7rem', fontWeight: 700, letterSpacing: 0.5 }}>FREE PLAN</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 8 }}>
          <span style={{ color: '#475569', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, padding: '0 12px', display: 'block', marginBottom: 6 }}>Menu</span>
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link key={item.path} to={item.path} style={linkStyle(active)} onClick={onClose}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = 'rgba(79,70,229,0.08)'; e.currentTarget.style.color = '#E2E8F0'; } }}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94A3B8'; } }}>
                <i className={item.icon} style={{ width: 18, textAlign: 'center', fontSize: '0.9rem' }}></i>
                <span>{item.label}</span>
                {item.path === '/builder' && (
                  <span style={{ marginLeft: 'auto', background: 'rgba(79,70,229,0.2)', color: '#818CF8', fontSize: '0.6rem', padding: '2px 6px', borderRadius: 10, fontWeight: 700 }}>NEW</span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Coming Soon section */}
        <div style={{ marginTop: 16 }}>
          <span style={{ color: '#475569', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, padding: '0 12px', display: 'block', marginBottom: 6 }}>Coming Soon</span>
          {[
            { icon: 'fas fa-brain', label: 'AI Resume Writer' },
            { icon: 'fas fa-comments', label: 'Interview Prep' },
            { icon: 'fas fa-bullseye', label: 'Job Match' },
          ].map((item) => (
            <div key={item.label}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8, marginBottom: 2, color: '#475569', fontSize: '0.875rem', cursor: 'default', borderLeft: '3px solid transparent' }}>
              <i className={item.icon} style={{ width: 18, textAlign: 'center', fontSize: '0.9rem' }}></i>
              <span>{item.label}</span>
              <span style={{ marginLeft: 'auto', background: 'rgba(124,58,237,0.15)', color: '#7C3AED', fontSize: '0.6rem', padding: '2px 6px', borderRadius: 10, fontWeight: 700 }}>SOON</span>
            </div>
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px', borderTop: '1px solid #334155' }}>
        <button onClick={handleLogout}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8, background: 'transparent', border: 'none', color: '#64748B', fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#EF4444'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B'; }}>
          <i className="fas fa-sign-out-alt" style={{ width: 18, textAlign: 'center' }}></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop */}
      <div className="d-none d-lg-block" style={{ width: 240, flexShrink: 0, position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100 }}>
        <Nav />
      </div>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, animation: 'fadeIn 0.2s ease' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
          <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: 240, zIndex: 201, animation: 'slideInLeft 0.25s ease' }}>
            <Nav />
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarMain;
