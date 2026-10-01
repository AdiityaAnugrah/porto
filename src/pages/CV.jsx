import React from "react";
import SEO from "../components/SEO";
import ArchivePage from "../components/archive/ArchivePage";

const timeline = [
  ["2026", "Independent developer", "Website, e-commerce, dashboard, dan integrasi bisnis untuk klien UMKM hingga operasional internal."],
  ["2025", "System builder", "Absensi, stock system, sales flow, internal approval, dan reporting."],
  ["2024", "Backend + UI", "CodeIgniter/Laravel admin, workflow tracking, PDF export, role access."],
];

const CV = () => (
  <>
    <SEO title="CV | Aditya Anugrah" description="Curriculum Vitae Aditya Anugrah dalam format archive yang ringkas." />
    <ArchivePage eyebrow="Curriculum vitae" title="CV" subtitle="Ringkasan pengalaman, kemampuan, dan cara kerja dalam format singkat." contentClassName="lg:min-h-[62svh]">
      <div className="space-y-6">
        <div className="archive-card">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-200/50">Profile</p>
          <h2 className="mt-3 text-3xl font-black uppercase text-white">Aditya Anugrah</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">Full-stack developer untuk website bisnis, dashboard admin, integrasi produk/stok, dan sistem operasional.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {["React / Next.js", "PHP / CI4 / Laravel", "Node / Database / API"].map((skill) => <div key={skill} className="archive-card text-sm font-semibold text-slate-100">{skill}</div>)}
        </div>
        <div className="space-y-3">
          {timeline.map(([year, role, desc]) => (
            <article key={year} className="archive-card grid gap-3 sm:grid-cols-[90px_1fr]">
              <p className="font-display text-4xl font-black text-cyan-200/80">{year}</p>
              <div>
                <h3 className="text-lg font-bold text-white">{role}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">{desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </ArchivePage>
  </>
);

export default CV;
