import React from "react";
import { Link } from "react-router-dom";
import { useLocalizedPath } from "../../lib/i18n";

const defaultMarks = [
  { text: "Selected\nArchive", className: "left-[4%] top-[12%] text-[clamp(2rem,5vw,5.6rem)] blur-[3px]" },
  { text: "Digital\nProduct", className: "right-[8%] top-[10%] text-[clamp(1.8rem,4.4vw,4.8rem)] blur-[2px]" },
  { text: "Portfolio", className: "left-[8%] bottom-[14%] text-[clamp(2.2rem,5.8vw,6.2rem)] blur-[3.5px]" },
  { text: "Aditya", className: "right-[10%] bottom-[16%] text-[clamp(1.7rem,4vw,4.4rem)] blur-[2.5px]" },
];

const ArchivePage = ({
  eyebrow = "Portfolio archive",
  title = "Archive",
  subtitle,
  children,
  backTo = "/",
  marks = defaultMarks,
  actions,
  className = "",
  contentClassName = "",
}) => {
  const toLocalized = useLocalizedPath();

  return (
    <section className={`archive-page relative min-h-[100svh] overflow-hidden px-4 py-4 text-white sm:px-6 lg:px-8 ${className}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,.13),transparent_36%)]" />

      {marks.map((mark, index) => (
        <span
          key={`${mark.text}-${index}`}
          aria-hidden="true"
          className={`archive-mark pointer-events-none absolute z-0 select-none whitespace-pre-line font-script leading-[.75] text-cyan-100/15 ${mark.className || ""}`}
        >
          {mark.text}
        </span>
      ))}

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-2rem)] w-full max-w-7xl flex-col">
        <header className="flex items-center justify-between gap-3 py-2">
          <Link
            to={toLocalized(backTo)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-cyan-100/20 bg-black/35 px-4 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100/80 transition hover:border-cyan-200/50 hover:bg-cyan-300/10 focus:outline-none focus:ring-2 focus:ring-cyan-300/60"
          >
            <span aria-hidden="true">←</span> Home
          </Link>
          <nav className="hidden items-center gap-2 md:flex" aria-label="Archive shortcuts">
            {[
              ["Work", "/projects"],
              ["CV", "/cv"],
              ["Contact", "/contact"],
            ].map(([label, to]) => (
              <Link
                key={to}
                to={toLocalized(to)}
                className="min-h-11 rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/55 transition hover:border-cyan-200/40 hover:text-cyan-100"
              >
                {label}
              </Link>
            ))}
          </nav>
        </header>

        <div className="grid flex-1 items-center gap-5 py-4 lg:grid-cols-[.82fr_1.18fr] lg:py-6">
          <aside className="relative min-h-[220px] lg:min-h-[620px]">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.45em] text-cyan-200/70">{eyebrow}</p>
            <h1 className="max-w-[12ch] font-display text-[clamp(3.6rem,12vw,12rem)] font-black uppercase leading-[0.78] tracking-[-0.08em] text-white/95">
              {title}
            </h1>
            {subtitle && <p className="mt-5 max-w-md text-sm leading-7 text-slate-300 sm:text-base">{subtitle}</p>}
            {actions && <div className="mt-6 flex flex-wrap gap-3">{actions}</div>}
          </aside>

          <div className={`retro-window archive-window relative max-h-[calc(100svh-7.5rem)] min-h-[58svh] overflow-y-auto rounded-[2rem] border border-cyan-100/15 bg-[#06101c]/82 p-4 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl sm:p-6 lg:p-8 ${contentClassName}`}>
            <div className="sticky -top-4 z-20 -mx-4 -mt-4 mb-6 flex items-center justify-between border-b border-cyan-100/10 bg-[#06101c]/90 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:-mt-6 sm:px-6 lg:-mx-8 lg:-mt-8 lg:px-8">
              <div className="flex gap-2" aria-hidden="true">
                <span className="h-3 w-3 rounded-full bg-cyan-300/80" />
                <span className="h-3 w-3 rounded-full bg-teal-300/70" />
                <span className="h-3 w-3 rounded-full bg-white/35" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-cyan-100/45">archive view</span>
            </div>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArchivePage;
