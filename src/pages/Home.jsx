import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { r2Image } from "../lib/media";
import { useLocalizedPath } from "../lib/i18n";
import { usePreferredLanguage } from "../lib/usePreferredLanguage";

const content = {
  id: {
    seoTitle: "Aditya Anugrah | Digital Product & Web Development",
    seoDescription:
      "Portfolio Aditya Anugrah untuk website, aplikasi bisnis, dashboard, dan produk digital yang dibangun untuk pertumbuhan bisnis.",
  },
  en: {
    seoTitle: "Aditya Anugrah | Digital Product & Web Development",
    seoDescription:
      "Aditya Anugrah portfolio for websites, business applications, dashboards, and digital products built for business growth.",
  },
};

const archiveLabels = [
  { text: "Digital\nProduct", to: "/projects", className: "left-[9%] top-[13%] text-[clamp(2.2rem,5.8vw,6.2rem)] blur-[2px]" },
  { text: "Curriculum\nVitae", to: "/cv", className: "right-[16%] top-[10%] text-[clamp(2.5rem,6.2vw,7rem)] blur-[1.4px]" },
  { text: "Web\nand\nSystem", to: "/projects/web", className: "left-[5%] top-[42%] text-[clamp(1.3rem,3.2vw,3.6rem)] blur-[4px]" },
  { text: "Store", to: "/store", className: "left-[50%] top-[31%] text-[clamp(1rem,2vw,2.3rem)] blur-[2px]" },
  { text: "Invoice", to: "/invoice", className: "right-[12%] top-[33%] text-[clamp(1.1rem,2.4vw,2.6rem)] blur-[1px]" },
  { text: "About\nMe", to: "/about", className: "left-[24%] top-[60%] text-[clamp(1.5rem,3.4vw,3.9rem)] blur-[3px]" },
  { text: "Business\nCase", to: "/projects", className: "right-[22%] top-[53%] text-[clamp(1.4rem,3vw,3.4rem)] blur-[2.4px]" },
  { text: "Selected\nWork", to: "/projects", className: "left-[4%] bottom-[16%] text-[clamp(2rem,5vw,5.6rem)] blur-[1.8px]" },
  { text: "Notes", to: "/blog", className: "left-[54%] bottom-[11%] text-[clamp(2rem,4.8vw,5.2rem)] blur-[3.4px]" },
  { text: "Contact", to: "/contact", className: "right-[8%] bottom-[21%] text-[clamp(2rem,5vw,5.5rem)] blur-[2.7px]" },
];

const Home = () => {
  const { language } = usePreferredLanguage();
  const toLocalized = useLocalizedPath();
  const t = content[language] || content.en;
  const profileImage = r2Image("profile/me-sunset.jpeg", "https://adityaanugrah.me/assets/me-sunset.jpeg");
  const siteLogo = r2Image("brand/icon-256.png", "https://adityaanugrah.me/assets/icon-256.png");

  const jsonLdGraph = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": "https://adityaanugrah.me/#person",
      name: "Aditya Anugrah",
      jobTitle: "Web Developer & Business Consultant",
      url: "https://adityaanugrah.me",
      sameAs: [
        "https://github.com/adiityaanugrah",
        "https://www.linkedin.com/in/aditya-anugrah/",
        "https://www.instagram.com/adiityaanugrah/",
      ],
      image: profileImage,
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": "https://adityaanugrah.me/#business",
      name: "Aditya Anugrah - Digital Product & Web Development",
      description: t.seoDescription,
      url: "https://adityaanugrah.me",
      logo: siteLogo,
      image: profileImage,
      telephone: "+6281379430432",
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        addressCountry: "ID",
        addressRegion: "Jawa Tengah",
        addressLocality: "Semarang",
      },
    },
  ];

  return (
    <div className="h-[100svh] overflow-hidden">
      <SEO title={t.seoTitle} description={t.seoDescription} jsonLd={jsonLdGraph} type="website" />

      <section className="archive-hero relative h-[100svh] w-full overflow-hidden text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[#050814]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(125,211,252,0.13),transparent_34rem),radial-gradient(circle_at_80%_15%,rgba(129,140,248,0.10),transparent_22rem)]" />
          <div className="absolute inset-0 portfolio-grid-bg opacity-60" />
        </div>

        {archiveLabels.map((item, index) => (
          <Link
            key={`${item.text}-${index}`}
            to={toLocalized(item.to)}
            aria-label={item.text.replaceAll("\n", " ")}
            className={`archive-label absolute z-20 whitespace-pre-line text-left leading-[0.92] font-normal tracking-[-0.055em] text-slate-100/82 transition-[filter,transform,opacity,color] duration-500 hover:scale-[1.035] hover:text-white hover:blur-none focus-visible:scale-[1.035] focus-visible:blur-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/70 ${item.className}`}
          >
            {item.text}
          </Link>
        ))}

        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
          <div className="relative aspect-video w-full max-w-7xl [container-type:size]">
            <div className="absolute left-[27%] top-[38%] flex items-baseline leading-[0.78] text-cyan-100 drop-shadow-[0_0_34px_rgba(125,211,252,.20)]">
              <span className="kapakana-font text-[30cqw] leading-[0.72]">P</span>
              <span className="inter-font text-[13cqw] font-normal tracking-[-0.075em]">ort</span>
              <span className="jersey-font ml-[.2rem] text-[13cqw] tracking-[0.01em]">folio</span>
            </div>

            <div className="absolute left-[42%] top-[53%] flex items-baseline leading-[0.78] text-white drop-shadow-[0_0_28px_rgba(125,211,252,.16)]">
              <span className="kapakana-font text-[30cqw] leading-[0.72]">A</span>
              <span className="inter-font text-[13cqw] font-normal tracking-[-0.075em]">ditya</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;