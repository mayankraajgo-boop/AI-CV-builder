import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, register, clearError } from "../store/authSliceV2";
import toast from "react-hot-toast";

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  left: `${(i * 13.7 + 5) % 100}%`,
  top: `${(i * 17.3 + 10) % 100}%`,
  delay: `${(i * 0.35) % 6}s`,
  dur: `${4 + (i % 5)}s`,
  size: [3, 2, 5, 2, 4][i % 5],
  type: i % 5,
}));

function Particles() {
  return (
    <div className="ap-particles" aria-hidden="true">
      {PARTICLES.map((p, i) => (
        <div key={i} className={`ap-p ap-p${p.type}`}
          style={{ left: p.left, top: p.top, width: p.size, height: p.size,
            animationDelay: p.delay, animationDuration: p.dur }} />
      ))}
    </div>
  );
}

function Beams() {
  return (
    <div className="ap-beams" aria-hidden="true">
      {[0, 1, 2, 3].map(i => <div key={i} className={`ap-beam ap-beam${i}`} />)}
    </div>
  );
}

export default function AuthV2() {
  const [params] = useSearchParams();
  const [isLogin, setIsLogin] = useState(params.get("mode") !== "register");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((s) => s.auth);

  useEffect(() => { if (user) navigate("/dashboard"); }, [user, navigate]);
  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && form.password.length < 6) {
      toast.error("Password must be at least 6 characters"); return;
    }
    const action = isLogin
      ? login({ email: form.email, password: form.password })
      : register(form);
    const result = await dispatch(action);
    if (!result.error) {
      toast.success(isLogin ? "Welcome back!" : "Account created!");
      navigate("/dashboard");
    }
  };

  const switchMode = () => {
    setIsLogin(v => !v);
    setForm({ name: "", email: "", password: "" });
  };

  return (
    <div className="ap-root">
      <div className="ap-mesh" />
      <div className="ap-orb ap-orb0" />
      <div className="ap-orb ap-orb1" />
      <div className="ap-orb ap-orb2" />
      <div className="ap-orb ap-orb3" />
      <div className="ap-grid" />
      <Beams />
      <Particles />
      <div className="ap-wrap">
        <div className="ap-logo-area">
          <Link to="/" className="ap-logo-link">
            <div className="ap-logo-icon">
              <svg width="26" height="26" viewBox="0 0 40 40" fill="none">
                <path d="M11 13h10M11 18h16M11 23h12M11 28h8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="30" cy="13" r="4" fill="white" fillOpacity="0.9"/>
                <path d="M28.5 13l1 1 2-2" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="ap-logo-text">CV<span>Pilot</span></span>
          </Link>
          <h2 className="ap-heading">{isLogin ? "Welcome back" : "Create your account"}</h2>
          <p className="ap-sub">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={switchMode} className="ap-switch">
              {isLogin ? "Sign up free" : "Sign in"}
            </button>
          </p>
        </div>
        <div className="ap-card">
          <form onSubmit={handleSubmit} noValidate>
            {!isLogin && (
              <div className="ap-field">
                <label>Full Name</label>
                <div className="ap-inp-wrap">
                  <i className="fas fa-user" />
                  <input type="text" placeholder="John Doe" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required autoComplete="name" />
                </div>
              </div>
            )}
            <div className="ap-field">
              <label>Email Address</label>
              <div className="ap-inp-wrap">
                <i className="fas fa-envelope" />
                <input type="email" placeholder="you@example.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required autoComplete="email" />
              </div>
            </div>
            <div className="ap-field" style={{ marginBottom: "22px" }}>
              <label>Password</label>
              <div className="ap-inp-wrap">
                <i className="fas fa-lock" />
                <input type={showPass ? "text" : "password"}
                  placeholder={isLogin ? "Your password" : "Min. 6 characters"}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required autoComplete={isLogin ? "current-password" : "new-password"} />
                <button type="button" className="ap-eye" onClick={() => setShowPass(p => !p)}>
                  <i className={`fas fa-eye${showPass ? "-slash" : ""}`} />
                </button>
              </div>
            </div>
            <button type="submit" className="ap-btn" disabled={loading}>
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2" />Please wait...</>
                : <><i className={`fas fa-${isLogin ? "sign-in-alt" : "user-plus"} me-2`} />{isLogin ? "Sign In" : "Create Account"}</>}
            </button>
          </form>
          {!isLogin && (
            <p className="ap-terms">By creating an account, you agree to our Terms of Service.</p>
          )}
        </div>
        <p className="ap-badge">
          <i className="fas fa-check-circle me-1" style={{ color: "#10B981" }} />
          100% Free - No credit card required
        </p>
      </div>
      <style>{`
        .ap-root{min-height:100vh;background:#04091A;display:flex;align-items:center;justify-content:center;padding:20px;position:relative;overflow:hidden}
        .ap-mesh{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 90% 70% at 15% 15%,rgba(79,70,229,.2) 0%,transparent 55%),radial-gradient(ellipse 70% 90% at 85% 85%,rgba(124,58,237,.18) 0%,transparent 55%),radial-gradient(ellipse 60% 60% at 50% 50%,rgba(16,185,129,.07) 0%,transparent 65%)}
        .ap-orb{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none}
        .ap-orb0{width:700px;height:700px;background:radial-gradient(circle,rgba(79,70,229,.3),transparent 65%);top:-200px;left:-200px;animation:orb0 8s ease-in-out infinite}
        .ap-orb1{width:600px;height:600px;background:radial-gradient(circle,rgba(124,58,237,.26),transparent 65%);bottom:-150px;right:-150px;animation:orb1 10s ease-in-out infinite}
        .ap-orb2{width:400px;height:400px;background:radial-gradient(circle,rgba(16,185,129,.16),transparent 65%);top:35%;left:55%;animation:orb2 6s ease-in-out infinite}
        .ap-orb3{width:300px;height:300px;background:radial-gradient(circle,rgba(245,158,11,.14),transparent 65%);top:10%;right:15%;animation:orb0 12s ease-in-out infinite reverse}
        @keyframes orb0{0%,100%{transform:translate(0,0) scale(1)}25%{transform:translate(50px,-60px) scale(1.12)}50%{transform:translate(20px,40px) scale(.92)}75%{transform:translate(-40px,-20px) scale(1.06)}}
        @keyframes orb1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-60px,-40px) scale(1.15)}66%{transform:translate(30px,50px) scale(.9)}}
        @keyframes orb2{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-65%) scale(1.2)}}
        .ap-grid{position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(79,70,229,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(79,70,229,.08) 1px,transparent 1px);background-size:48px 48px;animation:gridPulse 4s ease-in-out infinite}
        @keyframes gridPulse{0%,100%{opacity:.5}50%{opacity:1}}
        .ap-beams{position:absolute;inset:0;pointer-events:none;overflow:hidden}
        .ap-beam{position:absolute;width:2px;height:60%;background:linear-gradient(to bottom,transparent,rgba(79,70,229,.6),transparent);animation:beamSweep 5s ease-in-out infinite;transform-origin:top center}
        .ap-beam0{left:20%;top:-10%;animation-delay:0s}
        .ap-beam1{left:45%;top:-10%;animation-delay:1.2s;background:linear-gradient(to bottom,transparent,rgba(124,58,237,.5),transparent)}
        .ap-beam2{left:70%;top:-10%;animation-delay:2.4s;background:linear-gradient(to bottom,transparent,rgba(16,185,129,.4),transparent)}
        .ap-beam3{left:85%;top:-10%;animation-delay:3.6s;background:linear-gradient(to bottom,transparent,rgba(245,158,11,.3),transparent)}
        @keyframes beamSweep{0%{opacity:0;transform:scaleY(0) rotate(-5deg)}20%{opacity:1;transform:scaleY(1) rotate(0deg)}80%{opacity:1;transform:scaleY(1.1) rotate(3deg)}100%{opacity:0;transform:scaleY(0) rotate(5deg)}}
        .ap-particles{position:absolute;inset:0;pointer-events:none;overflow:hidden}
        .ap-p{position:absolute;border-radius:50%;animation:pFloat linear infinite}
        .ap-p0{background:rgba(79,70,229,.9);box-shadow:0 0 8px rgba(79,70,229,.7)}
        .ap-p1{background:rgba(124,58,237,.8);box-shadow:0 0 6px rgba(124,58,237,.6)}
        .ap-p2{background:rgba(16,185,129,.7);box-shadow:0 0 10px rgba(16,185,129,.6)}
        .ap-p3{background:rgba(245,158,11,.7);box-shadow:0 0 6px rgba(245,158,11,.5)}
        .ap-p4{background:rgba(129,140,248,.8);box-shadow:0 0 8px rgba(129,140,248,.6)}
        @keyframes pFloat{0%{transform:translateY(110vh) rotate(0deg) scale(0);opacity:0}5%{opacity:1;transform:translateY(100vh) rotate(20deg) scale(1)}95%{opacity:1}100%{transform:translateY(-80px) rotate(720deg) scale(.5);opacity:0}}
        .ap-wrap{width:100%;max-width:440px;position:relative;z-index:1;animation:wrapIn .6s cubic-bezier(.16,1,.3,1) forwards}
        @keyframes wrapIn{from{opacity:0;transform:translateY(48px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}
        .ap-logo-area{text-align:center;margin-bottom:28px}
        .ap-logo-link{display:inline-flex;align-items:center;gap:10px;text-decoration:none;margin-bottom:18px}
        .ap-logo-icon{width:52px;height:52px;background:linear-gradient(135deg,#4F46E5,#7C3AED);border-radius:15px;display:flex;align-items:center;justify-content:center;animation:iconPop 2.5s ease-in-out infinite}
        @keyframes iconPop{0%,100%{box-shadow:0 8px 30px rgba(79,70,229,.5),0 0 0 0 rgba(79,70,229,.3);transform:scale(1)}50%{box-shadow:0 12px 40px rgba(79,70,229,.8),0 0 0 8px rgba(79,70,229,.1);transform:scale(1.06)}}
        .ap-logo-text{font-weight:800;font-size:1.75rem;color:#E2E8F0}
        .ap-logo-text span{color:#818CF8}
        .ap-heading{font-weight:800;font-size:1.55rem;margin-bottom:8px;background:linear-gradient(135deg,#E2E8F0 20%,#A5B4FC 60%,#7C3AED);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;background-size:200% auto;animation:shimmer 3s ease-in-out infinite}
        @keyframes shimmer{0%{background-position:0% center}50%{background-position:100% center}100%{background-position:0% center}}
        .ap-sub{color:#64748B;font-size:.9rem;margin:0}
        .ap-switch{background:none;border:none;color:#818CF8;cursor:pointer;font-weight:700;padding:0;transition:color .2s}
        .ap-switch:hover{color:#A5B4FC;text-decoration:underline}
        .ap-card{background:rgba(10,18,38,.88);border:1px solid rgba(79,70,229,.3);border-radius:22px;padding:30px;backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);animation:cardGlow 4s ease-in-out infinite}
        @keyframes cardGlow{0%,100%{box-shadow:0 40px 100px rgba(0,0,0,.7),0 0 0 1px rgba(79,70,229,.12),inset 0 1px 0 rgba(255,255,255,.06),0 0 60px rgba(79,70,229,.08)}50%{box-shadow:0 40px 100px rgba(0,0,0,.7),0 0 0 1px rgba(79,70,229,.3),inset 0 1px 0 rgba(255,255,255,.06),0 0 80px rgba(79,70,229,.18)}}
        .ap-field{margin-bottom:16px}
        .ap-field label{display:block;color:#94A3B8;font-size:.82rem;font-weight:600;margin-bottom:7px;letter-spacing:.4px}
        .ap-inp-wrap{position:relative}
        .ap-inp-wrap i{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:#475569;font-size:.82rem;pointer-events:none;transition:color .25s}
        .ap-inp-wrap input{width:100%;padding:12px 14px 12px 38px;background:rgba(15,23,42,.9);border:1px solid #1E293B;border-radius:11px;color:#E2E8F0;font-size:.9rem;transition:all .25s;outline:none}
        .ap-inp-wrap input::placeholder{color:#334155}
        .ap-inp-wrap input:focus{border-color:#4F46E5;box-shadow:0 0 0 3px rgba(79,70,229,.2),0 0 20px rgba(79,70,229,.12);background:rgba(15,23,42,1)}
        .ap-inp-wrap:focus-within i{color:#818CF8}
        .ap-eye{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;color:#475569;cursor:pointer;padding:4px;transition:color .2s}
        .ap-eye:hover{color:#818CF8}
        .ap-btn{width:100%;padding:14px;border-radius:11px;background:linear-gradient(135deg,#4F46E5 0%,#7C3AED 50%,#4F46E5 100%);background-size:200% auto;border:none;color:white;font-size:.95rem;font-weight:700;cursor:pointer;letter-spacing:.4px;transition:all .3s;animation:btnPulse 3s ease-in-out infinite;position:relative;overflow:hidden}
        .ap-btn::before{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.15),transparent 60%);opacity:0;transition:opacity .3s}
        .ap-btn:hover:not(:disabled)::before{opacity:1}
        .ap-btn:hover:not(:disabled){background-position:right center;transform:translateY(-2px);box-shadow:0 8px 30px rgba(79,70,229,.65),0 0 0 4px rgba(79,70,229,.15)}
        .ap-btn:active:not(:disabled){transform:translateY(0)}
        .ap-btn:disabled{opacity:.65;cursor:not-allowed;animation:none}
        @keyframes btnPulse{0%,100%{box-shadow:0 4px 20px rgba(79,70,229,.5)}50%{box-shadow:0 4px 30px rgba(79,70,229,.75),0 0 0 6px rgba(79,70,229,.1)}}
        .ap-terms{color:#475569;font-size:.75rem;text-align:center;margin-top:14px;margin-bottom:0}
        .ap-badge{color:#475569;font-size:.78rem;text-align:center;margin-top:20px;margin-bottom:0}
      `}</style>
    </div>
  );
}
