// Minimal — single column, ATS-friendly, clean whitespace
const accent = '#1E293B';

function Divider() {
  return <div style={{ height: 1, background: '#CBD5E1', margin: '14px 0' }} />;
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: accent, marginBottom: 10, paddingBottom: 4, borderBottom: `2px solid ${accent}` }}>
      {children}
    </div>
  );
}

export default function TemplateMinimal({ resumeData }) {
  const { personalInfo: p, skills, experience, education, projects } = resumeData;

  return (
    <div style={{ fontFamily: 'Georgia, serif', color: '#1a1a1a', padding: '48px 52px', fontSize: 13, lineHeight: 1.6, background: 'white', minHeight: 960 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0F172A', marginBottom: 6, letterSpacing: -0.5 }}>{p.fullName || 'Your Name'}</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 20px', color: '#475569', fontSize: 12 }}>
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
          {p.website && <span>{p.website}</span>}
        </div>
      </div>

      <Divider />

      {p.summary && (
        <>
          <SectionTitle>Summary</SectionTitle>
          <p style={{ color: '#334155', marginBottom: 0, lineHeight: 1.7 }}>{p.summary}</p>
          <Divider />
        </>
      )}

      {experience.length > 0 && (
        <>
          <SectionTitle>Experience</SectionTitle>
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{exp.position}</span>
                  {exp.company && <span style={{ color: '#475569' }}> · {exp.company}</span>}
                </div>
                <span style={{ color: '#64748B', fontSize: 11, flexShrink: 0 }}>
                  {exp.startDate}{exp.startDate ? (exp.current ? ' – Present' : exp.endDate ? ` – ${exp.endDate}` : '') : ''}
                </span>
              </div>
              {exp.description && <div style={{ color: '#475569', fontSize: 12, marginTop: 4, whiteSpace: 'pre-line' }}>{exp.description}</div>}
            </div>
          ))}
          <Divider />
        </>
      )}

      {education.length > 0 && (
        <>
          <SectionTitle>Education</SectionTitle>
          {education.map((edu, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <span style={{ fontWeight: 700 }}>{edu.institution}</span>
                <div style={{ color: '#475569', fontSize: 12 }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</div>
              </div>
              <span style={{ color: '#64748B', fontSize: 11, flexShrink: 0 }}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}</span>
            </div>
          ))}
          <Divider />
        </>
      )}

      {skills.length > 0 && (
        <>
          <SectionTitle>Skills</SectionTitle>
          <p style={{ color: '#334155', marginBottom: 0 }}>{skills.join(' · ')}</p>
          <Divider />
        </>
      )}

      {projects.length > 0 && (
        <>
          <SectionTitle>Projects</SectionTitle>
          {projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700 }}>{proj.name}</span>
                {proj.link && <span style={{ color: '#64748B', fontSize: 11 }}>{proj.link}</span>}
              </div>
              {proj.technologies && <div style={{ color: '#64748B', fontSize: 11, marginTop: 2 }}>{proj.technologies}</div>}
              {proj.description && <div style={{ color: '#475569', fontSize: 12, marginTop: 3 }}>{proj.description}</div>}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
