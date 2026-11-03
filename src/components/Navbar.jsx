import { useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { localizedPath, stripLocaleFromPath, useActiveLocale, useLocalizedPath } from '../lib/i18n';
import InterfaceSound from './common/InterfaceSound';
import BrandWordmark from './common/BrandWordmark';

export default function Navbar() {
  const location = useLocation();
  const locale = useActiveLocale();
  const to = useLocalizedPath();
  const menu = useRef(null);
  const id = locale === 'id';
  const links = [['/projects', id ? 'Karya' : 'Work'], ['/about', id ? 'Tentang' : 'About'], ['/blog', id ? 'Tulisan' : 'Journal'], ['/store', id ? 'Layanan' : 'Services']];
  const languagePath = localizedPath(`${stripLocaleFromPath(location.pathname)}${location.search}${location.hash}`, id ? 'en' : 'id');
  useEffect(() => { if (menu.current) menu.current.open = false; }, [location.pathname]);
  const escapeMenu = (event) => {
    if (event.key === 'Escape' && menu.current?.open) {
      menu.current.open = false;
      menu.current.querySelector('summary')?.focus();
    }
  };
  return (
    <header className="site-header" onKeyDown={escapeMenu}>
      <nav className="site-nav" aria-label={id ? 'Navigasi utama' : 'Main navigation'}>
        <Link to={to('/')} className="brand" aria-label={id ? 'Aditya Anugrah, beranda' : 'Aditya Anugrah, home'}><BrandWordmark /></Link>
        <div className="desktop-links">{links.map(([path, label]) => <NavLink key={path} to={to(path)} className={({isActive}) => isActive ? 'nav-link is-active' : 'nav-link'}>{label}</NavLink>)}</div>
        <div className="nav-actions">
          <InterfaceSound />
          <Link to={languagePath} className="language-switch" aria-label={id ? 'EN: Switch to English' : 'ID: Ganti ke Bahasa Indonesia'}>{id ? 'EN' : 'ID'}</Link>
          <Link to={to('/contact')} className="nav-contact">{id ? 'Diskusi project' : 'Let’s talk'}</Link>
          <details ref={menu} className="mobile-menu">
            <summary>Menu <span aria-hidden="true">+</span></summary>
            <div className="mobile-menu-panel" onClick={(event) => { if (event.target.closest('a')) menu.current.open = false; }}>
              <NavLink to={to('/')}>{id ? 'Beranda' : 'Home'}</NavLink>
              {links.map(([path,label]) => <NavLink key={path} to={to(path)}>{label}</NavLink>)}
              <NavLink to={to('/cv')}>CV</NavLink>
              <NavLink to={to('/contact')}>{id ? 'Kontak' : 'Contact'}</NavLink>
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}
