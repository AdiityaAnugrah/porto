import { Link } from 'react-router-dom';
import { useActiveLocale, useLocalizedPath } from '../../lib/i18n';

export default function ArchivePage({ eyebrow, title, subtitle, children, backTo = '/', actions, className = '', contentClassName = '' }) {
  const to = useLocalizedPath();
  const id = useActiveLocale() === 'id';
  return <article className={`interior-page ${className}`}>
    <header className="page-heading"><div className="container">
      <Link className="back-link" to={to(backTo)}><span aria-hidden="true">←</span> {backTo === '/' ? (id ? 'Beranda' : 'Home') : backTo === '/projects' ? (id ? 'Semua karya' : 'All work') : (id ? 'Semua tulisan' : 'All articles')}</Link>
      <p className="section-label">{eyebrow}</p><h1>{title}</h1>
      {subtitle && <p className="page-intro">{subtitle}</p>}
      {actions && <div className="page-actions">{actions}</div>}
    </div></header>
    <div className={`container page-content ${contentClassName}`}>{children}</div>
  </article>;
}
