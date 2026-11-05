import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageLoader from './components/common/PageLoader';
import ScrollMotion from './components/common/ScrollMotion';
import RouteBackdrop from './components/common/RouteBackdrop';

export default function Layout() {
  const { pathname, hash, key } = useLocation();
  const utility = /\/store\/(admin|order\/)/.test(pathname);
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return; }
    let targetId;
    try { targetId = decodeURIComponent(hash.slice(1)); } catch { return; }
    let frame = 0;
    const scrollToTarget = () => {
      const target = document.getElementById(targetId);
      if (!target) return false;
      frame = requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
      return true;
    };
    if (scrollToTarget()) return () => cancelAnimationFrame(frame);
    const observer = new MutationObserver(() => { if (scrollToTarget()) observer.disconnect(); });
    observer.observe(document.getElementById('main-content'), { childList: true, subtree: true });
    const timeout = window.setTimeout(() => observer.disconnect(), 10000);
    return () => { observer.disconnect(); window.clearTimeout(timeout); cancelAnimationFrame(frame); };
  }, [pathname, hash, key]);
  return <div className={`site-shell${utility ? ' utility-page' : ''}`}>
    {utility&&<RouteBackdrop/>}
    <ScrollMotion />
    <a className="skip-link" href="#main-content">Skip to content</a>
    <Navbar />
    <main id="main-content" tabIndex={-1}><Suspense fallback={<PageLoader />}><Outlet /></Suspense></main>
    <Footer />
  </div>;
}
