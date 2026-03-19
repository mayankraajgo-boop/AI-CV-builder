import React from 'react';

const TemplateCard = ({ template, selected, onSelect }) => {
  return (
    <div
      className="card"
      style={{
        cursor: 'pointer',
        border: selected ? '2px solid #4F46E5' : '1px solid #334155',
        boxShadow: selected ? '0 0 20px rgba(79,70,229,0.3)' : '',
      }}
      onClick={() => onSelect(template.id)}
    >
      {/* Preview area */}
      <div style={{ height: 200, background: template.preview, borderRadius: '12px 12px 0 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '80%', background: 'white', borderRadius: 8, padding: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            <div style={{ height: 8, background: template.accentColor, borderRadius: 4, marginBottom: 8 }}></div>
            <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, marginBottom: 4, width: '70%' }}></div>
            <div style={{ height: 4, background: '#e2e8f0', borderRadius: 2, marginBottom: 4, width: '50%' }}></div>
            <div style={{ height: 1, background: '#e2e8f0', margin: '8px 0' }}></div>
            {[80, 60, 70, 55].map((w, i) => (
              <div key={i} style={{ height: 4, background: '#e2e8f0', borderRadius: 2, marginBottom: 4, width: `${w}%` }}></div>
            ))}
          </div>
        </div>
        {selected && (
          <div style={{ position: 'absolute', top: 10, right: 10, width: 28, height: 28, background: '#4F46E5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fas fa-check" style={{ color: 'white', fontSize: 12 }}></i>
          </div>
        )}
        {template.isPro && (
          <div style={{ position: 'absolute', top: 10, left: 10 }}>
            <span className="badge-pro">PRO</span>
          </div>
        )}
      </div>

      <div className="card-body p-3">
        <h6 style={{ color: '#E2E8F0', fontWeight: 700, marginBottom: 4 }}>{template.name}</h6>
        <p style={{ color: '#64748B', fontSize: '0.8rem', marginBottom: 0 }}>{template.description}</p>
      </div>
    </div>
  );
};

export default TemplateCard;
