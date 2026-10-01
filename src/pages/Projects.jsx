import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../components/SEO";
import ArchivePage from "../components/archive/ArchivePage";
import { projects } from "../data/projects";
import { useLocalizedPath, stripLocaleFromPath } from "../lib/i18n";

const categoryMap = {
  "/projects/web": "Web Apps",
  "/projects/mobile": "Mobile Apps",
  "/projects/landing": "Landing Pages",
};

const Projects = () => {
  const location = useLocation();
  const toLocalized = useLocalizedPath();
  const activePath = stripLocaleFromPath(location.pathname);
  const activeCategory = categoryMap[activePath];
  const visible = useMemo(() => {
    const sorted = [...projects].sort((a, b) => (b.year || 0) - (a.year || 0));
    return activeCategory ? sorted.filter((project) => project.category === activeCategory) : sorted;
  }, [activeCategory]);

  return (
    <>
      <SEO title="Selected Work | Aditya Anugrah" description="Archive project Aditya Anugrah: website, sistem, dashboard, dan aplikasi." />
      <ArchivePage eyebrow="Selected work" title="Work" subtitle="Tidak dibuat seperti landing page panjang. Semua project ditampilkan sebagai archive agar cepat dibaca dan dibandingkan.">
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {[["All", "/projects"], ["Web", "/projects/web"], ["Mobile", "/projects/mobile"], ["Landing", "/projects/landing"]].map(([label, to]) => (
              <Link key={to} to={toLocalized(to)} className={`archive-btn ${stripLocaleFromPath(to) === activePath ? "archive-btn-primary" : ""}`}>{label}</Link>
            ))}
          </div>
          <div className="grid gap-3">
            {visible.map((project, index) => (
              <Link key={project.id} to={toLocalized(`/projects/item/${project.id}`)} className="archive-row group">
                <span className="font-display text-4xl font-black text-cyan-200/50">{String(index + 1).padStart(2, "0")}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-200/45">{project.category} / {project.year}</p>
                  <h2 className="mt-1 text-xl font-black uppercase tracking-[-0.03em] text-white group-hover:text-cyan-100 sm:text-3xl">{project.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-7 text-slate-300">{project.summary}</p>
                </div>
                <span className="hidden text-sm font-bold uppercase tracking-[0.28em] text-cyan-200/60 md:block">open</span>
              </Link>
            ))}
          </div>
        </div>
      </ArchivePage>
    </>
  );
};

export default Projects;
