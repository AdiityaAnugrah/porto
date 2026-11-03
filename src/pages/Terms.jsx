import SEO from '../components/SEO';
import ArchivePage from '../components/archive/ArchivePage';
import { useActiveLocale } from '../lib/i18n';

export default function Terms() {
  const id = useActiveLocale() === 'id';
  return <><SEO title="Terms | Aditya Anugrah" description="Ketentuan penggunaan website dan layanan digital Aditya Anugrah."/>
    <ArchivePage eyebrow={id?'Informasi website':'Website information'} title={id?'Ketentuan penggunaan.':'Terms of use.'} subtitle={id?'Ketentuan dasar untuk konten portfolio dan kerja sama project.':'Basic terms for portfolio content and project collaboration.'}>
      <div className="prose"><h2>{id?'Konten portfolio':'Portfolio content'}</h2><p>{id?'Konten portfolio digunakan sebagai referensi kemampuan, proses, dan contoh pekerjaan.':'Portfolio content is provided as a reference for skills, processes, and examples of work.'}</p><h2>{id?'Kesepakatan project':'Project agreements'}</h2><p>{id?'Scope, timeline, biaya, dan revisi setiap project ditentukan melalui kesepakatan tertulis sebelum pekerjaan dimulai.':'The scope, timeline, fees, and revisions for each project are defined in a written agreement before work begins.'}</p><h2>{id?'Materi dari klien':'Client materials'}</h2><p>{id?'Materi dari klien seperti logo, foto, data produk, dan akses sistem menjadi tanggung jawab klien untuk disediakan secara benar.':'Clients are responsible for providing accurate materials, including logos, photos, product data, and system access.'}</p></div>
    </ArchivePage>
  </>;
}
