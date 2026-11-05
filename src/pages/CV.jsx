import SEO from '../components/SEO';
import ArchivePage from '../components/archive/ArchivePage';
import { useActiveLocale } from '../lib/i18n';

export default function CV() {
  const id = useActiveLocale() === 'id';
  const timeline = [['2026','Independent developer',id?'Website, e-commerce, dashboard, dan integrasi bisnis untuk klien UMKM hingga operasional internal.':'Websites, e-commerce, dashboards, and business integrations for small businesses and internal operations.'],['2025','System builder',id?'Absensi, sistem stok, alur penjualan, persetujuan internal, dan pelaporan.':'Attendance, inventory systems, sales flows, internal approvals, and reporting.'],['2024','Backend + UI',id?'Admin CodeIgniter/Laravel, pelacakan workflow, ekspor PDF, dan hak akses pengguna.':'CodeIgniter/Laravel administration, workflow tracking, PDF exports, and role-based access.']];
  return <><SEO title={id?'CV':'CV'} description={id?'Pengalaman dan kemampuan Aditya Anugrah, full-stack developer.':'Experience, technical skills, and professional background of full-stack developer Aditya Anugrah.'}/>
    <ArchivePage eyebrow="Curriculum vitae" title={id?'Pengalaman & kemampuan.':'Experience & skills.'} subtitle={id?'Ringkasan pekerjaan, teknologi, dan fokus saya sebagai full-stack developer.':'A summary of my work, tools, and focus as a full-stack developer.'}>
      <div className="cv-layout"><aside className="cv-sidebar"><img className="profile-portrait" src="/assets/me-sunset.jpeg" alt="Aditya Anugrah" width="1005" height="1289"/><h2>Aditya Anugrah</h2><p>Full-stack developer<br/>Semarang, Indonesia</p><a className="text-link" href="mailto:hello@adityaanugrah.me">Email</a><br/><button className="button" onClick={() => window.print()}>{id?'Cetak / simpan PDF':'Print / save PDF'}</button></aside>
      <div><section className="timeline" aria-label={id?'Pengalaman':'Experience'}>{timeline.map(([year,role,description]) => <article key={year}><time dateTime={year}>{year}</time><div><h3>{role}</h3><p>{description}</p></div></article>)}</section><section className="cv-skills"><h2>{id?'Teknologi yang saya gunakan':'Tools I work with'}</h2><div className="tech-list">{['React','Next.js','CodeIgniter','Laravel','Node.js','MySQL','PostgreSQL','API integration'].map(skill => <span className="tech-tag" key={skill}>{skill}</span>)}</div></section></div></div>
    </ArchivePage>
  </>;
}
