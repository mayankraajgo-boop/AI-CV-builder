import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createResume } from '../store/resumeSlice';
import DashboardLayout from '../layouts/DashboardMainV2';
import MainLayout from '../layouts/MainLayout';
import { TEMPLATE_META } from '../templates/index';
import templates from '../templates/index';
import toast from 'react-hot-toast';

const SAMPLE_DATA = {
  title: 'Sample Resume', templateId: 'modern',
  personalInfo: {
    fullName: 'Alex Johnson', email: 'alex@example.com', phone: '+1 555 0100',
    location: 'San Francisco, CA', linkedin: 'linkedin.com/in/alex', website: 'alexjohnson.dev',
    summary: 'Experienced software engineer with 5+ years building scalable web applications.',
  },
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'MongoDB'],
  experience: [
    { company: 'Google', position: 'Senior Software Engineer', startDate: 'Jan 2021', endDate: '', current: true, description: '• Led development of core search features\n• Improved performance by 40%' },
    { company: 'Startup Inc', position: 'Full Stack Developer', startDate: 'Mar 2019', endDate: 'Dec 2020', current: false, description: '• Built REST APIs serving 100k+ users' },
  ],
  education: [{ institution: 'MIT', degree: "Bachelor's", field: 'Computer Science', startDate: '2015', endDate: '2019', gpa: '3.9' }],
  projects: [{ name: 'CVPilot', description: 'AI-powered resume builder', technologies: 'React, Node.js', link: 'github.com/alex/cvpilot' }],
};

function TemplatesContent() {
  const [selected, setSelected] = useState('modern');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const handleUse = async (tplId) => {
    if (!user) { navigate('/auth'); return; }
    const result = await dispatch(createResume({ title: 'Untitled Resume', templateId: tplId || selected }));
    if (!result.error) navigate(`/builder/${result.payload.resume._id}`);
    else toast.error('Failed to create resume');
  };

  const SelectedTemplate = templates[selected] || templates.modern;
  const selectedMeta = TEMPLATE_META[selected];

  return (
    <div style={{ padding: '24px 16px' }} className="dashboard-content fade-in">
      <div className="text-center mb-4">
        <h1 style={{ color: '#E2E8F0', fontWeight: 800, fontSize: 'clamp(1.4rem,3vw,2rem)', marginBottom: 6 }}>Choose Your Template</h1>
        <p style={{ color: '#64748B', marginBottom: 0 }}>5 professionally designed templates — all free</p>
      </div>

      <div className="row g-4">
        {/* Template list */}
        <div className="col-lg-4">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.values(TEMPLATE_META).map((meta) => {
              const isSelected = selected === meta.id;
              return (
                <div key={meta.id} onClick={() => setSelected(meta.id)}
                  style={{ background: isSelected ? `${meta.accent}12` : '#1E293B', border: isSelected ? `2px solid ${meta.accent}` : '1px solid #334155', borderRadius: 12, padding: '12px 14px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: isSelected ? `0 0 16px ${meta.accent}20` : '' }}
                  onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.borderColor = meta.accent; }}
                  onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.borderColor = '#334155'; }}>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: `linear-gradient(135deg,${meta.accent},${meta.accent}99)`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                      {meta.id === 'minimal' ? '◻' : meta.id === 'modern' ? '▣' : meta.id === 'creative' ? '◈' : meta.id === 'compact' ? '▤' : '⌨'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ color: '#E2E8F0', fontWeight: 700, fontSize: '0.875rem' }}>{meta.name}</span>
                        {isSelected && <i className="fas fa-check-circle" style={{ color: meta.accent, fontSize: 12 }} />}
                      </div>
                      <div style={{ color: '#64748B', fontSize: '0.72rem', marginTop: 1 }}>{meta.description}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="btn btn-primary w-100 mt-3" style={{ padding: '12px', borderRadius: 10 }} onClick={() => handleUse(selected)}>
            <i className="fas fa-rocket me-2" />Use {selectedMeta?.name} Template
          </button>
        </div>

        {/* Live preview */}
        <div className="col-lg-8">
          <div style={{ position: 'sticky', top: 16 }}>
            <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12, padding: '12px 16px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 600 }}>
                <i className="fas fa-eye me-2" style={{ color: selectedMeta?.accent }} />Live Preview — {selectedMeta?.name}
              </span>
              <button onClick={() => handleUse(selected)}
                style={{ background: `${selectedMeta?.accent}20`, border: `1px solid ${selectedMeta?.accent}60`, color: selectedMeta?.accent, borderRadius: 8, padding: '4px 12px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                Use This →
              </button>
            </div>
            <div style={{ background: '#0F172A', borderRadius: 12, padding: '20px', overflow: 'hidden', border: '1px solid #334155' }}>
              <div style={{ transform: 'scale(0.62)', transformOrigin: 'top center', width: '161%', marginLeft: '-30.5%', marginBottom: '-38%', pointerEvents: 'none' }}>
                <div style={{ background: 'white', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', minHeight: 900 }}>
                  <SelectedTemplate resumeData={{ ...SAMPLE_DATA, templateId: selected }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  const { user } = useSelector((s) => s.auth);
  if (user) {
    return <DashboardLayout><TemplatesContent /></DashboardLayout>;
  }
  return (
    <MainLayout>
      <div style={{ paddingTop: 90, paddingBottom: 80 }}>
        <div className="container-fluid" style={{ maxWidth: 1400, padding: '0 24px' }}>
          <TemplatesContent />
        </div>
      </div>
    </MainLayout>
  );
}

// Need useSelector in the outer component too
import { useSelector } from 'react-redux';
