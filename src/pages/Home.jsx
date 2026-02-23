import React from "react";
import Hero from "../components/home/Hero";
import ClientLogos from "../components/home/ClientLogos";
import Services from "../components/home/Services";
import Workflow from "../components/home/Workflow";
import ProjectCard from "../components/projects/ProjectCard";
import SEO from "../components/SEO";
import { projects } from "../data/projects";
import { posts } from "../data/posts";
import { FaReact, FaNodeJs, FaPhp, FaDatabase, FaArrowRight } from "react-icons/fa";
import { SiTailwindcss, SiTypescript, SiNextdotjs, SiCodeigniter } from "react-icons/si";
import { Link } from "react-router-dom";

const stack = [
  { name: "React", icon: FaReact, color: "text-blue-400" },
  { name: "Next.js", icon: SiNextdotjs, color: "text-white" },
  { name: "TypeScript", icon: SiTypescript, color: "text-blue-500" },
  { name: "Tailwind", icon: SiTailwindcss, color: "text-cyan-400" },
  { name: "Node.js", icon: FaNodeJs, color: "text-green-500" },
  { name: "PHP / CI4", icon: SiCodeigniter, color: "text-orange-500" },
  { name: "MySQL", icon: FaDatabase, color: "text-yellow-500" },
  // Duplicate agar marquee terlihat panjang & seamless
  { name: "React", icon: FaReact, color: "text-blue-400" },
  { name: "Next.js", icon: SiNextdotjs, color: "text-white" },
  { name: "TypeScript", icon: SiTypescript, color: "text-blue-500" },
  { name: "Tailwind", icon: SiTailwindcss, color: "text-cyan-400" },
];

