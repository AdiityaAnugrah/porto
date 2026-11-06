import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ArchivePage from '../components/archive/ArchivePage';
import PersonalActivity from '../components/about/PersonalActivity';
import WorkstationScene from '../components/home/WorkstationScene';
import AboutStory, { WorkTogether } from '../components/about/AboutStory';
import ProfileEditorial, { ProfileGallery } from '../components/about/ProfileEditorial';
import { useActiveLocale, useLocalizedPath } from '../lib/i18n';

export default function About() {
  const id = useActiveLocale() === 'id';
  const to = useLocalizedPath();
  const facts = id ? [['Fokus','Website bisnis, e-commerce, dashboard operasional, dan otomatisasi.'],['Pendekatan','Pahami prosesnya, tentukan prioritas, lalu bangun alur yang mudah dipakai.'],['Teknologi','React, Next.js, CodeIgniter, Laravel, Node.js, MySQL, PostgreSQL.']] : [['Focus','Business websites, e-commerce, operational dashboards, and automation.'],['Approach','Understand the process, set priorities, then build a flow people can use.'],['Technology','React, Next.js, CodeIgniter, Laravel, Node.js, MySQL, PostgreSQL.']];
  return <><SEO title={id?'Tentang':'About'} description={id?'Aditya Anugrah, full-stack developer untuk website dan sistem bisnis di Semarang.':'Aditya Anugrah, a full-stack developer building websites and business systems in Semarang, Indonesia.'} image="/assets/me-sunset.jpeg"/>
    <ArchivePage background={<WorkstationScene />} eyebrow={id?'Tentang saya':'About me'} title={id?'Kenalan dulu.':'A little about me.'} subtitle={id?'Saya Aditya Anugrah, full-stack developer yang senang menghubungkan kebutuhan bisnis dengan teknologi.':'I’m Aditya Anugrah, a full-stack developer who likes connecting business needs with technology.'}>
      <div className="about-grid"><ProfileEditorial id={id}/>
        <div><h2>{id?'Bukan hanya tampilan. Juga cara kerjanya.':'Not just how it looks. How it works, too.'}</h2><div className="prose"><p>{id?'Saya membangun website dan sistem yang membantu operasional sehari-hari: transaksi, stok, administrasi, laporan, dan integrasi.':'I build websites and systems for everyday operations: transactions, inventory, administration, reporting, and integrations.'}</p><p>{id?'Proses saya dimulai dari memahami masalah. Setelah itu, saya menyusun alur, membangun antarmuka dan backend, lalu menyiapkan deployment serta iterasinya.':'My process starts with understanding the problem. Then I map the flow, build the interface and backend, and prepare deployment and iteration.'}</p></div>
          <dl className="fact-list">{facts.map(([label,value]) => <div className="fact-row" key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          <div className="page-actions"><Link className="button button-primary" to={to('/contact')}>{id?'Diskusi project':'Discuss a project'}</Link><Link className="button" to={to('/cv')}>{id?'Lihat CV':'View CV'}</Link></div>
        </div>
      </div>
      <ProfileGallery id={id}/>
      <AboutStory id={id}/>
      <PersonalActivity />
      <WorkTogether id={id}/>
    </ArchivePage>
  </>;
}
