import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useLocalizedPath } from '../../lib/i18n';
import PortfolioImage from '../common/PortfolioImage';
import './project-depth.css';

export default function WorkPreview({ project, priority = false }) {
  const to = useLocalizedPath();
  const domain=/^https?:\/\//.test(project.links?.live||'')?new URL(project.links.live).hostname.replace(/^www\./,''):null;
  const frame = useRef(0);
  useEffect(()=>()=>cancelAnimationFrame(frame.current),[]);
  const tilt = event => {
    if (!matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;
    const node = event.currentTarget;
    const rect = node.getBoundingClientRect();
    const x=Math.max(-.5,Math.min(.5,(event.clientX-rect.left)/rect.width-.5));
    const y=Math.max(-.5,Math.min(.5,(event.clientY-rect.top)/rect.height-.5));
    cancelAnimationFrame(frame.current);
    frame.current=requestAnimationFrame(()=>{
      node.style.setProperty('--project-rx',`${(-y*7).toFixed(2)}deg`);node.style.setProperty('--project-ry',`${(x*8).toFixed(2)}deg`);
      node.style.setProperty('--project-x',`${(x*12).toFixed(2)}px`);node.style.setProperty('--project-y',`${(y*9).toFixed(2)}px`);
      node.style.setProperty('--project-light',`${((x+.5)*100).toFixed(1)}%`);frame.current=0;
      node.style.setProperty('--project-fold',`${(68+(x+.5)*28).toFixed(1)}px`);
    });
  };
  const reset = event => { cancelAnimationFrame(frame.current);frame.current=0;for(const[property,value]of Object.entries({'--project-rx':'0deg','--project-ry':'0deg','--project-x':'0px','--project-y':'0px','--project-light':'50%'}))event.currentTarget.style.setProperty(property,value); };
  return <Link className="work-preview" onPointerMove={tilt} onPointerLeave={reset} onBlur={reset} to={to(`/projects/item/${encodeURIComponent(project.id)}`)}>
    <div className="work-image">
      <div className="work-underlay" aria-hidden="true">{project.relatedSites?.[0]?.image&&<PortfolioImage src={project.relatedSites[0].image} alt="" width="1440" height="960" loading="lazy"/>}</div>
      <div className="work-sheet"><PortfolioImage src={project.cover} alt={project.title} width="1440" height="960" loading={priority ? 'eager' : 'lazy'} /></div>
      <span className="work-fold" aria-hidden="true"/>
      {domain&&<span className="work-site-domain">{domain}</span>}
      <span className="work-open" aria-hidden="true">↗</span>
    </div>
    <div className="work-caption"><div><p className="section-label">{project.category} / {project.year}</p><h3>{project.title.replace(/\s*—\s*/g, ' / ')}</h3></div><span className="work-role">{project.role}</span></div>
    <p className="work-summary">{project.summary}</p>
  </Link>;
}
