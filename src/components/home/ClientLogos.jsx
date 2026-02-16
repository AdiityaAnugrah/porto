/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";

const clients = [
  { name: "Centra Game", tag: "Tech", icon: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  )},
  { name: "Ilena Furniture", tag: "Corporate", icon: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )},
  { name: "Titanium Group", tag: "Business", icon: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )},
  { name: "Global Cargo", tag: "Logistics", icon: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  )},
  { name: "Lunarea", tag: "Ecommerce", icon: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )},
  { name: "Catur Bhakti Mandiri", tag: "Business Systems", icon: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
      <path d="M9 7h1" />
      <path d="M9 11h1" />
      <path d="M9 15h1" />
      <path d="M14 7h1" />
      <path d="M14 11h1" />
      <path d="M14 15h1" />
    </svg>
  )},
  { name: "Bahtera Life (BLCC)", tag: "Church Management", icon: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M12 22V12" />
      <path d="M9 12h6" />
    </svg>
  )},
];

const ClientLogos = () => {
  // Triple the items for seamless infinite scroll
  const marqueeItems = [...clients, ...clients, ...clients];

  return (
    <section className="py-16 border-y border-white/5 bg-white/[0.02] overflow-hidden whitespace-nowrap">
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <p className="text-center text-white/30 text-[10px] md:text-xs font-mono uppercase tracking-[0.3em]">
          Selected Professional Collaborations
        </p>
      </div>

      <div className="relative flex overflow-hidden">
        <motion.div 
          className="flex gap-12 md:gap-24 items-center"
          animate={{ x: [0, -1035] }} 
          transition={{ 
            duration: 35, 
            repeat: Infinity, 
            ease: "linear",
          }}
        >
          {marqueeItems.map((client, index) => (
            <div 
              key={index} 
              className="flex items-center gap-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-default group"
            >
              <div className="text-cyan-500 group-hover:text-cyan-400 transition-colors">
                {client.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-sm md:text-lg font-bold text-white/50 group-hover:text-white transition-colors">
                  {client.name}
                </span>
                <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/10 group-hover:text-cyan-500/50 transition-colors">
                    {client.tag}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
        
        {/* Gradient Fades */}
        <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
};

export default ClientLogos;

