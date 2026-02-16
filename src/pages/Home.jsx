import React from "react";
import Hero from "../components/home/Hero";
import ClientLogos from "../components/home/ClientLogos";
import Services from "../components/home/Services";
import Workflow from "../components/home/Workflow";
import ProjectCard from "../components/projects/ProjectCard";
import SEO from "../components/SEO";
import { projects } from "../data/projects";
import { FaReact, FaNodeJs, FaPhp, FaDatabase } from "react-icons/fa";
import { SiTailwindcss, SiTypescript, SiNextdotjs, SiCodeigniter } from "react-icons/si";

const stack = [
  { name: "React", icon: FaReact, color: "text-blue-400" },
  { name: "Next.js", icon: SiNextdotjs, color: "text-white" },
  { name: "TypeScript", icon: SiTypescript, color: "text-blue-500" },
  { name: "Tailwind", icon: SiTailwindcss, color: "text-cyan-400" },
  { name: "Node.js", icon: FaNodeJs, color: "text-green-500" },
  { name: "PHP / CI4", icon: SiCodeigniter, color: "text-orange-500" },
  { name: "MySQL", icon: FaDatabase, color: "text-yellow-500" },
];

const Home = () => {
  // Get latest 4 projects
  const featuredProjects = projects.sort((a, b) => b.year - a.year).slice(0, 4);

  // Advanced JSON-LD for "Developer Business" Authority
  const jsonLdGraph = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": "https://adityaanugra.me/#person",
      "name": "Aditya Anugrah",
      "jobTitle": "Web Developer & Business Consultant",
      "url": "https://adityaanugra.me",
      "sameAs": [
        "https://github.com/adiityaanugrah",
        "https://www.linkedin.com/in/aditya-anugrah/",
        "https://www.instagram.com/adityaanugrah"
      ],
      "image": "https://adityaanugra.me/assets/me-sunset.jpg",
      "worksFor": {
        "@type": "Organization",
        "name": "Freelance Professional"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": "https://adityaanugra.me/#business",
      "name": "Aditya Anugrah - Solusi Digital & Web Development",
      "description": "Jasa pembuatan website profesional, aplikasi bisnis, dan sistem manajemen (ERP/POS) di Indonesia. Fokus pada performa, keamanan, dan pertumbuhan bisnis.",
      "url": "https://adityaanugra.me",
      "logo": "https://adityaanugra.me/assets/icon.png",
      "image": "https://adityaanugra.me/assets/og-default.jpg",
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
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Web Application Development",
      "provider": { "@id": "https://adityaanugra.me/#business" },
      "areaServed": { "@type": "Country", "name": "Indonesia" },
      "description": "Custom high-performance web applications built with React, Node.js, and PHP."
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "E-Commerce Solutions",
      "provider": { "@id": "https://adityaanugra.me/#business" },
      "description": "Scalable online stores with custom SKU management, payment gateways, and shipping integration."
    }
  ];

  return (
    <div className="pb-32">
      <SEO 
        title="Aditya Anugrah | Web Developer Semarang & Business Consultant" 
        description="Jasa pembuatan website dan aplikasi bisnis di Semarang. Aditya Anugrah membantu UMKM dan perusahaan berkembang dengan solusi digital modern."
        jsonLd={jsonLdGraph}
        type="website"
      />
      
      {/* Navbar is already in Layout.jsx */}
      
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
            <a href="/projects" aria-label="View All Projects" className="text-sm font-bold uppercase tracking-widest hover:text-cyan-400 transition-colors">
                View All Projects &rarr;
            </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {featuredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
            ))}
        </div>
      </section>

      {/* Tech Stack Marquee (Simple Grid for now) */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-display font-bold mb-12 text-white/40">Modern Tech for Scalable Apps</h2>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 grayscale hover:grayscale-0 transition-all duration-500">
                {stack.map((tech) => (
                    <div key={tech.name} className="flex flex-col items-center gap-3 group">
                        <span className={`text-4xl ${tech.color} opacity-50 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 duration-300`}>
                            <tech.icon />
                        </span>
                        <span className="text-xs font-mono opacity-0 group-hover:opacity-50 transition-opacity">
                            {tech.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
