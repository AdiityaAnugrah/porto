import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ArchivePage from '../components/archive/ArchivePage';
import { posts } from '../data/posts';
import { useActiveLocale, useLocalizedPath } from '../lib/i18n';
import PortfolioImage from '../components/common/PortfolioImage';

const sorted = [...posts].sort((a,b) => new Date(b.date) - new Date(a.date));
export default function Blog() {
  const id = useActiveLocale() === 'id';
  const to = useLocalizedPath();
  const [featured,...rest] = sorted;
  return <><SEO title={id?'Tulisan | Aditya Anugrah':'Journal | Aditya Anugrah'} description="Catatan pengembangan website, sistem bisnis, dan proses di balik project."/>
    <ArchivePage eyebrow={id?'Jurnal pribadi':'Personal journal'} title={id?'Catatan dari balik layar.':'Notes from behind the scenes.'} subtitle={id?'Tentang membuat website, merapikan sistem, dan hal-hal yang saya pelajari sepanjang prosesnya.':'On building websites, improving systems, and the things I learn along the way.'}>
      {featured ? <><Link className="blog-feature" to={to(`/blog/${featured.id}`)}><PortfolioImage src={featured.image} alt={featured.title} width="1000" height="700"/><div><p className="section-label">{featured.category} / {featured.date}</p><h2>{featured.title}</h2><p>{featured.excerpt}</p><span className="text-link">{id?'Baca tulisan':'Read article'} <span aria-hidden="true">↗</span></span></div></Link>
      <div className="journal-list">{rest.map(post => <Link className="journal-row" key={post.id} to={to(`/blog/${post.id}`)}><p className="section-label">{post.category}<br/>{post.date}</p><h3>{post.title}</h3><span aria-hidden="true">↗</span></Link>)}</div></> : <div className="empty-state"><h2>{id?'Tulisan sedang disiapkan.':'Articles are on the way.'}</h2></div>}
    </ArchivePage>
  </>;
}
