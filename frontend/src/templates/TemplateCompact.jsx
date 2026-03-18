// Compact — dense one-page layout, maximum content density
const ACCENT = '#0F766E';

function Row({ label, value }) {
  if (!value) return null;
  return <span style={{ marginRight: 16, color: '#475569', fontSize: 11 }}><span style={{ color: ACCENT, fontWeight: 600 }}>{label}:</span> {value}</span>;
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, color: 'white', background: ACCENT, padding: '3px 10px', marginBottom: 8, display: 'inline-block', borderRadius: 2 }}>
      {children}
    </div>
  );
}

export default function TemplateCompact({ resumeData }) {
  const { personalInfo: p, skills, experience, education, projects } = resumeData;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: 'white', minHeight: 960, fontSize: 12, padding: '32px 40px', lineHeight: 1.5 }}>
      {/* Header */}
      <div style={{ borderBottom: `3px solid ${ACCENT}`, paddingBottom: 10, marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', marginBottom: 2, letterSpacing: -0.5 }}>{p.fullName || 'Your Name'}</h1>
            <div style={{ color: ACCENT, fontWeight: 600, fontSize: 12 }}>{experience[0]?.position || ''}</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 11, color: '#475569' }}>
            {p.email && <div>{p.email}</div>}
            {p.phone && <div>{p.phone}</div>}
            {p.location && <div>{p.location}</div>}
          </div>
        </div>
        {(p.linkedin || p.website) && (
          <div style={{ marginTop: 4, fontSize: 11, color: ACCENT }}>
            {p.linkedin && <span style={{ marginRight: 16 }}>{p.linkedin}</span>}
            {p.website && <span>{p.website}</span>}
          </div>
        )}
      </div>

      {p.summary && (
        <div style={{ marginBottom: 14 }}>
          <SectionTitle>Summary</SectionTitle>
          <p style={{ color: '#334155', marginBottom: 0, fontSize: 12, lineHeight: 1.6 }}>{p.summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <SectionTitle>Experience</SectionTitle>
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{exp.position}</span>
                <span style={{ color: '#64748B', fontSize: 11 }}>{exp.startDate}{exp.current ? ' – Present' : exp.endDate ? ` – ${exp.endDate}` : ''}</span>
              </div>
              <div style={{ color: ACCENT, fontWeight: 600, fontSize: 11 }}>{exp.company}</div>
              {exp.description && <div style={{ color: '#475569', fontSize: 11, marginTop: 3, whiteSpace: 'pre-line' }}>{exp.description}</div>}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          {education.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <SectionTitle>Education</SectionTitle>
              {education.map((edu, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 12 }}>{edu.institution}</div>
                  <div style={{ color: '#475569', fontSize: 11 }}>{edu.degree}{edu.field ? ` · ${edu.field}` : ''}</div>
                  <div style={{ color: '#64748B', fontSize: 10 }}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</div>
                </div>
              ))}
            </div>
          )}

          {skills.length > 0 && (
            <div>
              <SectionTitle>Skills</SectionTitle>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {skills.map((s, i) => (
                  <span key={i} style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}30`, color: ACCENT, padding: '1px 8px', borderRadius: 3, fontSize: 10, fontWeight: 600 }}>{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          {projects.length > 0 && (
            <div>
              <SectionTitle>Projects</SectionTitle>
              {projects.map((proj, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 12 }}>{proj.name}{proj.link ? <span style={{ color: ACCENT, fontWeight: 400, fontSize: 10, marginLeft: 6 }}>{proj.link}</span> : null}</div>
                  {proj.technologies && <div style={{ color: ACCENT, fontSize: 10, fontWeight: 600 }}>{proj.technologies}</div>}
                  {proj.description && <div style={{ color: '#475569', fontSize: 11, marginTop: 2 }}>{proj.description}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
