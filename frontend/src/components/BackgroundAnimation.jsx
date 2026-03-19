import { useEffect, useRef, useCallback } from 'react';

// ── Performance detection ─────────────────────────────────────────────────────
function isLowPerformance() {
  try {
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return true;
    if (navigator.deviceMemory && navigator.deviceMemory <= 2) return true;
    const c = document.createElement('canvas');
    if (!c.getContext('webgl2') && !c.getContext('webgl')) return true;
    return false;
  } catch { return true; }
}

// ── Static fallback ───────────────────────────────────────────────────────────
function StaticFallback() {
  return (
    <div aria-hidden="true" style={{
      position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
      background: `radial-gradient(ellipse 80% 60% at 20% 20%,rgba(79,70,229,0.22) 0%,transparent 60%),
                   radial-gradient(ellipse 60% 80% at 80% 80%,rgba(124,58,237,0.18) 0%,transparent 60%),
                   radial-gradient(ellipse 50% 50% at 50% 50%,rgba(16,185,129,0.07) 0%,transparent 70%),
                   #04091A`,
    }} />
  );
}

// ── Wave background shader ────────────────────────────────────────────────────
const WAVE_VERT = `#version 300 es
precision mediump float;
in vec2 a_pos;
uniform vec2 u_res;
out vec2 v_uv;
void main(){
  v_uv = a_pos / u_res;
  vec2 clip = v_uv * 2.0 - 1.0;
  clip.y = -clip.y;
  gl_Position = vec4(clip, 0.0, 1.0);
}`;

const WAVE_FRAG = `#version 300 es
precision mediump float;
in vec2 v_uv;
uniform float u_time;
uniform vec2  u_mouse;
out vec4 fragColor;

// 2D noise
float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
             mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
}
float fbm(vec2 p){
  float v=0.0,a=0.5;
  for(int i=0;i<5;i++){ v+=a*noise(p); p=p*2.1+vec2(1.7,9.2); a*=0.5; }
  return v;
}

void main(){
  vec2 uv = v_uv;

  // Subtle mouse warp
  vec2 m = u_mouse * 0.5 + 0.5;
  float md = 1.0 - smoothstep(0.0, 0.7, distance(uv, m));
  uv += (uv - m) * md * 0.04;

  // Layered fbm for organic nebula feel
  float t = u_time * 0.12;
  float n1 = fbm(uv * 2.2 + vec2(t, t * 0.7));
  float n2 = fbm(uv * 3.5 - vec2(t * 0.8, t * 1.1) + n1 * 0.6);
  float n3 = fbm(uv * 1.8 + vec2(t * 0.5, -t * 0.4) + n2 * 0.4);

  // Color palette — deep space
  vec3 c0 = vec3(0.012, 0.020, 0.075); // near-black navy
  vec3 c1 = vec3(0.18,  0.14,  0.55);  // deep indigo
  vec3 c2 = vec3(0.38,  0.18,  0.72);  // violet
  vec3 c3 = vec3(0.05,  0.42,  0.38);  // dark teal
  vec3 c4 = vec3(0.08,  0.06,  0.22);  // very dark purple

  vec3 col = c0;
  col = mix(col, c1, smoothstep(0.2, 0.6, n1));
  col = mix(col, c2, smoothstep(0.4, 0.8, n2) * 0.7);
  col = mix(col, c3, smoothstep(0.5, 0.9, n3) * 0.35);
  col = mix(col, c4, smoothstep(0.0, 0.3, 1.0 - n1));

  // Radial vignette — darker edges
  float vig = 1.0 - smoothstep(0.25, 1.1, length(uv - 0.5) * 1.6);
  col *= 0.55 + vig * 0.55;

  // Subtle mouse glow
  col += vec3(0.12, 0.08, 0.35) * md * 0.18;

  // Slow global pulse
  float pulse = 0.96 + 0.04 * sin(u_time * 0.4);
  col *= pulse;

  fragColor = vec4(col, 1.0);
}`;

// ── Particle shaders ──────────────────────────────────────────────────────────
const PT_VERT = `#version 300 es
precision mediump float;
in vec2  a_pos;
in float a_size;
in float a_alpha;
in vec3  a_color;
uniform vec2  u_res;
uniform vec2  u_mouse;
uniform float u_time;
out float v_alpha;
out vec3  v_color;
void main(){
  // Very subtle mouse parallax — depth based on size
  float depth = a_size / 7.0;
  vec2 pos = a_pos + u_mouse * depth * 28.0;
  vec2 clip = (pos / u_res) * 2.0 - 1.0;
  clip.y = -clip.y;
  gl_Position = vec4(clip, 0.0, 1.0);
  gl_PointSize = a_size;
  v_alpha = a_alpha;
  v_color = a_color;
}`;

