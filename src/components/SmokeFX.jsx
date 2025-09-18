// src/components/SmokeFX.jsx
import React, { useEffect, useRef } from "react";

/**
 * Fullscreen animated "smoke" / nebula (WebGL fragment shader).
 * - Tinted by CSS var(--color-primary)
 * - Respects prefers-reduced-motion
 * - Fallback ke 2D canvas kalau WebGL unavailable / reduced motion
 */

const FRAG_HIGH = `
precision highp float;
uniform vec2  u_res;
uniform float u_time;
uniform vec3  u_tint;

vec2 hash2(vec2 p){
  p = vec2(dot(p, vec2(127.1,311.7)), dot(p, vec2(269.5,183.3)));
  return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}
float noise(vec2 p){
  const float K1 = 0.366025404;
  const float K2 = 0.211324865;
  vec2 i = floor(p + (p.x+p.y)*K1);
  vec2 a = p - i + (i.x+i.y)*K2;
  vec2 o = step(a.yx, a.xy);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0*K2;
  vec3 h = max(0.5 - vec3(dot(a,a), dot(b,b), dot(c,c)), 0.0);
  vec3 n = h*h*h*h * vec3(
    dot(a, hash2(i + 0.0)),
    dot(b, hash2(i + o)),
    dot(c, hash2(i + 1.0))
  );
  return dot(n, vec3(70.0));
}
float fbm(vec2 p){
  float f = 0.0, amp = 0.5;
  for(int i=0;i<5;i++){
    f += amp * noise(p);
    p *= 2.02;
    amp *= 0.5;
  }
  return f;
}
void main(){
  vec2 p = (gl_FragCoord.xy - 0.5*u_res.xy) / u_res.y;
  float t = u_time * 0.03;

  float n1 = fbm(p*2.0 + t*vec2(0.8, 0.6));
  float n2 = fbm(p*1.1 - t*vec2(0.5, 0.7));
  float n3 = fbm(p*3.5 + t*vec2(-0.2, 0.3));
  float m = smoothstep(0.25, 0.85, (n1*0.6 + n2*0.35 + n3*0.2));

  float v = 1.0 - smoothstep(0.85, 1.5, length(p));
  float alpha = clamp(m * v, 0.0, 1.0);

  vec3 tint = u_tint;
  vec3 col = mix(vec3(0.0), tint, 0.65*m + 0.25*v);
  col = mix(col, vec3(dot(col, vec3(0.299,0.587,0.114))), 0.08);

  gl_FragColor = vec4(col, 0.24 + 0.40*alpha);
}
`;

const FRAG_MED = FRAG_HIGH.replace("precision highp float;", "precision mediump float;");

function primaryToRGB() {
  try {
    const s = getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim();
    if (s.startsWith("#")) {
      const h = s.slice(1);
      const full = h.length === 3 ? h.split("").map(c=>c+c).join("") : h;
      const n = parseInt(full, 16);
      return [(n>>16&255)/255,(n>>8&255)/255,(n&255)/255];
    }
    if (s.startsWith("rgb")) {
      const m = s.match(/rgba?\(([^)]+)\)/i);
      if (m) {
        const [r,g,b] = m[1].split(",").map(v=>parseFloat(v));
        return [r/255,g/255,b/255];
      }
    }
  } catch {
    // nothing
  }
  return [0.6,0.6,0.6];
}

export default function SmokeFX({ className = "" }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const startRef = useRef(0);
  const roRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // full stretch
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const prefersReduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const fit = () => {
      const w = Math.max(1, Math.floor((canvas.clientWidth || window.innerWidth || 1) * dpr));
      const h = Math.max(1, Math.floor((canvas.clientHeight || window.innerHeight || 1) * dpr));
      canvas.width = w;
      canvas.height = h;
    };
    fit();

    const stopRAF = () => cancelAnimationFrame(rafRef.current);
    const cleanup = (extra = () => {}) => () => {
      stopRAF();
      try { roRef.current?.disconnect(); } catch {
        // nothing
      }
      extra();
    };

    // --- 2D fallback runner with guards ---
    const run2D = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.warn("[SmokeFX] 2D context is null; aborting animation.");
        return () => {};
      }
      roRef.current = new ResizeObserver(fit);
      roRef.current.observe(canvas);

      let running = true;
      const loop2d = () => {
        if (!running) return;
        const [r,g,b] = primaryToRGB();
        const w = canvas.width, h = canvas.height;
        // guard lagi kalau ctx tiba-tiba null (browser edge cases)
        if (!ctx) return;
        ctx.clearRect(0,0,w,h);
        const grd = ctx.createRadialGradient(w*0.6,h*0.35,0,w*0.6,h*0.35, Math.max(w,h)*0.9);
        grd.addColorStop(0, `rgba(${(r*255)|0},${(g*255)|0},${(b*255)|0},0.20)`);
        grd.addColorStop(1, `rgba(${(r*255)|0},${(g*255)|0},${(b*255)|0},0)`);
        ctx.fillStyle = grd;
        ctx.fillRect(0,0,w,h);
        rafRef.current = requestAnimationFrame(loop2d);
      };
      loop2d();
      return () => { running = false; stopRAF(); };
    };

    // reduce motion → 2D
    if (prefersReduce) {
      const end2d = run2D();
      return cleanup(end2d);
    }

    // Try WebGL
    let gl =
      canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true }) ||
      canvas.getContext("experimental-webgl", { alpha: true, premultipliedAlpha: true });

    if (!gl) {
      const end2d = run2D();
      return cleanup(end2d);
    }

    const compileShader = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(sh) || "(no shader log)";
        console.warn("[SmokeFX] shader compile failed:", info);
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    let vs = compileShader(gl.VERTEX_SHADER, `attribute vec2 a_pos; void main(){ gl_Position = vec4(a_pos,0.0,1.0); }`);
    let fs = compileShader(gl.FRAGMENT_SHADER, FRAG_HIGH) || compileShader(gl.FRAGMENT_SHADER, FRAG_MED);
    if (!vs || !fs) {
      // total gagal → fallback 2D
      gl = null;
      const end2d = run2D();
      return cleanup(end2d);
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn("[SmokeFX] program link failed:", gl.getProgramInfoLog(prog));
      const end2d = run2D();
      return cleanup(() => {
        end2d();
        gl.deleteProgram(prog);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      });
    }

    gl.useProgram(prog);

    // quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1,-1,  1,-1, -1, 1,  -1, 1,  1,-1,  1, 1]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPos);

    // uniforms
    const u_res  = gl.getUniformLocation(prog, "u_res");
    const u_time = gl.getUniformLocation(prog, "u_time");
    const u_tint = gl.getUniformLocation(prog, "u_tint");

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    roRef.current = new ResizeObserver(() => {
      fit();
      gl.viewport(0,0,canvas.width,canvas.height);
    });
    roRef.current.observe(canvas);

    startRef.current = performance.now();
    const loop = () => {
      const t = (performance.now() - startRef.current) / 1000;
      const [r,g,b] = primaryToRGB();
      gl.viewport(0,0,canvas.width,canvas.height);
      gl.uniform2f(u_res, canvas.width, canvas.height);
      gl.uniform1f(u_time, t);
      gl.uniform3f(u_tint, r, g, b);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafRef.current = requestAnimationFrame(loop);
    };
    loop();

    return cleanup(() => {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    });
  }, []);

  return <canvas ref={canvasRef} className={`smoke-canvas ${className}`} aria-hidden="true" />;
}
