import { Link } from 'react-router-dom';
import { useState } from 'react';
import SEO from '../components/SEO';
import WorkPreview from '../components/projects/WorkPreview';
import PcSetup from '../components/home/PcSetup';
import ScrollTypography from '../components/home/ScrollTypography';
import HomePortraitCard from '../components/home/HomePortraitCard';
import { projects } from '../data/projects';
import { posts } from '../data/posts';
import { useActiveLocale, useLocalizedPath } from '../lib/i18n';

const selected = ['ilenafurniture', 'absensi-site', 'Lunarea Furniture', 'cargomate'].map(id => projects.find(project => project.id === id)).filter(Boolean);
const latest = [...posts].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0,3);

export default function Home() {
  const [pcPower,setPcPower]=useState('on');
  const id = useActiveLocale() === 'id';
  const to = useLocalizedPath();
  return <>
    <SEO title="Aditya Anugrah | Full-stack Developer" description={id ? 'Portfolio Aditya Anugrah. Website, aplikasi bisnis, dashboard, dan integrasi sistem dari Semarang, Indonesia.' : 'Aditya Anugrah’s portfolio. Websites, business applications, dashboards, and system integrations from Semarang, Indonesia.'} image="/assets/me-sunset.jpeg" jsonLd={{'@context':'https://schema.org','@type':'Person',name:'Aditya Anugrah',jobTitle:'Full-stack Developer',url:'https://adityaanugrah.me',sameAs:['https://github.com/adiityaanugrah','https://www.linkedin.com/in/aditya-anugrah/']}} />
    <section className="home-hero home-hero--studio home-hero--network home-hero--pc" data-pc-power={pcPower}>
      <div className="hero-scrim" aria-hidden="true" />
      <PcSetup variant="interactive" onPowerChange={setPcPower}/>
      <div className="hero-studio-grid container"><div className="hero-copy">
        <p className="hero-identity hero-profession">Aditya Anugrah / Full-stack developer</p>
        <ScrollTypography active={pcPower==='on'} lines={id ? ['Dari ide, jadi','produk digital.'] : ['From an idea to','a digital product.']} label={id ? 'Dari ide, jadi produk digital.' : 'From an idea to a digital product.'}/>
        <p className="hero-description">{id ? 'Saya membangun website dan sistem bisnis. Dari tampilan yang mudah digunakan, sampai proses di balik layar yang saling terhubung.' : 'I build websites and business systems. From interfaces people enjoy using to the connected processes behind them.'}</p>
        <div className="hero-actions"><Link className="button button-light" to={to('/projects')}>{id ? 'Lihat karya saya' : 'View my work'}</Link><Link className="button button-ghost" to={to('/contact')}>{id ? 'Ceritakan idemu' : 'Tell me your idea'}</Link></div>
      </div></div>
      <div className="container hero-bottom"><p>Semarang, Indonesia<br/>Web development & business systems</p><a href="#selected-work">{id ? 'Lihat lebih dekat' : 'Take a closer look'} <span aria-hidden="true">↓</span></a></div>
    </section>
    <section id="selected-work" className="home-section container">
      <div className="section-heading"><div><p className="section-label">{id ? 'Pilihan project' : 'Selected projects'}</p><h2>{id ? 'Dibangun untuk dipakai.' : 'Built to be used.'}</h2></div><Link className="text-link" to={to('/projects')}>{id ? 'Semua karya' : 'All work'} <span aria-hidden="true">↗</span></Link></div>
      <div className="work-grid">{selected.map(project => <WorkPreview key={project.id} project={project}/>)}</div>
    </section>
    <section className="profile-section"><div className="container profile-grid">
      <HomePortraitCard id={id}/>
      <div className="profile-copy"><p className="section-label">{id ? 'Orang di balik layar' : 'The person behind the work'}</p><h2>{id ? <>Halo, saya Aditya.<br/>Senang membangun hal<br/>yang berguna.</> : <>Hi, I’m Aditya.<br/>I like building things<br/>that are useful.</>}</h2><p>{id ? 'Saya full-stack developer yang fokus pada website bisnis, e-commerce, dashboard operasional, dan integrasi antar sistem. Saya mulai dari memahami prosesnya, lalu mencari cara membuatnya lebih sederhana.' : 'I’m a full-stack developer focused on business websites, e-commerce, operational dashboards, and system integrations. I start by understanding the process, then look for ways to make it simpler.'}</p><Link className="text-link" to={to('/about')}>{id ? 'Tentang saya' : 'More about me'} <span aria-hidden="true">↗</span></Link></div>
    </div></section>
    <section className="container home-section">
      <div className="section-heading"><div><p className="section-label">{id ? 'Catatan dari prosesnya' : 'Notes from the process'}</p><h2>{id ? 'Hal yang saya pelajari.' : 'Things I’ve learned.'}</h2></div><Link className="text-link" to={to('/blog')}>{id ? 'Semua tulisan' : 'All articles'}</Link></div>
      <div className="journal-list">{latest.map(post => <Link className="journal-row" key={post.id} to={to(`/blog/${post.id}`)}><p className="section-label">{post.category}</p><h3>{post.title}</h3><span aria-hidden="true">↗</span></Link>)}</div>
    </section>
  </>;
}
