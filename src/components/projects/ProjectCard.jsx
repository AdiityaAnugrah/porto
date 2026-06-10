import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import LazyImage from "../common/LazyImage";
import { useLocalizedPath } from "../../lib/i18n";

const getDisplayTitle = (title) => title.replace(/\s(?:\u2014|\u00e2|\u00c3).*/, "");

const ProjectCard = ({ project, index }) => {
  const displayTitle = getDisplayTitle(project.title);
  const toLocalized = useLocalizedPath();

  return (
    <motion.div
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.24) }}
      className="group relative overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.045] transition-colors hover:bg-white/[0.075] sm:rounded-3xl sm:border-0 glass-panel"
    >
      <Link to={toLocalized(`/projects/item/${project.id}`)} className="block h-full">
        <div className="relative aspect-[0.86] w-full overflow-hidden sm:aspect-video">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/25 to-transparent opacity-80 transition-opacity group-hover:opacity-65 sm:from-black/80 sm:opacity-60 sm:group-hover:opacity-40" />
          <LazyImage
            src={project.cover}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 sm:group-hover:scale-110"
          />

          <div className="absolute left-2 top-2 z-20 flex max-w-[calc(100%-1rem)] flex-wrap gap-2 sm:left-4 sm:top-4">
            <span className="truncate rounded-full border border-white/10 bg-black/55 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-md sm:px-3 sm:text-xs">
              {project.category}
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-20 p-3 sm:hidden">
            <p className="mb-1 text-[10px] font-semibold text-cyan-100/75">{project.year}</p>
            <h3 className="line-clamp-2 text-[13px] font-bold leading-snug text-white font-display">
              {displayTitle}
            </h3>
          </div>
        </div>

        <div className="relative z-10 hidden p-3 sm:block sm:p-5 md:p-6">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-sm font-bold leading-tight transition-colors group-hover:text-cyan-400 sm:text-xl md:text-2xl font-display">
              {displayTitle}
            </h3>
            <div className="hidden gap-3 text-white/50 sm:flex">
              {project.links?.code && (
                <a
                  href={project.links.code}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                  title="View Code"
                >
                  <FaGithub />
                </a>
              )}
              {project.links?.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-cyan-400"
                  title="Live Demo"
                >
                  <FaExternalLinkAlt />
                </a>
              )}
            </div>
          </div>

          <p className="mb-4 line-clamp-2 text-xs leading-6 text-white/58 md:text-sm">
            {project.summary}
          </p>

          <div className="mt-auto flex flex-wrap gap-2">
            {project.tech.slice(0, 3).map((tech) => (
              <span key={tech} className="rounded bg-white/5 px-2 py-1 text-xs text-white/45">
                {tech}
              </span>
            ))}
            {project.tech.length > 3 && (
              <span className="px-2 py-1 text-xs text-white/40">+ {project.tech.length - 3}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
