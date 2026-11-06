import { useEffect, useRef, useState } from 'react';
import './home-portrait.css';

export default function HomePortraitCard({ id }) {
  const root = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [originalReady, setOriginalReady] = useState(false);
  const [originalFailed, setOriginalFailed] = useState(false);
  const [cartoonFailed, setCartoonFailed] = useState(false);
  const reveal = originalReady && (hovered || focused || pinned || cartoonFailed);
  const unavailable = cartoonFailed && originalFailed;

  useEffect(() => {
    const element = root.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches || !window.IntersectionObserver) { element.dataset.entered = 'true'; return; }
    element.dataset.entered = 'false';
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      element.dataset.entered = 'true';
      observer.disconnect();
    }, { threshold: .12 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <figure ref={root} className="home-portrait" data-view={reveal ? 'original' : 'illustration'}>
    <div className="home-portrait-entry"><div className="home-portrait-frame">
      <div className="home-portrait-heading" aria-hidden="true"><span>{id ? 'Catatan personal' : 'Personal notes'}</span><span>Semarang / ID</span></div>
      <button className="home-portrait-photo" type="button" disabled={unavailable} aria-pressed={pinned} aria-label={pinned ? (id ? 'Tampilkan ilustrasi potret Aditya' : 'Show Aditya’s illustrated portrait') : (id ? 'Tampilkan foto asli Aditya' : 'Show Aditya’s original portrait')} onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true); }} onPointerLeave={() => setHovered(false)} onPointerCancel={() => setHovered(false)} onFocus={event => setFocused(event.currentTarget.matches(':focus-visible'))} onBlur={() => setFocused(false)} onClick={event => { if (event.detail === 0) { setFocused(false); setHovered(false); } setPinned(previous => !previous); }}>
        {!originalFailed && <img className="home-portrait-original" src="/assets/me-sunset.jpeg" alt="Aditya Anugrah" width="1005" height="1289" loading="lazy" decoding="async" onLoad={() => setOriginalReady(true)} onError={() => { setOriginalFailed(true); setOriginalReady(false); }}/ >}
        {!cartoonFailed && <img className="home-portrait-illustration" src="/assets/aditya-portrait-cartoon.avif" alt="" aria-hidden="true" width="1108" height="1420" loading="lazy" decoding="async" onError={() => setCartoonFailed(true)}/>}
        {cartoonFailed && !originalReady && <span className="home-portrait-unavailable" role="status">{unavailable ? (id ? 'Potret belum berhasil dimuat.' : 'The portrait could not be loaded.') : (id ? 'Memuat potret…' : 'Loading portrait…')}</span>}
        {!unavailable && <span className="home-portrait-medium" aria-hidden="true"><span className="home-portrait-medium-art">{id ? 'Ilustrasi' : 'Illustration'}</span><span className="home-portrait-medium-photo">{id ? 'Potret' : 'Portrait'}</span></span>}
      </button>
      <figcaption className="home-portrait-caption"><span className="home-portrait-caption-title">{id ? 'Di balik layar.' : 'Behind the screen.'}</span><span className="home-portrait-caption-detail">Developer / Gamer / {id ? 'Musik' : 'Music'}</span></figcaption>
    </div></div>
  </figure>;
}
