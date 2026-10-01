import React from "react";
import SEO from "../components/SEO";
import ArchivePage from "../components/archive/ArchivePage";

const links = [
  ["WhatsApp", "https://wa.me/6281379430432", "Fast response untuk project dan konsultasi."],
  ["Email", "mailto:hello@adityaanugrah.me", "Kirim brief, kebutuhan sistem, atau kerja sama."],
  ["GitHub", "https://github.com/adiityaanugrah", "Source, experiment, dan engineering archive."],
  ["LinkedIn", "https://www.linkedin.com/in/aditya-anugrah/", "Professional profile dan network."],
];

const Contact = () => (
  <>
    <SEO title="Contact | Aditya Anugrah" description="Hubungi Aditya Anugrah untuk website, sistem bisnis, dashboard, dan integrasi." />
    <ArchivePage eyebrow="Contact archive" title="Contact" subtitle="Gunakan jalur paling cepat. Tidak perlu form panjang; langsung kirim kebutuhan utama project." contentClassName="lg:min-h-[62svh]">
      <div className="space-y-6">
        <div className="archive-card">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-200/50">Brief template</p>
          <p className="mt-3 text-sm leading-7 text-slate-300">Nama bisnis, masalah yang ingin dibereskan, fitur wajib, deadline, dan contoh referensi. Dari situ saya bisa bantu susun scope yang masuk akal.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {links.map(([label, href, desc]) => (
            <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="archive-card group block">
              <p className="text-2xl font-black uppercase tracking-[-0.03em] text-white group-hover:text-cyan-100">{label}</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">{desc}</p>
            </a>
          ))}
        </div>
      </div>
    </ArchivePage>
  </>
);

export default Contact;
