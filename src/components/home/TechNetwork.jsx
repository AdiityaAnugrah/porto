import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useActiveLocale, useLocalizedPath } from '../../lib/i18n';
import { createNetworkModel, projectNode } from './network-model';
import './workstation.css';

const fallback = createNetworkModel(26);
const fallbackPoints = fallback.nodes.map(node => projectNode(node,.3,.15));
const topics = [{ key:'developer',node:13 },{ key:'gaming',node:23 },{ key:'music',node:7 }];

export default function TechNetwork({ variant = 'ambient' }) {
  const ref = useRef(null), canvasRef = useRef(null);
  const dialogRef = useRef(null), triggerRef = useRef(null), paused = useRef(false);
  const [selected, setSelected] = useState(null);
  const id = useActiveLocale() === 'id', to = useLocalizedPath();
  const detail = {
    developer: { title:id?'Developer di Semarang.':'Developer in Semarang.',label:'Developer',body:id?'Saya Aditya Anugrah, full-stack developer. Saya membangun website bisnis, e-commerce, dashboard operasional, dan integrasi antar sistem.':'I’m Aditya Anugrah, a full-stack developer building business websites, e-commerce, operational dashboards, and system integrations.',extra:'React · Next.js · Laravel · CodeIgniter · Node.js · MySQL · PostgreSQL',href:'/projects',cta:id?'Lihat karya saya':'View my work' },
    gaming: { title:id?'Setelah kode, giliran game.':'After code, time for games.',label:'Gaming',body:id?'Gaming juga bagian dari keseharian saya. Saya bermain lewat Steam, termasuk PUBG. Profil dan aktivitas gaming saya ada di halaman Tentang.':'Gaming is part of my life too. I play on Steam, including PUBG. My gaming profile and activity are on the About page.',extra:'Steam / PUBG',href:'/about#personal-activity',cta:id?'Lihat aktivitas gaming':'See gaming activity' },
    music: { title:id?'Musik juga menemani.':'Music is part of it too.',label:id?'Musik':'Music',body:id?'Di luar pengembangan website dan gaming, saya juga suka mendengarkan musik. Aktivitas Spotify saya bisa kamu lihat bersama sisi personal lainnya di halaman Tentang.':'Outside web development and gaming, I enjoy listening to music. You can find my Spotify activity and more of my personal side on the About page.',extra:'Spotify',href:'/about#personal-activity',cta:id?'Lihat aktivitas musik':'See music activity' },
  };
  const interactive = variant === 'interactive';
  const openDetail = (key,event) => { triggerRef.current=event.currentTarget;paused.current=true;setSelected(key); };
  const closeDetail = () => { setSelected(null);paused.current=false;triggerRef.current?.focus({preventScroll:true}); };
  useEffect(() => { if (selected && !dialogRef.current.open) dialogRef.current.showModal(); },[selected]);
  useEffect(() => {
    const root = ref.current, canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) { root.dataset.status = 'fallback'; return; }
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    let model = createNetworkModel(), width = 0, height = 0, frame = 0, visible = false, elapsed = 0, previous = 0, lastDraw = 0;
    let cursorX = 0, cursorY = 0, targetX = 0, targetY = 0, scroll = 0;
    let draws = 0;
    function draw() {
      if (!width || !height) return;
      const yaw = .3 + elapsed * .018 + cursorX * .12 + scroll * .24;
      const pitch = .14 + Math.sin(elapsed * .11) * .035 + cursorY * .07;
      const points = model.nodes.map(node => projectNode(node,yaw,pitch));
      const size = Math.min(width * .32,height * .37);
      const centerX = width * .52, centerY = height * .49 - scroll * 12;
      const screen = point => [centerX + point.x * size,centerY + point.y * size];
      if (interactive) for (const topic of topics) {
        const button=root.querySelector(`[data-topic="${topic.key}"]`),point=points[topic.node];
        const [x,y]=screen(point),box=root.getBoundingClientRect();
        const safeX=Math.max(30,Math.min(x,innerWidth-box.left-30));
        if (button) { button.style.left=`${safeX}px`;button.style.top=`${y}px`; }
      }
      ctx.clearRect(0,0,width,height);
      ctx.lineWidth = .65;
      for (const [a,b] of model.edges) {
        const p = points[a], q = points[b], [x1,y1] = screen(p), [x2,y2] = screen(q);
        const depth = Math.max(0,Math.min(1,((p.depth + q.depth) / 2 + 1.5) / 3));
        ctx.strokeStyle = `rgba(151,185,199,${(.07 + depth * .17).toFixed(3)})`;
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
      }
      for (const point of [...points].sort((a,b) => a.depth-b.depth)) {
        const [x,y] = screen(point), alpha = Math.max(.24,Math.min(.85,(point.depth+2)/4));
        const radius = (point.accent ? 2.8 : 1.7) * point.scale;
        if (point.accent || point.depth > .6) {
          const halo = ctx.createRadialGradient(x,y,0,x,y,radius*5);
          halo.addColorStop(0,`rgba(162,196,209,${(alpha*.17).toFixed(3)})`); halo.addColorStop(1,'rgba(162,196,209,0)');
          ctx.fillStyle=halo; ctx.beginPath();ctx.arc(x,y,radius*5,0,Math.PI*2);ctx.fill();
        }
        ctx.fillStyle = point.accent ? `rgba(227,213,194,${alpha})` : `rgba(183,208,219,${alpha})`;
        ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.fill();
      }
      draws++;
      root.dataset.yaw = yaw.toFixed(4);
      root.dataset.draws = draws;
      root.dataset.nodes = model.nodes.length;
    }
    function tick(now) {
      frame=0;
      if (!visible || document.hidden) return;
      const fps = width < 600 ? 20 : 30;
      if (now-lastDraw >= 1000/fps && !paused.current) {
        const dt = previous ? Math.min((now-previous)/1000,.1) : 0;
        if (!paused.current) { elapsed+=dt;cursorX+=(targetX-cursorX)*.075;cursorY+=(targetY-cursorY)*.075; }
        previous=now;lastDraw=now;
        draw();
      }
      if (!motion.matches) frame=requestAnimationFrame(tick);
    }
    function sync() {
      cancelAnimationFrame(frame);frame=0;previous=0;
      const active=visible&&!document.hidden;
      root.dataset.active=active;
      if (!active) return;
      if (motion.matches) { elapsed=0;cursorX=0;cursorY=0;scroll=0;draw(); }
      else frame=requestAnimationFrame(tick);
    }
    function resize() {
      const rect=root.getBoundingClientRect();width=rect.width;height=rect.height;
      const ratio=Math.min(devicePixelRatio,1.5);
      canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);
      model=createNetworkModel(width<600?26:38);draw();
    }
    const pointer = event => {
      if (!interactive || motion.matches || !fine.matches || !visible || event.pointerType==='touch') return;
      const hero=root.parentElement.getBoundingClientRect();
      targetX=Math.max(-1,Math.min(1,(event.clientX-hero.left)/hero.width*2-1));
      targetY=Math.max(-1,Math.min(1,(event.clientY-hero.top)/hero.height*2-1));
    };
    const leave = () => { targetX=0;targetY=0; };
    const onScroll = () => {
      if (motion.matches || !visible) return;
      const rect=root.parentElement.getBoundingClientRect();scroll=Math.max(0,Math.min(1,-rect.top/rect.height));
    };
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});observer.observe(root);
    const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(root);
    root.parentElement.addEventListener('pointermove',pointer,{passive:true});root.parentElement.addEventListener('pointerleave',leave);
    window.addEventListener('scroll',onScroll,{passive:true});document.addEventListener('visibilitychange',sync);motion.addEventListener('change',sync);
    root.dataset.status='ready';resize();
    return () => {
      cancelAnimationFrame(frame);observer.disconnect();resizeObserver.disconnect();root.parentElement?.removeEventListener('pointermove',pointer);root.parentElement?.removeEventListener('pointerleave',leave);
      window.removeEventListener('scroll',onScroll);document.removeEventListener('visibilitychange',sync);motion.removeEventListener('change',sync);
    };
  }, [interactive]);
  return <div ref={ref} className="scene-background tech-network" data-status="loading" data-variant={variant} aria-hidden={interactive?undefined:true}>
    <canvas ref={canvasRef} className="network-canvas" aria-hidden="true"/>
    <svg className="network-fallback" viewBox="-320 -260 640 520" aria-hidden="true">{fallback.edges.map(([a,b])=><line key={`${a}-${b}`} x1={fallbackPoints[a].x*130} y1={fallbackPoints[a].y*130} x2={fallbackPoints[b].x*130} y2={fallbackPoints[b].y*130}/>)}{fallbackPoints.map((p,i)=><circle key={i} cx={p.x*130} cy={p.y*130} r={p.accent?2.8:1.5}/>)}</svg>
    {interactive && <>
      <div className="network-topics" role="group" aria-label={id?'Sisi personal Aditya':'Aditya’s personal side'}>{topics.map(topic=><button type="button" key={topic.key} className={`network-node network-node--${topic.key}`} data-topic={topic.key} aria-label={`${detail[topic.key].label} — Aditya Anugrah`} aria-haspopup="dialog" onClick={event=>openDetail(topic.key,event)} onPointerEnter={()=>{paused.current=true;}} onPointerLeave={()=>{if(!dialogRef.current?.open&&document.activeElement!==ref.current?.querySelector(`[data-topic="${topic.key}"]`))paused.current=false;}} onFocus={()=>{paused.current=true;}} onBlur={()=>{if(!dialogRef.current?.open)paused.current=false;}}><span className="network-node-dot"/><span className="network-node-label">{detail[topic.key].label}</span></button>)}</div>
      <dialog ref={dialogRef} className="network-detail" aria-labelledby="network-detail-title" onClose={closeDetail} onClick={event=>{if(event.target===event.currentTarget)event.currentTarget.close();}}>
        {selected && <article className="network-detail-content"><button className="network-detail-close" type="button" aria-label={id?'Tutup detail':'Close details'} onClick={()=>dialogRef.current.close()}>×</button><p className="network-detail-category">{detail[selected].label}</p><h2 id="network-detail-title">{detail[selected].title}</h2><p>{detail[selected].body}</p><p className="network-detail-extra">{detail[selected].extra}</p><Link className="text-link" to={to(detail[selected].href)} onClick={()=>dialogRef.current.close()}>{detail[selected].cta} <span aria-hidden="true">↗</span></Link></article>}
      </dialog>
    </>}
  </div>;
}
