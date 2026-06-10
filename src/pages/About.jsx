import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  Download,
  ExternalLink,
  Gamepad2,
  Mail,
  MapPin,
  Rocket,
  Server,
  ShieldCheck,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import SEO from "../components/SEO";
import LazyImage from "../components/common/LazyImage";
import PubgCard from "../components/about/PubgCard";
import SpotifyCard from "../components/about/SpotifyCard";
import SteamCard from "../components/about/SteamCard";
import { r2Image } from "../lib/media";
import { useLocalizedPath } from "../lib/i18n";
import { usePreferredLanguage } from "../lib/usePreferredLanguage";

const text = {
  id: {
    seoTitle: "Tentang Aditya Anugrah | Full-Stack Web Developer",
    seoDescription:
      "Aditya Anugrah membantu bisnis membangun website, dashboard, API, dan sistem digital yang jelas, cepat, dan siap digunakan.",
    badge: "About",
    title: "Saya membangun website dan sistem bisnis yang jelas, cepat, dan siap dipakai.",
    intro:
      "Fokus saya membantu bisnis tampil lebih kredibel, menerima inquiry dengan lebih rapi, dan menjalankan proses digital melalui website, dashboard, API, dan integrasi.",
    location: "Semarang & Palembang, Indonesia",
    cv: "Download CV",
    contact: "Diskusi Project",
    facts: [
      ["Role", "Full-stack Web Developer"],
      ["Focus", "Website, Dashboard, API"],
      ["Stack", "React, Node.js, PHP, MySQL"],
    ],
    servicesLabel: "Yang saya bantu",
    servicesTitle: "Solusi digital yang langsung berhubungan dengan kebutuhan bisnis.",
    services: [
      ["Company profile", "Website untuk memperkenalkan bisnis, layanan, portfolio, dan kontak."],
      ["Landing page", "Halaman campaign yang fokus pada trust, copy, dan konversi."],
      ["Business dashboard", "Panel admin, reporting, inventory, dan workflow internal."],
      ["API & integration", "Payment gateway, email, storage, analytics, dan layanan pihak ketiga."],
    ],
    approachLabel: "Cara kerja",
    approachTitle: "Dari kebutuhan sampai launch dibuat ringkas dan terukur.",
    approach: [
      ["01", "Define", "Tujuan bisnis, user flow, konten, dan fitur prioritas dibuat jelas di awal."],
      ["02", "Build", "UI, backend, database, dan integrasi dibangun sesuai kebutuhan utama."],
      ["03", "Launch", "Deploy, test, SEO dasar, dan pengecekan performa sebelum digunakan."],
    ],
    experienceLabel: "Pengalaman utama",
    experienceTitle: "Beberapa area kerja yang membentuk cara saya membangun produk.",
    experience: [
      ["PT Catur Bahkti Mandiri", "Web application, PHP, CodeIgniter, database, dan optimasi website."],
      ["Ilena Furniture", "Storefront Next.js, katalog produk, SEO, dan kebutuhan e-commerce."],
      ["Titanium Group", "REST API, dashboard operasional, skema database, dan laporan PDF."],
    ],
    personalLabel: "Lab & personal",
    personalTitle: "Minecraft server, musik, PUBG, dan akun Steam.",
    personalBody:
      "Di luar pekerjaan client, saya juga merawat server komunitas dan beberapa aktivitas personal yang masih dekat dengan dunia digital.",
    minecraftTitle: "Minecraft Server",
    minecraftBody:
      "Server survival kecil untuk komunitas. Saya pakai ini juga sebagai ruang praktik deployment, DNS, SSL, service process, dan monitoring ringan.",
    minecraftSmallLabel: "Community server",
    minecraftAddress: "play.adityaanugrah.me",
    minecraftCta: "Kunjungi server",
    minecraftNote:
      "Server ini jadi bagian dari cara saya tetap eksplorasi hal teknis di luar project komersial.",
    minecraftFacts: [
      ["Mode", "Public Survival"],
      ["Stack", "VPS + Apache"],
      ["Focus", "Community + Ops"],
    ],
    musicLabel: "Spotify",
    pubgLabel: "PUBG",
    steamLabel: "Akun Steam",
    ctaTitle: "Butuh website atau sistem yang lebih rapi?",
    ctaBody: "Kita bisa mulai dari kebutuhan paling penting dulu, lalu buat versi yang siap dipakai.",
    ctaButton: "Mulai diskusi",
  },
  en: {
    seoTitle: "About Aditya Anugrah | Full-Stack Web Developer",
    seoDescription:
      "Aditya Anugrah helps businesses build websites, dashboards, APIs, and digital systems that are clear, fast, and ready to use.",
    badge: "About",
    title: "I build websites and business systems that are clear, fast, and ready to use.",
    intro:
      "My focus is helping businesses look credible, handle inquiries more clearly, and run digital workflows through websites, dashboards, APIs, and integrations.",
    location: "Semarang & Palembang, Indonesia",
    cv: "Download CV",
    contact: "Discuss Project",
    facts: [
      ["Role", "Full-stack Web Developer"],
      ["Focus", "Websites, Dashboards, APIs"],
      ["Stack", "React, Node.js, PHP, MySQL"],
    ],
    servicesLabel: "What I help with",
    servicesTitle: "Digital solutions connected directly to business needs.",
    services: [
      ["Company profile", "Websites for presenting a business, services, portfolio, and contact flow."],
      ["Landing page", "Campaign pages focused on trust, copy, and conversion."],
      ["Business dashboard", "Admin panels, reporting, inventory, and internal workflows."],
      ["API & integration", "Payment gateways, email, storage, analytics, and third-party services."],
    ],
    approachLabel: "How I work",
    approachTitle: "From requirement to launch, the process stays concise and measurable.",
    approach: [
      ["01", "Define", "Business goals, user flow, content, and priority features are clarified first."],
      ["02", "Build", "UI, backend, database, and integrations are built around the core need."],
      ["03", "Launch", "Deployment, testing, SEO basics, and performance checks before use."],
    ],
    experienceLabel: "Main experience",
    experienceTitle: "A few work areas that shape how I build products.",
    experience: [
      ["PT Catur Bahkti Mandiri", "Web applications, PHP, CodeIgniter, databases, and website optimization."],
      ["Ilena Furniture", "Next.js storefront, product catalog, SEO, and e-commerce requirements."],
      ["Titanium Group", "REST APIs, operational dashboards, database schemas, and PDF reports."],
    ],
    personalLabel: "Lab & personal",
    personalTitle: "Minecraft server, music, PUBG, and a Steam account.",
    personalBody:
      "Outside client work, I also maintain a small community server and a few personal activity profiles connected to digital culture.",
    minecraftTitle: "Minecraft Server",
    minecraftBody:
      "A small survival server for the community. I also use it as a practical lab for deployment, DNS, SSL, service processes, and lightweight monitoring.",
    minecraftSmallLabel: "Community server",
    minecraftAddress: "play.adityaanugrah.me",
    minecraftCta: "Visit server",
    minecraftNote:
      "This server is part of how I keep exploring technical operations outside commercial projects.",
    minecraftFacts: [
      ["Mode", "Public Survival"],
      ["Stack", "VPS + Apache"],
      ["Focus", "Community + Ops"],
    ],
    musicLabel: "Spotify",
    pubgLabel: "PUBG",
    steamLabel: "Steam account",
    ctaTitle: "Need a cleaner website or business system?",
    ctaBody: "We can start from the most important requirement, then build a version that is ready to use.",
    ctaButton: "Start a discussion",
  },
};

