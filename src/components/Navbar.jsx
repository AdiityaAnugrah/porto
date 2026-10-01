import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome, FaUser, FaCode, FaEnvelope, FaBookOpen, FaShoppingBag, FaFileInvoice } from "react-icons/fa";
import { stripLocaleFromPath, useLocalizedPath } from "../lib/i18n";

const navItems = [
  { path: "/", label: "Home", icon: FaHome },
  { path: "/about", label: "About", icon: FaUser },
  { path: "/projects", label: "Work", icon: FaCode },
  { path: "/store", label: "Store", icon: FaShoppingBag },
  { path: "/invoice", label: "Invoice", icon: FaFileInvoice },
  { path: "/blog", label: "Blog", icon: FaBookOpen },
  { path: "/contact", label: "Contact", icon: FaEnvelope },
];

const Navbar = () => {
  const location = useLocation();
  const toLocalized = useLocalizedPath();
  const activePath = stripLocaleFromPath(location.pathname);

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl">
      <nav aria-label="Main Navigation" className="retro-window rounded-[28px] px-2.5 sm:px-4 py-2.5 flex justify-between items-center sm:gap-2">
        <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-cyan-300/70 blur-[1px]" />
        {navItems.map((item) => {
          const isActive = activePath === item.path || (item.path !== '/' && activePath.startsWith(item.path));
          
          return (
            <Link 
              key={item.path}
              to={toLocalized(item.path)}
              aria-label={`Navigate to ${item.label}`}
              className="relative min-h-11 min-w-11 px-2.5 sm:px-4 py-2 flex flex-col items-center justify-center group rounded-2xl"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-2xl border border-cyan-300/35 bg-cyan-400/10 shadow-[0_0_22px_rgba(64,255,30,0.18)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <span className={`relative z-10 text-lg sm:text-xl transition-colors duration-300 ${isActive ? 'text-cyan-300' : 'text-white/58 group-hover:text-cyan-100'}`}>
                <item.icon />
              </span>
              <span className="sr-only">{item.label}</span>
              
              {/* Tooltip for desktop */}
              <span className="absolute -top-11 left-1/2 -translate-x-1/2 rounded-full border border-cyan-300/20 bg-black/85 px-3 py-1 text-xs text-cyan-100 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block pointer-events-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Navbar;
