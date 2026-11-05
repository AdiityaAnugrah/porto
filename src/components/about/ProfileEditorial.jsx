import { useEffect, useRef, useState } from 'react';
import './profile-editorial.css';

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
  const dialog = useRef(null);
  const trigger = useRef(null);
  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    const returnFocus = trigger.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element.showModal();
    return () => {
      document.body.style.overflow = previous;
      if (element.open) element.close();
      returnFocus?.focus({ preventScroll: true });
    };
  }, [open]);
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
    {open && <dialog className="profile-photo-dialog" ref={dialog} data-lenis-prevent aria-labelledby="profile-photo-dialog-title" onClose={() => setOpen(false)} onClick={event => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setOpen(false);
    }}>
      <button type="button" className="profile-photo-close" onClick={() => setOpen(false)} autoFocus aria-label={id ? 'Tutup foto' : 'Close photo'}>×</button>
      <img src={photo === 'portrait' ? '/assets/me-sunset.jpeg' : '/assets/me-sunset.avif'} alt={photo === 'portrait' ? 'Aditya Anugrah' : (id ? 'Siluet di tepi pantai saat matahari terbenam' : 'A silhouette by the sea at sunset')} width="1005" height="1289"/>
      <div className="profile-dialog-caption"><h2 id="profile-photo-dialog-title">{photo === 'portrait' ? 'Aditya Anugrah' : (id ? 'Jeda sejenak.' : 'A moment away.')}</h2><p>{photo === 'portrait' ? 'Full-stack developer / Semarang' : (id ? 'Di luar layar / Suasana senja' : 'Beyond the screen / At sunset')}</p></div>
    </dialog>}
  </div>;
}
