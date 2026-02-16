import React from "react";
// import { motion } from "framer-motion"; // Removing unused import
import SEO from "../components/SEO";
import LazyImage from "../components/common/LazyImage";
import { FaDownload, FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";

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
        <div className="space-y-12">
            <section>
                <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
                    Hi, I'm <span className="text-gradient">Aditya.</span>
                </h1>
                <p className="text-white/70 text-xs md:text-lg leading-relaxed mb-6">
                    I am a passionate <strong className="text-white">Web Developer</strong> based in Indonesia, specializing in building modern web applications. 
                    My journey started with a curiosity for how things work on the internet, which quickly turned into a career crafting digital solutions.
                </p>
                <p className="text-white/70 text-xs md:text-lg leading-relaxed">
                    I focus on <span className="text-cyan-400">simplicity</span>, <span className="text-purple-400">performance</span>, and <span className="text-pink-400">user experience</span>. 
                    Whether it's a complex dashboard or a simple landing page, I strive to write clean, maintainable code.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-white/30"></span> Experience
                </h2>
                <div className="space-y-8 border-l border-white/10 pl-8 ml-3 relative">
                     {/* Timeline Item */}
                     <div className="relative">
                        <span className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-cyan-500 border-4 border-[#0a0a0a]" />
                        <h3 className="text-xl font-bold">Full-stack Developer</h3>
                        <p className="text-white/50 text-sm mb-2">Ilena Furniture • 2023 - Present</p>
                        <ul className="list-disc list-outside ml-4 text-white/70 space-y-1">
                            <li>Built Next.js storefront with SSR/ISR for optimal SEO.</li>
                            <li>Integrated shipping calculators and SKU matrix systems.</li>
                        </ul>
                     </div>

                     <div className="relative">
                        <span className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-purple-500 border-4 border-[#0a0a0a]" />
                        <h3 className="text-xl font-bold">Backend + UI Developer</h3>
                        <p className="text-white/50 text-sm mb-2">Titanium Group • 2024 - 2025</p>
                         <ul className="list-disc list-outside ml-4 text-white/70 space-y-1">
                            <li>Designed database schemas and REST APIs using CI4.</li>
                            <li>Developed workshop management dashboard and PDF reporting.</li>
                        </ul>
                     </div>
                </div>
            </section>

             <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-white/30"></span> Tech Stack
                </h2>
                <div className="flex flex-wrap gap-2 text-sm font-mono text-white/60">
                    {["JavaScript (ES6+)", "TypeScript", "React", "Next.js", "Tailwind CSS", "Node.js", "PHP", "CodeIgniter 4", "MySQL", "PostgreSQL", "Git"].map(tech => (
                        <span key={tech} className="px-3 py-1 rounded border border-white/10 bg-white/5">
                            {tech}
                        </span>
                    ))}
                </div>
            </section>
        </div>
      </div>
    </div>
  );
};

export default About;
