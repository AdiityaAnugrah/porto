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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-lg">
      <nav aria-label="Main Navigation" className="rounded-full px-3 sm:px-5 py-3 flex justify-between items-center sm:gap-2 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        {navItems.map((item) => {
          const isActive = activePath === item.path || (item.path !== '/' && activePath.startsWith(item.path));
          
          return (
            <Link 
              key={item.path}
              to={toLocalized(item.path)}
              aria-label={`Navigate to ${item.label}`}
              className="relative px-3 sm:px-4 py-2 flex flex-col items-center justify-center group"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-white/10 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <span className={`relative z-10 text-xl transition-colors duration-300 ${isActive ? 'text-cyan-400' : 'text-white/60 group-hover:text-white'}`}>
                <item.icon />
              </span>
              <span className="sr-only">{item.label}</span>
              
              {/* Tooltip for desktop */}
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block pointer-events-none">
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