const serviceIcons = [BriefcaseBusiness, Rocket, ShieldCheck, Code2];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const SectionHeader = ({ label, title }) => (
  <div className="mb-7 md:mb-9">
    <p className="mb-3 text-xs font-semibold uppercase text-cyan-200/70">{label}</p>
    <h2 className="max-w-3xl text-2xl font-bold leading-tight text-white md:text-4xl">{title}</h2>
  </div>
);

const About = () => {
  const { language } = usePreferredLanguage();
  const toLocalized = useLocalizedPath();
  const t = text[language] || text.en;
  const profileImage = r2Image("profile/me-sunset.jpeg", "/assets/me-sunset.jpeg");
  const profileImageAbsolute = r2Image(
    "profile/me-sunset.jpeg",
    "https://adityaanugrah.me/assets/me-sunset.jpeg"
  );

  return (
    <div className="pb-20 md:pb-28">
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
          ],
          knowsAbout: ["React", "Next.js", "Node.js", "PHP", "CodeIgniter", "MySQL", "REST API"],
        }}
      />

      <section className="relative overflow-hidden px-4 pt-24 sm:px-6 md:pt-28">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/30 to-transparent" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(238,232,220,0.035)_1px,transparent_1px)] bg-[size:100%_56px] opacity-40" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.08fr_0.72fr] lg:items-center lg:gap-12">
          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
            <motion.div variants={fadeUp}>
              <div className="mb-5 inline-flex rounded-full border border-cyan-300/20 bg-white/[0.055] px-3.5 py-2 text-sm text-cyan-100">
                {t.badge}
              </div>
              <h1 className="max-w-4xl text-3xl font-bold leading-tight text-white sm:text-4xl md:text-6xl">
                {t.title}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-white/66 md:text-lg">{t.intro}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={toLocalized("/contact")}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cyan-100 px-6 font-bold text-black transition-colors hover:bg-white"
                >
                  {t.contact}
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
                <a
                  href="https://drive.google.com/file/d/1M66SJlH_9zlT4EePbq-VrYYxctgjua9M/preview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-6 font-bold text-white transition-colors hover:bg-white/[0.075]"
                >
                  <Download size={17} aria-hidden="true" />
                  {t.cv}
                </a>
              </div>
            </motion.div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] md:rounded-3xl"
          >
            <div className="aspect-[16/10] overflow-hidden lg:aspect-[4/4.6]">
              <LazyImage src={profileImage} alt="Aditya Anugrah" className="h-full w-full object-cover" />
            </div>
            <div className="p-5 md:p-6">
              <div className="flex items-center gap-2 text-sm text-white/55">
                <MapPin size={16} aria-hidden="true" />
                {t.location}
              </div>

              <div className="mt-5 grid gap-3">
                {t.facts.map(([label, value]) => (
                  <div key={label} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-cyan-200" size={18} aria-hidden="true" />
                    <div>
                      <p className="text-xs font-semibold uppercase text-white/35">{label}</p>
                      <p className="mt-1 text-sm font-bold text-white">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex justify-center gap-5 text-xl text-white/48">
                <a href="https://github.com/adiityaanugrah" target="_blank" rel="noopener noreferrer" aria-label="GitHub Aditya Anugrah" className="transition-colors hover:text-white">
                  <FaGithub />
                </a>
                <a href="https://www.linkedin.com/in/aditya-anugrah/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Aditya Anugrah" className="transition-colors hover:text-white">
                  <FaLinkedin />
                </a>
                <a href="mailto:adityaanugrah494@gmail.com" aria-label="Email Aditya Anugrah" className="transition-colors hover:text-white">
                  <Mail size={21} />
                </a>
              </div>
            </div>
          </motion.aside>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeader label={t.servicesLabel} title={t.servicesTitle} />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {t.services.map(([title, body], index) => {
              const Icon = serviceIcons[index];
              return (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200">
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/55">{body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 md:py-18">
        <div className="mx-auto max-w-7xl">
          <SectionHeader label={t.approachLabel} title={t.approachTitle} />
          <div className="grid gap-4 md:grid-cols-3">
            {t.approach.map(([number, title, body]) => (
              <div key={number} className="rounded-2xl border border-white/10 bg-[#0d0b08] p-5">
                <p className="text-sm font-bold text-cyan-200">{number}</p>
                <h3 className="mt-5 text-xl font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/55">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <SectionHeader label={t.experienceLabel} title={t.experienceTitle} />
          <div className="grid gap-3">
            {t.experience.map(([company, body]) => (
              <div key={company} className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
                <h3 className="text-base font-bold text-white">{company}</h3>
                <p className="mt-2 text-sm leading-7 text-white/55">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 grid gap-4 md:grid-cols-[0.75fr_1.25fr] md:items-end">
            <SectionHeader label={t.personalLabel} title={t.personalTitle} />
            <p className="max-w-2xl text-sm leading-7 text-white/55 md:justify-self-end md:text-right">
              {t.personalBody}
            </p>
          </div>

          <div className="mb-5 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045]">
            <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="p-5 md:p-7">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-500/10 text-green-200">
                    <Server size={24} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-green-200/75">{t.minecraftSmallLabel}</p>
                    <h3 className="text-2xl font-bold text-white">{t.minecraftTitle}</h3>
                  </div>
                </div>

                <p className="max-w-2xl text-sm leading-7 text-white/58 md:text-base">{t.minecraftBody}</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {t.minecraftFacts.map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs text-white/35">{label}</p>
                      <p className="mt-1 text-sm font-bold text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 bg-[#0d0b08] p-5 md:p-7 lg:border-l lg:border-t-0">
                <div className="rounded-2xl border border-green-300/15 bg-green-300/[0.055] p-5">
                  <p className="text-xs font-semibold uppercase text-green-200/70">Server address</p>
                  <p className="mt-3 break-all text-2xl font-black text-white">{t.minecraftAddress}</p>
                  <a
                    href="https://play.adityaanugrah.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-5 font-bold text-black transition-colors hover:bg-green-50"
                  >
                    {t.minecraftCta}
                    <ExternalLink size={16} aria-hidden="true" />
                  </a>
                </div>

                <div className="mt-4 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <Gamepad2 className="mt-0.5 shrink-0 text-cyan-200" size={20} aria-hidden="true" />
                  <p className="text-sm leading-6 text-white/55">{t.minecraftNote}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="min-w-0">
              <p className="mb-3 text-xs font-semibold uppercase text-green-200/70">{t.musicLabel}</p>
              <SpotifyCard />
            </div>
            <div className="min-w-0">
              <p className="mb-3 text-xs font-semibold uppercase text-orange-200/70">{t.pubgLabel}</p>
              <PubgCard />
            </div>
            <div className="min-w-0">
              <p className="mb-3 text-xs font-semibold uppercase text-cyan-200/70">{t.steamLabel}</p>
              <SteamCard />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pt-10 sm:px-6">
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/[0.045] p-6 text-center md:p-10">
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
        </div>
      </section>
    </div>
  );
};

export default About;
