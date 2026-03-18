import { useState } from 'react';

const ComingSoonModal = ({ show, onClose, feature = 'AI features' }) => {
  if (!show) return null;
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 20, padding: '40px 32px', maxWidth: 420, width: '100%', textAlign: 'center', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
        <h4 style={{ color: '#E2E8F0', fontWeight: 800, marginBottom: 8 }}>Coming Soon!</h4>
        <p style={{ color: '#94A3B8', marginBottom: 24, lineHeight: 1.6 }}>
          <strong style={{ color: '#818CF8' }}>{feature}</strong> is currently under development.
          We're working hard to bring you this feature soon.
        </p>
        <div style={{ background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(79,70,229,0.3)', borderRadius: 12, padding: '12px 20px', marginBottom: 24 }}>
          <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: 0 }}>
            <i className="fas fa-bell me-2" style={{ color: '#4F46E5' }}></i>
            Stay tuned — AI features are coming in the next update!
          </p>
        </div>
        <button
          onClick={onClose}
          className="btn btn-primary"
          style={{ padding: '10px 32px', borderRadius: 10 }}
        >
          Got it!
        </button>
      </div>
    </div>
  );
};

export default ComingSoonModal;
