import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  BriefcaseBusiness,
  Cpu,
  Globe2,
  Layers3,
  LineChart,
  Rocket,
  ShieldCheck,
  Sparkles,
  Store,
} from "lucide-react";
import { FaDatabase, FaNodeJs, FaPhp, FaReact } from "react-icons/fa";
import { SiCodeigniter, SiNextdotjs, SiTailwindcss, SiTypescript } from "react-icons/si";
import ProjectCard from "../components/projects/ProjectCard";
import SEO from "../components/SEO";
import { projects } from "../data/projects";
import { posts } from "../data/posts";
import { imageUrl, r2Image } from "../lib/media";
import { useLocalizedPath } from "../lib/i18n";
import { usePreferredLanguage } from "../lib/usePreferredLanguage";

const content = {
  id: {
    seoTitle: "Aditya Anugrah | Digital Product & Web Development",
    seoDescription:
      "Portfolio Aditya Anugrah untuk website, aplikasi bisnis, dashboard, dan produk digital yang dibangun untuk pertumbuhan bisnis.",
    eyebrow: "Digital Product Development - Indonesia",
    headline: "Membangun website, sistem, dan produk digital untuk pertumbuhan bisnis.",
    intro:
      "Saya membantu bisnis merancang, membangun, dan meluncurkan pengalaman digital yang kredibel, cepat, dan siap dikembangkan.",
    primaryCta: "Diskusi Proyek",
    secondaryCta: "Lihat Portfolio",
    heroNote: "Portfolio - Store - Business Systems - Web Engineering",
    metrics: [
      ["Fokus", "Business-first"],
      ["Output", "Website + Sistem"],
      ["Delivery", "Design to launch"],
    ],
    introTitle: "Dibangun seperti partner digital, bukan sekadar vendor teknis.",
    introBody:
      "Setiap project dimulai dari kebutuhan bisnis: siapa targetnya, apa yang harus dipercaya user, dan proses apa yang perlu dibuat lebih efisien. Dari sana, desain, engineering, dan optimasi dibangun sebagai satu alur.",
    pillarsLabel: "Core pillars",
    pillarsTitle: "Empat fondasi untuk produk digital yang siap dipakai.",
    pillars: [
      ["Strategy", "Memetakan tujuan bisnis, user flow, struktur konten, dan prioritas fitur sebelum masuk ke desain."],
      ["Interface", "Membuat tampilan yang jelas, responsif, dan terasa profesional untuk calon customer maupun tim internal."],
      ["Engineering", "Membangun frontend, backend, API, dashboard, dan integrasi dengan struktur yang mudah dikembangkan."],
      ["Growth", "Menyiapkan performa, SEO dasar, analytics, dan iterasi agar produk bisa terus ditingkatkan."],
    ],
    buildLabel: "What I build",
    buildTitle: "Solusi yang paling sering dibutuhkan bisnis digital.",
    capabilities: [
      ["Company profile", "Website kredibel untuk memperkenalkan bisnis, layanan, dan bukti kerja."],
      ["Landing page", "Halaman promosi yang fokus pada konversi dan campaign."],
      ["Digital store", "Katalog produk digital, checkout, status order, dan delivery otomatis."],
      ["Business system", "Dashboard, inventory, admin panel, reporting, dan workflow internal."],
      ["SEO foundation", "Struktur teknis, metadata, sitemap, dan performa halaman."],
      ["API integration", "Payment gateway, email, storage, analytics, dan layanan pihak ketiga."],
    ],
    processLabel: "How it works",
    processTitle: "Proses kerja yang transparan dari ide sampai launch.",
    process: [
      ["01", "Discovery", "Memahami goal, market, konten, fitur, dan constraint project."],
      ["02", "Structure", "Menyusun sitemap, flow, copy direction, dan komponen utama."],
      ["03", "Build", "Mengembangkan UI, backend, integrasi, dan admin workflow."],
      ["04", "Launch", "Deploy, test, monitor, lalu optimasi berdasarkan kebutuhan nyata."],
    ],
    workLabel: "Selected work",
    workTitle: "Project sebagai bukti cara berpikir dan eksekusi.",
    workBody:
      "Portfolio tetap menjadi bukti utama: bukan hanya tampilan, tapi bagaimana sebuah kebutuhan bisnis diterjemahkan menjadi produk yang bisa dipakai.",
    allWork: "Lihat semua project",
    storeTitle: "Digital store sebagai produk tambahan.",
    storeBody:
      "Selain jasa pengembangan, saya juga menyiapkan produk digital seperti template, panduan, dan workflow siap pakai untuk kebutuhan bisnis kecil dan kreator.",
    storeCta: "Buka digital store",
    articlesLabel: "Notes",
    articlesTitle: "Tulisan seputar web, bisnis, dan engineering.",
    allArticles: "Baca semua artikel",
    stackTitle: "Teknologi yang saya gunakan untuk membangun produk scalable.",
    ctaLabel: "Tersedia untuk project baru",
    ctaTitle: "Mari bangun produk digital yang terasa serius sejak halaman pertama.",
    ctaBody:
      "Kalau kamu butuh website, sistem, atau store yang lebih rapi dan siap dipakai untuk bisnis, kita bisa mulai dari diskusi singkat.",
    ctaButton: "Mulai diskusi",
  },
  en: {
    seoTitle: "Aditya Anugrah | Digital Product & Web Development",
    seoDescription:
      "Aditya Anugrah portfolio for websites, business applications, dashboards, and digital products built for business growth.",
    eyebrow: "Digital Product Development - Indonesia",
    headline: "Building websites, systems, and digital products for business growth.",
    intro:
      "I help businesses design, build, and launch digital experiences that feel credible, fast, and ready to scale.",
    primaryCta: "Discuss a Project",
    secondaryCta: "View Portfolio",
    heroNote: "Portfolio - Store - Business Systems - Web Engineering",
    metrics: [
      ["Focus", "Business-first"],
      ["Output", "Web + Systems"],
      ["Delivery", "Design to launch"],
    ],
    introTitle: "Built like a digital partner, not just a technical vendor.",
    introBody:
      "Every project starts from the business case: who needs to trust it, what the user needs to do, and which workflow should become faster. Design, engineering, and optimization then work as one system.",
    pillarsLabel: "Core pillars",
    pillarsTitle: "Four foundations for digital products that are ready to use.",
    pillars: [
      ["Strategy", "Mapping business goals, user flows, content structure, and feature priorities before design."],
      ["Interface", "Creating responsive, credible interfaces for customers, teams, and internal operations."],
      ["Engineering", "Building frontend, backend, APIs, dashboards, and integrations with maintainable structure."],
      ["Growth", "Preparing performance, SEO foundations, analytics, and iteration paths for future improvement."],
    ],
    buildLabel: "What I build",
    buildTitle: "Digital solutions businesses usually need first.",
    capabilities: [
      ["Company profile", "Credible websites for introducing businesses, services, and proof of work."],
      ["Landing page", "Campaign-focused pages built for clarity and conversion."],
      ["Digital store", "Digital product catalogs, checkout, order status, and automatic delivery."],
      ["Business system", "Dashboards, inventory, admin panels, reporting, and internal workflows."],
      ["SEO foundation", "Technical structure, metadata, sitemap, and page performance."],
      ["API integration", "Payment gateways, email, storage, analytics, and third-party services."],
    ],
    processLabel: "How it works",
    processTitle: "A transparent workflow from idea to launch.",
    process: [
      ["01", "Discovery", "Understanding goals, market, content, features, and project constraints."],
      ["02", "Structure", "Defining sitemap, flow, copy direction, and core components."],
      ["03", "Build", "Developing UI, backend, integrations, and admin workflows."],
      ["04", "Launch", "Deploying, testing, monitoring, and improving based on real needs."],
    ],
    workLabel: "Selected work",
    workTitle: "Projects as proof of thinking and execution.",
    workBody:
      "The portfolio remains the proof: not just the visual layer, but how a business requirement becomes a product people can actually use.",
    allWork: "View all projects",
    storeTitle: "Digital store as an additional product channel.",
    storeBody:
      "Beyond custom development, I also prepare digital products such as templates, guides, and ready-to-use workflows for small businesses and creators.",
    storeCta: "Open digital store",
    articlesLabel: "Notes",
    articlesTitle: "Writing about web, business, and engineering.",
    allArticles: "Read all articles",
    stackTitle: "Technologies I use to build scalable products.",
    ctaLabel: "Available for new projects",
    ctaTitle: "Let us build a digital product that feels serious from the first screen.",
    ctaBody:
      "If you need a website, system, or store that is polished and business-ready, we can start from a short discussion.",
    ctaButton: "Start a discussion",
  },
};

