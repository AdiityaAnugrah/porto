import React from "react";
import { Link } from "react-router-dom";
import { useLocalizedPath } from "../../lib/i18n";

const defaultMarks = [
  { text: "Selected\nArchive", className: "left-[5%] top-[14%] text-[4.5svh] blur-[3px]" },
  { text: "Digital\nProduct", className: "right-[11%] top-[12%] text-[4svh] blur-[2px]" },
  { text: "Portfolio", className: "left-[7%] bottom-[16%] text-[4.8svh] blur-[3.5px]" },
  { text: "Aditya", className: "right-[12%] bottom-[18%] text-[3.6svh] blur-[2.5px]" },
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
    <section className={`archive-page relative min-h-[100svh] overflow-hidden px-3 py-3 text-white sm:px-5 lg:px-7 ${className}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,.13),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,.10),transparent_34%)]" />

      {marks.map((mark, index) => (
        <span
          key={`${mark.text}-${index}`}
          aria-hidden="true"
          className={`archive-mark pointer-events-none absolute z-0 select-none whitespace-pre-line font-script leading-[.75] text-cyan-100/13 ${mark.className || ""}`}
        >
          {mark.text}
        </span>
      ))}

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-1.5rem)] w-full max-w-6xl flex-col">
        <header className="flex items-center justify-between gap-3 py-1.5">
          <Link
            to={toLocalized(backTo)}
            className="inline-flex min-h-10 items-center gap-2 rounded-[.85rem] border border-cyan-100/20 bg-black/30 px-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-100/75 transition hover:border-cyan-200/50 hover:bg-cyan-300/10 focus:outline-none focus:ring-2 focus:ring-cyan-300/60"
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
                className="min-h-10 rounded-[.85rem] border border-white/10 bg-white/[0.03] px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50 transition hover:border-cyan-200/40 hover:text-cyan-100"
              >
                {label}
              </Link>
            ))}
          </nav>
        </header>

        <div className="grid flex-1 items-center gap-4 py-3 lg:grid-cols-[.72fr_1.28fr] lg:py-4">
          <aside className="relative min-h-[170px] lg:min-h-[500px]">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.38em] text-cyan-200/65">{eyebrow}</p>
            <h1 className="max-w-[12ch] font-display text-[clamp(2.8rem,7.4vw,7.8rem)] font-black uppercase leading-[0.82] tracking-[-0.075em] text-white/92">
              {title}
            </h1>
            {subtitle && <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">{subtitle}</p>}
            {actions && <div className="mt-5 flex flex-wrap gap-2.5">{actions}</div>}
          </aside>

          <div className={`retro-window archive-window relative max-h-[calc(100svh-6.25rem)] min-h-[52svh] overflow-y-auto rounded-[1.35rem] border border-cyan-100/14 bg-[#06101c]/78 p-3 shadow-2xl shadow-cyan-950/25 backdrop-blur-xl sm:p-4 lg:p-5 ${contentClassName}`}>
            <div className="sticky -top-3 z-20 -mx-3 -mt-3 mb-4 flex items-center justify-between border-b border-cyan-100/10 bg-[#06101c]/90 px-3 py-2.5 backdrop-blur-xl sm:-mx-4 sm:-mt-4 sm:px-4 lg:-mx-5 lg:-mt-5 lg:px-5">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-300/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-teal-300/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/35" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-cyan-100/40">archive view</span>
            </div>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArchivePage;
