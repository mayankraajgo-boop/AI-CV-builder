import { useState } from 'react';
import ComingSoonModal from './ComingSoonModal';

const aiActions = [
  { id: 'improve', icon: 'fas fa-magic', label: 'Improve Section', color: '#4F46E5' },
  { id: 'ats', icon: 'fas fa-robot', label: 'Make ATS Friendly', color: '#7C3AED' },
  { id: 'actions', icon: 'fas fa-bolt', label: 'Add Action Words', color: '#0EA5E9' },
  { id: 'generate', icon: 'fas fa-brain', label: 'Generate with AI', color: '#10B981' },
];

const AIHelperPanel = ({ currentSection }) => {
  const [modal, setModal] = useState({ show: false, feature: '' });

  const showComingSoon = (label) => setModal({ show: true, feature: label });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ComingSoonModal show={modal.show} onClose={() => setModal({ show: false, feature: '' })} feature={modal.feature} />

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,rgba(79,70,229,0.15),rgba(124,58,237,0.15))', border: '1px solid rgba(79,70,229,0.3)', borderRadius: 12, padding: 16 }}>
        <div className="d-flex align-items-center gap-2 mb-1">
          <i className="fas fa-brain" style={{ color: '#818CF8' }}></i>
          <span style={{ color: '#E2E8F0', fontWeight: 700, fontSize: '0.95rem' }}>AI Assistant</span>
          <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', fontSize: '0.65rem', padding: '2px 8px', borderRadius: 20, fontWeight: 700, marginLeft: 'auto' }}>SOON</span>
        </div>
        <p style={{ color: '#64748B', fontSize: '0.78rem', marginBottom: 0 }}>
          Editing: {currentSection || 'Select a section'}
        </p>
      </div>

      {/* AI Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {aiActions.map((action) => (
          <button
            key={action.id}
            onClick={() => showComingSoon(action.label)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
              background: 'rgba(30,41,59,0.8)',
              border: `1px solid #334155`,
              borderRadius: 8, color: '#94A3B8',
              cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = action.color; e.currentTarget.style.color = action.color; e.currentTarget.style.background = 'rgba(79,70,229,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'rgba(30,41,59,0.8)'; }}
          >
            <i className={action.icon} style={{ color: action.color, width: 16 }}></i>
            {action.label}
            <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: '#475569' }}>🚀</span>
          </button>
        ))}
      </div>

      {/* ATS Score */}
      <div style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid #334155', borderRadius: 10, padding: 14 }}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span style={{ color: '#E2E8F0', fontWeight: 600, fontSize: '0.85rem' }}>
            <i className="fas fa-chart-bar me-2" style={{ color: '#4F46E5' }}></i>ATS Score
          </span>
          <button
            onClick={() => showComingSoon('ATS Score Analysis')}
            style={{ background: 'rgba(79,70,229,0.15)', border: '1px solid #4F46E5', color: '#818CF8', borderRadius: 6, padding: '3px 10px', fontSize: '0.75rem', cursor: 'pointer' }}
          >
            Analyze 🚀
          </button>
        </div>
        <div style={{ textAlign: 'center', padding: '12px 0' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', border: '3px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', color: '#475569', fontSize: '1.1rem', fontWeight: 700 }}>—</div>
          <p style={{ color: '#475569', fontSize: '0.75rem', marginBottom: 0 }}>Click Analyze to check</p>
        </div>
      </div>

      {/* Coming soon notice */}
      <div style={{ background: 'linear-gradient(135deg,rgba(79,70,229,0.1),rgba(124,58,237,0.1))', border: '1px solid rgba(79,70,229,0.3)', borderRadius: 10, padding: 14, textAlign: 'center', marginTop: 'auto' }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>🚀</div>
        <p style={{ color: '#E2E8F0', fontWeight: 600, fontSize: '0.85rem', marginBottom: 4 }}>AI Features Coming Soon</p>
        <p style={{ color: '#64748B', fontSize: '0.75rem', marginBottom: 0 }}>
          GPT-4 powered resume writing, ATS optimization, and more — launching soon!
        </p>
      </div>
    </div>
  );
};

export default AIHelperPanel;
