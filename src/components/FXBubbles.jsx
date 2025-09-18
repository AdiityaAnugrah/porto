// src/components/FXBubbles.jsx
import React, { useEffect, useRef } from "react";

function parseCssColorToRGB(col) {
  if (!col) return { r: 100, g: 100, b: 255 };
  col = String(col).trim();
  if (col.startsWith("#")) {
    const h = col.slice(1);
    const norm = h.length === 3 ? h.split("").map((c) => c + c).join("") : h.padEnd(6, "0").slice(0, 6);
    const num = parseInt(norm, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }
  if (col.startsWith("rgb")) {
    const m = col.match(/rgba?\(([^)]+)\)/i);
    if (m) {
      const [r, g, b] = m[1].split(",").map((v) => parseFloat(v));
      return { r, g, b };
    }
  }
  return { r: 100, g: 100, b: 255 };
}
const rand = (min, max) => Math.random() * (max - min) + min;

export default function FXBubbles({ className = "" }) {
  const canvasRef = useRef(null);
  const rafRef = useRef();
  const bubblesRef = useRef([]);
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const colorRef = useRef({ r: 100, g: 100, b: 255 });

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0, height = 0, dpr = 1, running = true;
    const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const readPrimaryColor = () => {
      try {
        const c = getComputedStyle(document.documentElement).getPropertyValue("--color-primary")?.trim() || "#6aa0ff";
        colorRef.current = parseCssColorToRGB(c);
      } catch { colorRef.current = { r: 106, g: 160, b: 255 }; }
    };
    readPrimaryColor();

    const htmlObs = typeof MutationObserver !== "undefined" ? new MutationObserver(readPrimaryColor) : null;
    htmlObs?.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "style", "class"] });
    const bodyObs = typeof MutationObserver !== "undefined" ? new MutationObserver(readPrimaryColor) : null;
    bodyObs?.observe(document.body, { attributes: true, attributeFilter: ["class", "style"] });

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth || canvas.offsetWidth || 1;
      height = canvas.clientHeight || canvas.offsetHeight || 1;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = prefersReducedMotion ? 12 : Math.max(16, Math.min(70, Math.round((width * height) / 16000)));
      const arr = bubblesRef.current;
      while (arr.length < target) arr.push(makeBubble(width, height));
      if (arr.length > target) arr.length = target;
    }
    function makeBubble(w, h) {
      const r = rand(6, 18);
      return { x: Math.random() * w, y: Math.random() * h, vx: rand(-0.25, 0.25), vy: rand(-0.25, 0.25), r, alpha: rand(0.12, 0.28) };
    }

    function step() {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);
      const { r, g, b } = colorRef.current;
      const bubbles = bubblesRef.current;
      const pointer = pointerRef.current;

      const vg = ctx.createRadialGradient(width * 0.72, height * 0.1, 0, width * 0.72, height * 0.1, Math.max(width, height));
      vg.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.08)`);
      vg.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.00)`);
      ctx.fillStyle = vg; ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < bubbles.length; i++) {
        const p = bubbles[i];

        if (pointer.active) {
          const dx = p.x - pointer.x, dy = p.y - pointer.y, dist = Math.hypot(dx, dy), influence = 120;
          if (dist > 0 && dist < influence) {
            const force = (1 - dist / influence) * 0.8;
            p.vx += (dx / dist) * force * 0.12; p.vy += (dy / dist) * force * 0.12;
          }
        }

        p.x += p.vx; p.y += p.vy; p.vx *= 0.985; p.vy *= 0.985;
        if (p.x < -p.r) p.x = width + p.r; if (p.x > width + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = height + p.r; if (p.y > height + p.r) p.y = -p.r;

        const grd = ctx.createRadialGradient(p.x, p.y, p.r * 0.15, p.x, p.y, p.r);
        grd.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${Math.min(0.55, p.alpha + 0.15)})`);
        grd.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill();

        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 0.9, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.6})`; ctx.lineWidth = 0.8; ctx.stroke();
      }
      rafRef.current = requestAnimationFrame(step);
    }

    const onMove = (e) => {
      pointerRef.current.active = true;
      const rect = canvas.getBoundingClientRect();
      if ("touches" in e && e.touches.length) {
        const t = e.touches[0]; pointerRef.current.x = t.clientX - rect.left; pointerRef.current.y = t.clientY - rect.top;
      } else {
        pointerRef.current.x = e.clientX - rect.left; pointerRef.current.y = e.clientY - rect.top;
      }
    };
    const onLeave = () => { pointerRef.current.active = false; };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave);
    window.addEventListener("touchend", onLeave);

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => resize()) : null;
    if (ro) ro.observe(canvas);

    resize(); step();
    if (prefersReducedMotion) cancelAnimationFrame(rafRef.current);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
      ro?.disconnect(); htmlObs?.disconnect(); bodyObs?.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseout", onLeave);
      window.removeEventListener("touchend", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={`fx-bubbles-canvas ${className}`} aria-hidden="true" />;
}
