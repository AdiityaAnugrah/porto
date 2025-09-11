// src/pages/CV.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/CV.scss";

const DRIVE_FILE_ID = "1M66SJlH_9zlT4EePbq-VrYYxctgjua9M";

// /preview = tampilan embed (view-only). Pastikan di Drive: Settings -> disable download/print/copy.
const PREVIEW_URL = `https://drive.google.com/file/d/${DRIVE_FILE_ID}/preview`;
const VIEW_URL = `https://drive.google.com/file/d/${DRIVE_FILE_ID}/view?usp=sharing`;

const CV = () => {
  const [loaded, setLoaded] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [tall, setTall] = useState(false);

  useEffect(() => {
    document.title = "CV | My Portfolio";
  }, []);

  // Jika iframe belum loaded > 5s, tampilkan bantuan
  useEffect(() => {
    const t = setTimeout(() => setShowHelp(true), 5000);
    return () => clearTimeout(t);
  }, []);

  const onFrameLoad = () => {
    setLoaded(true);
    setShowHelp(false);
  };

  return (
    <main className="cv" role="main">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="cv-breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li aria-current="page">CV</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="cv-head">
          <h1 className="title">Curriculum Vitae</h1>
            <p className="subtitle">Lihat CV saya dalam mode view-only (Google Drive Preview)</p>
        </header>

        {/* Toolbar */}
        <div className="cv-toolbar" role="toolbar" aria-label="CV toolbar">
          <Link className="btn btn-ghost" to="/about" aria-label="Kembali ke About">
            ← Kembali
          </Link>

          <div className="spacer" aria-hidden />

          <button
            type="button"
            className="btn"
            onClick={() => setTall((v) => !v)}
            aria-pressed={tall}
            title={tall ? "Kecilkan tinggi" : "Tinggikan tampilan"}
          >
            {tall ? "Ketinggian Normal" : "Tinggi Layar"}
          </button>

          <a
            className="btn btn-primary"
            href={VIEW_URL}
            target="_blank"
            rel="noopener noreferrer nofollow"
            aria-label="Buka di tab baru"
            title="Buka di tab baru"
          >
            Buka di Tab Baru
          </a>
        </div>

        {/* Embed */}
        <section className="cv-embed">
          <div className={`frame-wrap ${tall ? "full" : ""}`}>
            {!loaded && <div className="skeleton" aria-hidden="true" />}
            <iframe
              title="CV — Google Drive Preview"
              src={PREVIEW_URL}
              allow="fullscreen"
              loading="lazy"
              onLoad={onFrameLoad}
            />
          </div>

          {/* Fallback help if needed */}
          {showHelp && !loaded && (
            <div className="cv-hint" role="status" aria-live="polite">
              <div className="hint-title">Memuat agak lama?</div>
              <p className="hint-text">
                Jika embed tidak tampil, klik <a href={VIEW_URL} target="_blank" rel="noopener noreferrer nofollow">Buka di Tab Baru</a>.
                Pastikan koneksi stabil, atau coba nonaktifkan pemblokir konten untuk domain Google Drive.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default CV;
