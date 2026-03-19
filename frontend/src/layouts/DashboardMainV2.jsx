import { Link, useLocation } from 'react-router-dom';
import SidebarMain from '../components/SidebarMain';
import usePWAInstall from '../hooks/usePWAInstall';

const BottomNav = () => {
  const location = useLocation();
  const items = [
    { path: '/dashboard',         icon: 'fas fa-th-large',  label: 'Home',      exact: true },
    { path: '/dashboard/resumes', icon: 'fas fa-file-alt',  label: 'Resumes' },
    { path: '/ats-analyzer',      icon: 'fas fa-chart-bar', label: 'ATS' },
    { path: '/templates',         icon: 'fas fa-layer-group',label: 'Templates' },
    { path: '/settings',          icon: 'fas fa-cog',       label: 'Settings' },
  ];
  const isActive = (item) =>
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);
  return (
    <nav className="mobile-bottom-nav">
      {items.map((item) => (
        <Link key={item.path} to={item.path} className={isActive(item) ? 'active' : ''}>
          <i className={item.icon}></i>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

const DashboardMain = ({ children }) => {
  const { canInstall, install } = usePWAInstall();
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'transparent' }}>
      <SidebarMain />

      {/* Mobile top bar */}
      <div className="mobile-top-bar d-lg-none">
        <div className="d-flex align-items-center gap-2">
          <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 40 40" fill="none">
              <path d="M11 13h10M11 18h16M11 23h12M11 28h8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontWeight: 800, color: '#E2E8F0', fontSize: '1rem' }}>
            CV<span style={{ color: '#4F46E5' }}>Pilot</span>
          </span>
        </div>
        {canInstall && (
          <button onClick={install}
            style={{ background: 'rgba(79,70,229,0.2)', border: '1px solid rgba(79,70,229,0.4)', color: '#818CF8', borderRadius: 8, padding: '5px 12px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="fas fa-download" style={{ fontSize: 11 }} />Install App
          </button>
        )}
      </div>

      <main className="dashboard-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' }}>
        <div className="mobile-top-spacer d-lg-none"></div>
        {children}
      </main>

      <BottomNav />
    </div>
  );
};

export default DashboardMain;
