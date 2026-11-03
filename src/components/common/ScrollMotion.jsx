import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const revealTargets = '.section-heading, .work-preview, .profile-portrait, .profile-copy, .journal-row, .page-heading .container, .page-content > .prose, .detail-section, .blog-feature, .contact-layout > div, .about-grid > div, .service-row, .billing-panel, .cv-sidebar, .timeline article, .footer-top';

export default function ScrollMotion() {
  const { pathname } = useLocation();
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const root = document.querySelector('.site-shell');
    if (!root || !window.IntersectionObserver) return;
    let stop = () => {};
    const setup = () => {
      stop();
      if (media.matches) return;
      const elements = new Set();
      let frame = 0;
      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
      const scan = () => {
        for (const element of root.querySelectorAll(revealTargets)) {
          if (elements.has(element) || element.closest('.utility-page main')) continue;
          element.style.setProperty('--reveal-delay', `${(elements.size % 3) * 55}ms`);
          elements.add(element);
          element.classList.add('scroll-reveal');
          observer.observe(element);
        }
      };
      const paint = () => {
        frame = 0;
        const header = root.querySelector('.site-header');
        header?.classList.toggle('is-scrolled', window.scrollY > 32);
        const hero = root.querySelector('.home-hero');
        if (hero && hero.getBoundingClientRect().bottom > 0) hero.style.setProperty('--hero-drift', `${Math.min(window.scrollY * 0.07, 36)}px`);
      };
      const scroll = () => { if (!frame) frame = requestAnimationFrame(paint); };
      const focus = event => {
        const element = event.target instanceof Element ? event.target.closest('.scroll-reveal') : null;
        if (element) { element.classList.add('is-revealed'); observer.unobserve(element); }
      };
      const mutations = new MutationObserver(() => { scan(); scroll(); });
      mutations.observe(root, { childList: true, subtree: true });
      scan(); paint();
      window.addEventListener('scroll', scroll, { passive: true });
      document.addEventListener('focusin', focus);
      stop = () => {
        observer.disconnect(); mutations.disconnect(); cancelAnimationFrame(frame);
        window.removeEventListener('scroll', scroll); document.removeEventListener('focusin', focus);
        for (const element of elements) { element.classList.remove('scroll-reveal', 'is-revealed'); element.style.removeProperty('--reveal-delay'); }
        root.querySelector('.home-hero')?.style.removeProperty('--hero-drift');
        root.querySelector('.site-header')?.classList.remove('is-scrolled');
      };
    };
    setup();
    media.addEventListener('change', setup);
    return () => { stop(); media.removeEventListener('change', setup); };
  }, [pathname]);
  return null;
}
