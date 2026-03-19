import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createResume } from '../store/resumeSlice';
import DashboardLayout from '../layouts/DashboardMainV2';
import LoginModal from '../components/LoginModal';
import SpinnerButton from '../components/SpinnerButton';
import toast from 'react-hot-toast';

const empty = {
  fullName: '', email: '', phone: '', location: '', linkedin: '', website: '', summary: '',
};

export default function LinkedInImport() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [tab, setTab] = useState('manual'); // 'manual' | 'pdf'
  const [form, setForm] = useState(empty);
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState([{ company: '', position: '', startDate: '', endDate: '', description: '' }]);
  const [education, setEducation] = useState([{ institution: '', degree: '', field: '', startDate: '', endDate: '' }]);
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const updateExp = (i, k, v) => setExperience(p => p.map((e, idx) => idx === i ? { ...e, [k]: v } : e));
  const updateEdu = (i, k, v) => setEducation(p => p.map((e, idx) => idx === i ? { ...e, [k]: v } : e));

  const handleImport = async () => {
    if (!user) { setShowLogin(true); return; }
    if (!form.fullName.trim()) { toast.error('Full name is required'); return; }
    setLoading(true);
    try {
      const resumeData = {
        title: `${form.fullName}'s Resume`,
        templateId: 'modern',
        personalInfo: form,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        experience: experience.filter(e => e.company || e.position),
        education: education.filter(e => e.institution),
        projects: [],
      };
      const result = await dispatch(createResume(resumeData));
      if (!result.error) {
        toast.success('Resume created from LinkedIn data!');
        navigate(`/builder/${result.payload.resume._id}`);
      }
    } catch {
      toast.error('Import failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { marginBottom: 12 };

  return (
    <DashboardLayout>
      <div style={{ padding: '24px 16px', maxWidth: 800, margin: '0 auto' }} className="dashboard-content fade-in">
        <div className="mb-4">
          <h1 style={{ color: '#E2E8F0', fontWeight: 800, fontSize: 'clamp(1.3rem,3vw,1.75rem)', marginBottom: 4 }}>
            <i className="fab fa-linkedin me-2" style={{ color: '#0A66C2' }} />LinkedIn Import
          </h1>
          <p style={{ color: '#64748B', marginBottom: 0 }}>Import your LinkedIn profile to auto-fill your resume</p>
        </div>

        {/* Tab toggle */}
        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #334155', marginBottom: 24 }}>
          {[['manual', 'fas fa-keyboard', 'Manual Entry'], ['pdf', 'fas fa-file-pdf', 'Upload PDF']].map(([t, icon, label]) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
                color: tab === t ? '#4F46E5' : '#64748B',
                borderBottom: tab === t ? '2px solid #4F46E5' : '2px solid transparent', transition: 'all 0.2s' }}>
              <i className={`${icon} me-2`} />{label}
            </button>
          ))}
        </div>

        {tab === 'pdf' && (
          <div className="card p-4 mb-4 text-center">
            <i className="fas fa-cloud-upload-alt" style={{ fontSize: 40, color: '#334155', marginBottom: 12 }} />
            <h6 style={{ color: '#E2E8F0', fontWeight: 700, marginBottom: 8 }}>Upload LinkedIn PDF Export</h6>
            <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: 16 }}>
              On LinkedIn: Me → Settings → Data Privacy → Get a copy of your data → Download PDF
            </p>
            <div style={{ background: 'rgba(79,70,229,0.08)', border: '1px dashed rgba(79,70,229,0.3)', borderRadius: 10, padding: 24 }}>
              <p style={{ color: '#475569', fontSize: '0.85rem', marginBottom: 0 }}>
                <i className="fas fa-info-circle me-2" style={{ color: '#818CF8' }} />
                PDF parsing coming soon — use Manual Entry for now
              </p>
            </div>
          </div>
        )}

        {tab === 'manual' && (
          <div>
            {/* Personal Info */}
            <div className="card p-4 mb-3">
              <h6 style={{ color: '#E2E8F0', fontWeight: 700, marginBottom: 16 }}>
                <i className="fas fa-user me-2" style={{ color: '#4F46E5' }} />Personal Information
              </h6>
              <div className="row g-2">
                <div className="col-md-6"><label className="form-label">Full Name *</label><input className="form-control" value={form.fullName} onChange={e => update('fullName', e.target.value)} placeholder="John Doe" /></div>
                <div className="col-md-6"><label className="form-label">Email</label><input type="email" className="form-control" value={form.email} onChange={e => update('email', e.target.value)} placeholder="john@example.com" /></div>
                <div className="col-md-6"><label className="form-label">Phone</label><input className="form-control" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+1 234 567 8900" /></div>
                <div className="col-md-6"><label className="form-label">Location</label><input className="form-control" value={form.location} onChange={e => update('location', e.target.value)} placeholder="New York, NY" /></div>
                <div className="col-md-6"><label className="form-label">LinkedIn URL</label><input className="form-control" value={form.linkedin} onChange={e => update('linkedin', e.target.value)} placeholder="linkedin.com/in/..." /></div>
                <div className="col-md-6"><label className="form-label">Website</label><input className="form-control" value={form.website} onChange={e => update('website', e.target.value)} placeholder="yoursite.com" /></div>
                <div className="col-12"><label className="form-label">Summary</label><textarea className="form-control" rows={3} value={form.summary} onChange={e => update('summary', e.target.value)} placeholder="Professional summary..." /></div>
              </div>
            </div>

            {/* Skills */}
            <div className="card p-4 mb-3">
              <h6 style={{ color: '#E2E8F0', fontWeight: 700, marginBottom: 12 }}>
                <i className="fas fa-code me-2" style={{ color: '#4F46E5' }} />Skills
              </h6>
              <input className="form-control" value={skills} onChange={e => setSkills(e.target.value)} placeholder="React, Node.js, Python, SQL (comma separated)" />
            </div>

            {/* Experience */}
            <div className="card p-4 mb-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 style={{ color: '#E2E8F0', fontWeight: 700, marginBottom: 0 }}>
                  <i className="fas fa-briefcase me-2" style={{ color: '#4F46E5' }} />Experience
                </h6>
                <button className="btn btn-sm btn-outline-primary" onClick={() => setExperience(p => [...p, { company: '', position: '', startDate: '', endDate: '', description: '' }])}>
                  <i className="fas fa-plus me-1" />Add
                </button>
              </div>
              {experience.map((exp, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: 16, marginBottom: 12 }}>
                  <div className="row g-2">
                    <div className="col-md-6"><input className="form-control form-control-sm" value={exp.company} onChange={e => updateExp(i, 'company', e.target.value)} placeholder="Company" /></div>
                    <div className="col-md-6"><input className="form-control form-control-sm" value={exp.position} onChange={e => updateExp(i, 'position', e.target.value)} placeholder="Position" /></div>
                    <div className="col-md-6"><input className="form-control form-control-sm" value={exp.startDate} onChange={e => updateExp(i, 'startDate', e.target.value)} placeholder="Start Date" /></div>
                    <div className="col-md-6"><input className="form-control form-control-sm" value={exp.endDate} onChange={e => updateExp(i, 'endDate', e.target.value)} placeholder="End Date / Present" /></div>
                    <div className="col-12"><textarea className="form-control form-control-sm" rows={2} value={exp.description} onChange={e => updateExp(i, 'description', e.target.value)} placeholder="Description..." /></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="card p-4 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 style={{ color: '#E2E8F0', fontWeight: 700, marginBottom: 0 }}>
                  <i className="fas fa-graduation-cap me-2" style={{ color: '#4F46E5' }} />Education
                </h6>
                <button className="btn btn-sm btn-outline-primary" onClick={() => setEducation(p => [...p, { institution: '', degree: '', field: '', startDate: '', endDate: '' }])}>
                  <i className="fas fa-plus me-1" />Add
                </button>
              </div>
              {education.map((edu, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: 16, marginBottom: 12 }}>
                  <div className="row g-2">
                    <div className="col-12"><input className="form-control form-control-sm" value={edu.institution} onChange={e => updateEdu(i, 'institution', e.target.value)} placeholder="Institution" /></div>
                    <div className="col-md-6"><input className="form-control form-control-sm" value={edu.degree} onChange={e => updateEdu(i, 'degree', e.target.value)} placeholder="Degree" /></div>
                    <div className="col-md-6"><input className="form-control form-control-sm" value={edu.field} onChange={e => updateEdu(i, 'field', e.target.value)} placeholder="Field of Study" /></div>
                    <div className="col-md-6"><input className="form-control form-control-sm" value={edu.startDate} onChange={e => updateEdu(i, 'startDate', e.target.value)} placeholder="Start Year" /></div>
                    <div className="col-md-6"><input className="form-control form-control-sm" value={edu.endDate} onChange={e => updateEdu(i, 'endDate', e.target.value)} placeholder="End Year" /></div>
                  </div>
                </div>
              ))}
            </div>

            <SpinnerButton text="Create Resume from LinkedIn Data" loading={loading} onClick={handleImport}
              icon="fab fa-linkedin" style={{ minWidth: 280 }} />
          </div>
        )}
      </div>
      <LoginModal show={showLogin} onClose={() => setShowLogin(false)} onSuccess={handleImport} />
    </DashboardLayout>
  );
}
