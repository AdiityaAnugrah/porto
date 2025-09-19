// src/components/FXBubbles.jsx
import React, { useEffect, useRef } from "react";

/* ==== utils ==== */
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

/**
 * FXBubbles: efek bubble dengan opsi liquid/metaball.
 *
 * Props:
 * - className?: string
 * - motion?: boolean (default: true)  -> set false agar diam (render sekali)
 * - density?: number (0.4 - 1.5)      -> banyaknya bubble relatif (default 1)
 * - blur?: number (5 - 30)            -> kekuatan blur (default 14)
 */
export default function FXBubbles({
  className = "",
  motion = true,
  density = 1,
  blur = 14,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef();
  const bubblesRef = useRef([]);
  const colorRef = useRef({ r: 100, g: 100, b: 255 });

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });
    if (!ctx) return;

    let width = 0, height = 0, dpr = 1, running = true;

    const prefersReducedMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* === theme color reader === */
    const readPrimaryColor = () => {
      try {
        const c =
          getComputedStyle(document.documentElement)
            .getPropertyValue("--color-primary")
            ?.trim() || "#6aa0ff";
        colorRef.current = parseCssColorToRGB(c);
        // re-render saat warna berubah (kalau non-motion)
        if (!motion || prefersReducedMotion) drawOnce();
      } catch {
        colorRef.current = { r: 106, g: 160, b: 255 };
      }
    };
    readPrimaryColor();

    const htmlObs =
      typeof MutationObserver !== "undefined"
        ? new MutationObserver(readPrimaryColor)
        : null;
    htmlObs?.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "style", "class"],
    });
    const bodyObs =
      typeof MutationObserver !== "undefined"
        ? new MutationObserver(readPrimaryColor)
        : null;
    bodyObs?.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    /* === init & resize === */
    function makeBubble(w, h) {
      const r = rand(10, 28);
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: rand(-0.2, 0.2),
        vy: rand(-0.2, 0.2),
        r,
        a: rand(0.18, 0.34),
      };
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth || canvas.offsetWidth || 1;
      height = canvas.clientHeight || canvas.offsetHeight || 1;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const baseTarget = Math.max(14, Math.min(60, Math.round((width * height) / 20000)));
      const target = Math.round(baseTarget * density * (prefersReducedMotion || !motion ? 0.7 : 1));
      const arr = bubblesRef.current;
      while (arr.length < target) arr.push(makeBubble(width, height));
      if (arr.length > target) arr.length = target;

      if (!motion || prefersReducedMotion) drawOnce();
    }

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => resize())
        : null;
    if (ro) ro.observe(canvas);
    resize();

    /* === drawing helpers (liquid look) === */

    // gambar satu frame dengan efek liquid/metaball
    function drawFrame(dt = 16) {
      const { r, g, b } = colorRef.current;
      const bubbles = bubblesRef.current;

      // clear
      ctx.clearRect(0, 0, width, height);

      // latar lembut mengikuti warna primary
      const vg = ctx.createRadialGradient(
        width * 0.75,
        height * 0.15,
        0,
        width * 0.75,
        height * 0.15,
        Math.max(width, height) * 0.9
      );
      vg.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.08)`);
      vg.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.0)`);
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, width, height);

      // set gaya liquid
      ctx.globalCompositeOperation = "lighter";
      ctx.filter = `blur(${blur}px) saturate(140%)`; // blur besar -> menyatu

      // isi blobby
      for (let i = 0; i < bubbles.length; i++) {
        const p = bubbles[i];

        if (motion && !prefersReducedMotion) {
          // pergerakan sangat halus
          p.x += p.vx * (dt / 16);
          p.y += p.vy * (dt / 16);
          p.vx *= 0.995;
          p.vy *= 0.995;
          // bounce tepi (wrap lembut)
          if (p.x < -p.r) p.x = width + p.r;
          if (p.x > width + p.r) p.x = -p.r;
          if (p.y < -p.r) p.y = height + p.r;
          if (p.y > height + p.r) p.y = -p.r;
        }

        // inti warna (solid yang akan diblur)
        const grd = ctx.createRadialGradient(p.x, p.y, p.r * 0.25, p.x, p.y, p.r);
        grd.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${Math.min(0.8, p.a + 0.2)})`);
        grd.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // sambungan “metaball” sederhana: gradient di titik tengah antar bubble yg dekat
      for (let i = 0; i < bubbles.length; i++) {
        for (let j = i + 1; j < bubbles.length; j++) {
          const a = bubbles[i], bbl = bubbles[j];
          const dx = bbl.x - a.x, dy = bbl.y - a.y;
          const dist = Math.hypot(dx, dy);
          const maxLink = (a.r + bbl.r) * 1.05;
          if (dist < maxLink) {
            const mx = (a.x + bbl.x) / 2;
            const my = (a.y + bbl.y) / 2;
            const rr = Math.max(6, (a.r + bbl.r) / 2 - dist / 2);
            const g2 = ctx.createRadialGradient(mx, my, rr * 0.15, mx, my, rr);
            g2.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.35)`);
            g2.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
            ctx.fillStyle = g2;
            ctx.beginPath();
            ctx.arc(mx, my, rr, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // kembalikan state
      ctx.filter = "none";
      ctx.globalCompositeOperation = "source-over";

      // highlight tipis di atas agar ada depth (tidak diblur)
      for (let i = 0; i < bubbles.length; i++) {
        const p = bubbles[i];
        const highlight = ctx.createRadialGradient(
          p.x - p.r * 0.25,
          p.y - p.r * 0.25,
          0,
          p.x - p.r * 0.25,
          p.y - p.r * 0.25,
          p.r * 0.8
        );
        highlight.addColorStop(0, `rgba(255,255,255,0.14)`);
        highlight.addColorStop(1, `rgba(255,255,255,0)`);
        ctx.fillStyle = highlight;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawOnce() {
      // satu frame statis
      drawFrame(16);
    }

    // animasi (opsional)
    let last = performance.now();
    function loop(t) {
      if (!running) return;
      const dt = Math.min(40, t - last);
      last = t;
      drawFrame(dt);
      rafRef.current = requestAnimationFrame(loop);
    }

    // start
    if (motion && !prefersReducedMotion) {
      rafRef.current = requestAnimationFrame(loop);
    } else {
      drawOnce();
    }

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
      ro?.disconnect();
      htmlObs?.disconnect();
      bodyObs?.disconnect();
    };
  }, [motion, density, blur]);

  return (
    <canvas
      ref={canvasRef}
      className={`fx-bubbles-canvas ${className}`}
      aria-hidden="true"
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
