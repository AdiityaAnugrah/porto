import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  Code2,
  Compass,
  Download,
  ExternalLink,
  Mail,
  MapPin,
  Server,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import SEO from "../components/SEO";
import LazyImage from "../components/common/LazyImage";
import PubgCard from "../components/about/PubgCard";
import SpotifyCard from "../components/about/SpotifyCard";
import SteamCard from "../components/about/SteamCard";
import { r2Image } from "../lib/media";
import { usePreferredLanguage } from "../lib/usePreferredLanguage";

const pageText = {
  id: {
    seoTitle: "Tentang Aditya Anugrah | Full-Stack Web Developer",
    seoDescription:
      "Tentang Aditya Anugrah, full-stack web developer yang membangun website, sistem bisnis, dashboard, API, dan produk digital untuk kebutuhan bisnis.",
    badge: "About the builder",
    title: "Saya membantu bisnis mengubah kebutuhan digital menjadi produk yang rapi, jelas, dan bisa dipakai.",
    intro:
      "Saya Aditya Anugrah, full-stack web developer berbasis di Semarang dan Palembang. Fokus saya ada di website bisnis, dashboard operasional, REST API, storefront, dan produk digital yang dibuat dengan arah bisnis yang jelas.",
    location: "Semarang & Palembang, Indonesia",
    cv: "Download CV",
    contact: "Hubungi saya",
    profileNote:
      "Saya bekerja dari strategi, interface, engineering, sampai deploy. Jadi diskusi tidak berhenti di tampilan, tapi sampai alur kerja, performa, SEO dasar, dan maintenance.",
    principlesLabel: "Cara saya bekerja",
    principlesTitle: "Pendekatannya business-first, eksekusinya tetap engineering.",
    principles: [
      [
        "Mulai dari konteks bisnis",
        "Sebelum desain dan coding, saya petakan target user, tujuan halaman, proses internal, dan prioritas fitur.",
      ],
      [
        "Bangun alur yang mudah dipakai",
        "UI dibuat untuk membantu user mengambil keputusan, bukan sekadar terlihat penuh atau ramai.",
      ],
      [
        "Siapkan pondasi teknis",
        "Struktur frontend, backend, database, dan integrasi dibuat agar mudah dirawat dan dikembangkan.",
      ],
    ],
    capabilityLabel: "Yang biasa saya bangun",
    capabilities: [
      ["Company profile", "Website pengenalan bisnis, layanan, portfolio, dan CTA yang jelas."],
      ["Landing page", "Halaman campaign yang fokus pada trust, copy, dan konversi."],
      ["Dashboard", "Panel admin, reporting, inventory, dan workflow internal."],
      ["API & integration", "Payment gateway, email, storage, analytics, dan layanan pihak ketiga."],
      ["Digital store", "Katalog produk digital, checkout, status order, dan delivery otomatis."],
      ["Optimization", "SEO teknis, metadata, performa halaman, dan monitoring ringan."],
    ],
    processLabel: "Operating model",
    processTitle: "Dari discovery sampai launch, alurnya dibuat transparan.",
    process: [
      ["01", "Discovery", "Memahami kebutuhan, market, konten, fitur, dan batasan project."],
      ["02", "Structure", "Menyusun sitemap, user flow, copy direction, dan komponen utama."],
      ["03", "Build", "Mengembangkan UI, backend, database, integrasi, dan admin workflow."],
      ["04", "Launch", "Deploy, test, monitor, lalu iterasi berdasarkan kebutuhan nyata."],
    ],
    stackLabel: "Tech stack",
    projectModes: [
      ["Client delivery", "Company profile, katalog, dashboard, form operasional, API, dan halaman campaign."],
      ["Internal tools", "Automation kecil, admin panel, integrasi data, deployment checklist, dan helper workflow."],
      ["Experimental builds", "Eksplorasi UI, micro product, game/server utility, AI workflow, dan prototype cepat."],
    ],
    minecraftLabel: "Community server",
    minecraftTitle: "Minecraft Server",
    minecraftBody:
      "Saya juga mengelola server Minecraft kecil untuk komunitas. Ini menjadi lab operasional nyata untuk VPS, Apache reverse proxy, DNS, SSL, backup, service process, dan monitoring ringan.",
    minecraftCta: "Kunjungi server page",
    projectsCta: "Lihat project",
    personalLabel: "Personal signal",
    musicLabel: "Music flow",
    pubgLabel: "PUBG Steam",
    steamLabel: "Steam profile",
    careerLabel: "Perjalanan karier",
    career: [
      [
        "Full-stack Developer",
        "Ilena Furniture",
        "2023 - Sekarang",
        "Membangun storefront Next.js dengan SSR/ISR, struktur katalog, SEO, dan integrasi kebutuhan e-commerce.",
      ],
      [
        "Web Developer",
        "PT Catur Bahkti Mandiri Semarang",
        "2022 - Sekarang",
        "Mengembangkan aplikasi web berbasis HTML, CSS, PHP, CodeIgniter, database, dan optimasi performa website.",
      ],
      [
        "Backend + UI Developer",
        "Titanium Group",
        "2024 - 2025",
        "Merancang skema database, REST API CodeIgniter 4, dashboard manajemen, dan laporan PDF otomatis.",
      ],
      [
        "Android Development",
        "Bangkit Academy by Google, GoTo, Traveloka",
        "2022",
        "Mengembangkan aplikasi Android menggunakan Kotlin dan Java dalam proyek pembelajaran berbasis tim.",
      ],
      [
        "UI/UX Design",
        "PT Greatedu Global Mahardika",
        "2022",
        "Mempelajari proses desain aplikasi mobile, prototyping, dan prinsip pengalaman pengguna.",
      ],
      [
        "Staff Admin",
        "Kantor Kesahbandaran Palembang",
        "2021 - 2022",
        "Mengelola administrasi, dokumen clearance kapal, dan komunikasi operasional pelabuhan.",
      ],
    ],
    ctaTitle: "Butuh partner untuk membangun website atau sistem bisnis?",
    ctaBody:
      "Kita bisa mulai dari diskusi singkat: tujuan bisnis, fitur prioritas, timeline, dan bentuk output yang paling masuk akal.",
    ctaButton: "Diskusi project",
  },
  en: {
    seoTitle: "About Aditya Anugrah | Full-Stack Web Developer",
    seoDescription:
      "About Aditya Anugrah, a full-stack web developer building websites, business systems, dashboards, APIs, and digital products for business needs.",
    badge: "About the builder",
    title: "I help businesses turn digital requirements into polished, clear, usable products.",
    intro:
      "I am Aditya Anugrah, a full-stack web developer based in Semarang and Palembang, Indonesia. My focus is business websites, operational dashboards, REST APIs, storefronts, and digital products built with a clear business direction.",
    location: "Semarang & Palembang, Indonesia",
    cv: "Download CV",
    contact: "Contact me",
    profileNote:
      "I work across strategy, interface, engineering, and deployment. The discussion does not stop at visuals; it also covers workflow, performance, SEO foundations, and maintenance.",
    principlesLabel: "How I work",
    principlesTitle: "The approach is business-first, while the execution stays engineering-led.",
    principles: [
      [
        "Start from business context",
        "Before design and code, I map the target users, page goals, internal processes, and feature priorities.",
      ],
      [
        "Build usable flows",
        "The interface is designed to help users make decisions, not just to look busy or decorative.",
      ],
      [
        "Prepare technical foundations",
        "Frontend, backend, database, and integration structure are built to stay maintainable and scalable.",
      ],
    ],
    capabilityLabel: "What I usually build",
    capabilities: [
      ["Company profile", "Business websites for services, proof of work, portfolio, and clear CTAs."],
      ["Landing page", "Campaign pages focused on trust, copy, and conversion."],
      ["Dashboard", "Admin panels, reporting, inventory, and internal workflows."],
      ["API & integration", "Payment gateways, email, storage, analytics, and third-party services."],
      ["Digital store", "Digital product catalogs, checkout, order status, and automatic delivery."],
      ["Optimization", "Technical SEO, metadata, page performance, and lightweight monitoring."],
    ],
    processLabel: "Operating model",
    processTitle: "From discovery to launch, the workflow stays transparent.",
    process: [
      ["01", "Discovery", "Understanding needs, market, content, features, and project constraints."],
      ["02", "Structure", "Defining sitemap, user flow, copy direction, and core components."],
      ["03", "Build", "Developing UI, backend, database, integrations, and admin workflows."],
      ["04", "Launch", "Deploying, testing, monitoring, and iterating based on real needs."],
    ],
    stackLabel: "Tech stack",
    projectModes: [
      ["Client delivery", "Company profiles, catalogs, dashboards, operational forms, APIs, and campaign pages."],
      ["Internal tools", "Small automation, admin panels, data integrations, deployment checklists, and workflow helpers."],
      ["Experimental builds", "UI exploration, micro products, game/server utilities, AI workflows, and fast prototypes."],
    ],
    minecraftLabel: "Community server",
    minecraftTitle: "Minecraft Server",
    minecraftBody:
      "I also manage a small Minecraft server for the community. It works as a real operations lab for VPS, Apache reverse proxy, DNS, SSL, backups, service processes, and lightweight monitoring.",
    minecraftCta: "Visit server page",
    projectsCta: "View projects",
    personalLabel: "Personal signal",
    musicLabel: "Music flow",
    pubgLabel: "PUBG Steam",
    steamLabel: "Steam profile",
    careerLabel: "Career path",
    career: [
      [
        "Full-stack Developer",
        "Ilena Furniture",
        "2023 - Present",
        "Building a Next.js storefront with SSR/ISR, catalog structure, SEO, and e-commerce requirements.",
      ],
      [
        "Web Developer",
        "PT Catur Bahkti Mandiri Semarang",
        "2022 - Present",
        "Developing web applications with HTML, CSS, PHP, CodeIgniter, databases, and website performance optimization.",
      ],
      [
        "Backend + UI Developer",
        "Titanium Group",
        "2024 - 2025",
        "Designing database schemas, CodeIgniter 4 REST APIs, management dashboards, and automatic PDF reports.",
      ],
      [
        "Android Development",
        "Bangkit Academy by Google, GoTo, Traveloka",
        "2022",
        "Developing Android applications with Kotlin and Java in a team-based learning project.",
      ],
      [
        "UI/UX Design",
        "PT Greatedu Global Mahardika",
        "2022",
        "Learning mobile app design processes, prototyping, and user experience principles.",
      ],
      [
        "Staff Admin",
        "Kantor Kesahbandaran Palembang",
        "2021 - 2022",
        "Managing administration, ship clearance documents, and port operational communication.",
      ],
    ],
    ctaTitle: "Need a partner to build a website or business system?",
    ctaBody:
      "We can start from a short discussion: business goals, feature priorities, timeline, and the most practical output.",
    ctaButton: "Discuss a project",
  },
};

