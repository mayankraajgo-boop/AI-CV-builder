import { useState } from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from '../layouts/DashboardMainV2';
import LoginModal from '../components/LoginModal';
import SpinnerButton from '../components/SpinnerButton';
import toast from 'react-hot-toast';
import api from '../services/apiService';

// Keyword extractor (client-side fallback)
function extractKeywords(text) {
  const stopWords = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','from','is','are','was','were','be','been','have','has','had','do','does','did','will','would','could','should','may','might','shall','can','need','must','that','this','these','those','it','its','we','you','your','our','their','they','he','she','i','my','me','us','them','who','which','what','when','where','how','why','not','no','yes','as','if','so','than','then','also','just','more','most','some','any','all','each','every','both','few','many','much','other','such','same','own','about','above','after','before','between','into','through','during','including','until','against','among','throughout','despite','towards','upon','concerning','of','to','in','for','on','with','at','by','from','up','about','into','through','during','before','after','above','below','between','out','off','over','under','again','further','once']);
  return [...new Set(
    text.toLowerCase()
      .replace(/[^a-z0-9\s+#]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w))
  )];
}

function scoreMatch(resumeText, jdText) {
  const jdKeywords = extractKeywords(jdText);
  const resumeLower = resumeText.toLowerCase();
  const matched = jdKeywords.filter(k => resumeLower.includes(k));
  const missing = jdKeywords.filter(k => !resumeLower.includes(k)).slice(0, 20);
  const score = jdKeywords.length ? Math.round((matched.length / jdKeywords.length) * 100) : 0;
  return { score: Math.min(score, 100), matched: matched.slice(0, 20), missing };
}

function ScoreRing({ score }) {
  const color = score >= 75 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444';
  const label = score >= 75 ? 'Excellent' : score >= 50 ? 'Good' : 'Needs Work';
  const r = 54, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width={130} height={130} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={65} cy={65} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={10} />
        <circle cx={65} cy={65} r={r} fill="none" stroke={color} strokeWidth={10}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease' }} />
      </svg>
      <div style={{ marginTop: -100, textAlign: 'center', zIndex: 1, position: 'relative' }}>
        <div style={{ fontSize: '2rem', fontWeight: 800, color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>/ 100</div>
      </div>
      <div style={{ marginTop: 48, color, fontWeight: 700, fontSize: '0.9rem' }}>{label}</div>
    </div>
  );
}

export default function ATSAnalyzer() {
  const { user } = useSelector((s) => s.auth);
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleAnalyze = async () => {
    if (!user) { setShowLogin(true); return; }
    if (!resumeText.trim() || !jdText.trim()) {
      toast.error('Please fill in both fields'); return;
    }
    setLoading(true);
    try {
      // Client-side scoring
      const { score, matched, missing } = scoreMatch(resumeText, jdText);
      // Try AI suggestions from backend
      let suggestions = [];
      try {
        const res = await api.post('/ai/ats-score', { resumeText, jobDescription: jdText });
        suggestions = res.data.suggestions || [];
      } catch {
        suggestions = missing.slice(0, 5).map(k => `Consider adding "${k}" to your resume`);
      }
      setResult({ score, matched, missing, suggestions });
      toast.success('Analysis complete!');
    } catch (err) {
      toast.error('Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ padding: '24px 16px', maxWidth: 900, margin: '0 auto' }} className="dashboard-content fade-in">
        <div className="mb-4">
          <h1 style={{ color: '#E2E8F0', fontWeight: 800, fontSize: 'clamp(1.3rem,3vw,1.75rem)', marginBottom: 4 }}>
            <i className="fas fa-chart-bar me-2" style={{ color: '#4F46E5' }} />ATS Score Analyzer
          </h1>
          <p style={{ color: '#64748B', marginBottom: 0 }}>Check how well your resume matches a job description</p>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label">Your Resume Text</label>
            <textarea className="form-control" rows={10} placeholder="Paste your resume content here..."
              value={resumeText} onChange={(e) => setResumeText(e.target.value)}
              style={{ resize: 'vertical', fontSize: '0.85rem' }} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Job Description</label>
            <textarea className="form-control" rows={10} placeholder="Paste the job description here..."
              value={jdText} onChange={(e) => setJdText(e.target.value)}
              style={{ resize: 'vertical', fontSize: '0.85rem' }} />
          </div>
        </div>

        <SpinnerButton text="Analyze ATS Score" loading={loading} onClick={handleAnalyze}
          icon="fas fa-search" style={{ minWidth: 200 }} />

        {result && (
          <div className="mt-4 fade-in-up">
            <div className="row g-3">
              {/* Score */}
              <div className="col-md-4">
                <div className="card p-4 text-center h-100 d-flex align-items-center justify-content-center">
                  <ScoreRing score={result.score} />
                  <p style={{ color: '#64748B', fontSize: '0.8rem', marginTop: 8, marginBottom: 0 }}>ATS Match Score</p>
                </div>
              </div>

              {/* Keywords */}
              <div className="col-md-8">
                <div className="card p-4 mb-3">
                  <h6 style={{ color: '#10B981', fontWeight: 700, marginBottom: 12 }}>
                    <i className="fas fa-check-circle me-2" />Matched Keywords ({result.matched.length})
                  </h6>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {result.matched.map((k, i) => (
                      <span key={i} style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', padding: '3px 10px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600 }}>{k}</span>
                    ))}
                    {result.matched.length === 0 && <span style={{ color: '#64748B', fontSize: '0.85rem' }}>No matches found</span>}
                  </div>
                </div>
                <div className="card p-4">
                  <h6 style={{ color: '#EF4444', fontWeight: 700, marginBottom: 12 }}>
                    <i className="fas fa-times-circle me-2" />Missing Keywords ({result.missing.length})
                  </h6>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {result.missing.map((k, i) => (
                      <span key={i} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#EF4444', padding: '3px 10px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600 }}>{k}</span>
                    ))}
                    {result.missing.length === 0 && <span style={{ color: '#10B981', fontSize: '0.85rem' }}>Great — no missing keywords!</span>}
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              {result.suggestions.length > 0 && (
                <div className="col-12">
                  <div className="card p-4">
                    <h6 style={{ color: '#818CF8', fontWeight: 700, marginBottom: 16 }}>
                      <i className="fas fa-lightbulb me-2" />Improvement Suggestions
                    </h6>
                    <div className="row g-2">
                      {result.suggestions.map((s, i) => (
                        <div className="col-md-6" key={i}>
                          <div style={{ background: 'rgba(79,70,229,0.08)', border: '1px solid rgba(79,70,229,0.15)', borderRadius: 10, padding: '12px 14px', fontSize: '0.85rem', color: '#94A3B8', display: 'flex', gap: 10 }}>
                            <i className="fas fa-arrow-right" style={{ color: '#4F46E5', marginTop: 2, flexShrink: 0 }} />
                            {s}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <LoginModal show={showLogin} onClose={() => setShowLogin(false)} onSuccess={handleAnalyze} />
    </DashboardLayout>
  );
}