const PT_FRAG = `#version 300 es
precision mediump float;
in float v_alpha;
in vec3  v_color;
out vec4 fragColor;
void main(){
  vec2 uv = gl_PointCoord - 0.5;
  float d = dot(uv, uv);
  if(d > 0.25) discard;
  // Double-layer glow: tight core + soft halo
  float core = 1.0 - smoothstep(0.0,  0.06, d);
  float halo = 1.0 - smoothstep(0.04, 0.25, d);
  float glow = core * 0.9 + halo * 0.4;
  fragColor = vec4(v_color, v_alpha * glow);
}`;

// ── Streak / shooting-star shaders ───────────────────────────────────────────
const STREAK_VERT = `#version 300 es
precision mediump float;
in vec2  a_pos;
in float a_alpha;
in vec3  a_color;
uniform vec2 u_res;
out float v_alpha;
out vec3  v_color;
void main(){
  vec2 clip = (a_pos / u_res) * 2.0 - 1.0;
  clip.y = -clip.y;
  gl_Position = vec4(clip, 0.0, 1.0);
  v_alpha = a_alpha;
  v_color = a_color;
}`;

const STREAK_FRAG = `#version 300 es
precision mediump float;
in float v_alpha;
in vec3  v_color;
out vec4 fragColor;
void main(){
  fragColor = vec4(v_color, v_alpha);
}`;

// ── Helpers ───────────────────────────────────────────────────────────────────
function compileShader(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn('Shader:', gl.getShaderInfoLog(s));
    gl.deleteShader(s); return null;
  }
  return s;
}
function createProgram(gl, vs, fs) {
  const v = compileShader(gl, gl.VERTEX_SHADER, vs);
  const f = compileShader(gl, gl.FRAGMENT_SHADER, fs);
  if (!v || !f) return null;
  const p = gl.createProgram();
  gl.attachShader(p, v); gl.attachShader(p, f);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.warn('Program:', gl.getProgramInfoLog(p)); return null;
  }
  gl.deleteShader(v); gl.deleteShader(f);
  return p;
}

