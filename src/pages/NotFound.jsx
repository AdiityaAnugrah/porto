import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ArchivePage from '../components/archive/ArchivePage';
import { useActiveLocale, useLocalizedPath } from '../lib/i18n';

export default function NotFound() {
  const id = useActiveLocale() === 'id';
  const to = useLocalizedPath();
  return <><SEO title="404 | Aditya Anugrah" robots="noindex,nofollow"/><ArchivePage eyebrow="404" title={id?'Sepertinya salah jalan.':'A little off the path.'} subtitle={id?'Halaman yang kamu cari tidak ditemukan. Tautannya mungkin berubah, atau halamannya sudah tidak tersedia.':'The page you’re looking for wasn’t found. The link may have changed, or the page may no longer be available.'}><div className="empty-state"><h2>{id?'Kembali ke tempat yang kamu cari.':'Find your way back.'}</h2><p>{id?'Lihat project terbaru atau kembali ke beranda untuk mulai lagi.':'Browse my projects, or start again from the homepage.'}</p><div className="page-actions"><Link className="button button-primary" to={to('/')}>{id?'Ke beranda':'Go home'}</Link><Link className="button" to={to('/projects')}>{id?'Lihat karya':'View work'}</Link></div></div></ArchivePage></>;
}
