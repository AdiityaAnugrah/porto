import { useEffect, useRef, useState } from 'react';
import './profile-editorial.css';

const galleryPhotos = [
  { src: '/img/a.avif', width: 1086, height: 1448 },
  { src: '/img/b.avif', width: 1086, height: 1448 },
  { src: '/img/c.avif', width: 960, height: 1280 },
  { src: '/img/d.avif', width: 1070, height: 1600 },
  { src: '/img/e.avif', width: 1086, height: 1448 },
];

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

function GalleryPhoto({ photo, index, id, onOpen }) {
  const tilt = usePhotoTilt();
  const [failed, setFailed] = useState(false);
  const number = String(index + 1).padStart(2, '0');
  const title = id ? `Foto pilihan ${number}` : `Selected photo ${number}`;
  return <button type="button" className="profile-photo-card" aria-label={id ? `Perbesar ${title.toLowerCase()}` : `Enlarge ${title.toLowerCase()}`} aria-haspopup="dialog" onClick={event => onOpen({ ...photo, title, index }, event.currentTarget)} {...tilt}>
    {failed ? <span className="profile-photo-fallback">{id ? 'Foto belum berhasil dimuat.' : 'The photo could not be loaded.'}</span> : <img src={photo.src} alt={id ? `Foto koleksi personal Aditya Anugrah, ${number}` : `Aditya Anugrah’s personal photo collection, ${number}`} width={photo.width} height={photo.height} loading="lazy" decoding="async" onError={() => setFailed(true)}/>}
    <span className="profile-photo-number" aria-hidden="true">{number} / Personal</span>
    <span className="profile-photo-caption"><span className="profile-photo-kicker">{id ? 'Potongan keseharian' : 'Everyday moments'}</span><span className="profile-photo-title">{title}</span></span>
    <span className="profile-photo-expand" aria-hidden="true">↗</span>
  </button>;
}

export function ProfileGallery({ id }) {
  const [photo, setPhoto] = useState(null);
  const [failed, setFailed] = useState(false);
  const dialog = useRef(null);
  const trigger = useRef(null);
  useEffect(() => {
    if (!photo) return;
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
  }, [photo]);
  const close = () => setPhoto(null);
  return <section className="profile-gallery" aria-labelledby="profile-gallery-title">
    <div className="section-heading"><div><p className="section-label">{id ? 'Album personal' : 'Personal album'}</p><h2 id="profile-gallery-title">{id ? 'Beberapa potongan keseharian.' : 'A few everyday moments.'}</h2></div><span className="profile-gallery-count">{String(galleryPhotos.length).padStart(2, '0')} {id ? 'foto' : 'photos'}</span></div>
    <div className="profile-gallery-grid">{galleryPhotos.map((item, index) => <GalleryPhoto key={item.src} photo={item} index={index} id={id} onOpen={(selected, button) => { trigger.current = button; setFailed(false); setPhoto(selected); }}/>)}</div>
    {photo && <dialog ref={dialog} className="profile-photo-dialog" data-lenis-prevent aria-labelledby="profile-gallery-dialog-title" onClose={close} onClick={event => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
    }}>
      <button type="button" className="profile-photo-close" aria-label={id ? 'Tutup foto' : 'Close photo'} onClick={close} autoFocus>×</button>
      {failed ? <p className="profile-gallery-image-error" role="status">{id ? 'Foto belum berhasil dimuat.' : 'The photo could not be loaded.'}</p> : <img src={photo.src} alt={id ? `Foto koleksi personal Aditya Anugrah, ${photo.index + 1}` : `Aditya Anugrah’s personal photo collection, ${photo.index + 1}`} width={photo.width} height={photo.height} decoding="async" onError={() => setFailed(true)}/>}
      <div className="profile-dialog-caption"><h2 id="profile-gallery-dialog-title">{photo.title}</h2><p>{id ? 'Koleksi personal' : 'Personal collection'} / {photo.index + 1} {id ? 'dari' : 'of'} {galleryPhotos.length}</p></div>
    </dialog>}
  </section>;
}
