import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, Filter, Layers3 } from "lucide-react";
import { Link } from "react-router-dom";
import ProjectCard from "../components/projects/ProjectCard";
import SEO from "../components/SEO";
import { projects } from "../data/projects";
import { useLocalizedPath } from "../lib/i18n";
import { usePreferredLanguage } from "../lib/usePreferredLanguage";

const copy = {
  id: {
    seoTitle: "Project | Aditya Anugrah",
    seoDescription:
      "Project pilihan Aditya Anugrah untuk website bisnis, dashboard, sistem internal, dan produk digital.",
    badge: "Selected work",
    title: "Project yang menunjukkan cara kebutuhan bisnis diterjemahkan menjadi produk digital.",
    body:
      "Saya menampilkan project yang relevan: website, dashboard, sistem internal, dan aplikasi yang punya tujuan bisnis jelas.",
    proof: [
      ["Area", "Website + Sistem"],
      ["Fokus", "Business workflow"],
      ["Output", "Design to launch"],
    ],
    all: "Semua",
    categories: {
      "Web Apps": "Web Apps",
      "Mobile Apps": "Mobile Apps",
      "Landing Pages": "Landing Pages",
    },
    emptyTitle: "Project tidak ditemukan",
    emptyBody: "Pilih kategori lain untuk melihat project yang tersedia.",
    ctaTitle: "Ada kebutuhan seperti salah satu project ini?",
    ctaBody: "Kita bisa mulai dari scope yang paling penting, lalu bangun versi yang siap dipakai.",
    ctaButton: "Diskusi project",
  },
  en: {
    seoTitle: "Projects | Aditya Anugrah",
    seoDescription:
      "Selected projects by Aditya Anugrah for business websites, dashboards, internal systems, and digital products.",
    badge: "Selected work",
    title: "Projects that show how business needs become digital products.",
    body:
      "I highlight relevant work: websites, dashboards, internal systems, and applications with clear business goals.",
    proof: [
      ["Area", "Web + Systems"],
      ["Focus", "Business workflow"],
      ["Output", "Design to launch"],
    ],
    all: "All",
    categories: {
      "Web Apps": "Web Apps",
      "Mobile Apps": "Mobile Apps",
      "Landing Pages": "Landing Pages",
    },
    emptyTitle: "No projects found",
    emptyBody: "Choose another category to see available projects.",
    ctaTitle: "Need something similar to one of these projects?",
    ctaBody: "We can start from the most important scope, then build a version ready to use.",
    ctaButton: "Discuss a project",
  },
};

const categories = ["All", "Web Apps", "Mobile Apps", "Landing Pages"];

const Projects = () => {
  const { language } = usePreferredLanguage();
  const toLocalized = useLocalizedPath();
  const t = copy[language] || copy.en;
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = useMemo(() => {
    const sorted = [...projects].sort((a, b) => b.year - a.year);
    if (activeCategory === "All") return sorted;
    return sorted.filter((project) => project.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen px-4 pb-24 pt-24 sm:px-6 md:pb-32 md:pt-28">
      <SEO title={t.seoTitle} description={t.seoDescription} path="/projects" />

      <div className="mx-auto max-w-7xl">
        <header className="grid gap-6 border-b border-white/10 pb-6 sm:gap-8 sm:pb-8 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-white/[0.055] px-3 py-1.5 text-xs text-cyan-100 sm:mb-5 sm:px-4 sm:py-2 sm:text-sm">
              <BriefcaseBusiness size={14} aria-hidden="true" />
              {t.badge}
            </div>
            <h1 className="max-w-4xl text-2xl font-bold leading-snug text-white sm:text-4xl sm:leading-tight md:text-6xl">
              {t.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62 sm:mt-5 sm:text-base md:text-lg md:leading-8">{t.body}</p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {t.proof.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.045] p-3 sm:p-4">
                <p className="text-[10px] text-white/38 sm:text-xs">{label}</p>
                <p className="mt-1.5 text-xs font-bold leading-snug text-white sm:mt-2 sm:text-sm">{value}</p>
              </div>
            ))}
          </div>
        </header>

        <div className="my-6 flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.035] p-1.5 sm:my-8 sm:p-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white/45 sm:h-11 sm:w-11">
            <Filter size={16} aria-hidden="true" />
          </div>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`min-h-10 shrink-0 rounded-xl px-3 text-xs font-semibold transition-colors sm:min-h-11 sm:px-4 sm:text-sm ${
                activeCategory === category
                  ? "bg-cyan-100 text-black"
                  : "text-white/62 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              {category === "All" ? t.all : t.categories[category]}
            </button>
          ))}
        </div>

        {filteredProjects.length === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
            <Layers3 className="text-white/30" size={38} aria-hidden="true" />
            <h2 className="mt-4 text-xl font-bold text-white">{t.emptyTitle}</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-white/50">{t.emptyBody}</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 gap-3 sm:gap-5 md:gap-7">
            <AnimatePresence>
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <section className="mt-16 rounded-3xl border border-white/10 bg-white/[0.045] p-6 text-center md:p-10">
          <h2 className="text-3xl font-black leading-tight text-white md:text-5xl">{t.ctaTitle}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/58">{t.ctaBody}</p>
          <div className="mt-8 flex justify-center">
            <Link
              to={toLocalized("/contact")}
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-cyan-100 px-8 font-bold text-black transition-colors hover:bg-white"
            >
              {t.ctaButton}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Projects;
