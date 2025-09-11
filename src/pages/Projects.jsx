// src/pages/Projects.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Img } from "react-image";
import { FaExternalLinkAlt, FaGithub, FaSearch, FaChevronDown } from "react-icons/fa";
import "../styles/Projects.scss";
import { projects as seed } from "../data/projects";

const CATEGORIES = ["All", "Web Apps", "Mobile Apps", "Landing Pages"];
const SORTS = ["Newest", "Oldest", "A–Z"];

// AUTO: mapping path -> kategori
const mapPathToCat = (pathname) => {
  if (pathname.endsWith("/web")) return "Web Apps";
  if (pathname.endsWith("/mobile")) return "Mobile Apps";
  if (pathname.endsWith("/landing")) return "Landing Pages";
  return "All";
};

const ProjectCard = ({ p }) => (
  <article className="proj-card" tabIndex={0}>
    <div className="thumb">
      <Img
        src={[p.cover, "/assets/placeholder.jpg"]}
        alt={p.title}
        loader={<div className="skeleton" aria-hidden="true" />}
      />
    </div>

    <div className="body">
      <h3 className="title">{p.title}</h3>
      <p className="meta">
        <span className="pill">{p.category}</span>
        <span className="muted">•</span>
        <span className="muted">{p.year}</span>
        {p.role && (
          <>
            <span className="muted">•</span>
            <span className="muted">{p.role}</span>
          </>
        )}
      </p>
      <p className="summary">{p.summary}</p>

      {Array.isArray(p.tech) && p.tech.length > 0 && (
        <ul className="tech">
          {p.tech.slice(0, 5).map((t) => (
            <li key={t} className="chip">{t}</li>
          ))}
        </ul>
      )}

      <div className="actions">
        {p.links?.live && (
          <a className="btn btn-ghost" href={p.links.live} target="_blank" rel="noreferrer">
            Live <FaExternalLinkAlt className="ic" />
          </a>
        )}
        {p.links?.code && (
          <a className="btn btn-ghost" href={p.links.code} target="_blank" rel="noreferrer">
            Code <FaGithub className="ic" />
          </a>
        )}
        <Link className="btn" to={`/projects/item/${p.id}`}>Detail</Link>
      </div>
    </div>
  </article>
);

const Projects = () => {
  const location = useLocation();

  const [query, setQuery] = useState("");
  const [cat, setCat] = useState(mapPathToCat(location.pathname));
  const [sort, setSort] = useState("Newest");

  // sinkron kategori dgn URL setiap ganti route
  useEffect(() => { setCat(mapPathToCat(location.pathname)); }, [location.pathname]);
  useEffect(() => { document.title = "Projects | My Portfolio"; }, []);

  const filtered = useMemo(() => {
    let arr = [...seed];

    if (cat !== "All") arr = arr.filter((p) => p.category === cat);

    const q = query.trim().toLowerCase();
    if (q) {
      arr = arr.filter((p) => {
        const hay = `${p.title} ${p.summary} ${(p.tech || []).join(" ")}`.toLowerCase();
        return hay.includes(q);
      });
    }

    if (sort === "Newest") arr.sort((a, b) => (b.year || 0) - (a.year || 0));
    if (sort === "Oldest") arr.sort((a, b) => (a.year || 0) - (b.year || 0));
    if (sort === "A–Z") arr.sort((a, b) => a.title.localeCompare(b.title));

    return arr;
  }, [cat, sort, query]);

  const counts = useMemo(() => {
    const c = { All: seed.length };
    CATEGORIES.slice(1).forEach((k) => { c[k] = seed.filter((p) => p.category === k).length; });
    return c;
  }, []);

  return (
    <main className="projects" role="main">
      <section className="toolbar" aria-label="Projects filter">
        <div className="container">
          <div className="toolbar-row">
            {/* Search */}
            <label className="search-wrap" htmlFor="search">
              <FaSearch className="ic" aria-hidden />
              <input
                id="search"
                type="search"
                placeholder="Cari proyek (judul, teknologi)…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search projects"
              />
            </label>

            {/* Sort */}
            <div className="sort">
              <span className="muted">Sort</span>
              <div className="select">
                <select
                  aria-label="Sort projects"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  {SORTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <FaChevronDown className="chev" aria-hidden />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="chips" role="tablist" aria-label="Categories">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={cat === c}
                className={`chip ${cat === c ? "active" : ""}`}
                onClick={() => setCat(c)}
              >
                {c}
                <span className="badge">{counts[c] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid-wrap">
        <div className="container">
          {filtered.length === 0 ? (
            <p className="muted nores">Tidak ada proyek yang cocok.</p>
          ) : (
            <div className="grid">
              {filtered.map((p) => <ProjectCard p={p} key={p.id} />)}
            </div>
          )}
        </div>
      </section>

      <section className="cta-bottom" aria-label="Call to action">
        <div className="container">
          <div className="cta-box">
            <h2>Ingin membangun sesuatu bersama?</h2>
            <p className="muted">Freelance/kolaborasi: dashboard, e-commerce, hingga sistem internal.</p>
            <div className="cta-actions">
              <Link className="btn btn-primary" to="/contact">Hubungi Saya</Link>
              <Link className="btn btn-ghost" to="/about">Tentang Saya</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Projects;
