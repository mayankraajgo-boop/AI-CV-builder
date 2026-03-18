// Creative — bold header gradient, color accents, modern typography
const ACCENT = '#7C3AED';
const ACCENT2 = '#4F46E5';

function Section({ title, icon, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ width: 28, height: 28, background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'white', flexShrink: 0 }}>
          {icon}
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: '#0F172A' }}>{title}</span>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${ACCENT}40, transparent)` }} />
      </div>
      {children}
    </div>
  );
}

export default function TemplateCreative({ resumeData }) {
  const { personalInfo: p, skills, experience, education, projects } = resumeData;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: 'white', minHeight: 960, fontSize: 13 }}>
      {/* Hero header */}
      <div style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`, padding: '36px 48px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -20, right: 80, width: 80, height: 80, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
        <h1 style={{ fontSize: 30, fontWeight: 800, color: 'white', marginBottom: 6, letterSpacing: -0.5 }}>{p.fullName || 'Your Name'}</h1>
        <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, marginBottom: 14 }}>{experience[0]?.position || 'Professional'}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 20px', color: 'rgba(255,255,255,0.85)', fontSize: 11 }}>
          {p.email && <span>✉ {p.email}</span>}
          {p.phone && <span>✆ {p.phone}</span>}
          {p.location && <span>⌖ {p.location}</span>}
          {p.linkedin && <span>in {p.linkedin}</span>}
          {p.website && <span>⊕ {p.website}</span>}
        </div>
      </div>

      <div style={{ padding: '28px 48px' }}>
        {p.summary && (
          <Section title="Profile" icon="✦">
            <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: 0, borderLeft: `3px solid ${ACCENT}`, paddingLeft: 12 }}>{p.summary}</p>
          </Section>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            {experience.length > 0 && (
              <Section title="Experience" icon="◈">
                {experience.map((exp, i) => (
                  <div key={i} style={{ marginBottom: 14, position: 'relative', paddingLeft: 14 }}>
                    <div style={{ position: 'absolute', left: 0, top: 5, width: 6, height: 6, borderRadius: '50%', background: ACCENT }} />
                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{exp.position}</div>
                    <div style={{ color: ACCENT, fontSize: 12, fontWeight: 600 }}>{exp.company}</div>
                    <div style={{ color: '#94A3B8', fontSize: 11 }}>{exp.startDate}{exp.current ? ' – Present' : exp.endDate ? ` – ${exp.endDate}` : ''}</div>
                    {exp.description && <div style={{ color: '#475569', fontSize: 12, marginTop: 4, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{exp.description}</div>}
                  </div>
                ))}
              </Section>
            )}

            {education.length > 0 && (
              <Section title="Education" icon="◉">
                {education.map((edu, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ fontWeight: 700, color: '#0F172A' }}>{edu.institution}</div>
                    <div style={{ color: '#475569', fontSize: 12 }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                    <div style={{ color: '#94A3B8', fontSize: 11 }}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</div>
                  </div>
                ))}
              </Section>
            )}
          </div>

          <div>
            {skills.length > 0 && (
              <Section title="Skills" icon="◆">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {skills.map((s, i) => (
                    <span key={i} style={{ background: `linear-gradient(135deg, ${ACCENT}15, ${ACCENT2}15)`, border: `1px solid ${ACCENT}30`, color: ACCENT, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{s}</span>
                  ))}
                </div>
              </Section>
            )}

            {projects.length > 0 && (
              <Section title="Projects" icon="◇">
                {projects.map((proj, i) => (
                  <div key={i} style={{ marginBottom: 12, padding: '10px', background: `linear-gradient(135deg, ${ACCENT}08, ${ACCENT2}08)`, borderRadius: 8, border: `1px solid ${ACCENT}20` }}>
                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 12 }}>{proj.name}</div>
                    {proj.technologies && <div style={{ color: ACCENT, fontSize: 10, fontWeight: 600, marginTop: 2 }}>{proj.technologies}</div>}
                    {proj.description && <div style={{ color: '#475569', fontSize: 11, marginTop: 3, lineHeight: 1.5 }}>{proj.description}</div>}
                    {proj.link && <div style={{ color: ACCENT2, fontSize: 10, marginTop: 3 }}>{proj.link}</div>}
                  </div>
                ))}
              </Section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
