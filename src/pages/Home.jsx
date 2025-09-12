import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Img } from 'react-image';
import {
  FaArrowRight,
  FaBolt,
  FaShieldAlt,
  FaMobileAlt,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import '../styles/Home.scss';
import { projects as seed } from '../data/projects';
import SEO from '../components/SEO';

const Home = () => {
  // Ambil 3 proyek terbaru berdasar tahun (pastikan numerik)
  const featured = useMemo(() => {
    return [...seed]
      .sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0))
      .slice(0, 3);
  }, []);

  // (Dummy) brand/klien untuk marquee
  const brands = useMemo(
    () => ['Ilena Furniture', 'Titanium Group', 'Lunarea Furniture', 'virtualxcellence', 'BLCC'],
    []
  );

  const stack = [
    'Next.js', 'React', 'TypeScript', 'CI4/PHP', 'Node.js', 'MySQL', 'SCSS/Tailwind', 'Vite'
  ];

  return (
    <main id="main-content" className="home" role="main">
      <SEO
        title="Home"
        description="Portfolio Aditya Anugrah — web developer fokus e-commerce, dashboard, dan sistem absensi."
        path="/"
        type="website"
        image="/assets/og-default.jpg"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'My Portfolio',
          url:
            (typeof window !== 'undefined' ? window.location.origin : '') + '/',
          potentialAction: {
            '@type': 'SearchAction',
            target:
              (typeof window !== 'undefined' ? window.location.origin : '') +
              '/projects?query={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        }}
      />

      {/* HERO */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="container">
          <p className="eyebrow">Web Developer • Indonesia (WIB)</p>

          <h1 id="hero-title" className="title">
            Hi, I’m <span className="accent">Aditya Anugrah</span> — I build fast, elegant web apps.
          </h1>

          <p className="lead">
            Fokus pada e-commerce, admin dashboard, dan sistem absensi dengan UX yang bersih,
            cepat, dan mudah di-maintain.
          </p>

          <div className="cta">
            <Link to="/projects" className="btn btn-primary" aria-label="View projects">
              Lihat Project <FaArrowRight className="icon" />
            </Link>
            <Link to="/contact" className="btn btn-ghost" aria-label="Contact me">
              Kontak Saya
            </Link>
          </div>

          <ul className="quick-stats" aria-label="Highlights">
            <li>
              <strong>2+</strong>
              <span>Tahun pengalaman</span>
            </li>
            <li>
              <strong>30+</strong>
              <span>Project selesai</span>
            </li>
            <li>
              <strong>100%</strong>
              <span>Error Handling</span>
            </li>
            <li>
              <strong>CI4/PHP</strong>
              <span>Praktis</span>
            </li>
          </ul>
        </div>

        <div className="hero-bg" aria-hidden="true" />
      </section>

      {/* TRUSTED BY (Marquee) */}
      <section className="trusted" aria-label="Pernah bekerja sama dengan">
        <div className="container">
          <div className="trusted-head">
            <span className="dot" aria-hidden /> Trusted by
          </div>
          <div className="marquee" role="list" aria-label="Brand/klien">
            {/* Track digandakan untuk efek scroll kontinu.
                Diberi aria-hidden agar pembaca layar tidak mendengar item ganda. */}
            <div className="marquee-track" aria-hidden="true">
              {[...brands, ...brands].map((b, i) => (
                <div className="brand" key={`${b}-${i}`}>{b}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" aria-labelledby="features-title">
        <div className="container">
          <h2 id="features-title" className="section-title">
            Apa yang saya kerjakan
          </h2>

          <div className="grid">
            <article className="card">
              <div className="card-icon" aria-hidden="true">
                <FaBolt />
              </div>
              <h3>Performa Kencang</h3>
              <p>
                Rendering efisien, asset minified, image lazy-load, dan caching yang tepat agar
                TTFB/CLS stabil.
              </p>
            </article>

            <article className="card">
              <div className="card-icon" aria-hidden="true">
                <FaShieldAlt />
              </div>
              <h3>Keamanan & Stabilitas</h3>
              <p>
                Otentikasi aman, validasi input, sanitasi data, serta role-based access untuk
                aplikasi berskala.
              </p>
            </article>

            <article className="card">
              <div className="card-icon" aria-hidden="true">
                <FaMobileAlt />
              </div>
              <h3>Responsif & Aksesibel</h3>
              <p>
                Desain mobile-first, navigasi keyboard-friendly, kontras warna sesuai, dan elemen
                ter-ARIA.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="stack" aria-labelledby="stack-title">
        <div className="container">
          <h2 id="stack-title" className="section-title">Stack yang sering saya pakai</h2>
        <ul className="stack-chips" role="list">
            {stack.map((t) => (
              <li className="chip" role="listitem" key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* AVAILABILITY CALLOUT */}
      <section className="availability" aria-label="Ketersediaan">
        <div className="container">
          <div className="availability-box">
            <span className="status" aria-hidden />
            <p className="text">
              Saat ini <strong>tersedia</strong> untuk freelance/kolaborasi (part-time).
            </p>
            <Link className="btn btn-primary" to="/contact">Ajak Kolaborasi</Link>
          </div>
        </div>
      </section>

      {/* RECENT / FEATURED PROJECTS */}
      <section className="recent" aria-labelledby="recent-title">
        <div className="container">
          <div className="recent-head">
            <h2 id="recent-title" className="section-title">
              Proyek Terbaru
            </h2>
            <Link to="/projects" className="link-more">
              Lihat semua <FaArrowRight aria-hidden />
            </Link>
          </div>

          <div className="recent-grid">
            {featured.map((p) => (
              <article key={p.id} className="recent-card">
                <Link
                  to={`/projects/item/${p.id}`}
                  className="thumb"
                  aria-label={`Lihat detail ${p.title}`}
                >
                  <Img
                    src={[p.cover, '/assets/placeholder.jpg']}
                    alt={p.title}
                    loader={<div className="skeleton" aria-hidden="true" />}
                    loading="lazy"
                    decoding="async"
                  />
                </Link>

                <div className="body">
                  <div className="meta">
                    <span className="pill">{p.category}</span>
                    {p.year && (
                      <>
                        <span className="dot">•</span>
                        <span className="muted">{p.year}</span>
                      </>
                    )}
                  </div>

                  <h3 className="title">
                    <Link to={`/projects/item/${p.id}`}>{p.title}</Link>
                  </h3>

                  {p.summary && <p className="summary">{p.summary}</p>}

                  <div className="actions">
                    <Link to={`/projects/item/${p.id}`} className="btn">
                      Detail
                    </Link>
                    {p.links?.live && (
                      <a
                        href={p.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost"
                      >
                        Live <FaExternalLinkAlt className="ic" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Quick paths ke kategori */}
          <div className="quick-paths" aria-label="Kategori populer">
            <Link to="/projects/web" className="qp-chip">Web Apps</Link>
            <Link to="/projects/mobile" className="qp-chip">Mobile Apps</Link>
            <Link to="/projects/landing" className="qp-chip">Landing Pages</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
