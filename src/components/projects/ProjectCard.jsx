/* eslint-disable no-unused-vars */
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
      className="group relative rounded-3xl overflow-hidden glass-panel border-0 bg-white/5 hover:bg-white/10 transition-colors"
    >
      <Link to={`/projects/item/${project.id}`} className="block h-full">

      {/* Image with overlay */}
      <div className="aspect-video w-full overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
        <LazyImage
           src={project.cover}
           alt={project.title}
           className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Floating Tags */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
            <span className="px-3 py-1 text-xs font-bold bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-white">
                {project.category}
            </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 md:p-6 relative z-10">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-2xl font-bold font-display leading-tight group-hover:text-cyan-400 transition-colors">
                {project.title.split(" — ")[0]}
            </h3>
            <div className="flex gap-3 text-white/50">
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
        
        <p className="text-white/60 text-xs md:text-sm line-clamp-2 mb-4">
            {project.summary}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
            {project.tech.slice(0, 3).map((t) => (
                <span key={t} className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded">
                    {t}
                </span>
            ))}
            {project.tech.length > 3 && (
                <span className="text-xs text-white/40 px-2 py-1">+ {project.tech.length - 3}</span>
            )}
        </div>
      </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
