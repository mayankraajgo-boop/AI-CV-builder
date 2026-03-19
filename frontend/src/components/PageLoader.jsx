/**
 * CVPilot branded full-page loader.
 * Usage: <PageLoader visible={true} message="Loading..." />
 */
export default function PageLoader({ visible = false, message = 'Loading...' }) {
  if (!visible) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#04091A',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      animation: 'pl-fadeIn 0.25s ease',
    }}>
      {/* Ambient orbs */}
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(79,70,229,.18),transparent 65%)', top: '10%', left: '20%', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,.14),transparent 65%)', bottom: '10%', right: '15%', filter: 'blur(60px)', pointerEvents: 'none' }} />

      {/* Logo container */}
      <div style={{ position: 'relative', marginBottom: 28 }}>
        {/* Outer spinning ring */}
        <div style={{
          position: 'absolute', inset: -14, borderRadius: '50%',
          border: '2px solid transparent',
          borderTopColor: '#4F46E5', borderRightColor: 'rgba(79,70,229,0.3)',
          animation: 'pl-spin 1s linear infinite',
        }} />
        {/* Inner spinning ring */}
        <div style={{
          position: 'absolute', inset: -6, borderRadius: '50%',
          border: '2px solid transparent',
          borderBottomColor: '#7C3AED', borderLeftColor: 'rgba(124,58,237,0.3)',
          animation: 'pl-spin 0.7s linear infinite reverse',
        }} />
        {/* Glow pulse ring */}
        <div style={{
          position: 'absolute', inset: -20, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(79,70,229,0.15),transparent 70%)',
          animation: 'pl-pulse 2s ease-in-out infinite',
        }} />
        {/* Logo icon */}
        <div style={{
          width: 64, height: 64,
          background: 'linear-gradient(135deg,#4F46E5,#7C3AED)',
          borderRadius: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(79,70,229,0.5)',
          animation: 'pl-iconPop 2s ease-in-out infinite',
          position: 'relative', zIndex: 1,
        }}>
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
            <path d="M11 13h10M11 18h16M11 23h12M11 28h8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="30" cy="13" r="4" fill="white" fillOpacity="0.9"/>
            <path d="M28.5 13l1 1 2-2" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Brand name */}
      <div style={{ fontWeight: 800, fontSize: '1.5rem', color: '#E2E8F0', marginBottom: 8, letterSpacing: '-0.5px' }}>
        CV<span style={{ color: '#818CF8' }}>Pilot</span>
      </div>

      {/* Animated dots */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: '50%',
            background: '#4F46E5',
            animation: `pl-dot 1.2s ease-in-out infinite`,
            animationDelay: `${i * 0.2}s`,
          }} />
        ))}
      </div>

      <p style={{ color: '#475569', fontSize: '0.82rem', fontWeight: 500, margin: 0 }}>{message}</p>

      <style>{`
        @keyframes pl-fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pl-spin { to { transform: rotate(360deg); } }
        @keyframes pl-pulse { 0%,100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.15); } }
        @keyframes pl-iconPop { 0%,100% { box-shadow: 0 8px 32px rgba(79,70,229,.5); transform: scale(1); } 50% { box-shadow: 0 12px 48px rgba(79,70,229,.8); transform: scale(1.06); } }
        @keyframes pl-dot { 0%,80%,100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1.2); opacity: 1; } }
      `}</style>
    </div>
  );
}
