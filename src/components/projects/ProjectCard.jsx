import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import LazyImage from "../common/LazyImage";

const ProjectCard = ({ project, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl border-0 bg-white/5 transition-colors hover:bg-white/10 sm:rounded-3xl glass-panel"
    >
      <Link to={`/projects/item/${project.id}`} className="block h-full">

      {/* Image with overlay */}
      <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-video">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
        <LazyImage
           src={project.cover}
           alt={project.title}
           className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Floating Tags */}
        <div className="absolute left-2 top-2 z-20 flex max-w-[calc(100%-1rem)] flex-wrap gap-2 sm:left-4 sm:top-4">
            <span className="truncate rounded-full border border-white/10 bg-black/55 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-md sm:px-3 sm:text-xs">
                {project.category}
            </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-3 sm:p-5 md:p-6">
        <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-sm font-bold leading-tight transition-colors group-hover:text-cyan-400 sm:text-xl md:text-2xl font-display">
                {project.title.split(" — ")[0]}
            </h3>
            <div className="hidden gap-3 text-white/50 sm:flex">
                {project.links?.code && (
                    <a href={project.links.code} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" title="View Code">
                        <FaGithub />
                    </a>
                )}
                {project.links?.live && (
                    <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors" title="Live Demo">
                        <FaExternalLinkAlt />
                    </a>
                )}
            </div>
        </div>
        
        <p className="mb-3 line-clamp-2 text-[11px] leading-5 text-white/58 sm:mb-4 sm:text-xs md:text-sm">
            {project.summary}
        </p>

        <div className="mt-auto flex flex-wrap gap-1.5 sm:gap-2">
            {project.tech.slice(0, 3).map((t, techIndex) => (
                <span key={t} className={`rounded bg-white/5 px-1.5 py-1 text-[10px] text-white/45 sm:px-2 sm:text-xs ${techIndex > 1 ? "hidden sm:inline-flex" : ""}`}>
                    {t}
                </span>
            ))}
            {project.tech.length > 3 && (
                <span className="px-1 py-1 text-[10px] text-white/40 sm:px-2 sm:text-xs">+ {project.tech.length - 3}</span>
            )}
        </div>
      </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
