import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import WorkPreview from '../components/projects/WorkPreview';
import LogoMotion from '../components/common/LogoMotion';
import { projects } from '../data/projects';
import { posts } from '../data/posts';
import { useActiveLocale, useLocalizedPath } from '../lib/i18n';

const selected = ['ilenafurniture', 'titanium-group', 'absensi-site', 'service-app'].map(id => projects.find(project => project.id === id)).filter(Boolean);
const latest = [...posts].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0,3);

export default function Home() {
  const id = useActiveLocale() === 'id';
  const to = useLocalizedPath();
  return <>
    <SEO title="Aditya Anugrah | Full-stack Developer" description={id ? 'Portfolio Aditya Anugrah. Website, aplikasi bisnis, dashboard, dan integrasi sistem dari Semarang, Indonesia.' : 'Aditya Anugrah’s portfolio. Websites, business applications, dashboards, and system integrations from Semarang, Indonesia.'} image="/assets/me-sunset.jpeg" jsonLd={{'@context':'https://schema.org','@type':'Person',name:'Aditya Anugrah',jobTitle:'Full-stack Developer',url:'https://adityaanugrah.me',sameAs:['https://github.com/adiityaanugrah','https://www.linkedin.com/in/aditya-anugrah/']}} />
    <section className="home-hero">
      <img className="hero-photo" src="/assets/me-sunset.avif" alt="" width="1005" height="1289" fetchPriority="high" />
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-copy">
        <LogoMotion />
        <p className="hero-identity"><img src="/assets/me-sunset.jpeg" alt="" width="34" height="34" /> Aditya Anugrah / Full-stack developer</p>
        <h1>{id ? <>Dari ide, jadi<br/>produk digital.</> : <>From an idea to<br/>a digital product.</>}</h1>
        <p className="hero-description">{id ? 'Saya membangun website dan sistem bisnis. Dari tampilan yang mudah digunakan, sampai proses di balik layar yang saling terhubung.' : 'I build websites and business systems. From interfaces people enjoy using to the connected processes behind them.'}</p>
        <div className="hero-actions"><Link className="button button-light" to={to('/projects')}>{id ? 'Lihat karya saya' : 'View my work'}</Link><Link className="button button-ghost" to={to('/contact')}>{id ? 'Ceritakan idemu' : 'Tell me your idea'}</Link></div>
      </div>
      <div className="container hero-bottom"><p>Semarang, Indonesia<br/>Web development & business systems</p><a href="#selected-work">{id ? 'Lihat lebih dekat' : 'Take a closer look'} <span aria-hidden="true">↓</span></a></div>
    </section>
    <section id="selected-work" className="home-section container">
      <div className="section-heading"><div><p className="section-label">{id ? 'Pilihan project' : 'Selected projects'}</p><h2>{id ? 'Dibangun untuk dipakai.' : 'Built to be used.'}</h2></div><Link className="text-link" to={to('/projects')}>{id ? 'Semua karya' : 'All work'} <span aria-hidden="true">↗</span></Link></div>
      <div className="work-grid">{selected.map(project => <WorkPreview key={project.id} project={project}/>)}</div>
    </section>
    <section className="profile-section"><div className="container profile-grid">
      <img className="profile-portrait" src="/assets/me-sunset.jpeg" alt="Aditya Anugrah" width="1005" height="1289" loading="lazy"/>
      <div className="profile-copy"><p className="section-label">{id ? 'Orang di balik layar' : 'The person behind the work'}</p><h2>{id ? <>Halo, saya Aditya.<br/>Senang membangun hal<br/>yang berguna.</> : <>Hi, I’m Aditya.<br/>I like building things<br/>that are useful.</>}</h2><p>{id ? 'Saya full-stack developer yang fokus pada website bisnis, e-commerce, dashboard operasional, dan integrasi antar sistem. Saya mulai dari memahami prosesnya, lalu mencari cara membuatnya lebih sederhana.' : 'I’m a full-stack developer focused on business websites, e-commerce, operational dashboards, and system integrations. I start by understanding the process, then look for ways to make it simpler.'}</p><Link className="text-link" to={to('/about')}>{id ? 'Tentang saya' : 'More about me'} <span aria-hidden="true">↗</span></Link></div>
    </div></section>
    <section className="container home-section">
      <div className="section-heading"><div><p className="section-label">{id ? 'Catatan dari prosesnya' : 'Notes from the process'}</p><h2>{id ? 'Hal yang saya pelajari.' : 'Things I’ve learned.'}</h2></div><Link className="text-link" to={to('/blog')}>{id ? 'Semua tulisan' : 'All articles'}</Link></div>
      <div className="journal-list">{latest.map(post => <Link className="journal-row" key={post.id} to={to(`/blog/${post.id}`)}><p className="section-label">{post.category}</p><h3>{post.title}</h3><span aria-hidden="true">↗</span></Link>)}</div>
    </section>
  </>;
}
