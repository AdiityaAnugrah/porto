import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageLoader from './components/common/PageLoader';
import ScrollMotion from './components/common/ScrollMotion';

export default function Layout() {
  const { pathname, hash } = useLocation();
  const utility = /\/store\/(admin|order\/)/.test(pathname);
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return; }
    const timer = window.setTimeout(() => document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView(), 100);
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);
  return <div className={`site-shell${utility ? ' utility-page' : ''}`}>
    <ScrollMotion />
    <a className="skip-link" href="#main-content">Skip to content</a>
    <Navbar />
    <main id="main-content" tabIndex={-1}><Suspense fallback={<PageLoader />}><Outlet /></Suspense></main>
    <Footer />
  </div>;
}
