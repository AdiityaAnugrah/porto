import { Link } from 'react-router-dom';
import { useActiveLocale, useLocalizedPath } from '../lib/i18n';

export default function Footer() {
  const to = useLocalizedPath();
  const id = useActiveLocale() === 'id';
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div><p className="section-label">{id ? 'Ada ide yang ingin diwujudkan?' : 'Have something in mind?'}</p><Link className="footer-invitation" to={to('/contact')}>{id ? 'Mari kita bangun.' : 'Let’s build it.'}</Link></div>
        <a className="footer-email" href="mailto:hello@adityaanugrah.me">hello@adityaanugrah.me</a>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} <Link to={to('/')}>Aditya Anugrah</Link></p>
        <nav aria-label={id?'Media sosial dan CV':'Social profiles and CV'}><a href="https://github.com/adiityaanugrah" target="_blank" rel="noreferrer">GitHub</a><a href="https://www.linkedin.com/in/aditya-anugrah/" target="_blank" rel="noreferrer">LinkedIn</a><Link to={to('/cv')}>CV</Link></nav>
        <nav aria-label={id?'Informasi website':'Website information'}><Link to={to('/privacy')}>{id?'Privasi':'Privacy'}</Link><Link to={to('/terms')}>{id?'Ketentuan':'Terms'}</Link><Link to={to('/invoice')}>Invoice</Link></nav>
      </div>
    </footer>
  );
}
