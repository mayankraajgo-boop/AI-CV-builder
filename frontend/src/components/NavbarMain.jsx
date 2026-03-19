import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSliceV2';
import usePWAInstall from '../hooks/usePWAInstall';

const CVPilotLogo = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="10" fill="url(#nlg)" />
    <path d="M11 13h10M11 18h16M11 23h12M11 28h8" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
    <circle cx="30" cy="13" r="4" fill="white" fillOpacity="0.9" />
    <path d="M28.5 13l1 1 2-2" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="nlg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4F46E5" /><stop offset="1" stopColor="#7C3AED" />
      </linearGradient>
    </defs>
  </svg>
);

const NAV_LINKS = [
  { label: 'Features',  href: '/#features' },
  { label: 'Templates', href: '/templates' },
];

export default function Navbar() {
  const { user }  = useSelector((s) => s.auth);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const { canInstall, install } = usePWAInstall();

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const menuRef = useRef(null);

  // Close menu on route change
  useEffect(() => { setOpen(false); }, [location]);

  // Scroll detection
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const fn = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    document.addEventListener('touchstart', fn);
    return () => { document.removeEventListener('mousedown', fn); document.removeEventListener('touchstart', fn); };
  }, [open]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleLogout = () => { dispatch(logout()); navigate('/'); };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(4,9,26,0.95)' : 'rgba(4,9,26,0.5)',
        backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
        borderBottom: scrolled ? '1px solid rgba(51,65,85,0.8)' : '1px solid transparent',
        transition: 'all 0.3s ease',
        padding: '0 0',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', height: 64, gap: 16 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <CVPilotLogo size={34} />
            <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#E2E8F0' }}>
              CV<span style={{ color: '#818CF8' }}>Pilot</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <ul className="nm-desktop-links">
            {NAV_LINKS.map((item) => (
              <li key={item.label}>
                <Link to={item.href} className="nm-nav-link">{item.label}</Link>
              </li>
            ))}
          </ul>

          {/* Desktop right actions */}
          <div className="nm-desktop-actions">
            {canInstall && (
              <button onClick={install} className="nm-install-btn">
                <i className="fas fa-download me-1" />Install App
              </button>
            )}
            {user ? (
              <>
                <Link to="/dashboard" className="btn btn-outline-primary btn-sm">
                  <i className="fas fa-th-large me-1" />Dashboard
                </Link>
                <div className="dropdown">
                  <button className="nm-avatar-btn" data-bs-toggle="dropdown" aria-expanded="false">
                    <div className="nm-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{user.name?.split(' ')[0]}</span>
                    <i className="fas fa-chevron-down" style={{ fontSize: 10, color: '#64748B' }} />
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end nm-dropdown">
                    <li><Link className="dropdown-item nm-dd-item" to="/settings"><i className="fas fa-cog me-2" />Settings</Link></li>
                    <li><hr className="dropdown-divider" style={{ borderColor: '#334155' }} /></li>
                    <li><button className="dropdown-item nm-dd-item nm-dd-danger" onClick={handleLogout}><i className="fas fa-sign-out-alt me-2" />Logout</button></li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <Link to="/auth" className="nm-signin-link">Sign In</Link>
                <Link to="/auth?mode=register" className="btn btn-primary btn-sm nm-cta">Get Started Free</Link>
              </>
            )}
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="nm-hamburger"
            onClick={() => setOpen(v => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span className={`nm-ham-line ${open ? 'nm-ham-open-1' : ''}`} />
            <span className={`nm-ham-line ${open ? 'nm-ham-open-2' : ''}`} />
            <span className={`nm-ham-line ${open ? 'nm-ham-open-3' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu backdrop */}
      <div
        className={`nm-backdrop ${open ? 'nm-backdrop-visible' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <div ref={menuRef} className={`nm-drawer ${open ? 'nm-drawer-open' : ''}`}>
        <div className="nm-drawer-inner">

          {/* Nav links */}
          <div className="nm-drawer-section">
            {NAV_LINKS.map((item, i) => (
              <Link key={item.label} to={item.href} className="nm-drawer-link"
                style={{ animationDelay: open ? `${i * 0.06}s` : '0s' }}>
                {item.label}
                <i className="fas fa-chevron-right nm-drawer-arrow" />
              </Link>
            ))}
          </div>

          <div className="nm-drawer-divider" />

          {/* Auth actions */}
          <div className="nm-drawer-section">
            {user ? (
              <>
                <div className="nm-drawer-user">
                  <div className="nm-avatar nm-avatar-lg">{user.name?.charAt(0).toUpperCase()}</div>
                  <div>
                    <div style={{ color: '#E2E8F0', fontWeight: 700, fontSize: '0.95rem' }}>{user.name}</div>
                    <div style={{ color: '#64748B', fontSize: '0.75rem' }}>{user.email}</div>
                  </div>
                </div>
                <Link to="/dashboard" className="nm-drawer-btn nm-drawer-btn-primary">
                  <i className="fas fa-th-large me-2" />Dashboard
                </Link>
                <Link to="/settings" className="nm-drawer-btn nm-drawer-btn-ghost">
                  <i className="fas fa-cog me-2" />Settings
                </Link>
                <button onClick={handleLogout} className="nm-drawer-btn nm-drawer-btn-danger">
                  <i className="fas fa-sign-out-alt me-2" />Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/auth?mode=register" className="nm-drawer-btn nm-drawer-btn-primary">
                  <i className="fas fa-rocket me-2" />Get Started Free
                </Link>
                <Link to="/auth" className="nm-drawer-btn nm-drawer-btn-ghost">
                  <i className="fas fa-sign-in-alt me-2" />Sign In
                </Link>
              </>
            )}
            {canInstall && (
              <button onClick={install} className="nm-drawer-btn nm-drawer-btn-ghost" style={{ marginTop: 4 }}>
                <i className="fas fa-download me-2" />Install App
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        /* ── Desktop links ── */
        .nm-desktop-links{display:flex;list-style:none;margin:0 auto;padding:0;gap:4px}
        .nm-nav-link{color:#94A3B8;font-weight:500;padding:7px 14px;border-radius:8px;text-decoration:none;transition:all 0.2s;font-size:0.9rem}
        .nm-nav-link:hover{color:#E2E8F0;background:rgba(79,70,229,0.12)}

        /* ── Desktop actions ── */
        .nm-desktop-actions{display:flex;align-items:center;gap:10px;flex-shrink:0}
        .nm-signin-link{color:#94A3B8;text-decoration:none;font-weight:500;font-size:0.9rem;transition:color 0.2s}
        .nm-signin-link:hover{color:#E2E8F0}
        .nm-cta{font-size:0.85rem!important;padding:8px 18px!important}
        .nm-install-btn{background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.35);color:#10B981;border-radius:8px;font-size:0.78rem;font-weight:600;padding:6px 12px;cursor:pointer;transition:all 0.2s}
        .nm-install-btn:hover{background:rgba(16,185,129,0.2)}

        /* ── Avatar / dropdown ── */
        .nm-avatar{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#4F46E5,#7C3AED);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:white;flex-shrink:0}
        .nm-avatar-lg{width:40px;height:40px;font-size:16px}
        .nm-avatar-btn{display:flex;align-items:center;gap:8px;background:rgba(79,70,229,0.12);border:1px solid rgba(79,70,229,0.35);border-radius:8px;color:#E2E8F0;padding:6px 12px;cursor:pointer;transition:all 0.2s}
        .nm-avatar-btn:hover{background:rgba(79,70,229,0.2)}
        .nm-dropdown{background:#1E293B!important;border:1px solid #334155!important;border-radius:12px!important;padding:6px!important;min-width:160px}
        .nm-dd-item{color:#E2E8F0!important;border-radius:8px;font-size:0.875rem;padding:8px 12px!important}
        .nm-dd-item:hover{background:rgba(79,70,229,0.12)!important}
        .nm-dd-danger{color:#EF4444!important}
        .nm-dd-danger:hover{background:rgba(239,68,68,0.1)!important}

        /* ── Hamburger ── */
        .nm-hamburger{display:none;flex-direction:column;justify-content:center;align-items:center;gap:5px;width:40px;height:40px;background:rgba(79,70,229,0.12);border:1px solid rgba(79,70,229,0.3);border-radius:10px;cursor:pointer;padding:0;margin-left:auto;flex-shrink:0;transition:background 0.2s}
        .nm-hamburger:hover{background:rgba(79,70,229,0.22)}
        .nm-ham-line{display:block;width:18px;height:2px;background:#E2E8F0;border-radius:2px;transition:all 0.3s cubic-bezier(0.16,1,0.3,1);transform-origin:center}
        .nm-ham-open-1{transform:translateY(7px) rotate(45deg)}
        .nm-ham-open-2{opacity:0;transform:scaleX(0)}
        .nm-ham-open-3{transform:translateY(-7px) rotate(-45deg)}

        /* ── Backdrop ── */
        .nm-backdrop{position:fixed;inset:0;z-index:998;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);opacity:0;pointer-events:none;transition:opacity 0.3s ease}
        .nm-backdrop-visible{opacity:1;pointer-events:all}

        /* ── Drawer ── */
        .nm-drawer{position:fixed;top:64px;left:0;right:0;z-index:999;transform:translateY(-8px);opacity:0;pointer-events:none;transition:transform 0.35s cubic-bezier(0.16,1,0.3,1),opacity 0.3s ease;max-height:calc(100vh - 64px);overflow-y:auto}
        .nm-drawer-open{transform:translateY(0);opacity:1;pointer-events:all}
        .nm-drawer-inner{background:rgba(10,18,38,0.98);border-bottom:1px solid rgba(79,70,229,0.25);border-left:none;border-right:none;backdrop-filter:blur(24px);padding:16px 0 24px}
        .nm-drawer-section{padding:0 16px;display:flex;flex-direction:column;gap:4px}
        .nm-drawer-divider{height:1px;background:rgba(51,65,85,0.6);margin:12px 16px}
        .nm-drawer-link{display:flex;align-items:center;justify-content:space-between;color:#CBD5E1;font-weight:600;font-size:1rem;padding:13px 16px;border-radius:12px;text-decoration:none;transition:all 0.2s;animation:nmLinkIn 0.3s both}
        .nm-drawer-link:hover{color:#E2E8F0;background:rgba(79,70,229,0.12)}
        .nm-drawer-arrow{color:#475569;font-size:11px;transition:transform 0.2s}
        .nm-drawer-link:hover .nm-drawer-arrow{transform:translateX(3px);color:#818CF8}
        .nm-drawer-user{display:flex;align-items:center;gap:12px;padding:12px 16px;background:rgba(79,70,229,0.08);border:1px solid rgba(79,70,229,0.15);border-radius:12px;margin-bottom:8px}
        .nm-drawer-btn{display:flex;align-items:center;width:100%;padding:13px 16px;border-radius:12px;font-size:0.95rem;font-weight:600;cursor:pointer;text-decoration:none;border:none;transition:all 0.2s}
        .nm-drawer-btn-primary{background:linear-gradient(135deg,#4F46E5,#7C3AED);color:white;box-shadow:0 4px 16px rgba(79,70,229,0.35)}
        .nm-drawer-btn-primary:hover{opacity:0.9;color:white}
        .nm-drawer-btn-ghost{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08)!important;color:#94A3B8}
        .nm-drawer-btn-ghost:hover{background:rgba(79,70,229,0.1);color:#E2E8F0}
        .nm-drawer-btn-danger{background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2)!important;color:#EF4444}
        .nm-drawer-btn-danger:hover{background:rgba(239,68,68,0.15)}
        @keyframes nmLinkIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}

        /* ── Responsive breakpoints ── */
        @media(max-width:991px){
          .nm-desktop-links{display:none}
          .nm-desktop-actions{display:none}
          .nm-hamburger{display:flex}
        }
        @media(min-width:992px){
          .nm-drawer{display:none}
          .nm-backdrop{display:none}
        }
      `}</style>
    </>
  );
}
