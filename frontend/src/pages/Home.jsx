import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

/* ─── DATA ─────────────────────────────────────────────────── */
const features = [
  { icon: 'fas fa-brain',      title: 'AI-Powered Writing',  desc: 'Generate professional content with GPT-4. Improve any section instantly.',          color: '#4F46E5' },
  { icon: 'fas fa-robot',      title: 'ATS Optimization',    desc: 'Score your resume against ATS systems and get actionable improvements.',             color: '#7C3AED' },
  { icon: 'fas fa-layer-group',title: 'Premium Templates',   desc: '20+ professionally designed templates for every industry and role.',                 color: '#0EA5E9' },
  { icon: 'fas fa-file-pdf',   title: 'One-Click Export',    desc: 'Download your resume as a pixel-perfect PDF instantly.',                             color: '#10B981' },
  { icon: 'fas fa-sync-alt',   title: 'Auto-Save',           desc: 'Never lose your work. Changes are saved automatically as you type.',                 color: '#F59E0B' },
  { icon: 'fas fa-chart-line', title: 'Resume Analytics',    desc: 'Track your resume score and get personalized improvement tips.',                     color: '#EF4444' },
];
const steps = [
  { num: '01', title: 'Create Your Account', desc: 'Sign up free in seconds. No credit card required.' },
  { num: '02', title: 'Fill Your Details',   desc: 'Add your experience, skills, and education with AI assistance.' },
  { num: '03', title: 'Download & Apply',    desc: 'Export as PDF and start landing your dream interviews.' },
];
const testimonials = [
  { name: 'Sarah Johnson', role: 'Software Engineer at Google', text: 'CVPilot helped me land my dream job. The AI suggestions were spot-on and the ATS optimization really works!', avatar: 'SJ' },
  { name: 'Marcus Chen',   role: 'Product Manager at Meta',    text: 'I went from 0 callbacks to 5 interviews in a week after using CVPilot. The templates are stunning.',          avatar: 'MC' },
  { name: 'Priya Patel',   role: 'Data Scientist at Amazon',   text: 'The AI feature is incredible. It transformed my boring resume into something that actually gets noticed.',     avatar: 'PP' },
];

/* ─── HOOKS ─────────────────────────────────────────────────── */
function useIsMobile(bp = 768) {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < bp : false);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < bp);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, [bp]);
  return mobile;
}

/* ─── TYPING TEXT ───────────────────────────────────────────── */
const TYPING_TEXTS = ['Software Engineer', 'Product Manager', 'Data Scientist', 'UX Designer', 'DevOps Engineer'];
function TypingText() {
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState('');
  const [del, setDel] = useState(false);
  useEffect(() => {
    const tgt = TYPING_TEXTS[idx]; let t;
    if (!del && shown.length < tgt.length)       t = setTimeout(() => setShown(tgt.slice(0, shown.length + 1)), 75);
    else if (!del && shown.length === tgt.length) t = setTimeout(() => setDel(true), 1800);
    else if (del && shown.length > 0)             t = setTimeout(() => setShown(shown.slice(0, -1)), 38);
    else { setDel(false); setIdx(i => (i + 1) % TYPING_TEXTS.length); }
    return () => clearTimeout(t);
  }, [shown, del, idx]);
  return (
    <span style={{ color: '#818CF8' }}>
      {shown}<span className="hv-cursor" />
    </span>
  );
}

/* ─── SCORE RING ────────────────────────────────────────────── */
function ScoreRing({ score = 92, size = 88 }) {
  const [cur, setCur] = useState(0);
  const r = size * 0.38, circ = 2 * Math.PI * r;
  useEffect(() => { const t = setTimeout(() => setCur(score), 700); return () => clearTimeout(t); }, [score]);
  const offset = circ - (cur / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <defs>
        <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" /><stop offset="100%" stopColor="#34D399" />
        </linearGradient>
      </defs>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(16,185,129,0.12)" strokeWidth="6" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#sg)" strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1.6s cubic-bezier(0.16,1,0.3,1)', filter: 'drop-shadow(0 0 6px rgba(16,185,129,0.7))' }} />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        style={{ fill: '#10B981', fontSize: size * 0.22, fontWeight: 800, transform: 'rotate(90deg)', transformOrigin: `${size/2}px ${size/2}px`, fontFamily: 'Inter,sans-serif' }}>
        {cur}
      </text>
    </svg>
  );
}

