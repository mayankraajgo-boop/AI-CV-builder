import { useState } from 'react';
import usePWAInstall from '../hooks/usePWAInstall';

export default function PWAInstallBanner() {
  const { canInstall, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showTip, setShowTip] = useState(false);

  // Hide if dismissed
  if (dismissed) return null;

  const handleInstall = async () => {
    if (canInstall) {
      await install();
    } else {
      // Show manual install tip
      setShowTip(v => !v);
    }
  };

  return (
    <>
      <style>{`
        @keyframes pwaSlideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(24px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes pwaTipIn {
          from { opacity: 0; transform: translateX(-50%) translateY(8px) scale(0.97); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
        .pwa-install-btn:hover { opacity: 0.9; transform: scale(1.03) !important; }
        .pwa-install-btn:active { transform: scale(0.97) !important; }
      `}</style>

      {/* Tip tooltip */}
      {showTip && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10000,
          width: 'calc(100% - 32px)',
          maxWidth: '360px',
          background: 'rgba(10,18,38,0.98)',
          border: '1px solid rgba(79,70,229,0.4)',
          borderRadius: '14px',
          padding: '14px 16px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.7)',
          animation: 'pwaTipIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards',
        }}>
          <div style={{ color: '#E2E8F0', fontWeight: 700, fontSize: '0.85rem', marginBottom: 8 }}>
            <i className="fas fa-info-circle me-2" style={{ color: '#818CF8' }} />
            How to install
          </div>
          <div style={{ color: '#94A3B8', fontSize: '0.78rem', lineHeight: 1.6 }}>
            <b style={{ color: '#CBD5E1' }}>Chrome/Android:</b> Tap the menu (⋮) → "Add to Home screen"<br />
            <b style={{ color: '#CBD5E1' }}>Safari/iOS:</b> Tap Share (⬆) → "Add to Home Screen"<br />
            <b style={{ color: '#CBD5E1' }}>Desktop Chrome:</b> Click the install icon (⊕) in the address bar
          </div>
          <button onClick={() => setShowTip(false)} style={{
            marginTop: 10, background: 'rgba(79,70,229,0.15)', border: '1px solid rgba(79,70,229,0.3)',
            borderRadius: 8, color: '#818CF8', fontSize: '0.78rem', fontWeight: 600,
            padding: '5px 12px', cursor: 'pointer', width: '100%',
          }}>Got it</button>
        </div>
      )}

      {/* Main banner */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        width: 'calc(100% - 32px)',
        maxWidth: '420px',
        background: 'rgba(10,18,38,0.96)',
        border: '1px solid rgba(79,70,229,0.45)',
        borderRadius: '16px',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(79,70,229,0.2), 0 0 30px rgba(79,70,229,0.12)',
        animation: 'pwaSlideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
      }}>
        {/* Icon */}
        <div style={{
          width: '40px', height: '40px', flexShrink: 0,
          background: 'linear-gradient(135deg,#4F46E5,#7C3AED)',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(79,70,229,0.4)',
        }}>
          <i className="fas fa-download" style={{ color: 'white', fontSize: '0.9rem' }} />
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#E2E8F0', fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.3 }}>
            Install CVPilot App
          </div>
          <div style={{ color: '#64748B', fontSize: '0.72rem', marginTop: '1px' }}>
            {canInstall ? 'Add to home screen — works offline' : 'Add to home screen for quick access'}
          </div>
        </div>

        {/* Install button */}
        <button
          className="pwa-install-btn"
          onClick={handleInstall}
          style={{
            flexShrink: 0,
            padding: '8px 14px',
            background: 'linear-gradient(135deg,#4F46E5,#7C3AED)',
            border: 'none',
            borderRadius: '9px',
            color: 'white',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s',
            boxShadow: '0 4px 12px rgba(79,70,229,0.4)',
          }}
        >
          {canInstall ? 'Install' : 'How to'}
        </button>

        {/* Dismiss */}
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          style={{
            flexShrink: 0,
            background: 'none',
            border: 'none',
            color: '#475569',
            cursor: 'pointer',
            padding: '6px',
            fontSize: '0.85rem',
            lineHeight: 1,
            transition: 'color 0.2s',
            borderRadius: '6px',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#94A3B8'}
          onMouseLeave={e => e.currentTarget.style.color = '#475569'}
        >
          <i className="fas fa-times" />
        </button>
      </div>
    </>
  );
}
