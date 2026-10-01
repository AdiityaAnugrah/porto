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
  FaCheckCircle,
} from "react-icons/fa";
import { projects } from "../data/projects";
import SEO from "../components/SEO";
import { useLocalizedPath } from "../lib/i18n";

const Chip = ({ children }) => (
  <span className="retro-chip inline-flex min-h-9 items-center rounded-full px-3 py-1 text-xs font-semibold">
    {children}
  </span>
);

const Section = ({ title, children }) => {
  if (!children) return null;
  const hasContent = Array.isArray(children) ? children.length > 0 : !!children;
  if (!hasContent) return null;

  return (
    <section className="retro-window mb-8 rounded-3xl p-5 md:p-7">
      <h2 className="retro-title mb-4 border-b border-cyan-300/15 pb-3 text-3xl">
        {title}
      </h2>
      <div className="text-white/70 leading-relaxed space-y-2">{children}</div>
    </section>
  );
};

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toLocalized = useLocalizedPath();

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
         <h1 className="retro-title text-5xl mb-4">Proyek Tidak Ditemukan</h1>
         <Link to={toLocalized("/projects")} className="text-cyan-400 hover:text-cyan-300">Kembali ke Proyek</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-32 px-4 sm:px-6 max-w-7xl mx-auto min-h-screen">
      <SEO 
        title={`${project.title} | Aditya Anugrah`}
        description={project.summary}
        image={project.cover}
      />

      {/* Header */}
      <header className="retro-window mb-10 rounded-[32px] p-5 md:p-8">
        <button 
            onClick={() => navigate(-1)} 
            className="retro-chip mb-6 inline-flex min-h-11 items-center gap-2 rounded-full px-4 transition-colors"
        >
            <FaArrowLeft /> Kembali
        </button>
        
        <h1 className="max-w-5xl text-4xl font-semibold leading-tight tracking-[-0.05em] text-white md:text-7xl">
            {project.title}
        </h1>

        <div className="flex flex-wrap gap-3 mb-8">
            <Chip>{project.category}</Chip>
            {project.year && <Chip><FaCalendarAlt className="inline mr-1"/> {project.year}</Chip>}
            {project.role && <Chip><FaUser className="inline mr-1"/> {project.role}</Chip>}
            {project.duration && <Chip><FaClock className="inline mr-1"/> {project.duration}</Chip>}
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3 sm:flex-row">
            {project.links?.live && (
                <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-cyan-200 px-6 py-3 font-bold text-black transition-colors hover:bg-white">
                    Kunjungi Situs <FaExternalLinkAlt />
                </a>
            )}
            {project.links?.code && (
                <a href={project.links.code} target="_blank" rel="noopener noreferrer" className="retro-chip flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 font-bold transition-colors">
                    Lihat Kode <FaGithub />
                </a>
            )}
        </div>
      </header>

      {/* Cover Image */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="retro-window rounded-[32px] overflow-hidden mb-12 aspect-video"
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
                    <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/5 p-5 md:p-6">
                        <ul className="space-y-3">
                            {project.results?.map((r, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <FaCheckCircle className="mt-1 shrink-0 text-cyan-200" />
                                    <span className="font-medium text-cyan-50">{r}</span>
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
                            <span key={t} className="retro-chip flex min-h-9 items-center gap-1 rounded-full px-3 py-1 text-sm">
                                <FaTools className="text-xs" /> {t}
                            </span>
                        ))}
                    </div>
                 </Section>
            )}
        </div>

        {/* Sidebar Gallery */}
        <div className="space-y-6">
            <h3 className="retro-title mb-4 text-3xl">Gallery</h3>
            {project.gallery?.map((img, i) => (
                <div key={i} className="retro-window rounded-2xl overflow-hidden cursor-pointer transition-opacity hover:opacity-85">
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
       <div className="mt-16 flex flex-col gap-5 border-t border-cyan-300/15 pt-8 sm:flex-row sm:justify-between">
            {prev ? (
                <Link to={toLocalized(`/projects/item/${prev.id}`)} className="group text-left">
                    <div className="text-xs text-white/40 mb-1 group-hover:text-cyan-400 transition-colors">Previous Project</div>
                    <div className="text-lg font-bold flex items-center gap-2">
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> {prev.title}
                    </div>
                </Link>
            ) : <div />}
            
            {next && (
                <Link to={toLocalized(`/projects/item/${next.id}`)} className="group text-right">
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
