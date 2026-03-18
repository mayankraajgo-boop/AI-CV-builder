import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResume, updateResume, createResume } from '../store/resumeSlice';
import DashboardLayout from '../layouts/DashboardMain';
import { FormInput, FormTextarea, SectionHeader, ItemCard } from '../components/FormInputs';
import { exportToPDF } from '../utils/pdfExport';
import useAutoSave from '../hooks/useAutoSave';
import toast from 'react-hot-toast';

const TABS = ['Personal', 'Experience', 'Education', 'Skills', 'Projects'];
const TEMPLATES = {
  modern:   { accent: '#4F46E5', font: 'Inter' },
  classic:  { accent: '#1E40AF', font: 'Georgia' },
  minimal:  { accent: '#374151', font: 'Inter' },
  creative: { accent: '#7C3AED', font: 'Inter' },
};
const defaultResume = {
  title: 'Untitled Resume', templateId: 'modern',
  personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', website: '', summary: '' },
  skills: [], experience: [], education: [], projects: [],
};

export default function BuilderPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentResume, saving } = useSelector((s) => s.resume);
  const [activeTab,  setActiveTab]  = useState('Personal');
  const [resumeData, setResumeData] = useState(defaultResume);
  const [skillInput, setSkillInput] = useState('');
  const [exporting,  setExporting]  = useState(false);
  const [mobileView, setMobileView] = useState('edit');

  useEffect(() => {
    if (id) {
      dispatch(fetchResume(id));
    } else {
      dispatch(createResume({ title: 'Untitled Resume' })).then((res) => {
        if (!res.error) navigate('/builder/' + res.payload.resume._id, { replace: true });
      });
    }
  }, [id]);

  useEffect(() => {
    if (currentResume) {
      setResumeData({
        title: currentResume.title || 'Untitled Resume',
        templateId: currentResume.templateId || 'modern',
        personalInfo: { ...defaultResume.personalInfo, ...currentResume.personalInfo },
        skills: currentResume.skills || [],
        experience: currentResume.experience || [],
        education: currentResume.education || [],
        projects: currentResume.projects || [],
      });
    }
  }, [currentResume?._id]);

  useAutoSave(currentResume?._id, resumeData);

  const updatePersonal = (e) => {
    const { name, value } = e.target;
    setResumeData((p) => ({ ...p, personalInfo: { ...p.personalInfo, [name]: value } }));
  };
  const addSkill    = () => { if (!skillInput.trim()) return; setResumeData((p) => ({ ...p, skills: [...p.skills, skillInput.trim()] })); setSkillInput(''); };
  const removeSkill = (i) => setResumeData((p) => ({ ...p, skills: p.skills.filter((_, idx) => idx !== i) }));
  const addItem     = (field, empty) => setResumeData((p) => ({ ...p, [field]: [...p[field], empty()] }));
  const removeItem  = (field, i) => setResumeData((p) => ({ ...p, [field]: p[field].filter((_, idx) => idx !== i) }));
  const updateItem  = (field, i, key, val) =>
    setResumeData((p) => ({ ...p, [field]: p[field].map((item, idx) => idx === i ? { ...item, [key]: val } : item) }));

  const handleSave = () => {
    if (currentResume?._id) { dispatch(updateResume({ id: currentResume._id, data: resumeData })); toast.success('Saved!'); }
  };
  const handleExport = async () => {
    setExporting(true);
    try { await exportToPDF('resume-preview', resumeData.personalInfo?.fullName || 'resume'); toast.success('PDF downloaded!'); }
    catch (err) { toast.error(err.message || 'Export failed'); }
    finally { setExporting(false); }
  };

  const tpl = TEMPLATES[resumeData.templateId] || TEMPLATES.modern;

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }} className="builder-root">

        {/* Top bar */}
        <div style={{ background: '#1E293B', borderBottom: '1px solid #334155', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px 8px', borderRadius: 6, flexShrink: 0 }}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <input value={resumeData.title} onChange={(e) => setResumeData((p) => ({ ...p, title: e.target.value }))}
            style={{ background: 'transparent', border: 'none', color: '#E2E8F0', fontWeight: 700, fontSize: '0.95rem', outline: 'none', flex: 1, minWidth: 0 }} />
          <div className="d-flex align-items-center gap-2 flex-shrink-0">
            {saving && <span style={{ color: '#64748B', fontSize: '0.75rem' }} className="d-none d-md-inline"><i className="fas fa-circle-notch fa-spin me-1"></i>Saving...</span>}
            <select value={resumeData.templateId} onChange={(e) => setResumeData((p) => ({ ...p, templateId: e.target.value }))}
              className="form-select form-select-sm d-none d-md-block"
              style={{ width: 120, background: '#0F172A', color: '#E2E8F0', border: '1px solid #334155' }}>
              {Object.keys(TEMPLATES).map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
            <button onClick={handleSave} className="btn btn-sm btn-outline-primary d-none d-md-inline-flex">
              <i className="fas fa-save me-1"></i>Save
            </button>
            <button onClick={handleExport} className="btn btn-sm btn-primary" disabled={exporting}>
              {exporting ? <span className="spinner-border spinner-border-sm"></span>
                : <><i className="fas fa-download me-1 d-none d-md-inline"></i><span className="d-none d-md-inline">Export PDF</span><i className="fas fa-download d-md-none"></i></>}
            </button>
          </div>
        </div>

        {/* Mobile toggle */}
        <div className="d-md-none" style={{ background: '#1E293B', borderBottom: '1px solid #334155', display: 'flex', padding: '8px 16px', gap: 8 }}>
          {['edit', 'preview'].map((v) => (
            <button key={v} onClick={() => setMobileView(v)}
              style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s',
                background: mobileView === v ? '#4F46E5' : 'rgba(51,65,85,0.5)',
                color: mobileView === v ? 'white' : '#94A3B8' }}>
              <i className={'fas fa-' + (v === 'edit' ? 'edit' : 'eye') + ' me-2'}></i>
              {v === 'edit' ? 'Edit' : 'Preview'}
            </button>
          ))}
        </div>

        {/* Split layout */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

          {/* Form panel */}
          <div style={{ borderRight: '1px solid #334155', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}
            className={'builder-form-panel ' + (mobileView === 'preview' ? 'd-none d-md-flex' : 'd-flex')}>
            <div style={{ display: 'flex', borderBottom: '1px solid #334155', background: '#1E293B', flexShrink: 0, overflowX: 'auto' }}>
              {TABS.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ padding: '12px 14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap',
                    color: activeTab === tab ? '#4F46E5' : '#64748B',
                    borderBottom: activeTab === tab ? '2px solid #4F46E5' : '2px solid transparent', transition: 'all 0.2s' }}>
                  {tab}
                </button>
              ))}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 16, minHeight: 0 }}>
              <FormContent activeTab={activeTab} resumeData={resumeData} updatePersonal={updatePersonal}
                skillInput={skillInput} setSkillInput={setSkillInput} addSkill={addSkill} removeSkill={removeSkill}
                addItem={addItem} removeItem={removeItem} updateItem={updateItem} />
            </div>
          </div>

          {/* Preview panel */}
          <div style={{ flex: 1, background: '#0F172A', overflowY: 'auto', overflowX: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', padding: '16px', minHeight: 0 }}
            className={'builder-preview-panel ' + (mobileView === 'edit' ? 'd-none d-md-flex' : 'd-flex')}>
            <div id="resume-preview" style={{ width: '100%', maxWidth: 680, background: 'white', borderRadius: 4, boxShadow: '0 8px 40px rgba(0,0,0,0.5)', fontFamily: tpl.font, color: '#1a1a1a', flexShrink: 0, margin: '0 auto' }}>
              <ResumePreview data={resumeData} tpl={tpl} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function FormContent({ activeTab, resumeData, updatePersonal, skillInput, setSkillInput, addSkill, removeSkill, addItem, removeItem, updateItem }) {
  if (activeTab === 'Personal') return (
    <div>
      <FormInput label="Full Name" name="fullName" value={resumeData.personalInfo.fullName} onChange={updatePersonal} placeholder="John Doe" required />
      <div className="row g-2">
        <div className="col-6"><FormInput label="Email" name="email" type="email" value={resumeData.personalInfo.email} onChange={updatePersonal} placeholder="john@example.com" /></div>
        <div className="col-6"><FormInput label="Phone" name="phone" value={resumeData.personalInfo.phone} onChange={updatePersonal} placeholder="+1 234 567 8900" /></div>
      </div>
      <FormInput label="Location" name="location" value={resumeData.personalInfo.location} onChange={updatePersonal} placeholder="New York, NY" />
      <div className="row g-2">
        <div className="col-6"><FormInput label="LinkedIn" name="linkedin" value={resumeData.personalInfo.linkedin} onChange={updatePersonal} placeholder="linkedin.com/in/..." /></div>
        <div className="col-6"><FormInput label="Website" name="website" value={resumeData.personalInfo.website} onChange={updatePersonal} placeholder="yoursite.com" /></div>
      </div>
      <FormTextarea label="Professional Summary" name="summary" value={resumeData.personalInfo.summary} onChange={updatePersonal} placeholder="Write a compelling summary..." rows={4} />
    </div>
  );
  if (activeTab === 'Experience') return (
    <div>
      <SectionHeader title="Work Experience" icon="fas fa-briefcase"
        onAdd={() => addItem('experience', () => ({ company: '', position: '', startDate: '', endDate: '', current: false, description: '' }))} addLabel="Add Job" />
      {resumeData.experience.map((exp, i) => (
        <ItemCard key={i} title={'Position ' + (i + 1)} onRemove={() => removeItem('experience', i)}>
          <div className="row g-2">
            <div className="col-6"><FormInput label="Company" name="company" value={exp.company} onChange={(e) => updateItem('experience', i, 'company', e.target.value)} placeholder="Google" /></div>
            <div className="col-6"><FormInput label="Position" name="position" value={exp.position} onChange={(e) => updateItem('experience', i, 'position', e.target.value)} placeholder="Software Engineer" /></div>
          </div>
          <div className="row g-2">
            <div className="col-6"><FormInput label="Start Date" name="startDate" value={exp.startDate} onChange={(e) => updateItem('experience', i, 'startDate', e.target.value)} placeholder="Jan 2022" /></div>
            <div className="col-6">
              {!exp.current && <FormInput label="End Date" name="endDate" value={exp.endDate} onChange={(e) => updateItem('experience', i, 'endDate', e.target.value)} placeholder="Dec 2023" />}
              <div className="form-check mt-1">
                <input className="form-check-input" type="checkbox" checked={exp.current} onChange={(e) => updateItem('experience', i, 'current', e.target.checked)} id={'cur-' + i} />
                <label className="form-check-label" htmlFor={'cur-' + i} style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Current</label>
              </div>
            </div>
          </div>
          <FormTextarea label="Description" name="description" value={exp.description}
            onChange={(e) => updateItem('experience', i, 'description', e.target.value)} placeholder="Describe your role..." rows={3} />
        </ItemCard>
      ))}
      {resumeData.experience.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px 0', color: '#475569' }}>
          <i className="fas fa-briefcase" style={{ fontSize: 32, marginBottom: 12, display: 'block' }}></i>
          <p style={{ marginBottom: 0 }}>No experience added yet</p>
        </div>
      )}
    </div>
  );
  if (activeTab === 'Education') return (
    <div>
      <SectionHeader title="Education" icon="fas fa-graduation-cap"
        onAdd={() => addItem('education', () => ({ institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }))} addLabel="Add Education" />
      {resumeData.education.map((edu, i) => (
        <ItemCard key={i} title={'Education ' + (i + 1)} onRemove={() => removeItem('education', i)}>
          <FormInput label="Institution" name="institution" value={edu.institution} onChange={(e) => updateItem('education', i, 'institution', e.target.value)} placeholder="MIT" />
          <div className="row g-2">
            <div className="col-6"><FormInput label="Degree" name="degree" value={edu.degree} onChange={(e) => updateItem('education', i, 'degree', e.target.value)} placeholder="Bachelor's" /></div>
            <div className="col-6"><FormInput label="Field" name="field" value={edu.field} onChange={(e) => updateItem('education', i, 'field', e.target.value)} placeholder="Computer Science" /></div>
          </div>
          <div className="row g-2">
            <div className="col-4"><FormInput label="Start" name="startDate" value={edu.startDate} onChange={(e) => updateItem('education', i, 'startDate', e.target.value)} placeholder="2018" /></div>
            <div className="col-4"><FormInput label="End" name="endDate" value={edu.endDate} onChange={(e) => updateItem('education', i, 'endDate', e.target.value)} placeholder="2022" /></div>
            <div className="col-4"><FormInput label="GPA" name="gpa" value={edu.gpa} onChange={(e) => updateItem('education', i, 'gpa', e.target.value)} placeholder="3.8" /></div>
          </div>
        </ItemCard>
      ))}
    </div>
  );
  if (activeTab === 'Skills') return (
    <div>
      <SectionHeader title="Skills" icon="fas fa-code" />
      <div className="d-flex gap-2 mb-3">
        <input className="form-control" value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} placeholder="Type a skill and press Enter" />
        <button onClick={addSkill} className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>Add</button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {resumeData.skills.map((skill, i) => (
          <span key={i} style={{ background: 'rgba(79,70,229,0.15)', border: '1px solid rgba(79,70,229,0.3)', color: '#818CF8', padding: '4px 12px', borderRadius: 20, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            {skill}
            <button onClick={() => removeSkill(i)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: 0, lineHeight: 1, fontSize: 14 }}>x</button>
          </span>
        ))}
      </div>
      {resumeData.skills.length === 0 && <p style={{ color: '#475569', fontSize: '0.875rem', marginTop: 16 }}>Add skills like "React", "Python", "Project Management"</p>}
    </div>
  );
  if (activeTab === 'Projects') return (
    <div>
      <SectionHeader title="Projects" icon="fas fa-rocket"
        onAdd={() => addItem('projects', () => ({ name: '', description: '', technologies: '', link: '' }))} addLabel="Add Project" />
      {resumeData.projects.map((proj, i) => (
        <ItemCard key={i} title={'Project ' + (i + 1)} onRemove={() => removeItem('projects', i)}>
          <FormInput label="Project Name" name="name" value={proj.name} onChange={(e) => updateItem('projects', i, 'name', e.target.value)} placeholder="E-Commerce Platform" />
          <FormTextarea label="Description" name="description" value={proj.description}
            onChange={(e) => updateItem('projects', i, 'description', e.target.value)} placeholder="Built a full-stack..." rows={2} />
          <div className="row g-2">
            <div className="col-6"><FormInput label="Technologies" name="technologies" value={proj.technologies} onChange={(e) => updateItem('projects', i, 'technologies', e.target.value)} placeholder="React, Node.js" /></div>
            <div className="col-6"><FormInput label="Link" name="link" value={proj.link} onChange={(e) => updateItem('projects', i, 'link', e.target.value)} placeholder="github.com/..." /></div>
          </div>
        </ItemCard>
      ))}
    </div>
  );
  return null;
}

function ResumePreview({ data, tpl }) {
  const { personalInfo: p, skills, experience, education, projects } = data;
  const a = tpl.accent;
  return (
    <div style={{ padding: '40px 48px', fontSize: 13, lineHeight: 1.5 }}>
      <div style={{ borderBottom: '3px solid ' + a, paddingBottom: 16, marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>{p.fullName || 'Your Name'}</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', color: '#555', fontSize: 12 }}>
          {p.email    && <span><span style={{ color: a }}>Email: </span>{p.email}</span>}
          {p.phone    && <span><span style={{ color: a }}>Phone: </span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
          {p.website  && <span>{p.website}</span>}
        </div>
      </div>
      {p.summary && <RS title="Professional Summary" a={a}><p style={{ color: '#333', marginBottom: 0, lineHeight: 1.6 }}>{p.summary}</p></RS>}
      {experience.length > 0 && (
        <RS title="Work Experience" a={a}>
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: i < experience.length - 1 ? 14 : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#1a1a1a', fontSize: 14 }}>{exp.position || 'Position'}</div>
                  <div style={{ color: a, fontWeight: 600, fontSize: 12 }}>{exp.company}</div>
                </div>
                <div style={{ color: '#777', fontSize: 11, flexShrink: 0 }}>
                  {exp.startDate}{exp.startDate && (exp.current ? ' - Present' : exp.endDate ? ' - ' + exp.endDate : '')}
                </div>
              </div>
              {exp.description && <div style={{ marginTop: 6, color: '#444', fontSize: 12, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{exp.description}</div>}
            </div>
          ))}
        </RS>
      )}
      {education.length > 0 && (
        <RS title="Education" a={a}>
          {education.map((edu, i) => (
            <div key={i} style={{ marginBottom: i < education.length - 1 ? 12 : 0, display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#1a1a1a', fontSize: 13 }}>{edu.institution}</div>
                <div style={{ color: '#555', fontSize: 12 }}>{edu.degree}{edu.field ? ' in ' + edu.field : ''}{edu.gpa ? ' - GPA: ' + edu.gpa : ''}</div>
              </div>
              <div style={{ color: '#777', fontSize: 11, flexShrink: 0 }}>{edu.startDate}{edu.startDate && edu.endDate ? ' - ' + edu.endDate : ''}</div>
            </div>
          ))}
        </RS>
      )}
      {skills.length > 0 && (
        <RS title="Skills" a={a}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 8px' }}>
            {skills.map((s, i) => (
              <span key={i} style={{ background: a + '15', border: '1px solid ' + a + '40', color: a, padding: '2px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>{s}</span>
            ))}
          </div>
        </RS>
      )}
      {projects.length > 0 && (
        <RS title="Projects" a={a}>
          {projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: i < projects.length - 1 ? 12 : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 700, color: '#1a1a1a', fontSize: 13 }}>{proj.name}</div>
                {proj.link && <a href={proj.link} style={{ color: a, fontSize: 11 }}>{proj.link}</a>}
              </div>
              {proj.technologies && <div style={{ color: a, fontSize: 11, fontWeight: 600, marginTop: 2 }}>{proj.technologies}</div>}
              {proj.description && <div style={{ color: '#444', fontSize: 12, marginTop: 4, lineHeight: 1.6 }}>{proj.description}</div>}
            </div>
          ))}
        </RS>
      )}
    </div>
  );
}

function RS({ title, a, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: a, margin: 0 }}>{title}</h2>
        <div style={{ flex: 1, height: 1, background: a + '40' }}></div>
      </div>
      {children}
    </div>
  );
}
