/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaWhatsapp } from "react-icons/fa";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-20">
      {/* Background Aurora */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-cyan-500/10 rounded-full blur-[80px] md:blur-[150px] mix-blend-screen animate-blob will-change-transform" style={{ transform: 'translate3d(0,0,0)' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-purple-500/10 rounded-full blur-[80px] md:blur-[150px] mix-blend-screen animate-blob animation-delay-2000 will-change-transform" style={{ transform: 'translate3d(0,0,0)' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Eyebrow / Supertitle for SEO context */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="mb-4"
        >
            <span className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] md:text-sm font-mono text-cyan-300 backdrop-blur-md">
                Web Developer & Consultant • Semarang, Indonesia
            </span>
        </motion.div>

        {/* Semantic H1 with Keywords but Visual Impact */}
        <motion.h1 
          className="text-4xl md:text-7xl lg:text-8xl font-bold font-display leading-tight mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Building Digital <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            Business Solutions.
          </span>
        </motion.h1>

        <motion.p
          className="text-xs md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Transform your business with high-performance websites and custom applications. 
          Focusing on <strong className="text-white font-medium">ROI</strong>, <strong className="text-white font-medium">Scalability</strong>, and <strong className="text-white font-medium">User Experience</strong>.
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <a href="/projects" aria-label="View My Work Projects" className="btn-primary px-8 py-4 bg-white text-black rounded-full font-bold flex items-center gap-2 hover:bg-cyan-50 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]">
            View My Work <FaArrowRight />
          </a>
          <a href="/contact" aria-label="Contact for Project Discussion" className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/10 transition-colors flex items-center gap-2 backdrop-blur-sm">
             <FaWhatsapp className="text-green-400 text-xl" /> Discuss Project
          </a>
        </motion.div>
      </div>

      {/* Helper text for SEO (hidden visually but present for bots in a way that isn't spammy? No, better to be visible) */}
       <div className="absolute bottom-10 left-0 w-full text-center pointer-events-none opacity-30 text-xs font-mono uppercase tracking-[0.2em] animate-pulse">
            Aditya Anugrah • Semarang • Full Stack Engineering
       </div>
    </section>
  );
};

export default Hero;
