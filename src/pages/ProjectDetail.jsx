// src/pages/ProjectDetail.jsx
import React, { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Img } from "react-image";
import {
  FaExternalLinkAlt,
  FaGithub,
  FaArrowLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaUser,
  FaTools,
  FaBuilding,
  FaClock,
  FaTag,
} from "react-icons/fa";
import "../styles/ProjectDetail.scss";
import { projects } from "../data/projects";
import SEO from "../components/SEO";

const Section = ({ title, children, id }) => {
  if (!children) return null;
  const hasContent = Array.isArray(children)
    ? children.length > 0
    : String(children).trim().length > 0;
  if (!hasContent) return null;
  return (
    <section className="pd-section" aria-labelledby={id}>
      <h2 id={id} className="pd-section__title">
        {title}
      </h2>
      <div className="pd-section__body">{children}</div>
    </section>
  );
};

const Chip = ({ children }) => <span className="pd-chip">{children}</span>;

/** FIX ESLint: pakai React.createElement agar 'Icon' terdeteksi terpakai */
const InfoRow = ({ icon: Icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="pd-inforow">
      {Icon &&
        React.createElement(Icon, {
          className: "pd-inforow__icon",
          "aria-hidden": true,
        })}
      <div className="pd-inforow__text">
        <div className="pd-inforow__label">{label}</div>
        <div className="pd-inforow__value">{value}</div>
      </div>
    </div>
  );
};

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const data = useMemo(() => projects.find((p) => p.id === id), [id]);

  // prev/next index
  const { prev, next } = useMemo(() => {
    const idx = projects.findIndex((p) => p.id === id);
    return {
      prev: idx > 0 ? projects[idx - 1] : null,
      next: idx >= 0 && idx < projects.length - 1 ? projects[idx + 1] : null,
    };
  }, [id]);

  // ===== SEO props =====
  const seo = useMemo(() => {
    if (!data) {
      return {
        title: "Project tidak ditemukan",
        description:
          "Project yang kamu cari tidak ditemukan. Lihat daftar proyek lain di portfolio.",
        path: `/projects/item/${id || ""}`,
        type: "article",
        image: "/assets/og-projects.jpg",
        imageAlt: "Portfolio projects",
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Project tidak ditemukan",
          url: "/projects",
        },
      };
    }
    const coverImg = data.cover || "/assets/placeholder.jpg";
    const baseLd = {
      "@context": "https://schema.org",
      "@type":
        data.links?.code || Array.isArray(data.tech)
          ? "SoftwareSourceCode"
          : "CreativeWork",
      name: data.title,
      description: data.summary,
      url: `/projects/item/${data.id}`,
      image: coverImg,
      dateCreated: data.year ? `${data.year}-01-01` : undefined,
      programmingLanguage: Array.isArray(data.tech) ? data.tech.join(", ") : undefined,
      author: {
        "@type": "Person",
        name: "Aditya Anugrah",
      },
      inLanguage: "id",
      keywords: Array.isArray(data.tags) ? data.tags.join(", ") : undefined,
    };
    if (data.links?.live) baseLd.discussionUrl = data.links.live;
    if (data.links?.code) baseLd.codeRepository = data.links.code;

    return {
      title: `${data.title} — Project`,
      description: data.summary || `${data.title} — detail project portfolio.`,
      path: `/projects/item/${data.id}`,
      type: "article",
      image: coverImg,
      imageAlt: data.title,
      jsonLd: baseLd,
    };
  }, [data, id]);

  if (!data) {
    return (
      <main className="pd container" style={{ padding: "24px 0" }}>
        <SEO
          title={seo.title}
          description={seo.description}
          path={seo.path}
          type={seo.type}
          image={seo.image}
          imageAlt={seo.imageAlt}
          jsonLd={seo.jsonLd}
        />
        <nav className="pd-breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/projects">Projects</Link>
            </li>
            <li aria-current="page">Not found</li>
          </ol>
        </nav>
        <h1>Project tidak ditemukan</h1>
        <p>
          <Link className="pd-btn" to="/projects">
            ← Kembali ke Projects
          </Link>
        </p>
      </main>
    );
  }

  const {
    title,
    summary,
    year,
    role,
    category,
    tech = [],
    links = {},
    client,
    duration,
    team,
    features,
    responsibilities,
    challenges,
    results,
    cover,
    gallery = [],
    tags = [],
  } = data;

  return (
    <main className="pd" role="main">
      <SEO
        title={seo.title}
        description={seo.description}
        path={seo.path}
        type={seo.type}
        image={seo.image}
        imageAlt={seo.imageAlt}
        jsonLd={seo.jsonLd}
      />

      <div className="container">
        {/* Breadcrumbs */}
        <nav className="pd-breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/projects">Projects</Link>
            </li>
            <li aria-current="page">{title}</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="pd-header">
          <div className="pd-header__top">
            <button
              className="pd-btn pd-btn--ghost"
              onClick={() => navigate(-1)}
              aria-label="Kembali"
              title="Kembali"
            >
              <FaArrowLeft /> Kembali
            </button>
          </div>

          <h1 className="pd-title">{title}</h1>

          <div className="pd-meta">
            {category && <Chip>{category}</Chip>}
            {year && (
              <Chip>
                <FaCalendarAlt aria-hidden /> {year}
              </Chip>
            )}
            {role && (
              <Chip>
                <FaUser aria-hidden /> {role}
              </Chip>
            )}
            {duration && (
              <Chip>
                <FaClock aria-hidden /> {duration}
              </Chip>
            )}
          </div>

          {/* Cover */}
          {cover && (
            <div className="pd-cover">
              <Img
                src={[cover, "/assets/placeholder.jpg"]}
                alt={title}
                loader={<div className="pd-skeleton" aria-hidden="true" />}
              />
            </div>
          )}
        </header>

        <div className="pd-grid">
          {/* Main content */}
          <div className="pd-main">
            <Section title="Overview" id="overview">
              <p className="pd-lead">{summary}</p>
            </Section>

            <Section title="Fitur Utama" id="features">
              {Array.isArray(features) && features.length > 0 && (
                <ul className="pd-list">
                  {features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              )}
            </Section>

            <Section title="Tanggung Jawab" id="responsibilities">
              {Array.isArray(responsibilities) && responsibilities.length > 0 && (
                <ul className="pd-list">
                  {responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              )}
            </Section>

            <Section title="Tantangan & Solusi" id="challenges">
              {Array.isArray(challenges) && challenges.length > 0 && (
                <ul className="pd-list">
                  {challenges.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              )}
            </Section>

            <Section title="Hasil & Dampak" id="results">
              {Array.isArray(results) && results.length > 0 && (
                <ul className="pd-list">
                  {results.map((res, i) => (
                    <li key={i}>{res}</li>
                  ))}
                </ul>
              )}
            </Section>

            {/* Tech Stack */}
            <Section title="Tech Stack" id="tech">
              <div className="pd-chips">
                {tech.map((t) => (
                  <Chip key={t}>
                    <FaTools aria-hidden /> {t}
                  </Chip>
                ))}
                {tags.map((t) => (
                  <Chip key={`tag-${t}`}>
                    <FaTag aria-hidden /> {t}
                  </Chip>
                ))}
              </div>
            </Section>

            {/* Links */}
            {(links?.live || links?.code) && (
              <div className="pd-links">
                {links.live && (
                  <a
                    className="pd-btn pd-btn--primary"
                    href={links.live}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Buka Situs <FaExternalLinkAlt />
                  </a>
                )}
                {links.code && (
                  <a
                    className="pd-btn pd-btn--ghost"
                    href={links.code}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Lihat Source <FaGithub />
                  </a>
                )}
              </div>
            )}

            {/* Gallery */}
            {Array.isArray(gallery) && gallery.length > 0 && (
              <Section title="Gallery" id="gallery">
                <div className="pd-gallery">
                  {gallery.map((g, i) => (
                    <a
                      key={i}
                      href={g.src}
                      target="_blank"
                      rel="noreferrer"
                      className="pd-gallery__item"
                      aria-label={`Lihat gambar ${i + 1} — ${title}`}
                    >
                      <Img
                        src={[g.src, "/assets/placeholder.jpg"]}
                        alt={g.alt || `Gallery ${i + 1} — ${title}`}
                        loader={<div className="pd-skeleton" aria-hidden="true" />}
                      />
                    </a>
                  ))}
                </div>
              </Section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="pd-aside" aria-label="Info proyek">
            <div className="pd-card">
              <h3 className="pd-card__title">Info Proyek</h3>
              <div className="pd-card__body">
                <InfoRow icon={FaBuilding} label="Client" value={client} />
                <InfoRow icon={FaCalendarAlt} label="Tahun" value={year} />
                <InfoRow icon={FaUser} label="Peran" value={role} />
                <InfoRow icon={FaClock} label="Durasi" value={duration} />
                <InfoRow icon={FaTools} label="Kategori" value={category} />
                {team && <InfoRow icon={FaUser} label="Tim" value={team} />}
              </div>

              {(links?.live || links?.code) && (
                <div className="pd-card__actions">
                  {links.live && (
                    <a
                      className="pd-btn pd-btn--primary"
                      href={links.live}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Kunjungi <FaExternalLinkAlt />
                    </a>
                  )}
                  {links.code && (
                    <a
                      className="pd-btn pd-btn--ghost"
                      href={links.code}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Source <FaGithub />
                    </a>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Prev/Next */}
        <nav className="pd-nav" aria-label="Navigasi project sebelumnya/berikutnya">
          <div className="pd-nav__item">
            {prev ? (
              <Link to={`/projects/item/${prev.id}`} className="pd-link">
                <FaArrowLeft /> <span className="pd-nav__meta">Sebelumnya</span>
                <span className="pd-nav__title">{prev.title}</span>
              </Link>
            ) : (
              <span className="pd-nav__placeholder" />
            )}
          </div>
          <div className="pd-nav__item pd-nav__item--right">
            {next ? (
              <Link to={`/projects/item/${next.id}`} className="pd-link pd-link--right">
                <span className="pd-nav__meta">Berikutnya</span> <FaArrowRight />
                <span className="pd-nav__title">{next.title}</span>
              </Link>
            ) : (
              <span className="pd-nav__placeholder" />
            )}
          </div>
        </nav>
      </div>
    </main>
  );
}
