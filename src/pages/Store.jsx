import React from "react";
import SEO from "../components/SEO";
import ArchivePage from "../components/archive/ArchivePage";

const items = [
  ["Website company profile", "Landing/company profile cepat, SEO-ready, dan mudah dirawat."],
  ["Admin dashboard", "Panel operasional untuk order, stok, laporan, dan approval."],
  ["Integration audit", "Audit alur sistem lama lalu rapikan data/API yang saling terhubung."],
];

const Store = () => (
  <>
    <SEO title="Store | Aditya Anugrah" description="Paket layanan digital Aditya Anugrah dalam format archive." />
    <ArchivePage eyebrow="Service archive" title="Store" subtitle="Bukan katalog panjang. Ini daftar layanan inti yang bisa dikembangkan sesuai kebutuhan bisnis." contentClassName="lg:min-h-[62svh]">
      <div className="grid gap-3">
        {items.map(([title, desc], index) => (
          <a key={title} href="https://wa.me/6281379430432" target="_blank" rel="noreferrer" className="archive-row group">
            <span className="font-display text-4xl font-black text-cyan-200/45">{String(index + 1).padStart(2, "0")}</span>
            <div className="flex-1">
              <h2 className="text-2xl font-black uppercase tracking-[-0.03em] text-white group-hover:text-cyan-100">{title}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">{desc}</p>
            </div>
            <span className="hidden text-xs font-bold uppercase tracking-[0.28em] text-cyan-200/60 md:block">ask</span>
          </a>
        ))}
      </div>
    </ArchivePage>
  </>
);

export default Store;
