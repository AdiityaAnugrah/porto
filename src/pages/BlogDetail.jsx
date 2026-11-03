import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SEO from '../components/SEO';
import ArchivePage from '../components/archive/ArchivePage';
import NotFound from './NotFound';
import { posts } from '../data/posts';
import { useActiveLocale, useLocalizedPath } from '../lib/i18n';
import PortfolioImage from '../components/common/PortfolioImage';

export default function BlogDetail() {
  const { id: postId } = useParams();
  const id = useActiveLocale() === 'id';
  const to = useLocalizedPath();
  const post = posts.find(item => item.id === postId);
  if (!post) return <NotFound/>;
  return <><SEO title={post.title} description={post.excerpt} image={post.image} type="article"/>
    <ArchivePage eyebrow={post.category} title={post.title} subtitle={post.excerpt} backTo="/blog">
      <PortfolioImage className="article-cover" src={post.image} alt={post.title} width="1200" height="700" fetchPriority="high"/>
      <div className="article-layout"><aside className="article-aside"><p>Aditya Anugrah<br/><time dateTime={post.date}>{new Intl.DateTimeFormat(id?'id-ID':'en-GB',{day:'numeric',month:'long',year:'numeric'}).format(new Date(post.date))}</time></p><p>{post.category}</p><Link className="text-link" to={to('/blog')}>{id?'Semua tulisan':'All articles'}</Link></aside><div className="prose"><ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown></div></div>
    </ArchivePage>
  </>;
}
