import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

const features = [
  { icon: 'fas fa-brain', title: 'AI-Powered Writing', desc: 'Generate professional content with GPT-4. Improve any section instantly.', color: '#4F46E5' },
  { icon: 'fas fa-robot', title: 'ATS Optimization', desc: 'Score your resume against ATS systems and get actionable improvements.', color: '#7C3AED' },
  { icon: 'fas fa-layer-group', title: 'Premium Templates', desc: '20+ professionally designed templates for every industry and role.', color: '#0EA5E9' },
  { icon: 'fas fa-file-pdf', title: 'One-Click Export', desc: 'Download your resume as a pixel-perfect PDF instantly.', color: '#10B981' },
  { icon: 'fas fa-sync-alt', title: 'Auto-Save', desc: 'Never lose your work. Changes are saved automatically as you type.', color: '#F59E0B' },
  { icon: 'fas fa-chart-line', title: 'Resume Analytics', desc: 'Track your resume score and get personalized improvement tips.', color: '#EF4444' },
];

const steps = [
  { num: '01', title: 'Create Your Account', desc: 'Sign up free in seconds. No credit card required.' },
  { num: '02', title: 'Fill Your Details', desc: 'Add your experience, skills, and education with AI assistance.' },
  { num: '03', title: 'Download & Apply', desc: 'Export as PDF and start landing your dream interviews.' },
];

const testimonials = [
  { name: 'Sarah Johnson', role: 'Software Engineer at Google', text: 'CVPilot helped me land my dream job. The AI suggestions were spot-on and the ATS optimization really works!', avatar: 'SJ' },
  { name: 'Marcus Chen', role: 'Product Manager at Meta', text: 'I went from 0 callbacks to 5 interviews in a week after using CVPilot. The templates are stunning.', avatar: 'MC' },
  { name: 'Priya Patel', role: 'Data Scientist at Amazon', text: 'The AI feature is incredible. It transformed my boring resume into something that actually gets noticed.', avatar: 'PP' },
];

