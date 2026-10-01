import React from "react";
import { Link, useParams } from "react-router-dom";
import SEO from "../components/SEO";
import ArchivePage from "../components/archive/ArchivePage";
import { projects } from "../data/projects";
import { useLocalizedPath } from "../lib/i18n";

const ProjectDetail = () => {
  const { id } = useParams();
  const toLocalized = useLocalizedPath();
  const project = projects.find((item) => item.id === id) || projects[0];

  return (
    <>
      <SEO title={`${project.title} | Project`} description={project.summary} image={project.cover} />
      <ArchivePage eyebrow={`${project.category} / ${project.year}`} title="Case" subtitle={project.title} backTo="/projects" contentClassName="lg:min-h-[66svh]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-[1.5rem] border border-cyan-100/10 bg-black/30">
            <img src={project.cover} alt={project.title} className="h-64 w-full object-cover opacity-80" loading="lazy" />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[ ["Role", project.role], ["Client", project.client], ["Duration", project.duration] ].map(([label, value]) => (
              <div key={label} className="archive-card"><p className="text-[10px] uppercase tracking-[0.3em] text-cyan-200/45">{label}</p><p className="mt-2 font-bold text-white">{value || "-"}</p></div>
            ))}
          </div>
          <p className="text-base leading-8 text-slate-300">{project.summary}</p>
          <div className="grid gap-5 md:grid-cols-2">
            {[ ["Features", project.features], ["Responsibilities", project.responsibilities], ["Challenges", project.challenges], ["Results", project.results] ].map(([title, items]) => (
              <section key={title} className="archive-card">
                <h2 className="text-lg font-black uppercase text-white">{title}</h2>
                <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-300">
                  {(items || []).map((item) => <li key={item}>— {item}</li>)}
                </ul>
              </section>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {(project.tech || []).map((tech) => <span key={tech} className="archive-pill">{tech}</span>)}
          </div>
          <Link to={toLocalized("/projects")} className="archive-btn">← Back to archive</Link>
        </div>
      </ArchivePage>
    </>
  );
};

export default ProjectDetail;
