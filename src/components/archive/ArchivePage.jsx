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

const folderItems = [
  { label: "Work", to: "/projects", className: "left-[14%] top-[24%]" },
  { label: "CV", to: "/cv", className: "left-[34%] top-[24%]" },
  { label: "Notes", to: "/blog", className: "left-[14%] top-[62%]" },
  { label: "Store", to: "/store", className: "left-[34%] top-[62%]" },
];

const splitTitle = (title = "Archive") => {
  const normalized = String(title).trim();
  if (normalized.length <= 3) return [normalized, ""];
  const mid = Math.ceil(normalized.length / 2);
  return [normalized.slice(0, mid), normalized.slice(mid)];
};

const FolderCard = ({ label, to, className }) => {
  const toLocalized = useLocalizedPath();
  return (
    <Link to={toLocalized(to)} className={`archive-folder absolute z-30 w-[15cqw] cursor-pointer pointer-events-auto ${className}`}>
      <div className="relative mx-auto aspect-square w-[70%]">
        <svg viewBox="0 0 282 261" className="pointer-events-none absolute bottom-0 right-0 h-auto w-[90%]" aria-hidden="true">
          <defs>
            <linearGradient id={`folderBack-${label}`} x1="66" x2="268" y1="104" y2="104" gradientUnits="userSpaceOnUse">
              <stop stopColor="#001014" />
              <stop offset="1" stopColor="#22d3ee" />
            </linearGradient>
            <linearGradient id={`folderBackStroke-${label}`} x1="167" x2="167" y1="0" y2="207" gradientUnits="userSpaceOnUse">
              <stop stopColor="#67e8f9" />
              <stop offset="1" stopColor="#0f172a" />
            </linearGradient>
          </defs>
          <path d="M0.5 260.5V74.1544H156.444V0.5H281.5V74.1544V260.5H141H0.5Z" fill={`url(#folderBack-${label})`} fillOpacity="0.58" stroke={`url(#folderBackStroke-${label})`} />
        </svg>
        <span className="absolute bottom-[8%] left-0 z-[8] inline-flex w-[110%] items-center justify-center rounded-[1cqh] border border-cyan-200/20 bg-black/30 p-[1.2cqh] text-center shadow-[0_16px_24px_rgba(0,0,0,0.34)] transition duration-500 ease-out grayscale hover:grayscale-0">
          <span className="inter-font text-[1.8cqh] font-black uppercase tracking-[-.04em] text-cyan-100/90">{label}</span>
        </span>
        <svg viewBox="0 0 321 230" className="pointer-events-none absolute bottom-0 right-0 z-20 w-full" aria-hidden="true">
          <defs>
            <linearGradient id={`folderFront-${label}`} x1="168" x2="168" y1="24" y2="189" gradientUnits="userSpaceOnUse">
              <stop stopColor="#000" stopOpacity="0.57" />
              <stop offset="1" stopColor="#22d3ee" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id={`folderFrontStroke-${label}`} x1="168" x2="168" y1="24" y2="189" gradientUnits="userSpaceOnUse">
              <stop stopColor="#67e8f9" />
              <stop offset="1" stopColor="#0f172a" />
            </linearGradient>
          </defs>
          <path d="M36.3339 229.5L0.63623 82.7748H158.617L141.908 0.5H207.606H264.191L283.939 82.7748L319.636 229.5H177.985H36.3339Z" fill={`url(#folderFront-${label})`} stroke={`url(#folderFrontStroke-${label})`} />
        </svg>
      </div>
      <p className="jersey-font mt-[5%] text-center text-[3.2cqh] leading-none text-cyan-200">{label}</p>
    </Link>
  );
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
        <div className="relative aspect-video h-full w-auto [container-type:size] pointer-events-none">
          <div aria-hidden="true" className="archive-organic-shape pointer-events-none absolute bottom-[0%] right-[-10%] z-0 w-[40%] opacity-90" />
          <div aria-hidden="true" className="archive-organic-shape pointer-events-none absolute left-[5%] top-[10%] z-[11] w-[20%] opacity-90" />

          <div className="absolute right-[10.6%] top-[14.2%] z-20 flex h-[20%] items-baseline leading-[0.8] text-cyan-200">
            <span className="kapakana-font text-[20cqh] leading-[0.72]">{title.charAt(0)}</span>
            <span className="inter-font text-[10cqh] font-normal tracking-[-0.055em]">{title.slice(1)}</span>
          </div>

          <div className="absolute left-[5%] top-[8%] z-0 leading-[.78] text-cyan-100/8">
            <div className="inter-font text-[16cqh] font-black uppercase tracking-[-0.09em]">{titleA}</div>
            {titleB ? <div className="kapakana-font -mt-[5cqh] pl-[7cqh] text-[23cqh] leading-[.72]">{titleB}</div> : null}
          </div>

          <div className="absolute right-[10%] top-[30%] z-[9] w-[30%] pointer-events-auto">
            <section className="relative w-full">
              <div className="relative overflow-hidden rounded-[3cqh] bg-cyan-950/38 text-cyan-200 shadow-[0_0_0_1px_rgba(34,211,238,.08),0_0_26px_rgba(34,211,238,.16),0_18px_60px_rgba(0,0,0,.34)] backdrop-blur-[14px]">
                <div className="pointer-events-none absolute inset-0 rounded-[inherit] border-[0.3cqh] border-cyan-300/70" />
                <div className="pointer-events-none absolute inset-[0.3cqh] rounded-[3cqh] border border-cyan-200/15" />
                <div className="relative z-10 flex items-start justify-between gap-[6cqh] px-[2cqh] pt-[2cqh]">
                  <div className="min-w-0 flex-1" />
                  <span aria-hidden="true" className="inline-flex h-[4cqh] w-[4cqh] shrink-0 items-center justify-center rounded-full text-cyan-200">×</span>
                </div>
                <div className="relative z-10 px-[6cqh] pb-[5cqh] pt-[1cqh]">
                  <p className="inter-font text-[2cqh] leading-[1.27] tracking-[-0.02em] text-cyan-100/90">{subtitle || "A compact archive view for selected work, notes, profile, and contact."}</p>
                </div>
              </div>
            </section>
          </div>

          {folderItems.map((item) => <FolderCard key={item.label} {...item} />)}

          <div className={`portfolio-window absolute right-[5.2%] top-[54%] z-40 h-[40cqh] w-[45cqw] max-w-[760px] pointer-events-auto ${contentClassName}`}>
            <div className="relative h-full overflow-hidden rounded-[3cqh] bg-cyan-950/38 text-cyan-50 shadow-[0_0_0_1px_rgba(34,211,238,.08),0_0_28px_rgba(34,211,238,.16),0_18px_60px_rgba(0,0,0,.38)] backdrop-blur-[14px]">
              <div className="pointer-events-none absolute inset-0 rounded-[inherit] border-[0.3cqh] border-cyan-300/70" />
              <div className="pointer-events-none absolute inset-[0.3cqh] rounded-[3cqh] border border-cyan-200/15" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,.08)_0%,rgba(255,255,255,.025)_32%,rgba(255,255,255,.01)_100%)]" />
              <div className="pointer-events-none absolute inset-x-[0.3cqh] top-0 h-[0.3cqh] rounded-full bg-cyan-200/40 blur-[0.4px]" />
              <div className="pointer-events-none absolute inset-x-[0.3cqh] bottom-0 h-[0.3cqh] rounded-full bg-cyan-300/70" />

              <div className="relative z-10 flex items-start justify-between gap-[6cqh] px-[2cqh] pt-[2cqh]">
                <div className="min-w-0 flex-1 pl-[2cqh] jersey-font text-[4cqh] leading-none tracking-[.01em] text-cyan-200">
                  {eyebrow}
                </div>
                <span aria-hidden="true" className="inline-flex h-[4cqh] w-[4cqh] shrink-0 items-center justify-center rounded-full text-cyan-200">
                  ×
                </span>
              </div>

              <div className="archive-window relative z-10 h-[calc(100%-8cqh)] overflow-y-auto px-[6cqh] pb-[5cqh] pt-[1cqh]">
                {actions ? <div className="mb-[2cqh] flex flex-wrap gap-[1cqh]">{actions}</div> : null}
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
