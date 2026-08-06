import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Code2,
  ExternalLink,
  Globe2,
  Layers3,
  MonitorSmartphone,
  PanelTop,
} from "lucide-react";
import { imageUrl } from "../../lib/media";
import { useLocalizedPath } from "../../lib/i18n";

const categoryIcons = {
  "Web Apps": MonitorSmartphone,
  "Mobile Apps": Code2,
  "Landing Pages": PanelTop,
};

const getDisplayTitle = (title = "") => String(title).split(/\s[—-]\s/)[0] || title;

const InteractiveSelector = ({ projects = [], eyebrow = "Project highlights" }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animatedOptions, setAnimatedOptions] = useState([]);
  const navigate = useNavigate();
  const toLocalized = useLocalizedPath();

  const options = useMemo(
    () =>
      projects.slice(0, 5).map((project) => ({
        ...project,
        displayTitle: getDisplayTitle(project.title),
        image: imageUrl(project.cover),
        Icon: categoryIcons[project.category] || Globe2,
      })),
    [projects]
  );

  useEffect(() => {
    setActiveIndex(0);
    setAnimatedOptions([]);
  }, [options.length]);

  useEffect(() => {
    const timers = options.map((_, index) =>
      window.setTimeout(() => {
        setAnimatedOptions((current) => (current.includes(index) ? current : [...current, index]));
      }, 110 * index)
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [options]);

  if (!options.length) return null;

  const active = options[Math.min(activeIndex, options.length - 1)];
  const openProject = (project) => {
    navigate(toLocalized(`/projects/item/${project.id}`));
  };

  return (
    <section className="mb-10 overflow-hidden rounded-3xl border border-white/10 bg-[#0d0b08]/82 shadow-2xl shadow-black/25">
      <div className="grid gap-0 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="border-b border-white/10 p-5 sm:p-6 lg:border-b-0 lg:border-r lg:p-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-cyan-100">
            <Layers3 size={14} aria-hidden="true" />
            {eyebrow}
          </div>
          <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
            Pilih project untuk melihat konteks, stack, dan hasil utama.
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/56">
            Highlight ini dibuat untuk membaca portfolio lebih cepat: pilih kartu, lihat ringkasannya, lalu buka detail bila relevan.
          </p>

          <div className="mt-6 grid gap-2">
            {options.map((project, index) => {
              const selected = index === activeIndex;
              const Icon = project.Icon;

              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={selected}
                  className={`flex min-h-14 w-full items-center gap-3 rounded-2xl border px-3 text-left transition-colors ${
                    selected
                      ? "border-cyan-200/45 bg-cyan-200/[0.10] text-white"
                      : "border-white/10 bg-white/[0.035] text-white/62 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      selected ? "bg-cyan-100 text-black" : "bg-white/8 text-cyan-100"
                    }`}
                  >
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold">{project.displayTitle}</span>
                    <span className="mt-0.5 block truncate text-xs text-white/42">{project.category}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-3 sm:p-4 lg:p-5">
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => openProject(active)}
              className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10 text-left"
              aria-label={`Open project ${active.title}`}
            >
              <img src={active.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
              <ProjectLabel project={active} active />
            </button>
          </div>

          <div className="hidden h-[420px] items-stretch overflow-hidden rounded-2xl md:flex">
            {options.map((project, index) => {
              const selected = index === activeIndex;
              const Icon = project.Icon;

              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => (selected ? openProject(project) : setActiveIndex(index))}
                  aria-pressed={selected}
                  aria-label={`${selected ? "Open" : "Select"} project ${project.title}`}
                  className="relative flex min-w-[64px] flex-col justify-end overflow-hidden border-2 bg-[#181512] text-left outline-none transition-[flex,border-color,box-shadow,opacity,transform] duration-500 ease-out focus-visible:z-20 focus-visible:ring-2 focus-visible:ring-cyan-100 motion-reduce:transition-none"
                  style={{
                    backgroundImage: `url("${project.image}")`,
                    backgroundSize: selected ? "auto 100%" : "auto 118%",
                    backgroundPosition: "center",
                    opacity: animatedOptions.includes(index) ? 1 : 0,
                    transform: animatedOptions.includes(index) ? "translateX(0)" : "translateX(-36px)",
                    borderColor: selected ? "rgba(238, 232, 220, 0.92)" : "rgba(255, 255, 255, 0.10)",
                    boxShadow: selected ? "0 24px 70px rgba(0,0,0,0.48)" : "0 12px 30px rgba(0,0,0,0.28)",
                    flex: selected ? "7 1 0%" : "1 1 0%",
                    zIndex: selected ? 10 : 1,
                  }}
                >
                  <div
                    className="absolute inset-x-0 bottom-0 h-48 transition-opacity duration-500"
                    style={{
                      background: selected
                        ? "linear-gradient(to top, rgba(0,0,0,0.92), rgba(0,0,0,0.56), transparent)"
                        : "linear-gradient(to top, rgba(0,0,0,0.72), transparent)",
                    }}
                  />

                  <div className="absolute inset-x-0 bottom-5 z-10 flex items-center gap-3 px-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/16 bg-black/65 text-white backdrop-blur-md">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <div
                      className="min-w-0 transition-all duration-500"
                      style={{
                        opacity: selected ? 1 : 0,
                        transform: selected ? "translateX(0)" : "translateX(24px)",
                      }}
                    >
                      <p className="truncate text-lg font-bold text-white">{project.displayTitle}</p>
                      <p className="mt-1 line-clamp-1 text-sm text-white/66">{project.summary}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-white/45">
                  <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 font-semibold text-cyan-100">
                    {active.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={14} aria-hidden="true" />
                    {active.year}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white sm:text-2xl">{active.title}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">{active.summary}</p>
              </div>

              <button
                type="button"
                onClick={() => openProject(active)}
                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-cyan-100 px-5 text-sm font-bold text-black transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100"
              >
                Detail project
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {(active.tech || []).slice(0, 5).map((tech) => (
                <span key={tech} className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-white/52">
                  {tech}
                </span>
              ))}
              {active.links?.live && (
                <a
                  href={active.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/52 transition-colors hover:border-cyan-200/35 hover:text-cyan-100"
                >
                  Live
                  <ExternalLink size={12} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProjectLabel = ({ project }) => {
  const Icon = project.Icon;

  return (
    <div className="absolute inset-x-0 bottom-0 z-10 p-5">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/16 bg-black/65 text-white backdrop-blur-md">
        <Icon size={21} aria-hidden="true" />
      </div>
      <p className="text-xs font-semibold uppercase text-cyan-100/75">{project.category}</p>
      <h3 className="mt-2 text-2xl font-bold leading-tight text-white">{project.title}</h3>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/62">{project.summary}</p>
    </div>
  );
};

export default InteractiveSelector;
