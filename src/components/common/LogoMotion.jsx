import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

const motionQuery = '(prefers-reduced-motion: reduce)';
const prefersReducedMotion = () => window.matchMedia(motionQuery).matches;
const subscribeToMotion = (onChange) => {
  const media = window.matchMedia(motionQuery);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};

export default function LogoMotion() {
  const reduced = useSyncExternalStore(subscribeToMotion, prefersReducedMotion, () => true);
  const [cycle, setCycle] = useState(0);
  const root = useRef(null);

  useEffect(() => {
    if (reduced) return;
    let visible = false;
    let timer;
    const syncTimer = () => {
      window.clearInterval(timer);
      if (visible && !document.hidden) timer = window.setInterval(() => setCycle(count => count + 1), 20000);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncTimer();
    }, { threshold: 0.1 });
    observer.observe(root.current);
    document.addEventListener('visibilitychange', syncTimer);
    return () => {
      window.clearInterval(timer);
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncTimer);
    };
  }, [reduced]);

  return (
    <div ref={root} className="logo-motion" aria-hidden="true">
      <span className="logo-motion__tilt">
        <span key={cycle} className="logo-motion__emblem" data-cycle={cycle}>
          <span className="logo-motion__slice logo-motion__slice--left"><img src="/assets/aa-mark-white.png" alt="" width="1024" height="1024" draggable="false" /></span>
          <span className="logo-motion__slice logo-motion__slice--right"><img src="/assets/aa-mark-white.png" alt="" width="1024" height="1024" draggable="false" /></span>
          <span className="logo-motion__shine" />
        </span>
      </span>
    </div>
  );
}
