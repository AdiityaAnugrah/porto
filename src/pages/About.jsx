// src/pages/About.jsx
import React, { useEffect, useMemo } from "react";
import Avatar from "../components/Avatar";
import { Link } from "react-router-dom";
import {
  FaDownload,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBriefcase,
  FaTools,
  FaGlobeAsia,
  FaCheckCircle,
  FaLightbulb,
  FaShieldAlt,
  FaUsers,
  FaRocket,
  FaLeaf,
  FaCogs,
  FaQuestionCircle,
  FaChevronDown,
  FaInstagram,
} from "react-icons/fa";
import SEO from "../components/SEO";
import "../styles/About.scss";

const CV_URL =
  "https://drive.google.com/file/d/1M66SJlH_9zlT4EePbq-VrYYxctgjua9M/preview"; // /preview agar view-only

const About = () => {
  useEffect(() => {
    document.title = "About | My Portfolio";
  }, []);

  // ====== DATA ======
  const profile = {
    name: "Aditya Anugrah",
    role: "Web Developer",
    location: "Indonesia (WIB)",
    bio:
      "Saya membangun aplikasi web yang cepat, elegan, dan mudah dipelihara — pada e-commerce, admin dashboard, dan sistem absensi. Mengutamakan UX yang bersih, performa stabil, dan keamanan.",
    email: "adityaanugrah494@gmail.com",
    cv: CV_URL,
    socials: {
      github: "https://github.com/adiityaanugrah",
      linkedin: "https://www.linkedin.com/in/aditya-anugrah/",
      instagram: "https://www.instagram.com/adiityaanugrah/",
    },
    availability: "Tersedia untuk freelance/kolaborasi (part-time).",
    languages: ["Indonesia", "English"],
    yearsExp: 2,
    shipped: 30,
  };

  const primarySkills = [
    "Next.js","React","TypeScript","CI4/PHP","Node.js","MySQL","SCSS/Tailwind","kotlin (dasar)",
  ];

  const tools = ["Git/GitHub","OpenLiteServer","Figma/canva","Postman","VSCode","Chrome DevTools"];

  const experiences = [
    {
      title: "Full-stack Developer",
      company: "Ilena Furniture (E-Commerce)",
      period: "2023 — sekarang",
      points: [
        "Bangun storefront Next.js (SSR/ISR) + backend CI4.",
        "Integrasi ongkir, SKU matrix, manajemen stok & pesanan.",
        "Optimasi LCP & TTFB; aksesibilitas & best practices.",
      ],
    },
    {
      title: "Backend + UI",
      company: "Titanium Group (Workshop Admin)",
      period: "2024 — 2025",
      points: [
        "Rancang skema DB & REST API CI4.",
        "Pipeline status BONGKAR→DEMPUL→CAT + export PDF.",
        "Audit keamanan dasar dan hardening form input.",
      ],
    },
    {
      title: "Full-stack Developer",
      company: "Absensi.site (Attendance Platform)",
      period: "2024 — sekarang",
      points: [
        "Login NIK, role-based access, kalender shift.",
        "Next.js + Tailwind, Postgres, session device-aware.",
      ],
    },
    {
      title: "Freelance Web Developer",
      company: "Proyek lain-lain",
      period: "2022 — sekarang",
      points: [
        "Landing page, dashboard admin, dan blog statis.",
        "Next.js, CI4/PHP, WordPress, dan sesuai kebutuhan klien.",
      ],
    },
  ];

  const education = [
    {
      title: <span className="text-lg font-bold">Teknik Informatika</span>,
      org: <span className="text-base">Universita Dian Nuswontoro</span>,
      period: <span className="text-sm">2019 — 2023</span>,
    },
    {
      title: <span className="text-lg font-bold">SMA IPA</span>,
      org: <span className="text-base">SMA Negeri 1 Semendawai Suku III</span>,
      period: <span className="text-sm">2016 — 2019</span>,
    },
  ];

  const certifications = [
    {
      name: <span className="text-lg font-bold">Mobile Development</span>,
      by: <span className="text-base">Bangkit Academy</span>,
    },
    {
      name: <span className="text-lg font-bold">Android Development</span>,
      by: <span className="text-base">Coursera</span>,
    },
    {
      name: <span className="text-lg font-bold">JavaScript Algorithms</span>,
      by: <span className="text-base">FreeCodeCamp</span>,
    },
    {
      name: <span className="text-lg font-bold">Aplikasi Android Intermediate</span>,
      by: <span className="text-base">Dicoding</span>,
    },
  ];

  const facts = useMemo(
    () => [
      { icon: <FaMapMarkerAlt aria-hidden className="ic" />, label: "Lokasi", value: profile.location },
      { icon: <FaGlobeAsia aria-hidden className="ic" />, label: "Bahasa", value: profile.languages.join(" • ") },
      { icon: <FaCalendarAlt aria-hidden className="ic" />, label: "Pengalaman", value: `${profile.yearsExp}+ Tahun` },
      { icon: <FaBriefcase aria-hidden className="ic" />, label: "Project", value: `${profile.shipped}+ Selesai` },
    ],
    [profile]
  );

  const values = [
    { icon: FaLightbulb, title: "Klarifikasi Terlebih Dahulu",  desc: "Mulai dari kebutuhan inti & KPI. Dokumen singkat, prototipe cepat, keputusan transparan." },
    { icon: FaRocket,     title: "Cepat & Ringan",    desc: "Prioritas performa & fokus pada hal penting. Hindari over-engineering, cicil iteratif." },
    { icon: FaShieldAlt,  title: "Keamanan sebagai Default", desc: "Validasi input, sanitasi, RBAC, audit log, dan prinsip least-privilege di awal." },
    { icon: FaUsers,      title: "UX Terlebih Dahulu",       desc: "Desain mobile-first, aksesibilitas, states jelas (loading/empty/error), navigasi nyaman." },
    { icon: FaLeaf,       title: "Dapat Diperbarui",   desc: "Arsitektur modular, naming konsisten, tokens/design system, test seperlunya." },
    { icon: FaCogs,       title: "Pragmatis",      desc: "Pilih tool sesuai konteks: Next.js/CI4, Postgres/MySQL, Tailwind/SCSS—tanpa dogma." },
  ];

  const faqs = [
    { q: "Stack favorit kamu apa untuk e-commerce?", a: "Front-end Next.js (SSR/ISR) untuk SEO + performa, backend CI4/PHP atau Node sesuai tim, DB Postgres/MySQL, dan integrasi pembayaran/logistik via REST." },
    { q: "Berapa estimasi waktu landing page?", a: "Untuk 1–3 section custom: ±3–5 hari kerja termasuk optimasi performa & copy ringan. Tambah fitur (form, CMS, animasi) menyesuaikan." },
    { q: "Bisa join existing codebase?", a: "Bisa. Mulai dengan audit ringan (struktur, ketergantungan, debt), susun rencana refactor bertahap tanpa down-time." },
    { q: "Cara kerja & kolaborasi?", a: "Kickoff singkat, bagi milestone mingguan, demo rutin, dan dokumentasi ringkas. Komunikasi via WhatsApp/Slack/Email, repo GitHub/Bitbucket." },
    { q: "Garansi bugfix?", a: "Bugfix minor pasca rilis 14 hari tanpa biaya untuk scope yang sama." },
  ];

  const ValueCard = ({ icon: Icon, title, desc }) => (
    <article className="v-card">
      {Icon && React.createElement(Icon, { className: "v-ic", "aria-hidden": true })}
      <h3 className="v-title">{title}</h3>
      <p className="v-desc">{desc}</p>
    </article>
  );

  const sameAs = [
    profile.socials.github,
    profile.socials.linkedin,
    profile.socials.instagram,
  ].filter(Boolean);

  return (
    <main className="about" role="main">
      <SEO
        title="About"
        description="Tentang Aditya Anugrah — Web Developer fokus e-commerce, dashboard, dan sistem absensi. Mengutamakan performa, keamanan, dan UX."
        path="/about"
        type="profile"
        image="/assets/me-sunset.jpg"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: profile.name,
          jobTitle: profile.role,
          url: (typeof window !== "undefined" ? window.location.origin : "") + "/about",
          email: `mailto:${profile.email}`,
          sameAs,
          image: (typeof window !== "undefined" ? window.location.origin : "") + "/assets/me-sunset.jpg",
          worksFor: {
            "@type": "Organization",
            name: "Freelance",
          },
        }}
      />

      <div className="container">
        {/* ===== HERO ===== */}
        <header className="about-hero">
          {/* gunakan class pembungkus baru agar tidak bentrok dengan .avatar milik komponen */}
          <div className="avatar-wrap">
            <Avatar srcBase="/assets/me-sunset" alt="Aditya Anugrah — sunset" size={180} />
          </div>

          <div className="intro">
            <p className="eyebrow">{profile.role}</p>
            <h1 className="title">Halo, saya {profile.name} 👋</h1>
            <p className="lead">{profile.bio}</p>

            <div className="actions">
              <Link className="btn btn-primary" to="/cv" aria-label="Buka CV (view only)">
                <FaDownload /> Lihat CV
              </Link>
              <a className="btn btn-ghost" href={`mailto:${profile.email}`} aria-label="Kirim email">
                <FaEnvelope /> Email
              </a>
              {profile.socials.github && (
                <a className="btn btn-ghost" href={profile.socials.github} target="_blank" rel="noreferrer">
                  <FaGithub /> GitHub
                </a>
              )}
              {profile.socials.linkedin && (
                <a className="btn btn-ghost" href={profile.socials.linkedin} target="_blank" rel="noreferrer">
                  <FaLinkedin /> LinkedIn
                </a>
              )}
              {profile.socials.instagram && (
                <a className="btn btn-ghost" href={profile.socials.instagram} target="_blank" rel="noreferrer">
                  <FaInstagram /> Instagram
                </a>
              )}
            </div>

            {profile.availability && (
              <div className="availability">
                <span className="dot" aria-hidden />
                <span className="text">{profile.availability}</span>
              </div>
            )}
          </div>
        </header>

        {/* ===== QUICK FACTS ===== */}
        <section className="facts" aria-label="Quick facts">
          <ul className="facts-grid">
            {facts.map((f, i) => (
              <li key={i} className="facts-item">
                {f.icon}
                <div className="txt">
                  <div className="label">{f.label}</div>
                  <div className="value">{f.value}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ===== SKILLS & TOOLS ===== */}
        <section className="skills" aria-labelledby="skills-title">
          <h2 id="skills-title" className="section-title">Keahlian Utama</h2>
          <ul className="chipset" role="list">
            {primarySkills.map((s) => (
              <li className="chip" role="listitem" key={s}>
                <FaCheckCircle className="ic" aria-hidden />
                {s}
              </li>
            ))}
          </ul>

          <h3 className="sub-title"><FaTools className="ic" aria-hidden /> Tools & Ekstra</h3>
          <ul className="chipset" role="list">
            {tools.map((s) => (
              <li className="chip" role="listitem" key={s}>{s}</li>
            ))}
          </ul>
        </section>

        {/* ===== VALUES ===== */}
        {values.length > 0 && (
          <section className="values" aria-labelledby="values-title">
            <div className="values-head">
              <h2 id="values-title" className="section-title">Nilai & Pendekatan</h2>
              <p className="muted">Prinsip kerja yang selalu saya pegang saat membangun produk.</p>
            </div>
            <div className="values-grid">
              {values.map((v, i) => (
                <ValueCard key={i} icon={v.icon} title={v.title} desc={v.desc} />
              ))}
            </div>
          </section>
        )}

        {/* ===== EXPERIENCE ===== */}
        <section className="experience" aria-labelledby="exp-title">
          <h2 id="exp-title" className="section-title">Pengalaman</h2>
          <ol className="timeline">
            {experiences.map((e, i) => (
              <li className="tl-item" key={i}>
                <div className="tl-dot" aria-hidden />
                <div className="tl-card">
                  <div className="tl-head">
                    <h3 className="tl-title">{e.title}</h3>
                    <span className="tl-period">{e.period}</span>
                  </div>
                  <div className="tl-company">{e.company}</div>
                  {Array.isArray(e.points) && e.points.length > 0 && (
                    <ul className="tl-points">
                      {e.points.map((p, idx) => <li key={idx}>{p}</li>)}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ===== EDUCATION & CERTS ===== */}
        <section className="edu-cert" aria-label="Pendidikan & Sertifikasi">
          <div className="grid-two">
            <div className="box">
              <h2 className="section-title">Pendidikan</h2>
              <ul className="simple-list">
                {education.map((ed, i) => (
                  <li key={i}>
                    <div className="top">
                      <span className="name">{ed.title}</span>
                      <span className="period">{ed.period}</span>
                    </div>
                    <div className="org">{ed.org}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="box">
              <h2 className="section-title">Sertifikasi</h2>
              <ul className="simple-list">
                {certifications.map((c, i) => (
                  <li key={i}>
                    <div className="top">
                      <span className="name">{c.name}</span>
                      <span className="period">{c.by}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        {faqs.length > 0 && (
          <section className="faq" aria-labelledby="faq-title">
            <div className="faq-head">
              <h2 id="faq-title" className="section-title">FAQ</h2>
              <p className="muted">Beberapa pertanyaan umum seputar cara kerja saya.</p>
            </div>

            <div className="accordion" role="list">
              {faqs.map((f, i) => (
                <details key={i} className="acc-item" role="listitem">
                  <summary className="acc-sum">
                    <span className="q">
                      <FaQuestionCircle className="q-ic" aria-hidden />
                      {f.q}
                    </span>
                    <FaChevronDown className="chev" aria-hidden />
                  </summary>
                  <div className="acc-body">
                    <p>{f.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* ===== CTA ===== */}
        <section className="about-cta" aria-label="Ajakan kolaborasi">
          <div className="cta-box">
            <h2>Siap bangun sesuatu bareng?</h2>
            <p className="muted">Ayo diskusikan kebutuhanmu.</p>
            <div className="cta-actions">
              <Link className="btn btn-primary" to="/contact">Hubungi Saya</Link>
              <Link className="btn btn-ghost" to="/projects">Lihat Proyek</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default About;