const pillarIcons = [BriefcaseBusiness, Layers3, Cpu, LineChart];
const capabilityIcons = [Globe2, Rocket, Store, Boxes, BarChart3, ShieldCheck];
const stack = [
  { name: "React", icon: FaReact, color: "text-blue-400" },
  { name: "Next.js", icon: SiNextdotjs, color: "text-white" },
  { name: "TypeScript", icon: SiTypescript, color: "text-blue-500" },
  { name: "Tailwind", icon: SiTailwindcss, color: "text-cyan-400" },
  { name: "Node.js", icon: FaNodeJs, color: "text-green-500" },
  { name: "PHP / CI4", icon: SiCodeigniter, color: "text-orange-500" },
  { name: "MySQL", icon: FaDatabase, color: "text-yellow-500" },
];

const SectionHeading = ({ eyebrow, title, body, action }) => (
  <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
    <div>
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase text-cyan-200/70">
          {eyebrow}
        </p>
      )}
      <h2 className="max-w-3xl text-3xl font-bold leading-tight text-white md:text-5xl">{title}</h2>
      {body && <p className="mt-4 max-w-2xl text-sm leading-7 text-white/56 md:text-base">{body}</p>}
    </div>
    {action}
  </div>
);

const Home = () => {
  const { language } = usePreferredLanguage();
  const toLocalized = useLocalizedPath();
  const t = content[language] || content.en;
  const featuredProjects = [...projects].sort((a, b) => b.year - a.year).slice(0, 4);
  const latestPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
  const profileImage = r2Image(
    "profile/me-sunset.jpeg",
    "https://adityaanugrah.me/assets/me-sunset.jpeg"
  );
  const siteLogo = r2Image(
    "brand/icon-256.png",
    "https://adityaanugrah.me/assets/icon-256.png"
  );

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
      worksFor: {
        "@type": "Organization",
        name: "Freelance Professional",
      },
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
      sameAs: ["https://www.linkedin.com/in/aditya-anugrah/"],
    },
  ];

  return (
    <div className="pb-20">
      <SEO title={t.seoTitle} description={t.seoDescription} jsonLd={jsonLdGraph} type="website" />

      <section className="relative flex min-h-[calc(100dvh-2rem)] items-center overflow-hidden px-6 pb-16 pt-28">
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={profileImage}
            alt=""
            className="h-full w-full object-cover opacity-28"
            loading="eager"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#090806_0%,rgba(9,8,6,0.88)_38%,rgba(9,8,6,0.52)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(238,232,220,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(238,232,220,0.045)_1px,transparent_1px)] bg-[size:80px_80px] opacity-35" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-white/[0.055] px-4 py-2 text-sm text-cyan-100 backdrop-blur">
              <Sparkles size={16} aria-hidden="true" />
              {t.eyebrow}
            </div>
            <h1 className="text-4xl font-bold leading-[1.05] text-white md:text-7xl lg:text-8xl">
              {t.headline}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/68 md:text-xl">{t.intro}</p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to={toLocalized("/contact")}
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-cyan-100 px-7 font-bold text-black transition-colors hover:bg-white"
              >
                {t.primaryCta}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                to={toLocalized("/projects")}
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-7 font-bold text-white transition-colors hover:bg-white/[0.08]"
              >
                {t.secondaryCta}
              </Link>
            </div>
          </div>

          <div className="mt-14 grid gap-3 md:grid-cols-3">
            {t.metrics.map(([label, value]) => (
              <div key={label} className="border-l border-cyan-200/25 pl-5">
                <p className="text-xs uppercase text-white/38">{label}</p>
                <p className="mt-2 text-xl font-bold text-white">{value}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-xs font-semibold uppercase text-white/30">{t.heroNote}</p>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025] px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <h2 className="text-3xl font-bold leading-tight text-white md:text-5xl">{t.introTitle}</h2>
          <p className="text-base leading-8 text-white/58 md:text-lg">{t.introBody}</p>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow={t.pillarsLabel} title={t.pillarsTitle} />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {t.pillars.map(([title, body], index) => {
              const Icon = pillarIcons[index];
              return (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.045] p-6">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200">
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/56">{body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="services" className="scroll-mt-24 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow={t.buildLabel} title={t.buildTitle} />
          <div className="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
            {t.capabilities.map(([title, body], index) => {
              const Icon = capabilityIcons[index];
              return (
                <div key={title} className="bg-[#0d0b08] p-6">
                  <Icon className="mb-5 text-cyan-200" size={24} aria-hidden="true" />
                  <h3 className="text-lg font-bold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/55">{body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow={t.processLabel} title={t.processTitle} />
          <div className="grid gap-4 lg:grid-cols-4">
            {t.process.map(([number, title, body]) => (
              <div key={number} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <p className="text-sm font-bold text-cyan-200">{number}</p>
                <h3 className="mt-5 text-xl font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/55">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={t.workLabel}
            title={t.workTitle}
            body={t.workBody}
            action={
              <Link to={toLocalized("/projects")} className="inline-flex items-center gap-2 text-sm font-bold uppercase text-cyan-200 hover:text-white">
                {t.allWork}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            }
          />
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-3xl border border-white/10 bg-white/[0.045] p-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-200">
              <Store size={24} aria-hidden="true" />
            </div>
            <h2 className="text-3xl font-bold text-white">{t.storeTitle}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58 md:text-base">{t.storeBody}</p>
          </div>
          <Link
            to={toLocalized("/store")}
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-cyan-100 px-7 font-bold text-black transition-colors hover:bg-white"
          >
            {t.storeCta}
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={t.articlesLabel}
            title={t.articlesTitle}
            action={
              <Link to={toLocalized("/blog")} className="inline-flex items-center gap-2 text-sm font-bold uppercase text-cyan-200 hover:text-white">
                {t.allArticles}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            }
          />
          <div className="grid gap-6 md:grid-cols-3">
            {latestPosts.map((post) => (
              <Link
                to={toLocalized(`/blog/${post.id}`)}
                key={post.id}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] transition-colors hover:border-cyan-300/30 hover:bg-white/[0.065]"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={imageUrl(post.image)}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase text-cyan-200/70">{post.category}</p>
                  <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-white">{post.title}</h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/52">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-y border-white/10 py-20">
        <div className="mx-auto mb-10 max-w-5xl px-6 text-center">
          <h2 className="text-2xl font-bold text-white/45">{t.stackTitle}</h2>
        </div>
        <div className="relative flex overflow-hidden whitespace-nowrap">
          <div className="animate-[marquee_24s_linear_infinite] flex min-w-full items-center justify-around gap-16 px-10">
            {[...stack, ...stack].map((tech, index) => (
              <div key={`${tech.name}-${index}`} className="flex items-center gap-3 text-white/45">
                <tech.icon className={`text-3xl ${tech.color}`} />
                <span className="text-sm font-semibold">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-32">
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-6 inline-flex rounded-full border border-cyan-300/20 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase text-cyan-200">
            {t.ctaLabel}
          </span>
          <h2 className="text-4xl font-black leading-tight text-white md:text-7xl">{t.ctaTitle}</h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/58 md:text-lg">{t.ctaBody}</p>
          <div className="mt-10 flex justify-center">
            <Link
              to={toLocalized("/contact")}
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-cyan-100 px-8 font-bold text-black transition-colors hover:bg-white"
            >
              {t.ctaButton}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
          `,
        }}
      />
    </div>
  );
};

export default Home;
