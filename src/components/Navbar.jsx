// src/components/Navbar.jsx
import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Img } from 'react-image';
import { FaBars, FaTimes, FaSun, FaMoon, FaChevronDown } from 'react-icons/fa';
import '../styles/Navbar.scss';

const BREAKPOINT = 1024;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);       // drawer mobile
  const [openMenu, setOpenMenu] = useState(null);    // submenu (mobile + tablet)
  const [darkMode, setDarkMode] = useState(() => {
    try {
      if (typeof document !== 'undefined') {
        const htmlPref = document.documentElement.getAttribute('data-theme');
        if (htmlPref) return htmlPref === 'dark';
      }
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('theme');
        if (saved) return saved === 'dark';
      }
    } catch {
      // ignore
    }
    return true;
  });

  const nodeRef = useRef(null);
  const location = useLocation();
  const scrollYRef = useRef(0);

  // sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    document.body.classList.toggle('dark-mode', darkMode);
    try { localStorage.setItem('theme', darkMode ? 'dark' : 'light'); } catch {
      // ignore
    }
  }, [darkMode]);

  // close on route change
  useEffect(() => { setIsOpen(false); setOpenMenu(null); }, [location.pathname]);

  // click outside + ESC
  useEffect(() => {
    const onPointer = (e) => {
      if (!isOpen) return;
      if (nodeRef.current && !nodeRef.current.contains(e.target)) {
        setIsOpen(false); setOpenMenu(null);
      }
    };
    const onKey = (e) => { if (e.key === 'Escape') { setIsOpen(false); setOpenMenu(null); } };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('touchstart', onPointer, { passive: true });
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('touchstart', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  // scroll lock when drawer open
  useEffect(() => {
    const body = document.body;
    if (isOpen) {
      scrollYRef.current = window.scrollY || window.pageYOffset || 0;
      body.style.position = 'fixed';
      body.style.top = `-${scrollYRef.current}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.width = '100%';
    } else {
      const y = scrollYRef.current;
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
      if (y) window.scrollTo(0, y);
    }
    return () => {
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
    };
  }, [isOpen]);

  // auto-close drawer when resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= BREAKPOINT) setIsOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const links = [
    { to: '/', label: 'Home', end: true },
    { to: '/about', label: 'About' },
    {
      to: '/projects',
      label: 'Projects',
      key: 'projects',
      submenu: [
        { to: '/projects/web', label: 'Web Apps' },
        { to: '/projects/mobile', label: 'Mobile Apps' },
        { to: '/projects/landing', label: 'Landing Pages' },
      ],
    },
    { to: '/contact', label: 'Contact' },
  ];

  const toggleSubmenu = (key) => setOpenMenu((p) => (p === key ? null : key));

  // handle parent menu click on tablet (<=1024px): toggle instead of navigate
  const onParentClick = (e, key) => {
    if (window.innerWidth <= BREAKPOINT) {
      e.preventDefault();
      toggleSubmenu(key);
    }
  };

  const logoSrc = darkMode ? '/assets/aa-mark-white.png' : '/assets/aa-mark-dark.png';
  const logoFallback = '/assets/aa-mark-primary.png';

  return (
    <>
      <nav className="navbar" ref={nodeRef} role="navigation" aria-label="Main navigation">
        <div className="navbar__inner">
          {/* Brand */}
          <div className="navbar-brand">
            <Link to="/" className="brand-link" aria-label="Go to homepage">
              <Img src={[logoSrc, logoFallback]} alt="AA Logo" className="navbar-logo" />
            </Link>
          </div>

          {/* Desktop/Tablet menu (CSS yang atur visibility) */}
          <ul className="navbar-links desktop" role="menubar" aria-label="Primary">
            {links.map(({ to, label, end, submenu, key }) => (
              <li
                key={to}
                className={`${submenu ? 'has-submenu' : ''} ${openMenu === key ? 'open' : ''}`}
                role="none"
              >
                {submenu ? (
                  <NavLink
                    to={to}
                    end={end}
                    role="menuitem"
                    className={({ isActive }) => (isActive ? 'active' : '')}
                    aria-haspopup="true"
                    aria-expanded={openMenu === key}
                    onClick={(e) => onParentClick(e, key)}
                  >
                    {label}
                    <FaChevronDown className="chevron" aria-hidden />
                  </NavLink>
                ) : (
                  <NavLink
                    to={to}
                    end={end}
                    role="menuitem"
                    className={({ isActive }) => (isActive ? 'active' : '')}
                  >
                    {label}
                  </NavLink>
                )}

                {submenu && (
                  <ul className="submenu" role="menu" aria-label={`${label} submenu`}>
                    {submenu.map((s) => (
                      <li key={s.to} role="none">
                        <NavLink to={s.to} role="menuitem" className={({ isActive }) => (isActive ? 'active' : '')}>
                          {s.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {/* Theme toggle */}
          <button
            className="theme-toggle"
            onClick={() => setDarkMode((d) => !d)}
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          {/* Burger (mobile only) */}
          <button
            className="navbar-toggle"
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Drawer (mobile only) */}
        <div id="mobile-menu" className={`mobile-drawer ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
          <ul className="navbar-links mobile" role="menu" aria-label="Mobile primary">
            {links.map(({ to, label, end, submenu, key }) => (
              <li key={to} className={submenu ? 'has-submenu' : ''} role="none">
                {!submenu ? (
                  <NavLink
                    to={to}
                    end={end}
                    role="menuitem"
                    className={({ isActive }) => (isActive ? 'active' : '')}
                    onClickCapture={() => setIsOpen(false)}
                  >
                    {label}
                  </NavLink>
                ) : (
                  <>
                    <button
                      type="button"
                      className="submenu-toggle"
                      aria-expanded={openMenu === key}
                      aria-controls={`submenu-${key}`}
                      onClick={() => toggleSubmenu(key)}
                    >
                      {label} <FaChevronDown className="chevron" aria-hidden />
                    </button>
                    <ul
                      id={`submenu-${key}`}
                      className={`submenu ${openMenu === key ? 'open' : ''}`}
                      role="menu"
                      aria-label={`${label} submenu`}
                    >
                      {submenu.map((s) => (
                        <li key={s.to} role="none">
                          <NavLink
                            to={s.to}
                            role="menuitem"
                            className={({ isActive }) => (isActive ? 'active' : '')}
                            onClickCapture={() => { setIsOpen(false); setOpenMenu(null); }}
                          >
                            {s.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </li>
            ))}

            <li className="mobile-theme-toggle" role="none">
              <button onClick={() => setDarkMode((d) => !d)} role="menuitem">
                {darkMode ? <FaSun /> : <FaMoon />} {darkMode ? 'Light' : 'Dark'}
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Overlay blur di belakang (fokus ke menu) */}
      <div
        className={`navbar-backdrop ${isOpen ? 'show' : ''}`}
        aria-hidden={!isOpen}
        onClick={() => { setIsOpen(false); setOpenMenu(null); }}
      />
    </>
  );
};

export default Navbar;
