import { useCallback, useEffect, useRef, useState } from 'react';
import './profile-editorial.css';

const galleryPhotos = [
  { src: '/img/a.avif', width: 1086, height: 1448, title: ['Di bawah langit terbuka.', 'Under open skies.'], alt: ['Aditya di alam terbuka dengan latar perbukitan dan langit biru', 'Aditya outdoors against hills and a blue sky'], focus: '50% 38%', drift: 22 },
  { src: '/img/b.avif', width: 1086, height: 1448, title: ['Di antara bukit.', 'Among the hills.'], alt: ['Potret dengan latar lereng bukit keemasan', 'A portrait against golden hillsides'], focus: '50% 44%', drift: -32 },
  { src: '/img/c.avif', width: 960, height: 1280, title: ['Menjelang senja.', 'Before dusk.'], alt: ['Siluet di perbukitan menjelang matahari terbenam', 'A silhouette in the hills as the sun sets'], focus: '50% 48%', drift: 18 },
  { src: '/img/d.avif', width: 1070, height: 1600, title: ['Sisi lain saya.', 'Another side of me.'], alt: ['Potret Aditya dengan kemeja bermotif di dalam ruangan', 'An indoor portrait of Aditya wearing a patterned shirt'], focus: '50% 28%', drift: 28 },
  { src: '/img/e.avif', width: 1086, height: 1448, title: ['Jeda di dekat air terjun.', 'A pause by the waterfall.'], alt: ['Sosok yang menghadap air terjun di antara bebatuan dan pepohonan', 'A figure facing a waterfall among rocks and trees'], focus: '50% 54%', drift: -24 },
];

function useFloatingPhotos() {
  const gallery = useRef(null);
  useEffect(() => {
    const root = gallery.current;
    const media = window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 640px), (hover: none), (pointer: coarse)');
    const items = [...root.querySelectorAll('.profile-float-item')];
    let frame = 0, visible = false;
    const reset = () => items.forEach(item => item.style.removeProperty('transform'));
    const paint = () => {
      frame = 0;
      if (media.matches) { reset(); return; }
      if (!visible || document.hidden) return;
      const rect = root.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (innerHeight - rect.top) / (innerHeight + rect.height)));
      for (const item of items) item.style.transform = `translate3d(0, ${((1 - progress * 2) * Number(item.dataset.drift)).toFixed(2)}px, 0)`;
    };
    const update = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (!visible) { cancelAnimationFrame(frame); frame = 0; } else update(); }, { rootMargin: '100px' });
    observer.observe(root);
    window.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update);
    document.addEventListener('visibilitychange', update); media.addEventListener('change', update);
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); reset();
      window.removeEventListener('scroll', update); window.removeEventListener('resize', update);
      document.removeEventListener('visibilitychange', update); media.removeEventListener('change', update);
    };
  }, []);
  return gallery;
}

function containedPhotoBounds(image) {
  const rect = image.getBoundingClientRect();
  const width = image.naturalWidth || Number(image.getAttribute('width'));
  const height = image.naturalHeight || Number(image.getAttribute('height'));
  if (!width || !height) return rect;
  const scale = Math.min(rect.width / width, rect.height / height);
  return { left: rect.left + (rect.width - width * scale) / 2, top: rect.top + (rect.height - height * scale) / 2, width: width * scale, height: height * scale };
}

