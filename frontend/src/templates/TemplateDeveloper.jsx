// Developer — skills + projects focused, terminal-inspired, tech-first
const ACCENT = '#0EA5E9';
const BG_DARK = '#0F172A';

function Tag({ children, color = ACCENT }) {
  return (
    <span style={{ background: `${color}15`, border: `1px solid ${color}40`, color, padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, fontFamily: 'monospace' }}>
      {children}
    </span>
  );
}

function Section({ title, icon, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ color: ACCENT, fontFamily: 'monospace', fontSize: 12 }}>{icon}</span>
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#94A3B8' }}>{title}</span>
        <div style={{ flex: 1, height: 1, background: '#1E293B' }} />
      </div>
      {children}
    </div>
  );
}

export default function TemplateDeveloper({ resumeData }) {
  const { personalInfo: p, skills, experience, education, projects } = resumeData;

  // Group skills into categories (simple split by comma groups of 4)
  const skillChunks = [];
  for (let i = 0; i < skills.length; i += 6) skillChunks.push(skills.slice(i, i + 6));

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: 'white', minHeight: 960, fontSize: 13 }}>
      {/* Header — dark terminal style */}
      <div style={{ background: BG_DARK, padding: '28px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ color: ACCENT, fontFamily: 'monospace', fontSize: 11, marginBottom: 4 }}>{'// developer resume'}</div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: 'white', marginBottom: 4, letterSpacing: -0.5 }}>{p.fullName || 'Your Name'}</h1>
            <div style={{ color: '#94A3B8', fontSize: 13 }}>{experience[0]?.position || 'Software Developer'}</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 11, color: '#64748B' }}>
            {p.email && <div style={{ marginBottom: 3, color: '#94A3B8' }}>{p.email}</div>}
            {p.phone && <div style={{ marginBottom: 3, color: '#94A3B8' }}>{p.phone}</div>}
            {p.location && <div style={{ marginBottom: 3, color: '#94A3B8' }}>{p.location}</div>}
            {p.linkedin && <div style={{ marginBottom: 3, color: ACCENT }}>{p.linkedin}</div>}
            {p.website && <div style={{ color: ACCENT }}>{p.website}</div>}
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 40px' }}>
        {/* Skills — prominent at top for devs */}
        {skills.length > 0 && (
          <Section title="Tech Stack" icon="</>">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {skills.map((s, i) => <Tag key={i}>{s}</Tag>)}
            </div>
          </Section>
        )}

        {/* Projects — second most important for devs */}
        {projects.length > 0 && (
          <Section title="Projects" icon="◈">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {projects.map((proj, i) => (
                <div key={i} style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px 14px', borderTop: `3px solid ${ACCENT}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{proj.name}</span>
                    {proj.link && <span style={{ color: ACCENT, fontSize: 10, fontFamily: 'monospace' }}>{proj.link}</span>}
                  </div>
                  {proj.technologies && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
                      {proj.technologies.split(',').map((t, j) => <Tag key={j}>{t.trim()}</Tag>)}
                    </div>
                  )}
                  {proj.description && <div style={{ color: '#475569', fontSize: 11, lineHeight: 1.5 }}>{proj.description}</div>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {p.summary && (
          <Section title="About" icon="///">
            <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: 0, fontFamily: 'monospace', fontSize: 12, background: '#F8FAFC', padding: '10px 14px', borderRadius: 6, borderLeft: `3px solid ${ACCENT}` }}>{p.summary}</p>
          </Section>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {experience.length > 0 && (
            <Section title="Experience" icon="$">
              {experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{exp.position}</div>
                  <div style={{ color: ACCENT, fontSize: 12, fontWeight: 600, fontFamily: 'monospace' }}>{exp.company}</div>
                  <div style={{ color: '#94A3B8', fontSize: 10, marginBottom: 4 }}>{exp.startDate}{exp.current ? ' → now' : exp.endDate ? ` → ${exp.endDate}` : ''}</div>
                  {exp.description && <div style={{ color: '#475569', fontSize: 11, lineHeight: 1.5, whiteSpace: 'pre-line' }}>{exp.description}</div>}
                </div>
              ))}
            </Section>
          )}

          {education.length > 0 && (
            <Section title="Education" icon="#">
              {education.map((edu, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{edu.institution}</div>
                  <div style={{ color: '#475569', fontSize: 12 }}>{edu.degree}{edu.field ? ` · ${edu.field}` : ''}</div>
                  <div style={{ color: '#94A3B8', fontSize: 11 }}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</div>
                </div>
              ))}
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}
