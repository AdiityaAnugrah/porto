import React from "react";
import { Link } from "react-router-dom";
import { useLocalizedPath } from "../../lib/i18n";

const defaultMarks = [
  { text: "Selected\nArchive", className: "left-[12%] top-[14%] text-[5svh] blur-[2.5px]" },
  { text: "Curriculum\nVitae", className: "right-[20%] top-[11%] text-[6svh] blur-[1.5px]" },
  { text: "Digital\nProduct", className: "left-[6%] top-[42%] text-[3svh] blur-[4px]" },
  { text: "Big\nProject", className: "left-[50%] top-[31%] text-[2svh] blur-[2px]" },
  { text: "Contact", className: "right-[13%] top-[33%] text-[2.3svh] blur-[1px]" },
  { text: "Archive", className: "left-[24%] top-[60%] text-[3svh] blur-[3px]" },
  { text: "Web\nand\nSystem", className: "right-[23%] top-[52%] text-[2.5svh] blur-[2.25px]" },
  { text: "Work", className: "left-[4%] bottom-[18%] text-[5svh] blur-[1.75px]" },
  { text: "Notes", className: "left-[53%] bottom-[11%] text-[4svh] blur-[3.5px]" },
  { text: "Store", className: "right-[8%] bottom-[22%] text-[4.5svh] blur-[2.75px]" },
];

const splitTitle = (title = "Archive") => {
  const normalized = String(title).trim();
  if (normalized.length <= 3) return [normalized, ""];
  const mid = Math.ceil(normalized.length / 2);
  return [normalized.slice(0, mid), normalized.slice(mid)];
};

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
  const [titleA, titleB] = splitTitle(title);

  return (
    <section className={`archive-page archive-stage relative h-[100svh] w-full overflow-hidden text-cyan-50 ${className}`}>
      <div className="absolute inset-0 bg-[#050814]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_50%,rgba(34,211,238,.11),transparent_34rem),radial-gradient(circle_at_80%_15%,rgba(20,184,166,.09),transparent_23rem)]" />
      <div className="absolute inset-0 portfolio-grid-bg opacity-45" />

      {marks.map((mark, index) => (
        <span
          key={`${mark.text}-${index}`}
          aria-hidden="true"
          className={`archive-mark inter-font pointer-events-none absolute z-0 select-none whitespace-pre-line text-left font-normal leading-[.98] tracking-[-0.03em] text-cyan-100/10 ${mark.className || ""}`}
        >
          {mark.text}
        </span>
      ))}

      <Link
        to={toLocalized(backTo)}
        className="absolute right-[2.15%] top-[3.4%] z-50 flex h-[6svh] min-h-11 w-[6svh] min-w-11 items-center justify-center rounded-[1cqh] border border-cyan-300/75 bg-cyan-950/25 text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.16)] backdrop-blur-[6px] transition-transform duration-300 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-cyan-300/60"
        aria-label="Back to home"
      >
        <span className="jersey-font text-[3.4svh] leading-none">≡</span>
      </Link>

      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="relative aspect-video h-auto w-full max-w-[min(100vw,177.78svh)] [container-type:size] pointer-events-none">
          <div className="absolute left-[5%] top-[8%] z-0 leading-[.78] text-cyan-100/10">
            <div className="inter-font text-[16cqh] font-black uppercase tracking-[-0.09em]">{titleA}</div>
            {titleB ? <div className="kapakana-font -mt-[5cqh] pl-[7cqh] text-[23cqh] leading-[.72]">{titleB}</div> : null}
          </div>

          <div className="absolute left-[5.5%] top-[70%] z-20 max-w-[33cqw] pointer-events-auto">
            <p className="inter-font mb-[1.1cqh] text-[1.55cqh] font-bold uppercase tracking-[.38em] text-cyan-200/65">{eyebrow}</p>
            {subtitle ? <p className="inter-font text-[2.05cqh] leading-[1.55] text-slate-300/95">{subtitle}</p> : null}
            {actions ? <div className="mt-[2cqh] flex flex-wrap gap-[1cqh]">{actions}</div> : null}
          </div>

          <div className={`portfolio-window absolute right-[5.2%] top-[18%] z-30 h-[67cqh] w-[58cqw] max-w-[900px] pointer-events-auto ${contentClassName}`}>
            <div className="relative h-full overflow-hidden rounded-[3cqh] bg-cyan-950/38 text-cyan-50 shadow-[0_0_0_1px_rgba(34,211,238,.08),0_0_28px_rgba(34,211,238,.16),0_18px_60px_rgba(0,0,0,.38)] backdrop-blur-[14px]">
              <div className="pointer-events-none absolute inset-0 rounded-[inherit] border-[0.3cqh] border-cyan-300/70" />
              <div className="pointer-events-none absolute inset-[0.3cqh] rounded-[3cqh] border border-cyan-200/15" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,.08)_0%,rgba(255,255,255,.025)_32%,rgba(255,255,255,.01)_100%)]" />
              <div className="pointer-events-none absolute inset-x-[0.3cqh] top-0 h-[0.3cqh] rounded-full bg-cyan-200/40 blur-[0.4px]" />
              <div className="pointer-events-none absolute inset-x-[0.3cqh] bottom-0 h-[0.3cqh] rounded-full bg-cyan-300/70" />

              <div className="relative z-10 flex items-start justify-between gap-[6cqh] px-[2cqh] pt-[2cqh]">
                <div className="min-w-0 flex-1 pl-[2cqh] jersey-font text-[4cqh] leading-none tracking-[.01em] text-cyan-200">
                  {title}
                </div>
                <span aria-hidden="true" className="inline-flex h-[4cqh] w-[4cqh] shrink-0 items-center justify-center rounded-full text-cyan-200">
                  ×
                </span>
              </div>

              <div className="archive-window relative z-10 h-[calc(100%-8cqh)] overflow-y-auto px-[6cqh] pb-[5cqh] pt-[1cqh]">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArchivePage;
