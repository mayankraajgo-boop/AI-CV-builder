import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../store/authSlice';
import DashboardLayout from '../layouts/DashboardMain';
import toast from 'react-hot-toast';

export default function Settings() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: '', email: '' });
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) setForm({ name: user.name || '', email: user.email || '' });
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateProfile(form));
    if (!result.error) toast.success('Profile updated!');
    else toast.error('Update failed');
  };

  return (
    <DashboardLayout>
      <div style={{ padding: '32px', maxWidth: 800 }}>
        <h1 style={{ color: '#E2E8F0', fontWeight: 800, fontSize: '1.75rem', marginBottom: 4 }}>Settings</h1>
        <p style={{ color: '#64748B', marginBottom: 32 }}>Manage your account and preferences</p>

        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #334155', marginBottom: 32 }}>
          {['profile', 'plan', 'security'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
                color: activeTab === tab ? '#4F46E5' : '#64748B',
                borderBottom: activeTab === tab ? '2px solid #4F46E5' : '2px solid transparent',
                fontWeight: 600, fontSize: '0.875rem', textTransform: 'capitalize', transition: 'all 0.2s',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <div className="card p-4">
            <h5 style={{ color: '#E2E8F0', fontWeight: 700, marginBottom: 24 }}>
              <i className="fas fa-user me-2" style={{ color: '#4F46E5' }}></i>Profile Information
            </h5>
            <form onSubmit={handleSave}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name</label>
                  <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                Save Changes
              </button>
            </form>
          </div>
        )}

        {activeTab === 'plan' && (
          <div>
            <div className="card p-4 mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 style={{ color: '#E2E8F0', fontWeight: 700, marginBottom: 4 }}>Current Plan</h5>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981' }}>Free</span>
                    <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', fontSize: '0.7rem', fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>ACTIVE</span>
                  </div>
                  <p style={{ color: '#64748B', fontSize: '0.85rem', marginTop: 6, marginBottom: 0 }}>
                    CVPilot is completely free — no credit card, no limits.
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-4">
              <h6 style={{ color: '#E2E8F0', fontWeight: 700, marginBottom: 16 }}>What's Included</h6>
              {[
                'Unlimited resumes',
                'All 5 templates',
                'PDF export',
                'Auto-save',
                'AI Tools (coming soon)',
                'Full editing suite',
              ].map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, color: '#94A3B8', fontSize: '0.9rem' }}>
                  <i className="fas fa-check-circle" style={{ color: '#10B981' }}></i>{f}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="card p-4">
            <h5 style={{ color: '#E2E8F0', fontWeight: 700, marginBottom: 24 }}>
              <i className="fas fa-shield-alt me-2" style={{ color: '#4F46E5' }}></i>Security
            </h5>
            <div style={{ background: 'rgba(79,70,229,0.08)', border: '1px solid rgba(79,70,229,0.2)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <p style={{ color: '#94A3B8', marginBottom: 0, fontSize: '0.9rem' }}>
                <i className="fas fa-info-circle me-2" style={{ color: '#818CF8' }}></i>
                Password changes are handled securely. Contact support to reset your password.
              </p>
            </div>
            <div style={{ color: '#64748B', fontSize: '0.875rem' }}>
              <div style={{ marginBottom: 8 }}><i className="fas fa-check me-2" style={{ color: '#10B981' }}></i>Password is hashed with bcrypt</div>
              <div style={{ marginBottom: 8 }}><i className="fas fa-check me-2" style={{ color: '#10B981' }}></i>JWT authentication enabled</div>
              <div><i className="fas fa-check me-2" style={{ color: '#10B981' }}></i>Secure HTTPS connection</div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
