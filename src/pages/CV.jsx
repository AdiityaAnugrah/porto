// src/pages/CV.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import "../styles/CV.scss";

const DRIVE_FILE_ID = "1M66SJlH_9zlT4EePbq-VrYYxctgjua9M";

// /preview = tampilan embed (view-only). Pastikan di Drive: Settings -> disable download/print/copy.
const PREVIEW_URL = `https://drive.google.com/file/d/${DRIVE_FILE_ID}/preview`;
const VIEW_URL = `https://drive.google.com/file/d/${DRIVE_FILE_ID}/view?usp=sharing`;

export default function CV() {
  const [loaded, setLoaded] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [tall, setTall] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const closeBtnRef = useRef(null);
  const modalRef = useRef(null);
  const lastFocusedRef = useRef(null);

  // Jika iframe belum loaded > 5s, tampilkan bantuan
  useEffect(() => {
    const t = setTimeout(() => setShowHelp(true), 5000);
    return () => clearTimeout(t);
  }, []);

  const onFrameLoad = () => {
    setLoaded(true);
    setShowHelp(false);
  };

  // ===== Modal: lifecycle =====
  const openModal = () => {
    lastFocusedRef.current = document.activeElement;
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    // kembalikan fokus ke pemicu
    setTimeout(() => {
      const el = lastFocusedRef.current;
      if (el && typeof el.focus === "function") el.focus();
    }, 0);
  };

  // Lock scroll + ESC + focus trap
  useEffect(() => {
    if (!modalOpen) return;
    // Lock body
    const body = document.body;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    // Focus the close button
    closeBtnRef.current?.focus?.();

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
      } else if (e.key === "Tab") {
        // simple focus trap inside modal
        const nodes = modalRef.current?.querySelectorAll(
          'a[href],button,textarea,input,select,[tabindex]:not([tabindex="-1"])'
        );
        if (!nodes || nodes.length === 0) return;
        const focusables = Array.from(nodes).filter(
          (n) => !n.hasAttribute("disabled") && n.getAttribute("aria-hidden") !== "true"
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);

    return () => {
      // Unlock
      const y = parseInt(body.style.top || "0", 10) || 0;
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      if (y) window.scrollTo(0, -y);

      document.removeEventListener("keydown", onKey);
    };
  }, [modalOpen]);

  return (
    <main className="cv" role="main">
      <SEO
        title="CV"
        description="Curriculum Vitae Aditya Anugrah — lihat CV dalam mode view-only via Google Drive Preview."
        path="/cv"
        type="article"
        image="/assets/og-cv.jpg"
        imageAlt="CV Aditya Anugrah"
      />

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
          <p className="subtitle">
            Lihat CV saya dalam mode view-only (Google Drive Preview)
          </p>
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

          <button
            type="button"
            className="btn btn-primary"
            onClick={openModal}
            aria-haspopup="dialog"
            aria-controls="cv-modal"
            aria-expanded={modalOpen}
            title="Baca dalam Popup"
          >
            Baca di Popup
          </button>

          <a
            className="btn btn-ghost"
            href={VIEW_URL}
            target="_blank"
            rel="noopener noreferrer nofollow"
            aria-label="Buka di tab baru"
            title="Buka di tab baru"
          >
            Buka di Tab Baru
          </a>
        </div>

        {/* Embed (klik area juga bisa buka modal) */}
        <section className="cv-embed">
          <div
            className={`frame-wrap ${tall ? "full" : ""}`}
            role="button"
            tabIndex={0}
            aria-label="Buka CV dalam popup"
            onClick={openModal}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openModal(); }}
            title="Klik untuk membuka popup"
          >
            {!loaded && <div className="skeleton" aria-hidden="true" />}
            <iframe
              title="CV — Google Drive Preview"
              src={PREVIEW_URL}
              allow="fullscreen"
              loading="lazy"
              onLoad={onFrameLoad}
            />
            <div className="frame-hint" aria-hidden="true">Klik untuk perbesar</div>
          </div>

          {/* Fallback help if needed */}
          {showHelp && !loaded && (
            <div className="cv-hint" role="status" aria-live="polite">
              <div className="hint-title">Memuat agak lama?</div>
              <p className="hint-text">
                Jika embed tidak tampil, klik{" "}
                <a
                  href={VIEW_URL}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  Buka di Tab Baru
                </a>
                . Pastikan koneksi stabil, atau coba nonaktifkan pemblokir konten
                untuk domain Google Drive.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* ===== Modal Overlay + Dialog ===== */}
      {modalOpen && (
        <div
          id="cv-modal"
          className="cv-modal is-open"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cv-modal-title"
          onMouseDown={(e) => {
            // close jika klik overlay
            if (e.target.classList.contains("cv-modal")) closeModal();
          }}
        >
          <div className="cv-modal__inner" ref={modalRef}>
            <header className="cv-modal__head">
              <h2 id="cv-modal-title" className="cv-modal__title">CV — Google Drive Preview</h2>
              <button
                ref={closeBtnRef}
                className="cv-modal__close"
                onClick={closeModal}
                aria-label="Tutup popup"
                title="Tutup"
              >
                ×
              </button>
            </header>

            <div className="cv-modal__body">
              <div className="cv-modal__frame">
                <iframe
                  title="CV — Google Drive Preview (Popup)"
                  src={PREVIEW_URL}
                  allow="fullscreen"
                />
              </div>
            </div>

            <footer className="cv-modal__foot">
              <a
                className="btn btn-ghost"
                href={VIEW_URL}
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                Buka di Tab Baru
              </a>
              <div className="spacer" />
              <button className="btn" onClick={closeModal}>Tutup</button>
            </footer>
          </div>
        </div>
      )}
    </main>
  );
}
