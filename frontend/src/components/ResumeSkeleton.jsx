/**
 * Skeleton loader matching the resume preview layout.
 * Shows shimmer animation while resume data is loading.
 */
const Bone = ({ w = '100%', h = 14, mb = 8, radius = 4 }) => (
  <div className="skeleton" style={{ width: w, height: h, marginBottom: mb, borderRadius: radius }} />
);

export default function ResumeSkeleton() {
  return (
    <div style={{ background: 'white', borderRadius: 4, padding: '40px 48px', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ borderBottom: '3px solid #e5e7eb', paddingBottom: 16, marginBottom: 20 }}>
        <Bone w="55%" h={28} mb={10} radius={6} />
        <div style={{ display: 'flex', gap: 16 }}>
          <Bone w="22%" h={12} mb={0} />
          <Bone w="18%" h={12} mb={0} />
          <Bone w="16%" h={12} mb={0} />
        </div>
      </div>

      {/* Summary */}
      <Section>
        <Bone w="30%" h={13} mb={10} />
        <Bone h={11} mb={6} />
        <Bone h={11} mb={6} />
        <Bone w="75%" h={11} mb={0} />
      </Section>

      {/* Experience */}
      <Section>
        <Bone w="35%" h={13} mb={12} />
        {[1, 2].map(i => (
          <div key={i} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <Bone w="40%" h={13} mb={0} />
              <Bone w="18%" h={11} mb={0} />
            </div>
            <Bone w="28%" h={11} mb={6} />
            <Bone h={10} mb={4} />
            <Bone w="85%" h={10} mb={0} />
          </div>
        ))}
      </Section>

      {/* Skills */}
      <Section>
        <Bone w="20%" h={13} mb={12} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[80, 70, 90, 65, 75, 60, 85].map((w, i) => (
            <Bone key={i} w={w} h={24} mb={0} radius={12} />
          ))}
        </div>
      </Section>

      {/* Education */}
      <Section>
        <Bone w="25%" h={13} mb={12} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ flex: 1 }}>
            <Bone w="55%" h={13} mb={6} />
            <Bone w="40%" h={11} mb={0} />
          </div>
          <Bone w="15%" h={11} mb={0} />
        </div>
      </Section>
    </div>
  );
}

function Section({ children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div className="skeleton" style={{ width: '25%', height: 13, borderRadius: 4 }} />
        <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
      </div>
      {children}
    </div>
  );
}