const Home = () => {
  return (
    <MainLayout>
      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 80, position: 'relative', overflow: 'hidden' }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '10%', right: '10%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
          <div className="fade-in-up">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(79,70,229,0.15)', border: '1px solid rgba(79,70,229,0.3)', borderRadius: 20, padding: '6px 16px', marginBottom: 24 }}>
              <span style={{ width: 8, height: 8, background: '#10B981', borderRadius: '50%', display: 'inline-block', animation: 'pulse-glow 2s infinite' }}></span>
              <span style={{ color: '#818CF8', fontSize: '0.85rem', fontWeight: 600 }}>AI-Powered Resume Builder</span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24, color: '#E2E8F0' }}>
              Build Your Resume with<br />
              <span className="gradient-text">AI in Minutes</span>
            </h1>

            <p style={{ fontSize: '1.2rem', color: '#94A3B8', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.7 }}>
              Create ATS-optimized, professionally designed resumes that get you hired. Powered by GPT-4 AI.
            </p>

            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link to="/auth?mode=register" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1rem', borderRadius: 10 }}>
                <i className="fas fa-rocket me-2"></i>Start Building Free
              </Link>
              <Link to="/templates" className="btn btn-outline-primary" style={{ padding: '14px 32px', fontSize: '1rem', borderRadius: 10 }}>
                <i className="fas fa-eye me-2"></i>View Templates
              </Link>
            </div>

            <p style={{ color: '#475569', fontSize: '0.85rem', marginTop: 16 }}>
              <i className="fas fa-check-circle me-1" style={{ color: '#10B981' }}></i>100% Free &nbsp;·&nbsp;
              <i className="fas fa-check-circle me-1" style={{ color: '#10B981' }}></i>No credit card &nbsp;·&nbsp;
              <i className="fas fa-check-circle me-1" style={{ color: '#10B981' }}></i>Export to PDF
            </p>
          </div>

          {/* Hero visual */}
          <div style={{ marginTop: 60, position: 'relative', display: 'inline-block' }}>
            <div style={{ background: 'linear-gradient(135deg,rgba(79,70,229,0.2),rgba(124,58,237,0.2))', border: '1px solid rgba(79,70,229,0.3)', borderRadius: 20, padding: 24, backdropFilter: 'blur(12px)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                {/* Resume preview mock */}
                <div style={{ width: 280, background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
                  <div style={{ height: 10, background: '#4F46E5', borderRadius: 4, marginBottom: 12 }}></div>
                  <div style={{ height: 16, background: '#1E293B', borderRadius: 3, marginBottom: 6, width: '60%' }}></div>
                  <div style={{ height: 8, background: '#94A3B8', borderRadius: 3, marginBottom: 16, width: '80%' }}></div>
                  {[90, 70, 85, 60, 75].map((w, i) => (
                    <div key={i} style={{ height: 6, background: '#E2E8F0', borderRadius: 3, marginBottom: 6, width: `${w}%` }}></div>
                  ))}
                  <div style={{ height: 1, background: '#E2E8F0', margin: '12px 0' }}></div>
                  {[80, 65, 70].map((w, i) => (
                    <div key={i} style={{ height: 6, background: '#E2E8F0', borderRadius: 3, marginBottom: 6, width: `${w}%` }}></div>
                  ))}
                </div>
                {/* AI panel mock */}
                <div style={{ width: 180 }}>
                  <div style={{ background: 'rgba(79,70,229,0.2)', border: '1px solid rgba(79,70,229,0.4)', borderRadius: 10, padding: 12, marginBottom: 10 }}>
                    <div style={{ color: '#818CF8', fontSize: '0.7rem', fontWeight: 700, marginBottom: 8 }}>
                      <i className="fas fa-brain me-1"></i>AI Suggestions
                    </div>
                    {['Improve Summary', 'ATS Optimize', 'Action Words'].map((t, i) => (
                      <div key={i} style={{ background: 'rgba(79,70,229,0.15)', borderRadius: 6, padding: '6px 10px', marginBottom: 6, color: '#CBD5E1', fontSize: '0.7rem', cursor: 'pointer' }}>
                        <i className="fas fa-magic me-1" style={{ color: '#4F46E5' }}></i>{t}
                      </div>
                    ))}
                  </div>
                  <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                    <div style={{ color: '#10B981', fontSize: '1.5rem', fontWeight: 800 }}>92</div>
                    <div style={{ color: '#64748B', fontSize: '0.65rem' }}>ATS Score</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '100px 0', background: 'rgba(30,41,59,0.3)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span style={{ color: '#818CF8', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: 2 }}>Features</span>
            <h2 style={{ color: '#E2E8F0', fontWeight: 800, fontSize: '2.5rem', marginTop: 8 }}>Everything You Need to Get Hired</h2>
            <p style={{ color: '#64748B', maxWidth: 500, margin: '12px auto 0' }}>Powerful tools designed to make your resume stand out in today's competitive job market.</p>
          </div>
          <div className="row g-4">
            {features.map((f, i) => (
              <div className="col-lg-4 col-md-6" key={i}>
                <div className="card h-100 p-4" style={{ transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.3)`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}>
                  <div style={{ width: 52, height: 52, background: `${f.color}20`, border: `1px solid ${f.color}40`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <i className={f.icon} style={{ color: f.color, fontSize: 22 }}></i>
                  </div>
                  <h5 style={{ color: '#E2E8F0', fontWeight: 700, marginBottom: 8 }}>{f.title}</h5>
                  <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span style={{ color: '#818CF8', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: 2 }}>How It Works</span>
            <h2 style={{ color: '#E2E8F0', fontWeight: 800, fontSize: '2.5rem', marginTop: 8 }}>3 Simple Steps to Your Dream Job</h2>
          </div>
          <div className="row g-4 justify-content-center">
            {steps.map((s, i) => (
              <div className="col-lg-4 col-md-6" key={i}>
                <div style={{ textAlign: 'center', padding: '32px 24px', position: 'relative' }}>
                  <div style={{ fontSize: '4rem', fontWeight: 900, color: 'rgba(79,70,229,0.15)', lineHeight: 1, marginBottom: 16 }}>{s.num}</div>
                  <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '-20px auto 20px', fontSize: 22, fontWeight: 700, color: 'white' }}>
                    {i + 1}
                  </div>
                  <h5 style={{ color: '#E2E8F0', fontWeight: 700, marginBottom: 12 }}>{s.title}</h5>
                  <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '100px 0', background: 'rgba(30,41,59,0.3)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 style={{ color: '#E2E8F0', fontWeight: 800, fontSize: '2.5rem' }}>Loved by Job Seekers</h2>
            <p style={{ color: '#64748B' }}>Join thousands who landed their dream jobs with CVPilot</p>
          </div>
          <div className="row g-4">
            {testimonials.map((t, i) => (
              <div className="col-lg-4" key={i}>
                <div className="card p-4 h-100">
                  <div className="d-flex mb-3">
                    {[...Array(5)].map((_, j) => <i key={j} className="fas fa-star" style={{ color: '#F59E0B', fontSize: 14, marginRight: 2 }}></i>)}
                  </div>
                  <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.7, flex: 1 }}>"{t.text}"</p>
                  <div className="d-flex align-items-center gap-3 mt-3">
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: 'white' }}>{t.avatar}</div>
                    <div>
                      <div style={{ color: '#E2E8F0', fontWeight: 600, fontSize: '0.875rem' }}>{t.name}</div>
                      <div style={{ color: '#64748B', fontSize: '0.75rem' }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 0' }}>
        <div className="container text-center">
          <div style={{ background: 'linear-gradient(135deg,rgba(79,70,229,0.15),rgba(124,58,237,0.15))', border: '1px solid rgba(79,70,229,0.3)', borderRadius: 24, padding: '60px 40px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'radial-gradient(circle,rgba(124,58,237,0.2),transparent)', borderRadius: '50%' }} />
            <h2 style={{ color: '#E2E8F0', fontWeight: 800, fontSize: '2.5rem', marginBottom: 16 }}>Ready to Land Your Dream Job?</h2>
            <p style={{ color: '#94A3B8', fontSize: '1.1rem', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
              Join 50,000+ professionals who built their careers with CVPilot.
            </p>
            <Link to="/auth?mode=register" className="btn btn-primary" style={{ padding: '16px 40px', fontSize: '1.1rem', borderRadius: 12 }}>
              <i className="fas fa-rocket me-2"></i>Build Your Resume Now — It's Free
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
