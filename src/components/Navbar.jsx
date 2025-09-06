// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Img } from 'react-image';
import { FaBars, FaTimes, FaSun, FaMoon, FaChevronDown } from 'react-icons/fa';
// ⛔️ Tidak impor motion:
import '../styles/Navbar.scss';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const nodeRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const onClick = (e) => { if (nodeRef.current && !nodeRef.current.contains(e.target)) setIsOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey); };
  }, []);

  const links = [
    { to: '/', label: 'Home', end: true },
    { to: '/about', label: 'About' },
    {
      to: '/projects', label: 'Projects',
      submenu: [
        { to: '/projects/web', label: 'Web Apps' },
        { to: '/projects/mobile', label: 'Mobile Apps' },
        { to: '/projects/landing', label: 'Landing Pages' },
      ],
    },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="navbar" ref={nodeRef} role="navigation" aria-label="Main navigation">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          <Img src={['/assets/logo.png', '/assets/logo-fallback.png']} alt="Logo" className="navbar-logo" />
          My Portfolio
        </Link>
      </div>

      <button
        className="navbar-toggle"
        onClick={() => setIsOpen(v => !v)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile menu tanpa framer-motion */}
      {isOpen && (
        <ul id="mobile-menu" className="navbar-links mobile">
          {links.map(({ to, label, end, submenu }) => (
            <li key={to}>
              {!submenu ? (
                <NavLink to={to} end={end} className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setIsOpen(false)}>
                  {label}
                </NavLink>
              ) : (
                <details>
                  <summary>{label} <FaChevronDown className="chevron" /></summary>
                  <ul className="submenu">
                    {submenu.map(s => (
                      <li key={s.to}>
                        <NavLink to={s.to} className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setIsOpen(false)}>
                          {s.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </li>
          ))}
          <li className="mobile-theme-toggle">
            <button onClick={() => setDarkMode(d => !d)} aria-label="Toggle theme">
              {darkMode ? <FaSun /> : <FaMoon />} {darkMode ? 'Light' : 'Dark'}
            </button>
          </li>
        </ul>
      )}

      <ul className="navbar-links desktop">
        {links.map(({ to, label, end, submenu }) => (
          <li key={to} className={submenu ? 'has-submenu' : ''}>
            <NavLink to={to} end={end} className={({ isActive }) => (isActive ? 'active' : '')}>{label}</NavLink>
            {submenu && (
              <ul className="submenu">
                {submenu.map(s => (
                  <li key={s.to}><NavLink to={s.to} className={({ isActive }) => (isActive ? 'active' : '')}>{s.label}</NavLink></li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <button className="theme-toggle" onClick={() => setDarkMode(d => !d)} aria-label="Toggle theme" title="Toggle theme">
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>
    </nav>
  );
};

export default Navbar;
