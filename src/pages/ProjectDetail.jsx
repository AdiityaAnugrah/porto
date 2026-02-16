/* eslint-disable no-unused-vars */
import React, { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import LazyImage from "../components/common/LazyImage";
import { motion } from "framer-motion";
import {
  FaExternalLinkAlt,
  FaGithub,
  FaArrowLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaUser,
  FaTools,
  FaClock,
} from "react-icons/fa";
import { projects } from "../data/projects";
import SEO from "../components/SEO";

const Chip = ({ children }) => (
  <span className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-white/70">
    {children}
  </span>
);

const Section = ({ title, children }) => {
  if (!children) return null;
  const hasContent = Array.isArray(children) ? children.length > 0 : !!children;
  if (!hasContent) return null;

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold font-display text-white mb-4 border-b border-white/10 pb-2">
        {title}
      </h2>
      <div className="text-white/70 leading-relaxed space-y-2">{children}</div>
    </div>
  );
};

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const project = useMemo(() => projects.find((p) => p.id === id), [id]);

  const { prev, next } = useMemo(() => {
    const idx = projects.findIndex((p) => p.id === id);
    return {
      prev: idx > 0 ? projects[idx - 1] : null,
      next: idx >= 0 && idx < projects.length - 1 ? projects[idx + 1] : null,
    };
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 text-center">
         <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
         <Link to="/projects" className="text-cyan-400 hover:text-cyan-300">Back to Projects</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-32 px-6 max-w-6xl mx-auto min-h-screen">
      <SEO 
        title={`${project.title} | Aditya Anugrah`}
        description={project.summary}
        image={project.cover}
      />

      {/* Header */}
      <div className="mb-12">
        <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6"
        >
            <FaArrowLeft /> Back
        </button>
        
        <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">
            {project.title}
        </h1>

        <div className="flex flex-wrap gap-3 mb-8">
            <Chip>{project.category}</Chip>
            {project.year && <Chip><FaCalendarAlt className="inline mr-1"/> {project.year}</Chip>}
            {project.role && <Chip><FaUser className="inline mr-1"/> {project.role}</Chip>}
            {project.duration && <Chip><FaClock className="inline mr-1"/> {project.duration}</Chip>}
        </div>

        {/* Links */}
        <div className="flex gap-4">
            {project.links?.live && (
                <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-bold hover:bg-cyan-400 transition-colors">
                    Visit Site <FaExternalLinkAlt />
                </a>
            )}
            {project.links?.code && (
                <a href={project.links.code} target="_blank" rel="noopener noreferrer" className="btn-ghost flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-colors">
                    View Code <FaGithub />
                </a>
            )}
        </div>
      </div>

      {/* Cover Image */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden mb-16 border border-white/10 shadow-2xl aspect-video bg-white/5"
      >
        <LazyImage 
            src={project.cover} 
            alt={project.title}
            className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="grid md:grid-cols-[2fr_1fr] gap-12">
        {/* Main Content */}
        <div>
            <Section title="Overview">
                <p>{project.summary}</p>
            </Section>

            <Section title="Key Features">
                <ul className="list-disc ml-5 space-y-1">
                    {project.features?.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
            </Section>

            {project.challenges && (
                <Section title="Challenges & Solutions">
                    <ul className="list-disc ml-5 space-y-1">
                        {project.challenges?.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                </Section>
            )}

            {project.results && (
                <Section title="Business Impact">
                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-xl p-6">
                        <ul className="space-y-3">
                            {project.results?.map((r, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="mt-1 text-green-400">✅</span>
                                    <span className="font-medium text-green-100">{r}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Section>
            )}

            {project.tech && (
                 <Section title="Technologies">
                    <div className="flex flex-wrap gap-2">
                        {project.tech.map(t => (
                            <span key={t} className="flex items-center gap-1 px-3 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm">
                                <FaTools className="text-xs" /> {t}
                            </span>
                        ))}
                    </div>
                 </Section>
            )}
        </div>

        {/* Sidebar Gallery */}
        <div className="space-y-6">
            <h3 className="text-xl font-bold font-display mb-4">Gallery</h3>
            {project.gallery?.map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-white/10 cursor-pointer hover:opacity-80 transition-opacity">
                    <LazyImage 
                        src={img.src}
                        alt={img.alt || "Project Screenshot"}
                        className="w-full h-auto"
                    />
                </div>
            ))}
             {!project.gallery?.length && <p className="text-white/30 italic text-sm">No additional images.</p>}
        </div>
      </div>

       {/* Navigation Footer */}
       <div className="mt-20 flex justify-between pt-8 border-t border-white/10">
            {prev ? (
                <Link to={`/projects/item/${prev.id}`} className="group text-left">
                    <div className="text-xs text-white/40 mb-1 group-hover:text-cyan-400 transition-colors">Previous Project</div>
                    <div className="text-lg font-bold flex items-center gap-2">
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> {prev.title}
                    </div>
                </Link>
            ) : <div />}
            
            {next && (
                <Link to={`/projects/item/${next.id}`} className="group text-right">
                    <div className="text-xs text-white/40 mb-1 group-hover:text-cyan-400 transition-colors">Next Project</div>
                    <div className="text-lg font-bold flex items-center gap-2">
                        {next.title} <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>
            )}
       </div>
    </div>
  );
}
