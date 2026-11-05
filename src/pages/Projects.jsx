import { Link, useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import ArchivePage from '../components/archive/ArchivePage';
import WorkPreview from '../components/projects/WorkPreview';
import WorkstationScene from '../components/home/WorkstationScene';
import { projects } from '../data/projects';
import { stripLocaleFromPath, useActiveLocale, useLocalizedPath } from '../lib/i18n';

const categories = { '/projects/web':'Web Apps', '/projects/mobile':'Mobile Apps', '/projects/landing':'Landing Pages' };
export default function Projects() {
  const path = stripLocaleFromPath(useLocation().pathname);
  const id = useActiveLocale() === 'id';
  const to = useLocalizedPath();
  const visible = [...projects].sort((a,b) => b.year - a.year).filter(project => !categories[path] || project.category === categories[path]);
  return <>
    <SEO title={(id?'Karya':'Selected work')+(categories[path]?' / '+categories[path]:'')} description={id?'Website, aplikasi, dashboard, dan sistem bisnis yang dikerjakan Aditya Anugrah.':'Websites, applications, dashboards, and business systems built by full-stack developer Aditya Anugrah.'} robots={visible.length?'index,follow':'noindex,follow'}/>
    <ArchivePage background={<WorkstationScene />} eyebrow={id ? 'Portfolio pilihan' : 'Selected portfolio'} title={id ? 'Ide yang sudah jadi.' : 'Ideas, made real.'} subtitle={id ? 'Website, aplikasi, dan sistem operasional. Setiap project berangkat dari kebutuhan yang berbeda.' : 'Websites, applications, and operational systems. Each project starts with a different need.'}>
      <nav className="filters" aria-label={id ? 'Kategori project' : 'Project categories'}>{[[id?'Semua':'All','/projects'],['Web apps','/projects/web'],['Mobile apps','/projects/mobile'],['Landing pages','/projects/landing']].map(([label,href]) => <Link key={href} className="filter" to={to(href)} aria-current={path === href ? 'page' : undefined}>{label}</Link>)}</nav>
      {visible.length ? <div className="work-grid">{visible.map(project => <WorkPreview key={project.id} project={project}/>)}</div> : <div className="empty-state"><h2>{id ? 'Belum ada project di kategori ini.' : 'No projects in this category yet.'}</h2><Link className="text-link" to={to('/projects')}>{id?'Lihat semua karya':'View all work'}</Link></div>}
    </ArchivePage>
  </>;
}
