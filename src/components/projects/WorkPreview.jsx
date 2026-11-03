import { Link } from 'react-router-dom';
import { useLocalizedPath } from '../../lib/i18n';
import PortfolioImage from '../common/PortfolioImage';

export default function WorkPreview({ project, priority = false }) {
  const to = useLocalizedPath();
  return <Link className="work-preview" to={to(`/projects/item/${encodeURIComponent(project.id)}`)}>
    <div className="work-image"><PortfolioImage src={project.cover} alt={project.title} width="1200" height="800" loading={priority ? 'eager' : 'lazy'} /><span className="work-open" aria-hidden="true">↗</span></div>
    <div className="work-caption"><div><p className="section-label">{project.category} / {project.year}</p><h3>{project.title.replace(/\s*—\s*/g, ' / ')}</h3></div><span className="work-role">{project.role}</span></div>
    <p className="work-summary">{project.summary}</p>
  </Link>;
}
