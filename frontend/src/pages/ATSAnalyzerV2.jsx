import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from '../layouts/DashboardMainV2';
import LoginModal from '../components/LoginModal';
import SpinnerButton from '../components/SpinnerButton';
import toast from 'react-hot-toast';
import api from '../services/apiService';

// ── Score Ring ────────────────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const color = score >= 75 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444';
  const label = score >= 75 ? 'Excellent' : score >= 50 ? 'Good' : 'Needs Work';
  const r = 58, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: 140, height: 140 }}>
        <svg width={140} height={140} style={{ transform: 'rotate(-90deg)', position: 'absolute', top: 0, left: 0 }}>
          <circle cx={70} cy={70} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={12} />
          <circle cx={70} cy={70} r={r} fill="none" stroke={color} strokeWidth={12}
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '2.2rem', fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>/100</span>
        </div>
      </div>
      <span style={{ color, fontWeight: 700, fontSize: '0.95rem', marginTop: 10 }}>{label}</span>
      <span style={{ color: '#64748B', fontSize: '0.78rem', marginTop: 2 }}>ATS Match Score</span>
    </div>
  );
}

// ── Section Score Bar ─────────────────────────────────────────────────────────
function SectionBar({ section, score, feedback }) {
  const color = score >= 75 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444';
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ color: '#E2E8F0', fontWeight: 600, fontSize: '0.875rem' }}>{section}</span>
        <span style={{ color, fontWeight: 700, fontSize: '0.875rem' }}>{score}%</span>
      </div>
      <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
        <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 3, transition: 'width 1s ease' }} />
      </div>
      <p style={{ color: '#64748B', fontSize: '0.8rem', marginBottom: 0 }}>{feedback}</p>
    </div>
  );
}

