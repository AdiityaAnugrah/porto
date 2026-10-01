import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import ArchivePage from "../components/archive/ArchivePage";
import { useLocalizedPath } from "../lib/i18n";

const Invoice = () => {
  const toLocalized = useLocalizedPath();
  return (
    <>
      <SEO title="Invoice | Aditya Anugrah" description="Invoice dan administrasi project Aditya Anugrah." />
      <ArchivePage eyebrow="Billing archive" title="Invoice" subtitle="Halaman invoice disederhanakan agar tidak mengganggu konsep portfolio. Untuk invoice aktif, gunakan link yang diberikan langsung." contentClassName="lg:min-h-[58svh]">
        <div className="space-y-5">
          <div className="archive-card">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-200/50">Status</p>
            <h2 className="mt-3 text-3xl font-black uppercase text-white">Private billing area</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">Invoice project dikirim melalui jalur komunikasi resmi agar data klien, nominal, dan detail pekerjaan tetap jelas.</p>
          </div>
          <Link to={toLocalized("/contact")} className="archive-btn archive-btn-primary">Request invoice link</Link>
        </div>
      </ArchivePage>
    </>
  );
};

export default Invoice;
