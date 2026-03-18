import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

const navItems = [
  { path: '/dashboard', icon: 'fas fa-th-large', label: 'Dashboard', exact: true },
  { path: '/dashboard/resumes', icon: 'fas fa-file-alt', label: 'My Resumes' },
  { path: '/templates', icon: 'fas fa-layer-group', label: 'Templates' },
  { path: '/builder', icon: 'fas fa-plus-circle', label: 'New Resume' },
];

const toolItems = [
  { path: '/tools/portfolio', icon: 'fas fa-globe', label: 'Portfolio Generator' },
  { path: '/tools/interview', icon: 'fas fa-comments', label: 'Interview Q&A' },
  { path: '/tools/skills', icon: 'fas fa-chart-pie', label: 'Skill Gap Analysis' },
  { path: '/tools/job-match', icon: 'fas fa-bullseye', label: 'Job Match' },
];

const Sidebar = ({ mobileOpen, onClose }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [toolsOpen, setToolsOpen] = useState(true);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    if (onClose) onClose();
  };

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname === item.path || location.pathname.startsWith(item.path + '/');
  };

  const linkStyle = (active) => ({
    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
    borderRadius: 8, marginBottom: 2, textDecoration: 'none',
    color: active ? '#4F46E5' : '#94A3B8',
    background: active ? 'rgba(79,70,229,0.12)' : 'transparent',
    borderLeft: active ? '3px solid #4F46E5' : '3px solid transparent',
    fontWeight: active ? 600 : 400, fontSize: '0.875rem', transition: 'all 0.2s',
  });

  const Nav = () => (
    <aside style={{ width: 240, height: '100%', background: '#1E293B', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none" onClick={onClose}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}></div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#E2E8F0' }}>CV<span style={{ color: '#4F46E5' }}>Pilot</span></span>
        </Link>
        {onClose && <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: 20, padding: 4 }}></button>}
      </div>

      <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155' }}>
        <div className="d-flex align-items-center gap-3">
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ color: '#E2E8F0', fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <span style={{ color: '#10B981', fontSize: '0.7rem', fontWeight: 600 }}>Free Plan</span>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Link key={item.path} to={item.path} style={linkStyle(active)} onClick={onClose}
              onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = 'rgba(79,70,229,0.06)'; e.currentTarget.style.color = '#E2E8F0'; } }}
              onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94A3B8'; } }}
            >
              <i className={item.icon} style={{ width: 18, textAlign: 'center' }}></i>
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div style={{ marginTop: 16 }}>
          <button onClick={() => setToolsOpen(p => !p)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'none', border: 'none', color: '#475569', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer', marginBottom: 4 }}>
            <span style={{ flex: 1, textAlign: 'left' }}>AI Tools</span>
            <i className={`fas fa-chevron-${toolsOpen ? 'down' : 'right'}`} style={{ fontSize: 10 }}></i>
          </button>
          {toolsOpen && toolItems.map((item) => {
            const active = isActive(item);
            return (
              <Link key={item.path} to={item.path} style={linkStyle(active)} onClick={onClose}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = 'rgba(79,70,229,0.06)'; e.currentTarget.style.color = '#E2E8F0'; } }}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94A3B8'; } }}
              >
                <i className={item.icon} style={{ width: 18, textAlign: 'center' }}></i>
                <span>{item.label}</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.6rem', color: '#475569' }}></span>
              </Link>
            );
          })}
        </div>

        <div style={{ marginTop: 8 }}>
          <Link to="/settings" style={linkStyle(location.pathname === '/settings')} onClick={onClose}
            onMouseEnter={(e) => { if (location.pathname !== '/settings') { e.currentTarget.style.background = 'rgba(79,70,229,0.06)'; e.currentTarget.style.color = '#E2E8F0'; } }}
            onMouseLeave={(e) => { if (location.pathname !== '/settings') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94A3B8'; } }}
          >
            <i className="fas fa-cog" style={{ width: 18, textAlign: 'center' }}></i>
            <span>Settings</span>
          </Link>
        </div>
      </nav>

      <div style={{ padding: '12px', borderTop: '1px solid #334155' }}>
        <button onClick={handleLogout}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8, background: 'transparent', border: 'none', color: '#64748B', fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#EF4444'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B'; }}
        >
          <i className="fas fa-sign-out-alt" style={{ width: 18, textAlign: 'center' }}></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <div className="d-none d-lg-block" style={{ width: 240, flexShrink: 0, position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100 }}>
        <Nav />
      </div>
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} onClick={onClose} />
          <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: 240, zIndex: 201 }}>
            <Nav />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
