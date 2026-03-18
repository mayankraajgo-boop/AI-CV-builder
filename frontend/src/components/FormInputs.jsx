import React from 'react';

export const FormInput = ({ label, name, value, onChange, type = 'text', placeholder, required }) => (
  <div className="mb-3">
    <label className="form-label">{label}{required && <span style={{ color: '#EF4444' }}> *</span>}</label>
    <input
      type={type}
      className="form-control"
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

export const FormTextarea = ({ label, name, value, onChange, placeholder, rows = 3 }) => (
  <div className="mb-3">
    <label className="form-label">{label}</label>
    <textarea
      className="form-control"
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      style={{ resize: 'vertical' }}
    />
  </div>
);

export const SectionHeader = ({ title, icon, onAdd, addLabel }) => (
  <div className="d-flex justify-content-between align-items-center mb-3">
    <h6 style={{ color: '#E2E8F0', fontWeight: 700, marginBottom: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
      <i className={icon} style={{ color: '#4F46E5' }}></i>{title}
    </h6>
    {onAdd && (
      <button
        onClick={onAdd}
        style={{ background: 'rgba(79,70,229,0.15)', border: '1px solid rgba(79,70,229,0.3)', color: '#818CF8', borderRadius: 6, padding: '4px 12px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
      >
        <i className="fas fa-plus me-1"></i>{addLabel || 'Add'}
      </button>
    )}
  </div>
);

export const ItemCard = ({ children, onRemove, title }) => (
  <div style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid #334155', borderRadius: 10, padding: 16, marginBottom: 12, position: 'relative' }}>
    {title && <div style={{ color: '#818CF8', fontWeight: 600, fontSize: '0.8rem', marginBottom: 12 }}>{title}</div>}
    {children}
    {onRemove && (
      <button
        onClick={onRemove}
        style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(239,68,68,0.1)', border: 'none', color: '#EF4444', borderRadius: 6, width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}
      >
        <i className="fas fa-times"></i>
      </button>
    )}
  </div>
);
