import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaWhatsapp } from "react-icons/fa";
import { useLocalizedPath } from "../../lib/i18n";

const Hero = () => {
  const toLocalized = useLocalizedPath();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-20">
      {/* Background texture */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(238,232,220,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(238,232,220,0.045)_1px,transparent_1px)] bg-[size:72px_72px] opacity-40" />
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-cyan-900/25 to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Eyebrow / Supertitle for SEO context */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="mb-4"
        >
            <span className="px-4 py-1.5 rounded-full border border-cyan-300/20 bg-white/5 text-[10px] md:text-sm font-mono text-cyan-200 backdrop-blur-md">
              Web Developer & Consultant • Indonesia
            </span>
        </motion.div>

        {/* Semantic H1 with Keywords but Visual Impact */}
        <motion.h1 
          className="text-4xl md:text-7xl lg:text-8xl font-bold font-display leading-tight mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Membangun <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-cyan-300 to-purple-300">
            Solusi Digital.
          </span>
        </motion.h1>

        <motion.p
          className="text-xs md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
            Transformasi bisnis Anda dengan website berkinerja tinggi dan aplikasi khusus. 
          Fokus pada <strong className="text-white font-medium">ROI</strong>, <strong className="text-white font-medium">Scalability</strong>, dan <strong className="text-white font-medium">User Experience</strong>.
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link to={toLocalized("/projects")} aria-label="View My Work Projects" className="btn-primary px-8 py-4 bg-cyan-100 text-black rounded-full font-bold flex items-center gap-2 hover:bg-white transition-colors shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
            Lihat Karya <FaArrowRight />
          </Link>
          <Link to={toLocalized("/contact")} aria-label="Contact for Project Discussion" className="px-8 py-4 rounded-full border border-cyan-300/20 hover:bg-white/10 transition-colors flex items-center gap-2 backdrop-blur-sm">
             <FaWhatsapp className="text-green-400 text-xl" /> Diskusi Proyek
          </Link>
        </motion.div>
      </div>

      {/* Helper text for SEO (hidden visually but present for bots in a way that isn't spammy? No, better to be visible) */}
       <div className="absolute bottom-10 left-0 w-full text-center pointer-events-none opacity-30 text-xs font-mono uppercase tracking-[0.2em] animate-pulse">
            Aditya Anugrah • Semarang • Palembang • Full Stack Engineering
       </div>
    </section>
  );
};

export default Hero;