function useFlyingDialog(active, onClosed) {
  const dialog = useRef(null), trigger = useRef(null), closeFlight = useRef(null);
  const close = useCallback(() => { if (closeFlight.current) closeFlight.current(); else onClosed(); }, [onClosed]);
  useEffect(() => {
    if (!active) return;
    const element = dialog.current, button = trigger.current, source = button?.querySelector('img');
    const previous = document.body.style.overflow, previousVisibility = source?.style.visibility || '';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, animation = null, clone = null, closed = false, closing = false;
    const clearFlight = () => { animation?.cancel(); animation = null; clone?.remove(); clone = null; const image = element.querySelector(':scope > img'); if (image) image.style.opacity = ''; };
    const fly = (out, done) => {
      clearFlight();
      const image = element.querySelector(':scope > img');
      if (reduced.matches || !source?.isConnected || !image || typeof image.animate !== 'function') { done(); return; }
      const from = source.getBoundingClientRect(), to = containedPhotoBounds(image);
      if (!from.width || !from.height || !to.width || !to.height || from.bottom < 0 || from.top > innerHeight) { done(); return; }
      clone = image.cloneNode(); clone.removeAttribute('id'); clone.alt = ''; clone.setAttribute('aria-hidden', 'true');
      clone.className = 'profile-photo-flight';
      Object.assign(clone.style, { left: `${to.left}px`, top: `${to.top}px`, width: `${to.width}px`, height: `${to.height}px`, objectPosition: getComputedStyle(source).objectPosition });
      element.appendChild(clone); image.style.opacity = '0'; source.style.visibility = 'hidden';
      // Interpolate one fixed photo frame so differently cropped portraits never stretch.
      const origin = { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px`, borderRadius: '5px' };
      const expanded = { left: `${to.left}px`, top: `${to.top}px`, width: `${to.width}px`, height: `${to.height}px`, borderRadius: '0px' };
      animation = clone.animate(out ? [expanded, origin] : [origin, expanded], { duration: out ? 300 : 420, easing: 'cubic-bezier(.22,.75,.25,1)', fill: 'both' });
      animation.finished.then(() => { if (!closed) { clearFlight(); done(); } }).catch(() => {});
    };
    document.body.style.overflow = 'hidden'; element.showModal();
    frame = requestAnimationFrame(() => fly(false, () => {}));
    closeFlight.current = () => { if (closing) return; closing = true; cancelAnimationFrame(frame); fly(true, onClosed); };
    const motionChange = () => { if (reduced.matches) { clearFlight(); if (closing) onClosed(); } };
    reduced.addEventListener('change', motionChange);
    return () => {
      closed = true; cancelAnimationFrame(frame); clearFlight(); closeFlight.current = null;
      reduced.removeEventListener('change', motionChange);
      if (source) source.style.visibility = previousVisibility;
      document.body.style.overflow = previous;
      if (element.open) element.close(); button?.focus({ preventScroll: true });
    };
  }, [active, onClosed]);
  return { dialog, trigger, close };
}

function usePhotoTilt() {
  const frame = useRef(0);
  const target = useRef(null);
  const reset = () => {
    cancelAnimationFrame(frame.current);
    if (target.current) {
      target.current.style.removeProperty('--photo-rx');
      target.current.style.removeProperty('--photo-ry');
    }
  };
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  return {
    onPointerMove(event) {
      if (event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const element = event.currentTarget;
      const rect = element.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
      const y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
      target.current = element;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        element.style.setProperty('--photo-rx', `${-y * 4}deg`);
        element.style.setProperty('--photo-ry', `${x * 5}deg`);
      });
    },
    onPointerLeave: reset,
    onPointerCancel: reset,
    onBlur: reset,
  };
}

export default function ProfileEditorial({ id }) {
  const portraitTilt = usePhotoTilt();
  const workTilt = usePhotoTilt();
  const [open, setOpen] = useState(false);
  const [photo, setPhoto] = useState('portrait');
  const [failed, setFailed] = useState(false);
  const dismiss = useCallback(() => setOpen(false), []);
  const { dialog, trigger, close } = useFlyingDialog(open, dismiss);
  return <div className="profile-editorial" aria-label={id ? 'Potret dan sisi personal' : 'Portrait and personal details'}>
    <div className="profile-editorial-heading"><span>{id ? 'Catatan personal' : 'Personal notes'}</span><span>01 / 03</span></div>
    <div className="profile-bento">
      <button type="button" className="profile-photo-card profile-photo-card--portrait" aria-label={id ? 'Lihat foto profil Aditya Anugrah' : 'View Aditya Anugrah’s portrait'} aria-haspopup="dialog" onClick={event => { trigger.current = event.currentTarget; setPhoto('portrait'); setOpen(true); }} {...portraitTilt}>
        {failed ? <span className="profile-photo-fallback">Aditya Anugrah</span> : <img src="/assets/me-sunset.jpeg" alt={id ? 'Aditya Anugrah mengenakan kemeja hitam di depan dinding bertekstur' : 'Aditya Anugrah in a black shirt against a textured wall'} width="1005" height="1289" loading="lazy" decoding="async" onError={() => setFailed(true)}/>}
        <span className="profile-photo-number" aria-hidden="true">01 / {id ? 'Potret' : 'Portrait'}</span>
        <span className="profile-photo-caption"><span className="profile-photo-kicker">{id ? 'Di balik layar' : 'Behind the screen'}</span><span className="profile-photo-title">Aditya Anugrah</span><span className="profile-photo-subtitle">Full-stack developer / Semarang</span></span>
        <span className="profile-photo-expand" aria-hidden="true">↗</span>
      </button>
      <button type="button" className="profile-photo-card profile-photo-card--scene" aria-haspopup="dialog" aria-label={id ? 'Lihat foto suasana senja' : 'View the sunset photo'} onClick={event => { trigger.current = event.currentTarget; setPhoto('sunset'); setOpen(true); }} {...workTilt}>
        <img src="/assets/me-sunset.avif" alt={id ? 'Siluet di tepi pantai saat matahari terbenam' : 'A silhouette by the sea at sunset'} width="1005" height="1289" loading="lazy" decoding="async"/>
        <span className="profile-photo-number" aria-hidden="true">02 / {id ? 'Jeda' : 'Pause'}</span>
        <span className="profile-photo-caption"><span className="profile-photo-kicker">{id ? 'Di luar layar' : 'Beyond the screen'}</span><span className="profile-photo-title">{id ? 'Jeda sejenak.' : 'A moment away.'}</span><span className="profile-photo-subtitle">{id ? 'Suasana senja' : 'At sunset'}</span></span>
      </button>
      <a className="profile-personal-note" href="#personal-activity"><span className="profile-note-index">03 / {id ? 'Di luar kode' : 'Beyond code'}</span><span className="profile-note-title">{id ? <>Bukan hanya<br/>baris kode.</> : <>More than<br/>lines of code.</>}</span><span className="profile-note-interests">Gaming / {id ? 'Musik' : 'Music'} <span aria-hidden="true">↗</span></span></a>
    </div>
    <p className="profile-editorial-footnote">{id ? 'Developer, penikmat game, dan pendengar musik.' : 'Developer, gamer, and music listener.'}</p>
    {open && <dialog className="profile-photo-dialog" ref={dialog} data-lenis-prevent aria-labelledby="profile-photo-dialog-title" onClose={dismiss} onCancel={event => { event.preventDefault(); close(); }} onClick={event => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
    }}>
      <button type="button" className="profile-photo-close" onClick={close} autoFocus aria-label={id ? 'Tutup foto' : 'Close photo'}>×</button>
      <img src={photo === 'portrait' ? '/assets/me-sunset.jpeg' : '/assets/me-sunset.avif'} alt={photo === 'portrait' ? 'Aditya Anugrah' : (id ? 'Siluet di tepi pantai saat matahari terbenam' : 'A silhouette by the sea at sunset')} width="1005" height="1289"/>
      <div className="profile-dialog-caption"><h2 id="profile-photo-dialog-title">{photo === 'portrait' ? 'Aditya Anugrah' : (id ? 'Jeda sejenak.' : 'A moment away.')}</h2><p>{photo === 'portrait' ? 'Full-stack developer / Semarang' : (id ? 'Di luar layar / Suasana senja' : 'Beyond the screen / At sunset')}</p></div>
    </dialog>}
  </div>;
}

function GalleryPhoto({ photo, index, id, onOpen }) {
  const tilt = usePhotoTilt();
  const [failed, setFailed] = useState(false);
  const number = String(index + 1).padStart(2, '0');
  const title = photo.title[id ? 0 : 1];
  return <div className="profile-float-item" data-drift={photo.drift}><div className="profile-float-frame"><button type="button" className="profile-photo-card" aria-label={id ? `Perbesar foto: ${title}` : `Enlarge photo: ${title}`} aria-haspopup="dialog" onClick={event => onOpen({ ...photo, title, index }, event.currentTarget)} {...tilt}>
    {failed ? <span className="profile-photo-fallback">{id ? 'Foto belum berhasil dimuat.' : 'The photo could not be loaded.'}</span> : <img src={photo.src} alt={photo.alt[id ? 0 : 1]} style={{ objectPosition: photo.focus }} width={photo.width} height={photo.height} loading="lazy" decoding="async" onError={() => setFailed(true)}/>}
    <span className="profile-photo-number" aria-hidden="true">{number} / Personal</span>
    <span className="profile-photo-caption"><span className="profile-photo-kicker">{id ? 'Potongan keseharian' : 'Everyday moments'}</span><span className="profile-photo-title">{title}</span></span>
    <span className="profile-photo-expand" aria-hidden="true">↗</span>
  </button></div></div>;
}

export function ProfileGallery({ id }) {
  const [photo, setPhoto] = useState(null);
  const [failed, setFailed] = useState(false);
  const gallery = useFloatingPhotos();
  const dismiss = useCallback(() => setPhoto(null), []);
  const { dialog, trigger, close } = useFlyingDialog(Boolean(photo), dismiss);
  return <section ref={gallery} className="profile-gallery" aria-labelledby="profile-gallery-title">
    <div className="section-heading"><div><p className="section-label">{id ? 'Album personal' : 'Personal album'}</p><h2 id="profile-gallery-title">{id ? 'Beberapa potongan keseharian.' : 'A few everyday moments.'}</h2></div><span className="profile-gallery-count">{String(galleryPhotos.length).padStart(2, '0')} {id ? 'foto' : 'photos'}</span></div>
    <div className="profile-gallery-grid">{galleryPhotos.map((item, index) => <GalleryPhoto key={item.src} photo={item} index={index} id={id} onOpen={(selected, button) => { trigger.current = button; setFailed(false); setPhoto(selected); }}/>)}</div>
    {photo && <dialog ref={dialog} className="profile-photo-dialog" data-lenis-prevent aria-labelledby="profile-gallery-dialog-title" onClose={dismiss} onCancel={event => { event.preventDefault(); close(); }} onClick={event => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
    }}>
      <button type="button" className="profile-photo-close" aria-label={id ? 'Tutup foto' : 'Close photo'} onClick={close} autoFocus>×</button>
      {failed ? <p className="profile-gallery-image-error" role="status">{id ? 'Foto belum berhasil dimuat.' : 'The photo could not be loaded.'}</p> : <img src={photo.src} alt={photo.alt[id ? 0 : 1]} width={photo.width} height={photo.height} decoding="async" onError={() => setFailed(true)}/>}
      <div className="profile-dialog-caption"><h2 id="profile-gallery-dialog-title">{photo.title}</h2><p>{id ? 'Koleksi personal' : 'Personal collection'} / {photo.index + 1} {id ? 'dari' : 'of'} {galleryPhotos.length}</p></div>
    </dialog>}
  </section>;
}
