import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import ArchivePage from "../components/archive/ArchivePage";
import { useLocalizedPath } from "../lib/i18n";

const facts = [
  ["Focus", "Business websites, internal systems, dashboards, and automation."],
  ["Approach", "Audit dulu, buang fitur tidak perlu, lalu bangun flow yang cepat dipakai."],
  ["Stack", "React, Next.js, CodeIgniter, Laravel, Node.js, MySQL, PostgreSQL."],
  ["Style", "Clean archive interface, dark system, clear hierarchy, fast loading."],
];

const About = () => {
  const toLocalized = useLocalizedPath();

  return (
    <>
      <SEO title="About Aditya Anugrah" description="Tentang Aditya Anugrah, web developer dan pembuat sistem bisnis." />
      <ArchivePage
        eyebrow="Profile archive"
        title="About"
        subtitle="Saya membangun website dan sistem yang langsung membantu operasional: transaksi, stok, admin, laporan, dan integrasi."
        actions={
          <>
            <Link to={toLocalized("/projects")} className="archive-btn">Selected work</Link>
            <Link to={toLocalized("/contact")} className="archive-btn archive-btn-primary">Start project</Link>
          </>
        }
      >
        <div className="space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-200/60">01 / identity</p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.04em] text-white sm:text-5xl">Aditya Anugrah</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
              Full-stack developer yang fokus pada website bisnis, e-commerce, dashboard operasional, dan integrasi antar sistem. Tampilan baru ini sengaja dibuat lebih ringkas seperti archive supaya pengunjung langsung masuk ke hal penting.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {facts.map(([label, value]) => (
              <article key={label} className="archive-card">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-200/50">{label}</p>
                <p className="mt-3 text-sm leading-7 text-slate-200">{value}</p>
              </article>
            ))}
          </div>

          <div className="archive-card">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-200/50">02 / working rule</p>
            <ul className="mt-4 grid gap-3 text-sm leading-7 text-slate-300 md:grid-cols-3">
              <li>Audit proses dan masalah bisnis.</li>
              <li>Rancang UI yang mudah dipakai tim.</li>
              <li>Deploy, ukur, lalu iterasi berdasarkan data.</li>
            </ul>
          </div>
        </div>
      </ArchivePage>
    </>
  );
};

export default About;
