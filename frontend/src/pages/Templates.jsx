import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createResume } from '../store/resumeSlice';
import MainLayout from '../layouts/MainLayout';
import { TEMPLATE_META } from '../templates/index';
import templates from '../templates/index';
import toast from 'react-hot-toast';

const SAMPLE_DATA = {
  title: 'Sample Resume',
  templateId: 'modern',
  personalInfo: {
    fullName: 'Alex Johnson', email: 'alex@example.com', phone: '+1 555 0100',
    location: 'San Francisco, CA', linkedin: 'linkedin.com/in/alex', website: 'alexjohnson.dev',
    summary: 'Experienced software engineer with 5+ years building scalable web applications. Passionate about clean code and great user experiences.',
  },
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'MongoDB'],
  experience: [
    { company: 'Google', position: 'Senior Software Engineer', startDate: 'Jan 2021', endDate: '', current: true, description: '• Led development of core search features\n• Improved performance by 40%\n• Mentored 3 junior engineers' },
    { company: 'Startup Inc', position: 'Full Stack Developer', startDate: 'Mar 2019', endDate: 'Dec 2020', current: false, description: '• Built REST APIs serving 100k+ users\n• Reduced load time by 60%' },
  ],
  education: [{ institution: 'MIT', degree: "Bachelor's", field: 'Computer Science', startDate: '2015', endDate: '2019', gpa: '3.9' }],
  projects: [
    { name: 'CVPilot', description: 'AI-powered resume builder SaaS platform', technologies: 'React, Node.js, OpenAI', link: 'github.com/alex/cvpilot' },
    { name: 'DataViz', description: 'Real-time analytics dashboard', technologies: 'D3.js, Python, FastAPI', link: 'github.com/alex/dataviz' },
  ],
};

export default function Templates() {
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
    <MainLayout>
      <div style={{ paddingTop: 90, paddingBottom: 80, minHeight: '100vh' }}>
        <div className="container-fluid" style={{ maxWidth: 1400, padding: '0 24px' }}>
          <div className="text-center mb-5">
            <span style={{ color: '#818CF8', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: 2 }}>Templates</span>
            <h1 style={{ color: '#E2E8F0', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginTop: 8 }}>Choose Your Template</h1>
            <p style={{ color: '#64748B', maxWidth: 520, margin: '12px auto 0' }}>
              5 professionally designed templates — all free. Click any to preview, then use it instantly.
            </p>
          </div>

          <div className="row g-4">
            {/* Left: Template cards */}
            <div className="col-lg-4">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {Object.values(TEMPLATE_META).map((meta) => {
                  const isSelected = selected === meta.id;
                  return (
                    <div
                      key={meta.id}
                      onClick={() => setSelected(meta.id)}
                      style={{
                        background: isSelected ? `${meta.accent}12` : '#1E293B',
                        border: isSelected ? `2px solid ${meta.accent}` : '1px solid #334155',
                        borderRadius: 14, padding: '14px 16px', cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: isSelected ? `0 0 20px ${meta.accent}25` : '',
                      }}
                      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.borderColor = meta.accent; }}
                      onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.borderColor = '#334155'; }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${meta.accent}, ${meta.accent}99)`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                          {meta.id === 'minimal' ? '◻' : meta.id === 'modern' ? '▣' : meta.id === 'creative' ? '◈' : meta.id === 'compact' ? '▤' : '⌨'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="d-flex align-items-center gap-2">
                            <span style={{ color: '#E2E8F0', fontWeight: 700, fontSize: '0.9rem' }}>{meta.name}</span>
                            {isSelected && <i className="fas fa-check-circle" style={{ color: meta.accent, fontSize: 13 }}></i>}
                          </div>
                          <div style={{ color: '#64748B', fontSize: '0.75rem', marginTop: 2 }}>{meta.description}</div>
                          <span style={{ background: `${meta.accent}20`, color: meta.accent, fontSize: '0.65rem', fontWeight: 700, padding: '1px 7px', borderRadius: 4, marginTop: 4, display: 'inline-block' }}>{meta.tag}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: 20 }}>
                <button
                  className="btn btn-primary w-100"
                  style={{ padding: '13px', fontSize: '1rem', borderRadius: 12 }}
                  onClick={() => handleUse(selected)}
                >
                  <i className="fas fa-rocket me-2"></i>Use {selectedMeta?.name} Template
                </button>
                <p style={{ color: '#475569', fontSize: '0.78rem', textAlign: 'center', marginTop: 8, marginBottom: 0 }}>
                  <i className="fas fa-check-circle me-1" style={{ color: '#10B981' }}></i>All templates are free
                </p>
              </div>
            </div>

            {/* Right: Live preview */}
            <div className="col-lg-8">
              <div style={{ position: 'sticky', top: 100 }}>
                <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 16, padding: '16px', marginBottom: 12 }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: selectedMeta?.accent }}></div>
                      <span style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 600 }}>Live Preview — {selectedMeta?.name}</span>
                    </div>
                    <button
                      onClick={() => handleUse(selected)}
                      style={{ background: `${selectedMeta?.accent}20`, border: `1px solid ${selectedMeta?.accent}60`, color: selectedMeta?.accent, borderRadius: 8, padding: '5px 14px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                    >
                      Use This →
                    </button>
                  </div>
                </div>

                <div style={{ background: '#0F172A', borderRadius: 16, padding: '24px', overflow: 'hidden', border: '1px solid #334155' }}>
                  <div style={{ transform: 'scale(0.65)', transformOrigin: 'top center', width: '154%', marginLeft: '-27%', marginBottom: '-35%', pointerEvents: 'none' }}>
                    <div style={{ background: 'white', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', minHeight: 960 }}>
                      <SelectedTemplate resumeData={{ ...SAMPLE_DATA, templateId: selected }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
