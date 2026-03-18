// Modern — two-column layout with colored sidebar
const ACCENT = '#4F46E5';
const SIDEBAR_BG = '#1E293B';

function SideSection({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#94A3B8', marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid #334155' }}>{title}</div>
      {children}
    </div>
  );
}

function MainSection({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: ACCENT }}>{title}</span>
        <div style={{ flex: 1, height: 1, background: `${ACCENT}30` }} />
      </div>
      {children}
    </div>
  );
}

export default function TemplateModern({ resumeData }) {
  const { personalInfo: p, skills, experience, education, projects } = resumeData;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', display: 'flex', minHeight: 960, background: 'white', fontSize: 13 }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: SIDEBAR_BG, padding: '36px 20px', flexShrink: 0 }}>
        {/* Avatar */}
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg, ${ACCENT}, #7C3AED)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 16 }}>
          {p.fullName?.charAt(0) || '?'}
        </div>
        <div style={{ color: '#E2E8F0', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{p.fullName || 'Your Name'}</div>
        <div style={{ color: '#64748B', fontSize: 11, marginBottom: 24 }}>{experience[0]?.position || 'Professional'}</div>

        <SideSection title="Contact">
          {p.email && <div style={{ color: '#94A3B8', fontSize: 11, marginBottom: 6, wordBreak: 'break-all' }}>{p.email}</div>}
          {p.phone && <div style={{ color: '#94A3B8', fontSize: 11, marginBottom: 6 }}>{p.phone}</div>}
          {p.location && <div style={{ color: '#94A3B8', fontSize: 11, marginBottom: 6 }}>{p.location}</div>}
          {p.linkedin && <div style={{ color: '#818CF8', fontSize: 11, marginBottom: 6, wordBreak: 'break-all' }}>{p.linkedin}</div>}
          {p.website && <div style={{ color: '#818CF8', fontSize: 11, wordBreak: 'break-all' }}>{p.website}</div>}
        </SideSection>

        {skills.length > 0 && (
          <SideSection title="Skills">
            {skills.map((s, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ color: '#CBD5E1', fontSize: 11, marginBottom: 3 }}>{s}</div>
                <div style={{ height: 3, background: '#334155', borderRadius: 2 }}>
                  <div style={{ height: '100%', width: `${70 + (i % 3) * 10}%`, background: `linear-gradient(90deg, ${ACCENT}, #7C3AED)`, borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </SideSection>
        )}

        {education.length > 0 && (
          <SideSection title="Education">
            {education.map((edu, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ color: '#E2E8F0', fontSize: 11, fontWeight: 600 }}>{edu.institution}</div>
                <div style={{ color: '#64748B', fontSize: 10 }}>{edu.degree}{edu.field ? ` · ${edu.field}` : ''}</div>
                <div style={{ color: '#475569', fontSize: 10 }}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}</div>
              </div>
            ))}
          </SideSection>
        )}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '36px 32px' }}>
        {p.summary && (
          <MainSection title="About Me">
            <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: 0 }}>{p.summary}</p>
          </MainSection>
        )}

        {experience.length > 0 && (
          <MainSection title="Experience">
            {experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: 16, paddingLeft: 12, borderLeft: `3px solid ${ACCENT}20` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{exp.position}</div>
                    <div style={{ color: ACCENT, fontSize: 12, fontWeight: 600 }}>{exp.company}</div>
                  </div>
                  <span style={{ background: `${ACCENT}15`, color: ACCENT, fontSize: 10, padding: '2px 8px', borderRadius: 10, flexShrink: 0, fontWeight: 600 }}>
                    {exp.startDate}{exp.current ? ' – Now' : exp.endDate ? ` – ${exp.endDate}` : ''}
                  </span>
                </div>
                {exp.description && <div style={{ color: '#475569', fontSize: 12, marginTop: 6, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{exp.description}</div>}
              </div>
            ))}
          </MainSection>
        )}

        {projects.length > 0 && (
          <MainSection title="Projects">
            {projects.map((proj, i) => (
              <div key={i} style={{ marginBottom: 14, padding: '10px 12px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{proj.name}</span>
                  {proj.link && <span style={{ color: ACCENT, fontSize: 11 }}>{proj.link}</span>}
                </div>
                {proj.technologies && <div style={{ color: ACCENT, fontSize: 11, fontWeight: 600, marginTop: 3 }}>{proj.technologies}</div>}
                {proj.description && <div style={{ color: '#475569', fontSize: 12, marginTop: 4 }}>{proj.description}</div>}
              </div>
            ))}
          </MainSection>
        )}
      </div>
    </div>
  );
}
