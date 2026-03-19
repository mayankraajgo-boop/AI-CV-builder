import Navbar from '../components/NavbarMain';

const MainLayout = ({ children }) => (
  <div style={{ minHeight: '100vh', background: 'transparent' }}>
    <Navbar />
    <main>{children}</main>
    <footer style={{ background: '#1E293B', borderTop: '1px solid #334155', padding: '40px 0 24px' }}>
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-lg-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="8" fill="url(#footerLogoGrad)"/>
                <path d="M11 13h10M11 18h16M11 23h12M11 28h8" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                <circle cx="30" cy="13" r="4" fill="white" fillOpacity="0.9"/>
                <path d="M28.5 13l1 1 2-2" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="footerLogoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4F46E5"/>
                    <stop offset="1" stopColor="#7C3AED"/>
                  </linearGradient>
                </defs>
              </svg>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#E2E8F0' }}>CV<span style={{ color: '#4F46E5' }}>Pilot</span></span>
            </div>
            <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.7 }}>
              Build your perfect resume in minutes. Stand out from the crowd with professionally designed templates.
            </p>
          </div>
          <div className="col-lg-2 col-6">
            <h6 style={{ color: '#E2E8F0', fontWeight: 700, marginBottom: 16, fontSize: '0.875rem' }}>Product</h6>
            {[
              { label: 'Features', href: '/#features' },
              { label: 'Templates', href: '/templates' },
              { label: 'Dashboard', href: '/dashboard' },
            ].map((l) => (
              <div key={l.label} style={{ marginBottom: 8 }}>
                <a href={l.href} style={{ color: '#64748B', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.target.style.color = '#E2E8F0')}
                  onMouseLeave={(e) => (e.target.style.color = '#64748B')}
                >{l.label}</a>
              </div>
            ))}
          </div>
          <div className="col-lg-2 col-6">
            <h6 style={{ color: '#E2E8F0', fontWeight: 700, marginBottom: 16, fontSize: '0.875rem' }}>Company</h6>
            {['About', 'Blog', 'Contact'].map((l) => (
              <div key={l} style={{ marginBottom: 8 }}>
                <a href="#" style={{ color: '#64748B', textDecoration: 'none', fontSize: '0.875rem' }}
                  onMouseEnter={(e) => (e.target.style.color = '#E2E8F0')}
                  onMouseLeave={(e) => (e.target.style.color = '#64748B')}
                >{l}</a>
              </div>
            ))}
          </div>
          <div className="col-lg-4">
            <h6 style={{ color: '#E2E8F0', fontWeight: 700, marginBottom: 16, fontSize: '0.875rem' }}>Stay Updated</h6>
            <div className="d-flex gap-2">
              <input type="email" className="form-control form-control-sm" placeholder="Enter your email" style={{ flex: 1 }} />
              <button className="btn btn-primary btn-sm">Subscribe</button>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #334155', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: '#475569', fontSize: '0.8rem', marginBottom: 0 }}>
            © 2026 CVPilot. All rights reserved. Created by Mayank Raj.
          </p>
          <div className="d-flex gap-3">
            {['Privacy', 'Terms', 'Cookies'].map((l) => (
              <a key={l} href="#" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.8rem' }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  </div>
);

export default MainLayout;