// ── Main component ────────────────────────────────────────────────────────────
export default function BackgroundAnimation() {
  const canvasRef = useRef(null);
  const stateRef  = useRef(null);

  const cleanup = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    if (s.rafId) cancelAnimationFrame(s.rafId);
    if (s.resizeObs) s.resizeObs.disconnect();
    window.removeEventListener('mousemove', s.onMouse);
    stateRef.current = null;
  }, []);

  useEffect(() => {
    if (isLowPerformance()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', {
      alpha: false, antialias: false,
      powerPreference: 'low-power',
      preserveDrawingBuffer: false,
    });
    if (!gl) return;

    // ── Programs ──────────────────────────────────────────────────────────
    const waveProg   = createProgram(gl, WAVE_VERT,   WAVE_FRAG);
    const ptProg     = createProgram(gl, PT_VERT,     PT_FRAG);
    const streakProg = createProgram(gl, STREAK_VERT, STREAK_FRAG);
    if (!waveProg || !ptProg || !streakProg) return;

    // ── Wave quad ─────────────────────────────────────────────────────────
    const waveVAO    = gl.createVertexArray();
    const wavePosBuf = gl.createBuffer();
    gl.bindVertexArray(waveVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, wavePosBuf);
    const wavePosLoc = gl.getAttribLocation(waveProg, 'a_pos');
    gl.enableVertexAttribArray(wavePosLoc);
    gl.vertexAttribPointer(wavePosLoc, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    // ── Particles ─────────────────────────────────────────────────────────
    const COUNT = 180;
    const PALETTE = [
      [0.38, 0.32, 0.98],  // bright indigo
      [0.55, 0.22, 0.95],  // violet
      [0.06, 0.78, 0.55],  // teal
      [0.55, 0.60, 1.00],  // light indigo
      [0.85, 0.85, 1.00],  // near-white blue
      [0.90, 0.55, 1.00],  // lavender
    ];

    const particles = Array.from({ length: COUNT }, (_, i) => {
      const ci = Math.floor(Math.random() * PALETTE.length);
      // Cluster some particles near center for nebula effect
      const cluster = Math.random() < 0.35;
      return {
        x: cluster ? 0.3 + Math.random() * 0.4 : Math.random(),
        y: cluster ? 0.2 + Math.random() * 0.6 : Math.random(),
        vx: (Math.random() - 0.5) * 0.00006,
        vy: (Math.random() - 0.5) * 0.00006,
        size: cluster ? 1.5 + Math.random() * 3.5 : 1 + Math.random() * 2.5,
        alpha: cluster ? 0.3 + Math.random() * 0.55 : 0.1 + Math.random() * 0.35,
        color: PALETTE[ci],
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.2,
      };
    });

    const ptData = new Float32Array(COUNT * 7); // x,y,size,alpha,r,g,b
    const ptVAO  = gl.createVertexArray();
    const ptBuf  = gl.createBuffer();
    gl.bindVertexArray(ptVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, ptBuf);
    gl.bufferData(gl.ARRAY_BUFFER, ptData, gl.DYNAMIC_DRAW);
    const STRIDE = 7 * 4;
    const ptLocs = {
      pos:   gl.getAttribLocation(ptProg, 'a_pos'),
      size:  gl.getAttribLocation(ptProg, 'a_size'),
      alpha: gl.getAttribLocation(ptProg, 'a_alpha'),
      color: gl.getAttribLocation(ptProg, 'a_color'),
    };
    gl.enableVertexAttribArray(ptLocs.pos);   gl.vertexAttribPointer(ptLocs.pos,   2, gl.FLOAT, false, STRIDE, 0);
    gl.enableVertexAttribArray(ptLocs.size);  gl.vertexAttribPointer(ptLocs.size,  1, gl.FLOAT, false, STRIDE, 8);
    gl.enableVertexAttribArray(ptLocs.alpha); gl.vertexAttribPointer(ptLocs.alpha, 1, gl.FLOAT, false, STRIDE, 12);
    gl.enableVertexAttribArray(ptLocs.color); gl.vertexAttribPointer(ptLocs.color, 3, gl.FLOAT, false, STRIDE, 16);
    gl.bindVertexArray(null);

    // ── Shooting stars ────────────────────────────────────────────────────
    const STREAK_MAX = 6;
    const streaks = [];
    const spawnStreak = (W, H) => ({
      x: Math.random() * W,
      y: Math.random() * H * 0.5,
      len: 60 + Math.random() * 120,
      angle: Math.PI * 0.18 + Math.random() * 0.15,
      speed: 4 + Math.random() * 6,
      alpha: 0.6 + Math.random() * 0.4,
      life: 1.0,
      decay: 0.012 + Math.random() * 0.018,
      color: PALETTE[Math.floor(Math.random() * 3)],
    });

    // streak VAO: 2 vertices per streak (line)
    const streakVAO = gl.createVertexArray();
    const streakBuf = gl.createBuffer();
    gl.bindVertexArray(streakVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, streakBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(STREAK_MAX * 2 * 7), gl.DYNAMIC_DRAW);
    const sLocs = {
      pos:   gl.getAttribLocation(streakProg, 'a_pos'),
      alpha: gl.getAttribLocation(streakProg, 'a_alpha'),
      color: gl.getAttribLocation(streakProg, 'a_color'),
    };
    gl.enableVertexAttribArray(sLocs.pos);   gl.vertexAttribPointer(sLocs.pos,   2, gl.FLOAT, false, STRIDE, 0);
    gl.enableVertexAttribArray(sLocs.alpha); gl.vertexAttribPointer(sLocs.alpha, 1, gl.FLOAT, false, STRIDE, 8);
    gl.enableVertexAttribArray(sLocs.color); gl.vertexAttribPointer(sLocs.color, 3, gl.FLOAT, false, STRIDE, 12);
    gl.bindVertexArray(null);

    // ── Uniforms ──────────────────────────────────────────────────────────
    const wU = {
      res:   gl.getUniformLocation(waveProg, 'u_res'),
      time:  gl.getUniformLocation(waveProg, 'u_time'),
      mouse: gl.getUniformLocation(waveProg, 'u_mouse'),
    };
    const pU = {
      res:   gl.getUniformLocation(ptProg, 'u_res'),
      time:  gl.getUniformLocation(ptProg, 'u_time'),
      mouse: gl.getUniformLocation(ptProg, 'u_mouse'),
    };
    const sU = { res: gl.getUniformLocation(streakProg, 'u_res') };

    // ── State ─────────────────────────────────────────────────────────────
    let W = 0, H = 0, cW = 0, cH = 0;
    let mouseX = 0, mouseY = 0, tMX = 0, tMY = 0;
    let rafId = null;
    let nextStreak = 3.0;
    const startTime = performance.now();

    const onMouse = (e) => {
      tMX = (e.clientX / window.innerWidth)  * 2 - 1;
      tMY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    // ── Resize ────────────────────────────────────────────────────────────
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      cW = Math.floor(W * dpr); cH = Math.floor(H * dpr);
      canvas.width = cW; canvas.height = cH;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      gl.viewport(0, 0, cW, cH);
      const q = new Float32Array([0,0, cW,0, 0,cH, cW,cH]);
      gl.bindBuffer(gl.ARRAY_BUFFER, wavePosBuf);
      gl.bufferData(gl.ARRAY_BUFFER, q, gl.STATIC_DRAW);
    };
    const resizeObs = new ResizeObserver(resize);
    resizeObs.observe(document.documentElement);
    resize();

    // ── Render ────────────────────────────────────────────────────────────
    const render = (now) => {
      rafId = requestAnimationFrame(render);
      const t = (now - startTime) * 0.001;
      const dpr = cW / W;

      // Smooth mouse
      mouseX += (tMX - mouseX) * 0.035;
      mouseY += (tMY - mouseY) * 0.035;

      // ── Wave pass ──────────────────────────────────────────────────────
      gl.useProgram(waveProg);
      gl.uniform2f(wU.res, cW, cH);
      gl.uniform1f(wU.time, t);
      gl.uniform2f(wU.mouse, mouseX, mouseY);
      gl.bindVertexArray(waveVAO);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      gl.enable(gl.BLEND);

      // ── Particle pass ──────────────────────────────────────────────────
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE); // additive glow
      for (let i = 0; i < COUNT; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < -0.05) p.x = 1.05;
        if (p.x >  1.05) p.x = -0.05;
        if (p.y < -0.05) p.y = 1.05;
        if (p.y >  1.05) p.y = -0.05;
        const breathe = 0.65 + 0.35 * Math.sin(t * p.speed + p.phase);
        const b = i * 7;
        ptData[b]   = p.x * cW;
        ptData[b+1] = p.y * cH;
        ptData[b+2] = p.size * dpr;
        ptData[b+3] = p.alpha * breathe;
        ptData[b+4] = p.color[0];
        ptData[b+5] = p.color[1];
        ptData[b+6] = p.color[2];
      }
      gl.useProgram(ptProg);
      gl.uniform2f(pU.res, cW, cH);
      gl.uniform1f(pU.time, t);
      gl.uniform2f(pU.mouse, mouseX, mouseY);
      gl.bindVertexArray(ptVAO);
      gl.bindBuffer(gl.ARRAY_BUFFER, ptBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, ptData);
      gl.drawArrays(gl.POINTS, 0, COUNT);

      // ── Shooting stars ─────────────────────────────────────────────────
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      if (t > nextStreak && streaks.length < STREAK_MAX) {
        streaks.push(spawnStreak(cW, cH));
        nextStreak = t + 1.5 + Math.random() * 4;
      }
      const streakData = new Float32Array(STREAK_MAX * 2 * 7);
      let sCount = 0;
      for (let i = streaks.length - 1; i >= 0; i--) {
        const s = streaks[i];
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.life -= s.decay;
        if (s.life <= 0 || s.x > cW + 200 || s.y > cH + 200) {
          streaks.splice(i, 1); continue;
        }
        const tailX = s.x - Math.cos(s.angle) * s.len;
        const tailY = s.y - Math.sin(s.angle) * s.len;
        const base = sCount * 14;
        // head
        streakData[base]    = s.x; streakData[base+1] = s.y;
        streakData[base+2]  = s.alpha * s.life;
        streakData[base+3]  = s.color[0]; streakData[base+4] = s.color[1]; streakData[base+5] = s.color[2];
        streakData[base+6]  = 0; // padding to match stride
        // tail
        streakData[base+7]  = tailX; streakData[base+8] = tailY;
        streakData[base+9]  = 0;
        streakData[base+10] = s.color[0]; streakData[base+11] = s.color[1]; streakData[base+12] = s.color[2];
        streakData[base+13] = 0;
        sCount++;
      }
      if (sCount > 0) {
        gl.useProgram(streakProg);
        gl.uniform2f(sU.res, cW, cH);
        gl.bindVertexArray(streakVAO);
        gl.bindBuffer(gl.ARRAY_BUFFER, streakBuf);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, streakData.subarray(0, sCount * 14));
        gl.lineWidth(1.5);
        for (let i = 0; i < sCount; i++) {
          gl.drawArrays(gl.LINES, i * 2, 2);
        }
      }

      gl.disable(gl.BLEND);
      gl.bindVertexArray(null);
    };

    rafId = requestAnimationFrame(render);
    stateRef.current = { rafId, resizeObs, onMouse };
    return cleanup;
  }, [cleanup]);

  if (typeof window !== 'undefined' && isLowPerformance()) {
    return <StaticFallback />;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
}
