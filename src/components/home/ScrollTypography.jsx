import { useEffect, useRef } from 'react';

export default function ScrollTypography({ lines, label, active=true }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    const hero = node.closest('.home-hero');
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, visible = true, typeVisible = false;
    let pulseTimer, resetTimer;
    const stopPulse = () => { clearTimeout(pulseTimer);clearTimeout(resetTimer);node.classList.remove('type-pulse'); };
    const schedulePulse = (delay=6000) => {
      stopPulse();
      if(!active||media.matches||!visible||!typeVisible||document.hidden)return;
      pulseTimer=setTimeout(()=>{
        if(!document.querySelector('dialog[open]')&&!window.getSelection()?.toString())node.classList.add('type-pulse');
        resetTimer=setTimeout(()=>{node.classList.remove('type-pulse');schedulePulse(18000);},1600);
      },delay);
    };
    const draw = () => {
      frame = 0;
      const rect = hero.getBoundingClientRect();
      const progress = media.matches ? 0 : Math.max(0, Math.min(1, -rect.top / (rect.height * .8)));
      node.style.setProperty('--type-progress', progress.toFixed(4));
    };
    const update = () => { if (!frame && visible && !document.hidden) frame = requestAnimationFrame(draw); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedulePulse();if (visible) update(); else { cancelAnimationFrame(frame); frame = 0; } });
    observer.observe(hero);
    const pulseObserver=new IntersectionObserver(([entry])=>{typeVisible=entry.isIntersecting;schedulePulse();});
    pulseObserver.observe(node);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    const syncMotion = () => {draw();schedulePulse();};
    const visibility = () => {update();schedulePulse();};
    media.addEventListener('change', syncMotion);
    document.addEventListener('visibilitychange', visibility);
    update();
    return () => { stopPulse();cancelAnimationFrame(frame); observer.disconnect();pulseObserver.disconnect(); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); media.removeEventListener('change', syncMotion); document.removeEventListener('visibilitychange', visibility); };
  }, [active]);
  return <h1 ref={ref} className="scroll-typography" aria-label={label}>{lines.map((line, index) => <span className={`type-line type-line--${index}`} key={line} aria-hidden="true"><span className="type-line-inner">{line.split(' ').map((word, order) => <span className="type-word" key={`${word}-${order}`} style={{'--word-order':index*3+order}}><span className="type-glyphs">{word}</span><span className="type-space"> </span></span>)}</span></span>)}</h1>;
}