const Home = () => {
  // Get latest 4 projects
  const featuredProjects = projects.sort((a, b) => b.year - a.year).slice(0, 4);

  // Advanced JSON-LD for "Developer Business" Authority
  const jsonLdGraph = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": "https://adityaanugrah.me/#person",
      "name": "Aditya Anugrah",
      "jobTitle": "Web Developer & Business Consultant",
      "url": "https://adityaanugrah.me",
      "sameAs": [
        "https://github.com/adiityaanugrah",
        "https://www.linkedin.com/in/aditya-anugrah/",
        "https://www.instagram.com/adityaanugrah"
      ],
      "image": "https://adityaanugrah.me/assets/me-sunset.jpg",
      "worksFor": {
        "@type": "Organization",
        "name": "Freelance Professional"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": "https://adityaanugrah.me/#business",
      "name": "Aditya Anugrah - Solusi Digital & Web Development",
      "description": "Jasa pembuatan website profesional, aplikasi bisnis, dan sistem manajemen (ERP/POS) di Indonesia. Fokus pada performa, keamanan, dan pertumbuhan bisnis.",
      "url": "https://adityaanugrah.me",
      "logo": "https://adityaanugrah.me/assets/icon.png",
      "image": "https://adityaanugrah.me/assets/og-default.jpg",
      "telephone": "+6281379430432",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "ID",
        "addressRegion": "Jawa Tengah",
        "addressLocality": "Semarang"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "-6.9667",
        "longitude": "110.4167" 
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "09:00",
        "closes": "17:00"
      },
      "sameAs": [
        "https://www.linkedin.com/in/aditya-anugrah/"
      ]
    }
  ];

  return (
    <div className="pb-20">
      <SEO 
        title="Aditya Anugrah | Web Developer Semarang & Business Consultant" 
        description="Jasa pembuatan website dan aplikasi bisnis di Semarang. Aditya Anugrah membantu UMKM dan perusahaan berkembang dengan solusi digital modern."
        jsonLd={jsonLdGraph}
        type="website"
      />
      
      <Hero />
      <ClientLogos />
      <Services />
      <Workflow />

      {/* Featured Projects Section */}
      <section id="projects" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-2">Featured Case Studies</h2>
                <p className="text-white/50 max-w-md">
                    Helping businesses grow through custom web solutions. 
                    From e-commerce to internal management systems.
                </p>
            </div>
            <Link to="/projects" aria-label="View All Projects" className="text-sm font-bold uppercase tracking-widest hover:text-cyan-400 transition-colors">
                View All Projects &rarr;
            </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {featuredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
            ))}
        </div>
      </section>

      {/* Latest Blog Posts Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
                <h2 className="text-4xl md:text-5xl font-bold font-display mb-2">Latest Insights</h2>
                <p className="text-white/50 max-w-md">
                    Thoughts on technology, business logic, and web performance.
                </p>
            </div>
            <Link to="/blog" aria-label="View All Articles" className="text-sm font-bold uppercase tracking-widest hover:text-cyan-400 transition-colors">
                Read All Articles &rarr;
            </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...posts].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3).map((post) => (
                <Link to={`/blog/${post.id}`} key={post.id} className="group glass-panel rounded-2xl overflow-hidden border border-white/5 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1 block">
                    <div className="aspect-video overflow-hidden relative">
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                        <img 
                            src={post.image} 
                            alt={post.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded">
                                {post.category}
                            </span>
                            <span className="text-xs text-white/40 font-mono">
                                {new Date(post.date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-cyan-300 transition-colors line-clamp-2">
                            {post.title}
                        </h3>
                        <p className="text-white/50 text-sm line-clamp-2">
                            {post.excerpt}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
      </section>

      {/* Tech Stack - Infinite CSS Marquee (Ultra Fast, No JS Overhead) */}
      <section className="py-20 border-y border-white/5 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center mb-10">
            <h2 className="text-2xl font-display font-bold text-white/40">Modern Tech for Scalable Apps</h2>
        </div>
        
        {/* Marquee Wrapper */}
        <div className="relative flex overflow-x-hidden group whitespace-nowrap mask-fade-edges">
            <div className="animate-[marquee_25s_linear_infinite] flex items-center min-w-full justify-around space-x-12 sm:space-x-24 px-12 will-change-transform">
                {stack.map((tech, i) => (
                    <div key={`${tech.name}-${i}`} className="flex flex-col items-center gap-3 grayscale hover:grayscale-0 transition-all duration-300">
                        <span className={`text-4xl ${tech.color} opacity-50 hover:opacity-100 hover:scale-110 transition-all duration-300`}>
                            <tech.icon />
                        </span>
                        <span className="text-xs font-mono opacity-0 hover:opacity-50 transition-opacity">
                            {tech.name}
                        </span>
                    </div>
                ))}
            </div>
            {/* Duplikasi Mutlak untuk Seamless Loop */}
            <div className="absolute top-0 animate-[marquee2_25s_linear_infinite] flex items-center min-w-full justify-around space-x-12 sm:space-x-24 px-12 will-change-transform">
                {stack.map((tech, i) => (
                    <div key={`dup-${tech.name}-${i}`} className="flex flex-col items-center gap-3 grayscale hover:grayscale-0 transition-all duration-300">
                        <span className={`text-4xl ${tech.color} opacity-50 hover:opacity-100 hover:scale-110 transition-all duration-300`}>
                            <tech.icon />
                        </span>
                        <span className="text-xs font-mono opacity-0 hover:opacity-50 transition-opacity">
                            {tech.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Giant CTA - Bottom Conversion Engine */}
      <section className="py-32 px-6 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] to-cyan-900/10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[400px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] md:text-sm font-mono text-cyan-400 mb-6 inline-block uppercase tracking-widest backdrop-blur-md">
                Available for meaningful work
            </span>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black font-display tracking-tight leading-tight mb-8">
                Let's Build <br/> Something <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Amazing.</span>
            </h2>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-12">
                Have an idea you'd like to bring to life? Let's discuss your project and see how we can help your business grow.
            </p>
            
            <div className="flex justify-center">
                 <Link to="/contact" className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-cyan-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95 duration-300 overflow-hidden">
                    <span className="relative z-10">Start a Project</span>
                    <FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
                    {/* Hover Glow Background inside Button */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
            </div>
        </div>
      </section>

      {/* Critical CSS rules for CSS-only Marquee & masking */}
      <style dangerouslySetInnerHTML={{__html: `
        .mask-fade-edges {
           -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
           mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes marquee2 {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0%); }
        }
      `}} />

    </div>
  );
};

export default Home;
