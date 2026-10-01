import React from "react";
import SEO from "../components/SEO";
import ArchivePage from "../components/archive/ArchivePage";

const Privacy = () => (
  <>
    <SEO title="Privacy Policy | Aditya Anugrah" description="Privacy policy website Aditya Anugrah." />
    <ArchivePage eyebrow="Legal archive" title="Privacy" subtitle="Ringkasan kebijakan privasi untuk penggunaan website ini." contentClassName="lg:min-h-[62svh]">
      <div className="space-y-4 text-sm leading-8 text-slate-300">
        <p>Website ini hanya mengumpulkan data yang diperlukan untuk komunikasi, analytics dasar, dan peningkatan pengalaman pengguna.</p>
        <p>Data kontak yang dikirim melalui WhatsApp/email digunakan untuk membalas kebutuhan project dan tidak dijual ke pihak lain.</p>
        <p>Beberapa layanan pihak ketiga dapat menyimpan cookie atau metadata sesuai kebijakan mereka masing-masing.</p>
      </div>
    </ArchivePage>
  </>
);

export default Privacy;
