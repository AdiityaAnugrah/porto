import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import ArchivePage from '../components/archive/ArchivePage';
import NotFound from './NotFound';
import { projects } from '../data/projects';
import { useActiveLocale, useLocalizedPath } from '../lib/i18n';
import PortfolioImage from '../components/common/PortfolioImage';

export default function ProjectDetail() {
  const { id: projectId } = useParams();
  const id = useActiveLocale() === 'id';
  const to = useLocalizedPath();
  const project = projects.find(item => item.id === projectId);
  if (!project) return <NotFound/>;
  const sections = [[id?'Fitur':'Features',project.features],[id?'Tanggung jawab':'Responsibilities',project.responsibilities],[id?'Tantangan':'Challenges',project.challenges],[id?'Hasil project':'Project results',project.results]];
  const live = /^https?:\/\//.test(project.links?.live || '') ? project.links.live : null;
  return <><SEO title={project.title.replace(/—/g,'/')} description={project.summary} image={project.cover}/>
    <ArchivePage eyebrow={`${project.category} / ${project.year}`} title={project.title.replace(/\s*—\s*/g,' / ')} subtitle={project.summary} backTo="/projects" actions={<>{live && <a className="archive-btn archive-btn-primary" href={live} target="_blank" rel="noreferrer">{id?'Kunjungi website':'Visit website'} <span aria-hidden="true">↗</span></a>}{project.links?.code && <a className="archive-btn" href={project.links.code} target="_blank" rel="noreferrer">Source code</a>}</>}>
      <PortfolioImage className="article-cover" src={project.cover} alt={project.title} width="1200" height="700" fetchPriority="high"/>
      <dl className="project-facts">{[[id?'Peran':'Role',project.role],[id?'Klien':'Client',project.client],[id?'Durasi':'Duration',project.duration],[id?'Tim':'Team',project.team]].map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value || '-'}</dd></div>)}</dl>
      <div className="prose"><p>{project.summary}</p></div>
      <div className="detail-sections">{sections.filter(([,items]) => items?.length).map(([label,items]) => <section className="detail-section prose" key={label}><h2>{label}</h2><ul>{items.map(item => <li key={item}>{item}</li>)}</ul></section>)}</div>
      <div className="tech-list">{project.tech?.map(tech => <span className="tech-tag" key={tech}>{tech}</span>)}</div>
      {project.gallery?.length > 0 && <div className="detail-gallery">{project.gallery.map(item => <PortfolioImage key={item.src} src={item.src} alt={item.alt || project.title} width="1200" height="800" loading="lazy"/>)}</div>}
      <div className="page-actions"><Link className="text-link" to={to('/projects')}>{id?'Kembali ke semua karya':'Back to all work'}</Link></div>
    </ArchivePage>
  </>;
}