// ── Keyword Badge ─────────────────────────────────────────────────────────────
const KeyBadge = ({ word, type }) => {
  const styles = {
    matched: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', color: '#10B981' },
    missing: { bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)',  color: '#EF4444' },
  }[type];
  return (
    <span style={{ background: styles.bg, border: `1px solid ${styles.border}`, color: styles.color, padding: '3px 10px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600 }}>
      {word}
    </span>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function ATSAnalyzerV2() {
  const { user } = useSelector((s) => s.auth);
  const [inputMode, setInputMode]   = useState('text'); // 'text' | 'pdf'
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText]         = useState('');
  const [pdfFile, setPdfFile]       = useState(null);
  const [result, setResult]         = useState(null);
  const [loading, setLoading]       = useState(false);
  const [showLogin, setShowLogin]   = useState(false);
  const fileRef = useRef();

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f && f.type === 'application/pdf') { setPdfFile(f); toast.success(`${f.name} selected`); }
    else toast.error('Please select a PDF file');
  };

  const handleAnalyze = async () => {
    if (!user) { setShowLogin(true); return; }

    const trimmedText = resumeText.trim();
    if (inputMode === 'text' && !trimmedText) { toast.error('Please paste your resume text'); return; }
    if (inputMode === 'pdf'  && !pdfFile)     { toast.error('Please upload a PDF file'); return; }

    setLoading(true);
    setResult(null);
    try {
      let res;
      if (inputMode === 'pdf') {
        const fd = new FormData();
        fd.append('resume', pdfFile);
        if (jdText.trim()) fd.append('jobDescription', jdText);
        // Let browser set multipart boundary automatically — don't override Content-Type
        res = await api.post('/ai/ats-analyze', fd, {
          headers: { 'Content-Type': undefined },
          transformRequest: [(data) => data],
        });
      } else {
        res = await api.post('/ai/ats-analyze', {
          resumeText: trimmedText,
          jobDescription: jdText.trim() || '',
        });
      }
      setResult(res.data.result);
      toast.success('Analysis complete!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Analysis failed';
      toast.error(msg);
      console.error('ATS analyze error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ padding: '24px 16px', maxWidth: 960, margin: '0 auto' }} className="dashboard-content fade-in">

        {/* Header */}
        <div className="mb-4">
          <h1 style={{ color: '#E2E8F0', fontWeight: 800, fontSize: 'clamp(1.3rem,3vw,1.75rem)', marginBottom: 4 }}>
            <i className="fas fa-chart-bar me-2" style={{ color: '#4F46E5' }} />ATS Resume Analyzer
          </h1>
          <p style={{ color: '#64748B', marginBottom: 0 }}>Upload your resume PDF or paste text — get a full ATS score with AI-powered suggestions</p>
        </div>

        {/* Input mode toggle */}
        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #334155', marginBottom: 24 }}>
          {[['text','fas fa-align-left','Paste Text'],['pdf','fas fa-file-pdf','Upload PDF']].map(([m, icon, label]) => (
            <button key={m} onClick={() => setInputMode(m)}
              style={{ padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
                color: inputMode === m ? '#4F46E5' : '#64748B',
                borderBottom: inputMode === m ? '2px solid #4F46E5' : '2px solid transparent', transition: 'all 0.2s' }}>
              <i className={`${icon} me-2`} />{label}
            </button>
          ))}
        </div>

        <div className="row g-3 mb-4">
          {/* Resume input */}
          <div className="col-md-6">
            <label className="form-label">
              {inputMode === 'pdf' ? 'Upload Resume PDF' : 'Resume Text'}
            </label>
            {inputMode === 'pdf' ? (
              <div
                onClick={() => fileRef.current.click()}
                style={{ border: '2px dashed #334155', borderRadius: 10, padding: '32px 16px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', background: pdfFile ? 'rgba(79,70,229,0.06)' : 'transparent' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#4F46E5'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#334155'}
              >
                <input ref={fileRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleFileChange} />
                <i className="fas fa-cloud-upload-alt" style={{ fontSize: 32, color: pdfFile ? '#4F46E5' : '#334155', marginBottom: 10, display: 'block' }} />
                {pdfFile
                  ? <><p style={{ color: '#818CF8', fontWeight: 600, marginBottom: 4 }}>{pdfFile.name}</p><p style={{ color: '#64748B', fontSize: '0.8rem', marginBottom: 0 }}>Click to change</p></>
                  : <><p style={{ color: '#64748B', fontWeight: 500, marginBottom: 4 }}>Click to upload PDF</p><p style={{ color: '#475569', fontSize: '0.78rem', marginBottom: 0 }}>Max 5MB</p></>}
              </div>
            ) : (
              <textarea className="form-control" rows={12} placeholder="Paste your full resume text here..."
                value={resumeText} onChange={e => setResumeText(e.target.value)}
                style={{ resize: 'vertical', fontSize: '0.85rem' }} />
            )}
          </div>

          {/* Job description */}
          <div className="col-md-6">
            <label className="form-label">Job Description <span style={{ color: '#475569', fontWeight: 400 }}>(optional but recommended)</span></label>
            <textarea className="form-control" rows={12} placeholder="Paste the job description to get keyword matching..."
              value={jdText} onChange={e => setJdText(e.target.value)}
              style={{ resize: 'vertical', fontSize: '0.85rem' }} />
          </div>
        </div>

        <SpinnerButton text="Analyze My Resume" loading={loading} onClick={handleAnalyze}
          icon="fas fa-search" style={{ minWidth: 220, padding: '12px 28px' }} />

        {/* Results */}
        {result && (
          <div className="mt-4 fade-in-up">
            <div className="row g-3">

              {/* Score + section bars */}
              <div className="col-md-4">
                <div className="card p-4 h-100">
                  <div className="d-flex justify-content-center mb-4">
                    <ScoreRing score={result.score} />
                  </div>
                  <hr style={{ borderColor: '#334155' }} />
                  <h6 style={{ color: '#E2E8F0', fontWeight: 700, marginBottom: 16, fontSize: '0.875rem' }}>
                    <i className="fas fa-layer-group me-2" style={{ color: '#4F46E5' }} />Section Scores
                  </h6>
                  {(result.sectionFeedback || []).map((s, i) => (
                    <SectionBar key={i} section={s.section} score={s.score} feedback={s.feedback} />
                  ))}
                </div>
              </div>

              {/* Keywords + suggestions */}
              <div className="col-md-8">
                <div className="row g-3">

                  {/* Strong / Weak sections */}
                  <div className="col-6">
                    <div className="card p-3">
                      <h6 style={{ color: '#10B981', fontWeight: 700, marginBottom: 10, fontSize: '0.82rem' }}>
                        <i className="fas fa-thumbs-up me-2" />Strong Sections
                      </h6>
                      {(result.strongSections || []).map((s, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <i className="fas fa-check-circle" style={{ color: '#10B981', fontSize: 12 }} />
                          <span style={{ color: '#94A3B8', fontSize: '0.82rem' }}>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="card p-3">
                      <h6 style={{ color: '#EF4444', fontWeight: 700, marginBottom: 10, fontSize: '0.82rem' }}>
                        <i className="fas fa-exclamation-circle me-2" />Weak Sections
                      </h6>
                      {(result.weakSections || []).map((s, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <i className="fas fa-times-circle" style={{ color: '#EF4444', fontSize: 12 }} />
                          <span style={{ color: '#94A3B8', fontSize: '0.82rem' }}>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Matched keywords */}
                  <div className="col-12">
                    <div className="card p-4">
                      <h6 style={{ color: '#10B981', fontWeight: 700, marginBottom: 12 }}>
                        <i className="fas fa-check-circle me-2" />Matched Keywords ({(result.matchedKeywords || []).length})
                      </h6>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {(result.matchedKeywords || []).map((k, i) => <KeyBadge key={i} word={k} type="matched" />)}
                        {!result.matchedKeywords?.length && <span style={{ color: '#64748B', fontSize: '0.85rem' }}>No matches found</span>}
                      </div>
                    </div>
                  </div>

                  {/* Missing keywords */}
                  <div className="col-12">
                    <div className="card p-4">
                      <h6 style={{ color: '#EF4444', fontWeight: 700, marginBottom: 12 }}>
                        <i className="fas fa-times-circle me-2" />Missing Keywords ({(result.missingKeywords || []).length})
                      </h6>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {(result.missingKeywords || []).map((k, i) => <KeyBadge key={i} word={k} type="missing" />)}
                        {!result.missingKeywords?.length && <span style={{ color: '#10B981', fontSize: '0.85rem' }}>No missing keywords!</span>}
                      </div>
                    </div>
                  </div>

                  {/* Suggestions */}
                  {(result.suggestions || []).length > 0 && (
                    <div className="col-12">
                      <div className="card p-4">
                        <h6 style={{ color: '#818CF8', fontWeight: 700, marginBottom: 14 }}>
                          <i className="fas fa-lightbulb me-2" />AI Suggestions
                        </h6>
                        <div className="row g-2">
                          {result.suggestions.map((s, i) => (
                            <div className="col-md-6" key={i}>
                              <div style={{ background: 'rgba(79,70,229,0.08)', border: '1px solid rgba(79,70,229,0.15)', borderRadius: 10, padding: '12px 14px', fontSize: '0.83rem', color: '#94A3B8', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                <i className="fas fa-arrow-right" style={{ color: '#4F46E5', marginTop: 2, flexShrink: 0 }} />{s}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rewritten bullets */}
                  {(result.rewrittenBullets || []).length > 0 && (
                    <div className="col-12">
                      <div className="card p-4">
                        <h6 style={{ color: '#F59E0B', fontWeight: 700, marginBottom: 14 }}>
                          <i className="fas fa-magic me-2" />AI-Rewritten Bullet Points
                        </h6>
                        {result.rewrittenBullets.map((b, i) => (
                          <div key={i} style={{ marginBottom: 16 }}>
                            <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, padding: '10px 14px', marginBottom: 6 }}>
                              <span style={{ color: '#64748B', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Before</span>
                              <p style={{ color: '#94A3B8', fontSize: '0.83rem', marginBottom: 0, marginTop: 4 }}>{b.original}</p>
                            </div>
                            <div style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, padding: '10px 14px' }}>
                              <span style={{ color: '#10B981', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>After</span>
                              <p style={{ color: '#E2E8F0', fontSize: '0.83rem', marginBottom: 0, marginTop: 4 }}>{b.improved}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <LoginModal show={showLogin} onClose={() => setShowLogin(false)} onSuccess={handleAnalyze} />
    </DashboardLayout>
  );
}
