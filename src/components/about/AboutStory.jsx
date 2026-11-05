import { Link } from 'react-router-dom';
import { journey, caseStudies, currentFocus, testimonials } from '../../data/about';
import { projects } from '../../data/projects';
import { useLocalizedPath } from '../../lib/i18n';
import PortfolioImage from '../common/PortfolioImage';
import DeveloperActivity from './DeveloperActivity';
import './about-story.css';

export default function AboutStory({ id }) {
  const language = id ? 'id' : 'en';
  const to = useLocalizedPath();
  return <>
    <section className="about-section" aria-labelledby="about-journey-title">
      <div className="section-heading"><div><p className="section-label">{id ? 'Perjalanan' : 'The journey'}</p><h2 id="about-journey-title">{id ? 'Dari halaman ke sistem.' : 'From pages to systems.'}</h2></div><Link className="text-link" to={to('/cv')}>{id ? 'Pengalaman lengkap' : 'Full experience'} <span aria-hidden="true">↗</span></Link></div>
      <p className="about-section-intro">{id ? 'Beberapa tahap dari proyek yang saya kerjakan, dari kebutuhan tampilan sampai proses di belakangnya.' : 'A few milestones from my projects, from what people see to the processes behind it.'}</p>
      <ol className="about-journey">{journey.map(item => <li key={item.year}><time dateTime={item.year}>{item.year}</time><div><h3>{item[language][0]}</h3><p>{item[language][1]}</p></div></li>)}</ol>
    </section>
    <section className="about-section" aria-labelledby="about-proof-title">
      <div className="section-heading"><div><p className="section-label">{id ? 'Penerapan nyata' : 'In practice'}</p><h2 id="about-proof-title">{id ? 'Masalahnya berbeda. Pendekatannya jelas.' : 'Different problems. A clear approach.'}</h2></div></div>
      <div className="about-case-list">{caseStudies.map(study => {
        const project = projects.find(item => item.id === study.projectId);
        if (!project) return null;
        const content = study[language];
        return <article className="about-case" key={project.id}>
          <Link to={to(`/projects/${encodeURIComponent(project.id)}`)} className="about-case-image" aria-label={id ? `Lihat proyek ${project.title}` : `View ${project.title}`}><PortfolioImage src={project.cover} alt={project.title} width="720" height="480" loading="lazy"/></Link>
          <div><p className="section-label">{project.year} / {project.role}</p><h3>{project.title.replace(/\s*—\s*/g, ' / ')}</h3><dl>{[[id ? 'Kebutuhan' : 'The need', content.problem], [id ? 'Peran saya' : 'My contribution', content.contribution], [id ? 'Yang dibangun' : 'What shipped', content.outcome]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><Link className="text-link" to={to(`/projects/${encodeURIComponent(project.id)}`)}>{id ? 'Baca detail proyek' : 'Read the project'} <span aria-hidden="true">↗</span></Link></div>
        </article>;
      })}</div>
    </section>
    <section className="about-section about-now" aria-labelledby="about-now-title">
      <div><p className="section-label">{id ? 'Fokus saat ini' : 'Current focus'}</p><h2 id="about-now-title">{id ? 'Masih terus dirapikan.' : 'Always refining.'}</h2><p className="about-caption">{id ? 'Catatan dari pengembangan portfolio ini, diperbarui secara manual.' : 'A manually maintained note from building this portfolio.'}</p></div>
      <div className="about-focus-list"><article><h3>{currentFocus.project[language]}</h3><p>{currentFocus.description[language]}</p><Link className="text-link" to={to('/')}>{id ? 'Lihat interaksinya' : 'Explore the interactions'} <span aria-hidden="true">↗</span></Link></article><article><p className="section-label">{id ? 'Sedang dieksplorasi' : 'Exploring'}</p><h3>{currentFocus.exploration[language]}</h3><p>{currentFocus.explorationDetail[language]}</p></article></div>
    </section>
    <DeveloperActivity id={id}/>
    <section className="about-section" aria-labelledby="about-testimonials-title">
      <div className="section-heading"><div><p className="section-label">{id ? 'Dari yang pernah bekerja bersama' : 'From working together'}</p><h2 id="about-testimonials-title">{id ? 'Kata mereka.' : 'Their perspective.'}</h2></div></div>
      {testimonials.length > 0 ? <div className="about-quotes">{testimonials.map(item => <figure key={`${item.name}-${item.project}`}><blockquote><p>{item.quote[language]}</p></blockquote><figcaption>{item.name}<span>{item.role} / {item.project}</span></figcaption></figure>)}</div> : <div className="about-testimonial-empty"><p>{id ? 'Belum ada testimoni yang dipublikasikan.' : 'No testimonials have been published yet.'}</p><p className="about-caption">{id ? 'Untuk saat ini, kenali pekerjaan saya melalui studi kasus dan website yang sudah dibangun.' : 'For now, explore my work through the case studies and websites I have built.'}</p><Link className="text-link" to={to('/projects')}>{id ? 'Lihat hasil pekerjaan' : 'Explore the work'} <span aria-hidden="true">↗</span></Link></div>}
    </section>
  </>;
}

export function WorkTogether({ id }) {
  const to = useLocalizedPath();
  const steps = id ? [ ['Pahami kebutuhan', 'Kita bahas pengguna, proses yang berjalan, kendala, dan tujuan proyek.'], ['Sepakati prioritas', 'Ruang lingkup, tahapan, komunikasi, dan jadwal disepakati sebelum pembangunan.'], ['Bangun & tinjau', 'Antarmuka, backend, serta integrasi ditinjau bertahap berdasarkan kebutuhan.'], ['Rilis & lanjutkan', 'Pengujian, deployment, dan kebutuhan iterasi dibahas sebagai bagian dari serah terima.'] ] : [ ['Understand the need', 'We discuss users, existing processes, constraints, and project goals.'], ['Agree on priorities', 'Scope, milestones, communication, and timing are agreed before building.'], ['Build & review', 'The interface, backend, and integrations are reviewed against the requirements.'], ['Ship & iterate', 'Testing, deployment, and follow-up needs are discussed as part of handover.'] ];
  return <section className="about-section about-collaborate" aria-labelledby="about-collaborate-title"><div className="section-heading"><div><p className="section-label">{id ? 'Kerja sama' : 'Working together'}</p><h2 id="about-collaborate-title">{id ? 'Mulai dari kebutuhanmu.' : 'Start with what you need.'}</h2></div></div><p className="about-section-intro">{id ? 'Website bisnis, e-commerce, dashboard operasional, dan integrasi sistem. Ketersediaan serta jadwal pengerjaan dikonfirmasi saat diskusi awal.' : 'Business websites, e-commerce, operational dashboards, and system integrations. Availability and delivery timing are confirmed in our first conversation.'}</p><ol className="about-process">{steps.map(([title, description], index) => <li key={title}><span className="about-step-number" aria-hidden="true">0{index + 1}</span><h3>{title}</h3><p>{description}</p></li>)}</ol><div className="page-actions"><Link className="button button-primary" to={to('/contact')}>{id ? 'Diskusikan kebutuhan proyek' : 'Discuss your project'}</Link><a className="text-link" href="https://www.linkedin.com/in/aditya-anugrah/" target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a></div></section>;
}
