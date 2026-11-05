import { useEffect, useId, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useActiveLocale, useLocalizedPath } from '../../lib/i18n';

export default function ProfileDetails({ topic, onClose }) {
  const ref=useRef(null), pressedOutside=useRef(false), titleId=useId();
  const id=useActiveLocale()==='id',to=useLocalizedPath();
  const content={
    developer:{label:id?'Pekerjaan':'Work',title:id?'Developer di Semarang.':'Developer in Semarang.',body:id?'Saya Aditya Anugrah, full-stack developer. Saya membangun website bisnis, e-commerce, dashboard operasional, dan integrasi antar sistem.':'I’m Aditya Anugrah, a full-stack developer building business websites, e-commerce, operational dashboards, and system integrations.',extra:'React · Next.js · Laravel · CodeIgniter · Node.js · MySQL · PostgreSQL',href:'/projects',cta:id?'Lihat karya saya':'View my work'},
    gaming:{label:'Gaming',title:id?'Setelah kode, giliran game.':'After code, time for games.',body:id?'Gaming juga bagian dari keseharian saya. Saya bermain lewat Steam, termasuk PUBG. Profil dan aktivitas gaming saya bisa kamu lihat di halaman Tentang.':'Gaming is part of my life too. I play on Steam, including PUBG. My profile and gaming activity are on the About page.',extra:'Steam / PUBG',href:'/about#personal-activity',cta:id?'Lihat aktivitas gaming':'See gaming activity'},
    music:{label:id?'Musik':'Music',title:id?'Musik juga menemani.':'Music is part of it too.',body:id?'Selain mengembangkan website dan bermain game, saya juga suka mendengarkan musik. Aktivitas Spotify saya ada bersama sisi personal lainnya di halaman Tentang.':'Alongside building websites and playing games, I enjoy listening to music. My Spotify activity is on the About page.',extra:'Spotify',href:'/about#personal-activity',cta:id?'Lihat aktivitas musik':'See music activity'},
  }[topic];
  useEffect(()=>{
    const dialog=ref.current,html=document.documentElement,body=document.body;
    const previous={htmlOverflow:html.style.overflow,bodyOverflow:body.style.overflow,gutter:html.style.scrollbarGutter};
    html.style.scrollbarGutter='stable';html.style.overflow='hidden';body.style.overflow='hidden';
    dialog.showModal();
    return()=>{html.style.overflow=previous.htmlOverflow;body.style.overflow=previous.bodyOverflow;html.style.scrollbarGutter=previous.gutter;if(dialog.open)dialog.close();};
  },[]);
  const outside=event=>{const r=event.currentTarget.getBoundingClientRect();return event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom;};
  return <dialog ref={ref} className="network-detail pc-detail" aria-labelledby={titleId} onClose={event=>{if(!event.currentTarget.open)onClose();}} onPointerDown={event=>{pressedOutside.current=outside(event);}} onPointerUp={event=>{if(pressedOutside.current&&outside(event))event.currentTarget.close();pressedOutside.current=false;}}>
    <article className="network-detail-content"><button className="network-detail-close" type="button" aria-label={id?'Tutup detail':'Close details'} onClick={()=>ref.current.close()}>×</button><p className="network-detail-category">{content.label}</p><h2 id={titleId}>{content.title}</h2><p>{content.body}</p><p className="network-detail-extra">{content.extra}</p><Link className="text-link" to={to(content.href)} onClick={()=>ref.current.close()}>{content.cta} <span aria-hidden="true">↗</span></Link></article>
  </dialog>;
}