/* ─── PARTICLES ─────────────────────────────────────────────── */
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  x: 8 + (i * 33.7) % 84, y: 5 + (i * 21.3) % 88,
  size: 2 + (i % 3), delay: (i * 0.4) % 5, dur: 4 + (i % 4),
  color: ['#4F46E5','#7C3AED','#10B981','#818CF8','#F59E0B'][i % 5],
}));

/* ─── DATA STREAM ───────────────────────────────────────────── */
function DataStream({ x, delay, color }) {
  return (
    <div style={{
      position: 'absolute', left: `${x}%`, top: 0, width: 1, height: '100%',
      background: `linear-gradient(to bottom,transparent,${color}55,transparent)`,
      animation: `hvStream 3.2s ${delay}s linear infinite`, pointerEvents: 'none',
    }} />
  );
}

/* ─── HERO VISUAL ───────────────────────────────────────────── */
function HeroVisual() {
  const isMobile = useIsMobile(768);
  const wrapRef  = useRef(null);
  const [tilt, setTilt]       = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [scanLine, setScan]   = useState(0);
  const [aiActive, setAiActive] = useState(null);
  const [aiDone, setAiDone]   = useState([]);

  const onMove = useCallback((e) => {
    if (isMobile) return;
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = (e.clientX - rect.left  - rect.width  / 2) / (rect.width  / 2);
    const dy = (e.clientY - rect.top   - rect.height / 2) / (rect.height / 2);
    setTilt({ x: dy * -7, y: dx * 7 });
  }, [isMobile]);

  useEffect(() => {
    const id = setInterval(() => setScan(p => (p + 1) % 100), 28);
    return () => clearInterval(id);
  }, []);

  const handleAI = (i) => {
    if (aiDone.includes(i) || aiActive !== null) return;
    setAiActive(i);
    setTimeout(() => { setAiActive(null); setAiDone(d => [...d, i]); }, 1100);
  };

  const aiItems = [
    { label: 'Improve Summary', icon: 'fas fa-pen-nib', color: '#818CF8' },
    { label: 'ATS Optimize',    icon: 'fas fa-robot',   color: '#34D399' },
    { label: 'Action Words',    icon: 'fas fa-bolt',    color: '#FBBF24' },
  ];
  const skills = ['React', 'Python', 'AWS', 'SQL', 'Node.js'];
  const tags   = [
    { icon: 'fas fa-shield-alt', label: 'ATS Ready',     color: '#10B981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)'  },
    { icon: 'fas fa-magic',      label: 'AI Enhanced',   color: '#818CF8', bg: 'rgba(129,140,248,0.1)', border: 'rgba(129,140,248,0.25)' },
    { icon: 'fas fa-file-pdf',   label: 'PDF Ready',     color: '#EF4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)'   },
    { icon: 'fas fa-globe',      label: 'LinkedIn Sync', color: '#0EA5E9', bg: 'rgba(14,165,233,0.1)',  border: 'rgba(14,165,233,0.25)'  },
  ];

  return (
    <div ref={wrapRef} className="hv-wrap"
      onMouseMove={onMove}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false); }}
      onMouseEnter={() => setHovered(true)}>

      {/* Outer glow */}
      <div className="hv-outer-glow" />

      {/* 3-D card */}
      <div className="hv-card" style={{
        transform: isMobile ? 'none' : `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.015 : 1})`,
        transition: hovered ? 'transform 0.08s linear' : 'transform 0.7s cubic-bezier(0.16,1,0.3,1)',
        boxShadow: hovered && !isMobile
          ? '0 50px 100px rgba(0,0,0,0.7),0 0 0 1px rgba(79,70,229,0.5),0 0 80px rgba(79,70,229,0.25),inset 0 1px 0 rgba(255,255,255,0.07)'
          : '0 30px 70px rgba(0,0,0,0.6),0 0 0 1px rgba(79,70,229,0.25),0 0 40px rgba(79,70,229,0.12),inset 0 1px 0 rgba(255,255,255,0.05)',
      }}>
        {/* Data streams */}
        <div className="hv-streams">
          {[[12,'#4F46E5',0],[30,'#7C3AED',1.1],[52,'#10B981',2.3],[72,'#818CF8',0.7],[88,'#4F46E5',3]].map(([x,c,d],i) => (
            <DataStream key={i} x={x} color={c} delay={d} />
          ))}
        </div>

        {/* Particles */}
        <div className="hv-particles">
          {PARTICLES.map((p, i) => (
            <div key={i} style={{
              position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
              width: p.size, height: p.size, borderRadius: '50%',
              background: p.color, boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
              animation: `hvFloat ${p.dur}s ${p.delay}s ease-in-out infinite alternate`,
              opacity: 0.55,
            }} />
          ))}
        </div>

        {/* Scan line */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 2, zIndex: 2,
          top: `${scanLine}%`, pointerEvents: 'none',
          background: 'linear-gradient(90deg,transparent,rgba(79,70,229,0.4),rgba(129,140,248,0.6),rgba(79,70,229,0.4),transparent)',
          filter: 'blur(1px)',
        }} />

        {/* Tilt shimmer */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', zIndex: 3,
          background: `radial-gradient(ellipse 60% 40% at ${50 + tilt.y * 4}% ${50 + tilt.x * 4}%,rgba(255,255,255,0.05) 0%,transparent 70%)`,
          transition: hovered ? 'background 0.08s' : 'background 0.5s',
        }} />

        {/* ── CONTENT ── */}
        <div className="hv-content">

          {/* Top bar */}
          <div className="hv-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="hv-icon-box">
                <i className="fas fa-file-alt" style={{ color: 'white', fontSize: 12 }} />
              </div>
              <div>
                <div style={{ color: '#E2E8F0', fontSize: '0.7rem', fontWeight: 700 }}>resume_final.pdf</div>
                <div style={{ color: '#475569', fontSize: '0.58rem' }}>Last edited just now</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 5 }}>
              {['#EF4444','#F59E0B','#10B981'].map((c,i) => (
                <div key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.8 }} />
              ))}
            </div>
          </div>

          {/* Main row — stacks on mobile */}
          <div className="hv-main-row">

            {/* Resume doc */}
            <div className="hv-resume-doc">
              <div className="hv-resume-bar">
                <div className="hv-resume-bar-shine" />
              </div>
              <div className="hv-resume-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', flexShrink: 0 }} />
                  <div>
                    <div style={{ height: 9, background: '#1E293B', borderRadius: 3, width: 90, marginBottom: 4 }} />
                    <div style={{ height: 6, background: '#94A3B8', borderRadius: 3, width: 65 }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 9 }}>
                  {[48,58,42].map((w,i) => <div key={i} style={{ height: 4, background: '#CBD5E1', borderRadius: 3, width: w }} />)}
                </div>
                <div style={{ height: 1, background: 'linear-gradient(90deg,#4F46E5,transparent)', marginBottom: 9, opacity: 0.3 }} />
                <div style={{ height: 6, background: '#4F46E5', borderRadius: 3, width: 55, marginBottom: 6, opacity: 0.7 }} />
                {[95,80,88,65,75,55,82].map((w,i) => (
                  <div key={i} style={{ height: 4, background: i%4===0?'#CBD5E1':'#E2E8F0', borderRadius: 3, marginBottom: 4, width: `${w}%` }} />
                ))}
                <div style={{ height: 1, background: '#E2E8F0', margin: '7px 0' }} />
                <div style={{ height: 6, background: '#4F46E5', borderRadius: 3, width: 48, marginBottom: 6, opacity: 0.7 }} />
                {[70,85,60].map((w,i) => (
                  <div key={i} style={{ height: 4, background: '#E2E8F0', borderRadius: 3, marginBottom: 4, width: `${w}%` }} />
                ))}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 7 }}>
                  {skills.map((s,i) => (
                    <span key={s} style={{
                      background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(79,70,229,0.25)',
                      borderRadius: 20, padding: '2px 7px', fontSize: '0.52rem', color: '#4F46E5',
                      fontWeight: 700, fontFamily: 'Inter,sans-serif',
                      animation: `hvChip 0.4s ${0.8+i*0.08}s both`,
                    }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right panel */}
            <div className="hv-right-panel">

              {/* Score */}
              <div className="hv-score-card">
                <div className="hv-score-glow" />
                <ScoreRing score={92} size={isMobile ? 72 : 84} />
                <div style={{ color: '#34D399', fontSize: '0.6rem', fontWeight: 700, marginTop: 2, fontFamily: 'Inter,sans-serif' }}>ATS Score</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 3, marginTop: 5 }}>
                  {[85,92,78,95,88].map((v,i) => (
                    <div key={i} style={{ width: 4, height: v/10, background: i===3?'#10B981':'rgba(16,185,129,0.3)', borderRadius: 2, alignSelf: 'flex-end' }} />
                  ))}
                </div>
              </div>

              {/* AI panel */}
              <div className="hv-ai-panel">
                <div style={{ color: '#818CF8', fontSize: '0.6rem', fontWeight: 700, marginBottom: 7, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 5, height: 5, background: '#818CF8', borderRadius: '50%', animation: 'pulse-glow 1.5s infinite' }} />
                  AI Suggestions
                </div>
                {aiItems.map((item, i) => (
                  <button key={i} onClick={() => handleAI(i)} style={{
                    width: '100%',
                    background: aiDone.includes(i) ? 'rgba(16,185,129,0.12)' : aiActive===i ? 'rgba(79,70,229,0.25)' : 'rgba(79,70,229,0.08)',
                    border: `1px solid ${aiDone.includes(i) ? 'rgba(16,185,129,0.35)' : 'rgba(79,70,229,0.2)'}`,
                    borderRadius: 7, padding: '6px 7px', marginBottom: 5,
                    color: aiDone.includes(i) ? '#34D399' : '#CBD5E1',
                    fontSize: '0.6rem', cursor: 'pointer', textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 5,
                    transition: 'all 0.2s', fontFamily: 'Inter,sans-serif',
                  }}>
                    {aiActive===i
                      ? <span className="spinner-border spinner-border-sm" style={{ width: 8, height: 8, borderWidth: 1.5, color: item.color }} />
                      : <i className={aiDone.includes(i) ? 'fas fa-check-circle' : item.icon} style={{ color: aiDone.includes(i) ? '#34D399' : item.color, fontSize: 8 }} />}
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Live badge */}
              <div className="hv-live-badge">
                <span style={{ width: 5, height: 5, background: '#F59E0B', borderRadius: '50%', flexShrink: 0, animation: 'pulse-glow 1.5s infinite' }} />
                <span style={{ color: '#FCD34D', fontSize: '0.57rem', fontWeight: 600, fontFamily: 'Inter,sans-serif' }}>Auto-saving...</span>
              </div>
            </div>
          </div>

          {/* Bottom tags */}
          <div className="hv-tags">
            {tags.map((tag, i) => (
              <div key={i} style={{
                background: tag.bg, border: `1px solid ${tag.border}`,
                borderRadius: 20, padding: '4px 10px',
                display: 'flex', alignItems: 'center', gap: 4,
                animation: `hvTag 0.4s ${1+i*0.1}s both`,
              }}>
                <i className={tag.icon} style={{ color: tag.color, fontSize: 8 }} />
                <span style={{ color: '#94A3B8', fontSize: '0.6rem', fontWeight: 600, fontFamily: 'Inter,sans-serif' }}>{tag.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orbit dots — hidden on mobile */}
      {!isMobile && [0,1,2].map(i => (
        <div key={i} style={{
          position: 'absolute', width: 7, height: 7, borderRadius: '50%',
          background: ['#4F46E5','#10B981','#F59E0B'][i],
          boxShadow: `0 0 10px ${['#4F46E5','#10B981','#F59E0B'][i]}`,
          animation: `hvOrbit${i} ${6+i*2}s linear infinite`,
          top: '50%', left: '50%', zIndex: 5, pointerEvents: 'none',
        }} />
      ))}
    </div>
  );
}

/* ─── PAGE ──────────────────────────────────────────────────── */
const Home = () => (
  <MainLayout>

    {/* ══ HERO ══ */}
    <section className="hv-hero-section">
      {/* bg glows */}
      <div style={{ position:'absolute',top:'10%',left:'30%',width:700,height:700,background:'radial-gradient(circle,rgba(79,70,229,0.12) 0%,transparent 65%)',pointerEvents:'none' }} />
      <div style={{ position:'absolute',top:'5%',right:'5%',width:350,height:350,background:'radial-gradient(circle,rgba(124,58,237,0.1) 0%,transparent 70%)',pointerEvents:'none' }} />
      <div style={{ position:'absolute',bottom:'10%',left:'5%',width:260,height:260,background:'radial-gradient(circle,rgba(16,185,129,0.07) 0%,transparent 70%)',pointerEvents:'none' }} />

      <div className="container" style={{ position:'relative',zIndex:1 }}>
        <div className="row align-items-center g-5">

          {/* Copy */}
          <div className="col-lg-5 text-center text-lg-start fade-in-up">
            <div className="hv-badge">
              <span className="hv-badge-dot" />
              <span style={{ color:'#818CF8',fontSize:'0.85rem',fontWeight:600 }}>AI-Powered Resume Builder</span>
            </div>

            <h1 className="hv-h1">
              Build Resumes for<br /><TypingText />
            </h1>

            <p className="hv-sub">
              Create ATS-optimized, professionally designed resumes that get you hired. Powered by GPT-4 AI.
            </p>

            <div className="d-flex gap-3 justify-content-center justify-content-lg-start flex-wrap">
              <Link to="/auth?mode=register" className="btn btn-primary hv-cta-btn">
                <i className="fas fa-rocket me-2" />Start Building Free
              </Link>
              <Link to="/templates" className="btn btn-outline-primary hv-cta-btn">
                <i className="fas fa-eye me-2" />View Templates
              </Link>
            </div>

            <p className="hv-trust">
              <i className="fas fa-check-circle me-1" style={{ color:'#10B981' }} />100% Free &nbsp;&middot;&nbsp;
              <i className="fas fa-check-circle me-1" style={{ color:'#10B981' }} />No credit card &nbsp;&middot;&nbsp;
              <i className="fas fa-check-circle me-1" style={{ color:'#10B981' }} />Export to PDF
            </p>

            <div className="hv-stats">
              {[['50K+','Resumes Built'],['4.9★','User Rating'],['3x','More Interviews']].map(([v,l]) => (
                <div key={l} style={{ textAlign:'center' }}>
                  <div style={{ color:'#E2E8F0',fontWeight:800,fontSize:'1.2rem' }}>{v}</div>
                  <div style={{ color:'#475569',fontSize:'0.68rem',fontWeight:600 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="col-lg-7 d-flex justify-content-center justify-content-lg-end hv-visual-col">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>

    {/* ══ FEATURES ══ */}
    <section id="features" style={{ padding:'80px 0',background:'rgba(30,41,59,0.3)' }}>
      <div className="container">
        <div className="text-center mb-5">
          <span style={{ color:'#818CF8',fontWeight:600,fontSize:'0.875rem',textTransform:'uppercase',letterSpacing:2 }}>Features</span>
          <h2 style={{ color:'#E2E8F0',fontWeight:800,fontSize:'clamp(1.8rem,4vw,2.5rem)',marginTop:8 }}>Everything You Need to Get Hired</h2>
          <p style={{ color:'#64748B',maxWidth:500,margin:'12px auto 0' }}>Powerful tools designed to make your resume stand out in today's competitive job market.</p>
        </div>
        <div className="row g-4">
          {features.map((f,i) => (
            <div className="col-lg-4 col-md-6" key={i}>
              <div className="card h-100 p-4">
                <div style={{ width:52,height:52,background:`${f.color}20`,border:`1px solid ${f.color}40`,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:16 }}>
                  <i className={f.icon} style={{ color:f.color,fontSize:22 }} />
                </div>
                <h5 style={{ color:'#E2E8F0',fontWeight:700,marginBottom:8 }}>{f.title}</h5>
                <p style={{ color:'#64748B',fontSize:'0.9rem',lineHeight:1.7,marginBottom:0 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ══ HOW IT WORKS ══ */}
    <section style={{ padding:'80px 0' }}>
      <div className="container">
        <div className="text-center mb-5">
          <span style={{ color:'#818CF8',fontWeight:600,fontSize:'0.875rem',textTransform:'uppercase',letterSpacing:2 }}>How It Works</span>
          <h2 style={{ color:'#E2E8F0',fontWeight:800,fontSize:'clamp(1.8rem,4vw,2.5rem)',marginTop:8 }}>3 Simple Steps to Your Dream Job</h2>
        </div>
        <div className="row g-4 justify-content-center">
          {steps.map((s,i) => (
            <div className="col-lg-4 col-md-6" key={i}>
              <div style={{ textAlign:'center',padding:'28px 20px' }}>
                <div style={{ fontSize:'3.5rem',fontWeight:900,color:'rgba(79,70,229,0.15)',lineHeight:1,marginBottom:14 }}>{s.num}</div>
                <div style={{ width:52,height:52,background:'linear-gradient(135deg,#4F46E5,#7C3AED)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'-18px auto 18px',fontSize:20,fontWeight:700,color:'white' }}>{i+1}</div>
                <h5 style={{ color:'#E2E8F0',fontWeight:700,marginBottom:10 }}>{s.title}</h5>
                <p style={{ color:'#64748B',fontSize:'0.9rem',lineHeight:1.7 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ══ TESTIMONIALS ══ */}
    <section style={{ padding:'80px 0',background:'rgba(30,41,59,0.3)' }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 style={{ color:'#E2E8F0',fontWeight:800,fontSize:'clamp(1.8rem,4vw,2.5rem)' }}>Loved by Job Seekers</h2>
          <p style={{ color:'#64748B' }}>Join thousands who landed their dream jobs with CVPilot</p>
        </div>
        <div className="row g-4">
          {testimonials.map((t,i) => (
            <div className="col-lg-4" key={i}>
              <div className="card p-4 h-100">
                <div className="d-flex mb-3">{[...Array(5)].map((_,j) => <i key={j} className="fas fa-star" style={{ color:'#F59E0B',fontSize:14,marginRight:2 }} />)}</div>
                <p style={{ color:'#94A3B8',fontSize:'0.9rem',lineHeight:1.7,flex:1 }}>"{t.text}"</p>
                <div className="d-flex align-items-center gap-3 mt-3">
                  <div style={{ width:40,height:40,borderRadius:'50%',background:'linear-gradient(135deg,#4F46E5,#7C3AED)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:14,color:'white' }}>{t.avatar}</div>
                  <div>
                    <div style={{ color:'#E2E8F0',fontWeight:600,fontSize:'0.875rem' }}>{t.name}</div>
                    <div style={{ color:'#64748B',fontSize:'0.75rem' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ══ CTA ══ */}
    <section style={{ padding:'80px 0' }}>
      <div className="container text-center">
        <div style={{ background:'linear-gradient(135deg,rgba(79,70,229,0.15),rgba(124,58,237,0.15))',border:'1px solid rgba(79,70,229,0.3)',borderRadius:24,padding:'clamp(32px,6vw,60px) clamp(20px,5vw,40px)',position:'relative',overflow:'hidden' }}>
          <div style={{ position:'absolute',top:-50,right:-50,width:200,height:200,background:'radial-gradient(circle,rgba(124,58,237,0.2),transparent)',borderRadius:'50%' }} />
          <h2 style={{ color:'#E2E8F0',fontWeight:800,fontSize:'clamp(1.6rem,4vw,2.5rem)',marginBottom:16 }}>Ready to Land Your Dream Job?</h2>
          <p style={{ color:'#94A3B8',fontSize:'1rem',marginBottom:32,maxWidth:500,margin:'0 auto 32px' }}>Join 50,000+ professionals who built their careers with CVPilot.</p>
          <Link to="/auth?mode=register" className="btn btn-primary" style={{ padding:'14px 36px',fontSize:'1rem',borderRadius:12 }}>
            <i className="fas fa-rocket me-2" />Build Your Resume Now — It's Free
          </Link>
        </div>
      </div>
    </section>

    {/* ══ ALL STYLES ══ */}
    <style>{`
      /* Keyframes */
      @keyframes cursorBlink{0%,100%{opacity:1}50%{opacity:0}}
      @keyframes hvStream{0%{transform:translateY(-100%);opacity:0}15%{opacity:1}85%{opacity:1}100%{transform:translateY(100%);opacity:0}}
      @keyframes hvFloat{0%{transform:translate(0,0) scale(1)}100%{transform:translate(7px,-11px) scale(1.3)}}
      @keyframes hvShimmer{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
      @keyframes hvScorePulse{0%,100%{opacity:0.5}50%{opacity:1}}
      @keyframes hvChip{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}
      @keyframes hvTag{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      @keyframes hvOuterGlow{0%,100%{opacity:0.5;transform:scale(1)}50%{opacity:1;transform:scale(1.07)}}
      @keyframes hvOrbit0{0%{transform:translate(-50%,-50%) rotate(0deg) translateX(250px) rotate(0deg)}100%{transform:translate(-50%,-50%) rotate(360deg) translateX(250px) rotate(-360deg)}}
      @keyframes hvOrbit1{0%{transform:translate(-50%,-50%) rotate(120deg) translateX(280px) rotate(-120deg)}100%{transform:translate(-50%,-50%) rotate(480deg) translateX(280px) rotate(-480deg)}}
      @keyframes hvOrbit2{0%{transform:translate(-50%,-50%) rotate(240deg) translateX(230px) rotate(-240deg)}100%{transform:translate(-50%,-50%) rotate(600deg) translateX(230px) rotate(-600deg)}}

      /* Cursor */
      .hv-cursor{display:inline-block;width:2px;height:1em;background:#818CF8;margin-left:2px;vertical-align:text-bottom;animation:cursorBlink 1s step-end infinite}

      /* Hero section */
      .hv-hero-section{min-height:100vh;display:flex;align-items:center;padding-top:80px;position:relative;overflow:hidden}

      /* Badge */
      .hv-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(79,70,229,0.15);border:1px solid rgba(79,70,229,0.3);border-radius:20px;padding:6px 16px;margin-bottom:20px}
      .hv-badge-dot{width:8px;height:8px;background:#10B981;border-radius:50%;display:inline-block;animation:pulse-glow 2s infinite}

      /* Heading */
      .hv-h1{font-size:clamp(2rem,5vw,3.8rem);font-weight:800;line-height:1.1;margin-bottom:16px;color:#E2E8F0}

      /* Sub */
      .hv-sub{font-size:clamp(0.95rem,2vw,1.05rem);color:#94A3B8;margin-bottom:28px;line-height:1.75;max-width:440px}
      @media(max-width:991px){.hv-sub{max-width:100%}}

      /* CTA buttons */
      .hv-cta-btn{padding:13px 28px;font-size:0.95rem;border-radius:10px}
      @media(max-width:480px){.hv-cta-btn{width:100%;justify-content:center}}

      /* Trust line */
      .hv-trust{color:#475569;font-size:0.8rem;margin-top:16px}

      /* Stats */
      .hv-stats{display:flex;gap:28px;margin-top:20px;justify-content:center}
      @media(min-width:992px){.hv-stats{justify-content:flex-start}}

      /* Visual column */
      .hv-visual-col{animation:hvVisualIn 0.9s 0.15s cubic-bezier(0.16,1,0.3,1) both}
      @keyframes hvVisualIn{from{opacity:0;transform:translateY(50px) scale(0.93)}to{opacity:1;transform:translateY(0) scale(1)}}

      /* Wrap */
      .hv-wrap{perspective:1400px;width:100%;max-width:560px;position:relative;cursor:default}
      @media(max-width:575px){.hv-wrap{max-width:100%}}

      /* Outer glow */
      .hv-outer-glow{position:absolute;inset:-28px;border-radius:44px;background:radial-gradient(ellipse at center,rgba(79,70,229,0.22) 0%,transparent 70%);animation:hvOuterGlow 4s ease-in-out infinite;pointer-events:none;z-index:0}

      /* Card */
      .hv-card{transform-style:preserve-3d;position:relative;z-index:1;border-radius:24px;background:linear-gradient(145deg,rgba(10,18,38,0.97) 0%,rgba(20,30,55,0.95) 100%);border:1px solid rgba(79,70,229,0.38);overflow:hidden;padding:0}

      /* Streams / particles */
      .hv-streams,.hv-particles{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0}

      /* Content */
      .hv-content{position:relative;z-index:4;padding:20px}
      @media(max-width:400px){.hv-content{padding:14px}}

      /* Top bar */
      .hv-topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
      .hv-icon-box{width:30px;height:30px;border-radius:7px;background:linear-gradient(135deg,#4F46E5,#7C3AED);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(79,70,229,0.5);flex-shrink:0}

      /* Main row */
      .hv-main-row{display:flex;gap:14px;align-items:flex-start}
      @media(max-width:480px){
        .hv-main-row{flex-direction:column;gap:12px}
      }

      /* Resume doc */
      .hv-resume-doc{flex:1;min-width:0;background:white;border-radius:12px;overflow:hidden;box-shadow:0 10px 36px rgba(0,0,0,0.45),0 0 0 1px rgba(79,70,229,0.08)}
      .hv-resume-bar{height:5px;background:linear-gradient(90deg,#4F46E5,#7C3AED,#0EA5E9);position:relative;overflow:hidden}
      .hv-resume-bar-shine{position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.45),transparent);animation:hvShimmer 2.2s linear infinite}
      .hv-resume-body{padding:12px 14px}

      /* Right panel */
      .hv-right-panel{width:148px;flex-shrink:0;display:flex;flex-direction:column;gap:9px}
      @media(max-width:480px){
        .hv-right-panel{width:100%;flex-direction:row;flex-wrap:wrap;gap:8px}
        .hv-score-card,.hv-ai-panel,.hv-live-badge{flex:1;min-width:120px}
      }

      /* Score card */
      .hv-score-card{background:rgba(16,185,129,0.07);border:1px solid rgba(16,185,129,0.2);border-radius:12px;padding:12px 8px;text-align:center;position:relative;overflow:hidden}
      .hv-score-glow{position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,rgba(16,185,129,0.08),transparent 70%);animation:hvScorePulse 3s ease-in-out infinite}

      /* AI panel */
      .hv-ai-panel{background:rgba(79,70,229,0.08);border:1px solid rgba(79,70,229,0.22);border-radius:12px;padding:10px 9px}

      /* Live badge */
      .hv-live-badge{background:rgba(245,158,11,0.07);border:1px solid rgba(245,158,11,0.2);border-radius:9px;padding:7px 9px;display:flex;align-items:center;gap:5px}

      /* Tags */
      .hv-tags{display:flex;gap:6px;margin-top:14px;flex-wrap:wrap}
      @media(max-width:360px){.hv-tags{gap:4px}}
    `}</style>
  </MainLayout>
);

export default Home;
