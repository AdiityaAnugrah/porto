import SEO from '../components/SEO';
import ArchivePage from '../components/archive/ArchivePage';
import { useActiveLocale } from '../lib/i18n';

export default function Store() {
  const id = useActiveLocale() === 'id';
  const services = [
    ['Website company profile',id?'Website untuk memperkenalkan bisnis, menampilkan layanan, dan membantu calon pelanggan menghubungimu.':'A website to introduce your business, present your services, and help customers get in touch.',['Company profile','Landing page','SEO']],
    ['Admin dashboard',id?'Panel operasional untuk mengelola order, stok, laporan, dan persetujuan internal dalam satu alur.':'Operational tools for managing orders, inventory, reporting, and internal approvals.',['Orders','Inventory','Reporting']],
    ['Integration audit',id?'Pemetaan sistem yang sudah ada, pemeriksaan alur data, dan perencanaan integrasi API sesuai kebutuhan bisnis.':'A review of your existing systems, data flows, and API integrations based on what your business needs.',['System audit','API','Automation']]
  ];
  return <><SEO title={id?'Layanan | Aditya Anugrah':'Services | Aditya Anugrah'} description={id?'Pembuatan website, admin dashboard, dan audit integrasi sistem bisnis.':'Website development, admin dashboards, and business-system integration reviews by Aditya Anugrah.'}/>
    <ArchivePage eyebrow={id?'Layanan digital':'Digital services'} title={id?'Apa yang bisa kita bangun?':'What can we build?'} subtitle={id?'Mulai dari website bisnis sampai sistem di balik operasionalnya. Scope disusun sesuai kebutuhan, bukan paket fitur yang tidak terpakai.':'From your business website to the systems behind the operation. A scope shaped around your needs, not features you won’t use.'}>
      <div className="services-list">{services.map(([title,desc,tags]) => <section className="service-row" key={title}><h2>{title}</h2><div><p>{desc}</p><div className="tech-list">{tags.map(tag => <span className="tech-tag" key={tag}>{tag}</span>)}</div></div><a className="button" href={`https://wa.me/6281379430432?text=${encodeURIComponent(id?`Halo Aditya, saya ingin diskusi tentang ${title}.`:`Hi Aditya, I’d like to discuss ${title}.`)}`} target="_blank" rel="noreferrer">{id?'Diskusikan kebutuhan':'Discuss your needs'}</a></section>)}</div>
    </ArchivePage>
  </>;
}