const stack = ["React", "Next.js", "TypeScript", "Tailwind", "Node.js", "PHP", "CodeIgniter", "MySQL", "Git", "Kotlin"];
const principleIcons = [Compass, Code2, ShieldCheck];

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const SectionHeader = ({ label, title }) => (
  <div className="mb-8">
    <p className="mb-3 text-xs font-semibold uppercase text-cyan-200/70">{label}</p>
    <h2 className="max-w-3xl text-3xl font-bold leading-tight text-white md:text-5xl">{title}</h2>
  </div>
);

const About = () => {
  const { language } = usePreferredLanguage();
  const t = pageText[language] || pageText.en;
  const profileImage = r2Image("profile/me-sunset.jpeg", "/assets/me-sunset.jpeg");
  const profileImageAbsolute = r2Image(
    "profile/me-sunset.jpeg",
    "https://adityaanugrah.me/assets/me-sunset.jpeg"
  );

  return (
    <div className="pb-28">
      <SEO
        title={t.seoTitle}
        description={t.seoDescription}
        path="/about"
        type="profile"
        imageAlt="Aditya Anugrah"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Aditya Anugrah",
          alternateName: ["Aditya Anugrah Dev", "adiityaanugrah"],
          url: "https://adityaanugrah.me/about",
          image: profileImageAbsolute,
          jobTitle: "Full-Stack Web Developer",
          description: t.seoDescription,
          email: "adityaanugrah494@gmail.com",
          nationality: "Indonesian",
          homeLocation: [
            { "@type": "City", name: "Semarang", addressCountry: "ID" },
            { "@type": "City", name: "Palembang", addressCountry: "ID" },
          ],
          sameAs: [
            "https://github.com/adiityaanugrah",
            "https://www.linkedin.com/in/aditya-anugrah/",
            "https://steamcommunity.com/id/claraikaa/",
          ],
          knowsAbout: [
            "React",
            "Next.js",
            "Node.js",
            "PHP",
            "CodeIgniter",
            "MySQL",
            "JavaScript",
            "TypeScript",
            "Web Development",
            "REST API",
            "Kotlin",
            "Android Development",
          ],
        }}
      />

      <section className="relative overflow-hidden px-6 pt-28">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/30 to-transparent" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(238,232,220,0.035)_1px,transparent_1px)] bg-[size:100%_56px] opacity-45" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <motion.aside
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:sticky lg:top-24"
          >
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045]">
              <div className="aspect-[4/5] overflow-hidden">
                <LazyImage
                  src={profileImage}
                  alt="Aditya Anugrah"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white">Aditya Anugrah</h2>
                <div className="mt-2 flex items-center gap-2 text-sm text-white/50">
                  <MapPin size={16} aria-hidden="true" />
                  {t.location}
                </div>
                <p className="mt-5 text-sm leading-7 text-white/58">{t.profileNote}</p>

                <div className="mt-6 grid gap-3">
                  <a
                    href="https://drive.google.com/file/d/1M66SJlH_9zlT4EePbq-VrYYxctgjua9M/preview"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cyan-100 px-5 font-bold text-black transition-colors hover:bg-white"
                  >
                    <Download size={17} aria-hidden="true" />
                    {t.cv}
                  </a>
                  <Link
                    to="/contact"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 font-bold text-white transition-colors hover:bg-white/[0.075]"
                  >
                    <Mail size={17} aria-hidden="true" />
                    {t.contact}
                  </Link>
                </div>

                <div className="mt-6 flex justify-center gap-5 text-xl text-white/48">
                  <a href="https://github.com/adiityaanugrah" target="_blank" rel="noopener noreferrer" aria-label="GitHub Aditya Anugrah" className="transition-colors hover:text-white">
                    <FaGithub />
                  </a>
                  <a href="https://www.linkedin.com/in/aditya-anugrah/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Aditya Anugrah" className="transition-colors hover:text-white">
                    <FaLinkedin />
                  </a>
                </div>
              </div>
            </div>
          </motion.aside>

          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
            <motion.div variants={fadeIn} className="mb-12">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-white/[0.055] px-4 py-2 text-sm text-cyan-100 backdrop-blur">
                <Sparkles size={16} aria-hidden="true" />
                {t.badge}
              </div>
              <h1 className="max-w-4xl text-4xl font-bold leading-[1.07] text-white md:text-6xl">
                {t.title}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-white/66 md:text-lg">{t.intro}</p>
            </motion.div>

            <motion.section variants={fadeIn} className="mb-16">
              <SectionHeader label={t.principlesLabel} title={t.principlesTitle} />
              <div className="grid gap-4 md:grid-cols-3">
                {t.principles.map(([title, body], index) => {
                  const Icon = principleIcons[index];
                  return (
                    <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.045] p-6">
                      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200">
                        <Icon size={22} aria-hidden="true" />
                      </div>
                      <h3 className="text-lg font-bold text-white">{title}</h3>
                      <p className="mt-3 text-sm leading-7 text-white/55">{body}</p>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center gap-3 text-cyan-200/75">
            <BriefcaseBusiness size={20} aria-hidden="true" />
            <p className="text-xs font-semibold uppercase">{t.capabilityLabel}</p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
            {t.capabilities.map(([title, body]) => (
              <div key={title} className="bg-[#0d0b08] p-6">
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/55">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeader label={t.processLabel} title={t.processTitle} />
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

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-5">
          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 md:p-8">
            <p className="mb-5 text-xs font-semibold uppercase text-white/42">{t.stackLabel}</p>
            <div className="flex flex-wrap gap-2">
              {stack.map((tech) => (
                <span key={tech} className="rounded-xl border border-white/10 bg-white/[0.055] px-3 py-2 text-xs font-semibold text-white/70">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {t.projectModes.map(([title, body], index) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
                <span className="text-xs font-bold text-cyan-200">0{index + 1}</span>
                <h3 className="mt-4 text-lg font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/55">{body}</p>
              </div>
            ))}
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-6 md:p-8">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-green-500/10 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-200">
                    <Server size={23} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-green-200/80">{t.minecraftLabel}</p>
                    <h2 className="text-3xl font-bold text-white">{t.minecraftTitle}</h2>
                  </div>
                </div>
                <p className="max-w-2xl text-sm leading-7 text-white/58 md:text-base">{t.minecraftBody}</p>
              </div>
              <div className="grid gap-3">
                <a
                  href="https://play.adityaanugrah.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 font-bold text-black transition-colors hover:bg-green-50"
                >
                  {t.minecraftCta}
                  <ExternalLink size={16} aria-hidden="true" />
                </a>
                <Link
                  to="/projects"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-500/10 px-5 font-bold text-cyan-100 transition-colors hover:bg-cyan-500/15"
                >
                  {t.projectsCta}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-5 text-xs font-semibold uppercase text-white/42">{t.personalLabel}</p>
            <div className="grid gap-5 lg:grid-cols-3">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase text-green-200/70">{t.musicLabel}</p>
                <SpotifyCard />
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase text-orange-200/70">{t.pubgLabel}</p>
                <PubgCard />
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase text-cyan-200/70">{t.steamLabel}</p>
                <SteamCard />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-white/[0.045] p-6 md:p-8">
          <p className="mb-8 text-xs font-semibold uppercase text-cyan-200/70">{t.careerLabel}</p>
          <div className="grid gap-x-12 gap-y-9 border-l border-white/10 pl-6 md:grid-cols-2">
            {t.career.map(([role, company, period, body]) => (
              <div key={`${role}-${company}`} className="relative">
                <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-[#0a0a0a] bg-cyan-300" />
                <h3 className="text-lg font-bold text-white">{role}</h3>
                <p className="mt-1 text-xs font-semibold text-cyan-200/70">{company} - {period}</p>
                <p className="mt-3 text-sm leading-7 text-white/55">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pt-14">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-black leading-tight text-white md:text-6xl">{t.ctaTitle}</h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/58 md:text-lg">{t.ctaBody}</p>
          <div className="mt-10 flex justify-center">
            <Link
              to="/contact"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-cyan-100 px-8 font-bold text-black transition-colors hover:bg-white"
            >
              {t.ctaButton}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
