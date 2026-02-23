import React from "react";
// import { motion } from "framer-motion"; // Removing unused import
import SEO from "../components/SEO";
import LazyImage from "../components/common/LazyImage";
import { FaDownload, FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import PubgCard from "../components/about/PubgCard";
import SpotifyCard from "../components/about/SpotifyCard";

const About = () => {
  return (
    <div className="pt-24 pb-32 px-6 max-w-5xl mx-auto min-h-screen">
      <SEO 
        title="About | Aditya Anugrah" 
        description="More about Aditya Anugrah, a Web Developer based in Indonesia."
      />

      <div className="grid md:grid-cols-[1fr_2fr] gap-12 items-start">
        {/* Sidebar / Image */}
        <div className="space-y-8 sticky top-24">
            <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="aspect-[3/4] rounded-2xl overflow-hidden glass-panel relative border border-white/10 group-hover:border-white/20 transition-colors">
                    <LazyImage 
                        src="/assets/me-sunset.webp" 
                        alt="Aditya Anugrah"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Overlay gradient for text readability if needed */}
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
            </div>
            
            <div className="flex flex-col gap-4">
                <a href="https://drive.google.com/file/d/1M66SJlH_9zlT4EePbq-VrYYxctgjua9M/preview" target="_blank" rel="noopener noreferrer" className="btn-primary w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-white text-black hover:bg-cyan-50 transition-colors">
                    <FaDownload /> Download CV
                </a>
                <div className="flex justify-center gap-6 text-2xl text-white/50">
                     <a href="https://github.com/adiityaanugrah" className="hover:text-white transition-colors"><FaGithub /></a>
                     <a href="https://www.linkedin.com/in/aditya-anugrah/" className="hover:text-white transition-colors"><FaLinkedin /></a>
                     <a href="mailto:adityaanugrah494@gmail.com" className="hover:text-white transition-colors"><FaEnvelope /></a>
                </div>
            </div>
        </div>

        {/* Content */}
        <div className="space-y-10">
            {/* Intro Header */}
            <section className="relative">
                <div className="absolute -inset-x-6 -inset-y-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-2xl rounded-full opacity-50 pointer-events-none" />
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6 tracking-tight relative z-10">
                    Hi, I'm <span className="text-gradient">Aditya.</span>
                </h1>
                <div className="space-y-4 text-white/70 text-sm md:text-base leading-relaxed max-w-2xl relative z-10">
                    <p>
                        I am a passionate <strong className="text-white">Web Developer</strong> based in Indonesia, specializing in building modern web applications. 
                        My journey started with a curiosity for how things work on the internet, which quickly turned into a career crafting digital solutions.
                    </p>
                    <p>
                        I focus on <span className="text-cyan-400">simplicity</span>, <span className="text-purple-400">performance</span>, and <span className="text-pink-400">user experience</span>. 
                        Whether it's a complex dashboard or a simple landing page, I strive to write clean, maintainable code.
                    </p>
                </div>
            </section>

            {/* BENTO GRID LAYOUT */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 relative z-10 w-full mb-8">
                {/* ---------- BENTO 1: EXPERIENCE (7 cols) ---------- */}
                <div className="md:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl relative group overflow-hidden border border-white/10 hover:border-cyan-500/30 transition-colors duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full transition-transform duration-700 group-hover:scale-150 pointer-events-none" />
                    <h2 className="text-xs sm:text-sm font-mono uppercase tracking-widest text-white/40 mb-8 flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                        Experience
                    </h2>
                    
                    <div className="space-y-8 border-l border-white/10 pl-6 relative">
                         <div className="relative group/item">
                            <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-cyan-500 border-2 border-[#0a0a0a] group-hover/item:scale-150 transition-transform" />
                            <h3 className="text-base sm:text-lg font-bold text-white group-hover/item:text-cyan-300 transition-colors">Full-stack Developer</h3>
                            <p className="text-cyan-500/70 text-[10px] sm:text-xs font-mono mb-2">Ilena Furniture • 2023 - Present</p>
                            <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
                                Built Next.js storefront with SSR/ISR for optimal SEO. Integrated complex shipping calculators and SKU matrix systems.
                            </p>
                         </div>
    
                         <div className="relative group/item">
                            <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-purple-500 border-2 border-[#0a0a0a] group-hover/item:scale-150 transition-transform" />
                            <h3 className="text-base sm:text-lg font-bold text-white group-hover/item:text-purple-300 transition-colors">Backend + UI Developer</h3>
                            <p className="text-purple-500/70 text-[10px] sm:text-xs font-mono mb-2">Titanium Group • 2024 - 2025</p>
                            <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
                                Designed robust database schemas and REST APIs using CodeIgniter 4. Developed workshop management dashboards and PDF reporting.
                            </p>
                         </div>
                    </div>
                </div>

                {/* ---------- BENTO 2: TECH STACK (5 cols) ---------- */}
                <div className="md:col-span-1 md:hidden lg:block lg:col-span-5 glass-panel p-6 sm:p-8 rounded-3xl relative group overflow-hidden border border-white/10 hover:border-purple-500/30 transition-colors duration-500 flex flex-col justify-center">
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full transition-transform duration-700 group-hover:scale-150 pointer-events-none" />
                    <h2 className="text-xs sm:text-sm font-mono uppercase tracking-widest text-white/40 mb-6 flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-purple-500 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                        Tech Arsenal
                    </h2>
                    
                    <div className="flex flex-wrap gap-2 text-[10px] sm:text-xs font-mono">
                        {["JavaScript", "TypeScript", "React", "Next.js", "Tailwind", "Node.js", "PHP", "CodeIgniter", "MySQL", "Postgres", "Git"].map(tech => (
                            <span key={tech} className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all cursor-default relative overflow-hidden group/badge">
                                <span className="absolute inset-0 bg-white/5 translate-y-full group-hover/badge:translate-y-0 transition-transform" />
                                <span className="relative z-10">{tech}</span>
                            </span>
                        ))}
                    </div>
                </div>
                
                {/* Fallback untuk ukuran MD (tablet vertikal) agar Tech Stack muat responsif */}
                <div className="hidden md:block lg:hidden md:col-span-5 glass-panel p-6 rounded-3xl relative group overflow-hidden border border-white/10">
                     <h2 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-4">Tech Arsenal</h2>
                     <div className="flex flex-wrap gap-1.5 text-[9px] font-mono">
                        {["JS/TS", "React/Next", "Tailwind", "Node/PHP", "SQL", "Git"].map(tech => (
                            <span key={tech} className="px-2 py-1 rounded border border-white/10 bg-white/5 text-white/70">{tech}</span>
                        ))}
                    </div>
                </div>

                {/* ---------- BENTO 3: MUSIC VIBES (5 cols) ---------- */}
                <div className="md:col-span-5 flex flex-col relative group pb-4 lg:pb-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1DB954]/5 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <div className="mb-4 pl-3">
                        <h2 className="text-xs sm:text-sm font-mono uppercase tracking-widest text-white/40 flex items-center gap-2">
                            <span className="text-base sm:text-xl">🎧</span> Vibe Check
                        </h2>
                    </div>
                    {/* Mengisi sisa flex */}
                    <div className="flex-1 transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.01] h-full">
                        <SpotifyCard />
                    </div>
                </div>

                {/* ---------- BENTO 4: GAMING (7 cols) ---------- */}
                <div className="md:col-span-7 flex flex-col relative group h-full pb-4 lg:pb-0">
                    <div className="absolute inset-0 bg-gradient-to-tl from-orange-500/5 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <div className="mb-4 pl-3">
                        <h2 className="text-xs sm:text-sm font-mono uppercase tracking-widest text-white/40 flex items-center gap-2">
                            <span className="text-base sm:text-xl">🎮</span> Off-Duty
                        </h2>
                    </div>
                    <div className="flex-1 transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.01]">
                        <PubgCard />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default About;
