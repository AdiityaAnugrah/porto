import React from "react";
import SEO from "../components/SEO";
import ArchivePage from "../components/archive/ArchivePage";

const Terms = () => (
  <>
    <SEO title="Terms | Aditya Anugrah" description="Terms and conditions website Aditya Anugrah." />
    <ArchivePage eyebrow="Legal archive" title="Terms" subtitle="Ketentuan penggunaan website dan layanan digital." contentClassName="lg:min-h-[62svh]">
      <div className="space-y-4 text-sm leading-8 text-slate-300">
        <p>Konten portfolio digunakan sebagai referensi kemampuan, proses, dan contoh pekerjaan.</p>
        <p>Scope, timeline, biaya, dan revisi setiap project ditentukan melalui kesepakatan tertulis sebelum pekerjaan dimulai.</p>
        <p>Materi dari klien seperti logo, foto, data produk, dan akses sistem menjadi tanggung jawab klien untuk disediakan secara benar.</p>
      </div>
    </ArchivePage>
  </>
);

export default Terms;
