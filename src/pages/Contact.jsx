// src/pages/Contact.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaGithub,
  FaLinkedin,
  FaPaperPlane,
  FaCheckCircle,
  FaCopy,
  FaInstagram,
} from "react-icons/fa";
import SEO from "../components/SEO";
import "../styles/Contact.scss";

/* ================== Config ================== */
const CONTACT_CONFIG = {
  email: "admin@adityaanugra.me",
  phone: "+6281379430432",
  location: "Indonesia (WIB)",
  whatsappNumber: "6281379430432",
  whatsappText: "Halo AA, saya tertarik kolaborasi",
  socials: {
    github: "https://github.com/adiityaanugrah",
    linkedin: "https://www.linkedin.com/in/aditya-anugrah/",
    instagram: "https://www.instagram.com/adityaanugrah",
  },
  // Kosongkan untuk MENONAKTIFKAN pengiriman:
  FORM_ENDPOINT: "",
};

const initialValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
  company: "", // honeypot (biarkan kosong)
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (v) => {
  const errs = {};
  if (!v.name.trim()) errs.name = "Nama wajib diisi.";
  if (!v.email.trim()) errs.email = "Email wajib diisi.";
  else if (!emailRegex.test(v.email)) errs.email = "Format email tidak valid.";
  if (!v.subject.trim()) errs.subject = "Subjek wajib diisi.";
  if (!v.message.trim()) errs.message = "Pesan wajib diisi.";
  else if (v.message.length < 10) errs.message = "Minimal 10 karakter.";
  else if (v.message.length > 1000) errs.message = "Maksimal 1000 karakter.";
  if (v.company) errs.company = "Spam terdeteksi.";
  return errs;
};

const buildWaLink = (number, text) =>
  `https://wa.me/${number}?text=${encodeURIComponent(text || "")}`;

export default function Contact() {
  const info = useMemo(() => {
    const wUrl = buildWaLink(CONTACT_CONFIG.whatsappNumber, CONTACT_CONFIG.whatsappText);
    return { ...CONTACT_CONFIG, whatsappUrl: wUrl };
  }, []);

  const formDisabled = !info.FORM_ENDPOINT;

  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState(false);

  const [copyMsg, setCopyMsg] = useState(""); // status copy email
  const [formMsg, setFormMsg] = useState(""); // status kirim form

  // Refs untuk fokus otomatis ke error pertama saat submit
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const subjectRef = useRef(null);
  const messageRef = useRef(null);

  useEffect(() => {
    setErrors(validate(values));
  }, [values]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((s) => ({ ...s, [name]: value }));
  };
  const onBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  };

  const focusFirstError = (errs) => {
    if (errs.name && nameRef.current) return nameRef.current.focus();
    if (errs.email && emailRef.current) return emailRef.current.focus();
    if (errs.subject && subjectRef.current) return subjectRef.current.focus();
    if (errs.message && messageRef.current) return messageRef.current.focus();
  };

  const copyEmail = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(info.email);
      } else {
        const tmp = document.createElement("textarea");
        tmp.value = info.email;
        tmp.setAttribute("readonly", "");
        tmp.style.position = "absolute";
        tmp.style.left = "-9999px";
        document.body.appendChild(tmp);
        tmp.select();
        document.execCommand("copy");
        document.body.removeChild(tmp);
      }
      setCopyMsg("Email disalin ke clipboard.");
    } catch {
      setCopyMsg("Gagal menyalin email.");
    } finally {
      setTimeout(() => setCopyMsg(""), 2200);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    setTouched({ name: true, email: true, subject: true, message: true });

    if (Object.keys(errs).length > 0) {
      focusFirstError(errs);
      return;
    }

    // Jika sedang DINONAKTIFKAN → jangan kirim network request
    if (formDisabled) {
      setFormMsg("Form sementara dinonaktifkan. Silakan kirim via Email atau WhatsApp.");
      setTimeout(() => setFormMsg(""), 4000);
      return;
    }

    if (values.company) return; // stop bot
    setSubmitting(true);
    setFormMsg("");

    try {
      const res = await fetch(info.FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Request gagal");

      setOk(true);
      setValues(initialValues);
      setTouched({});
      setFormMsg("Terima kasih! Pesanmu sudah terkirim.");
    } catch (err) {
      console.error(err);
      setFormMsg("Maaf, pengiriman gagal. Coba lagi atau kontak via email/WhatsApp.");
    } finally {
      setSubmitting(false);
      setTimeout(() => setFormMsg(""), 4000);
    }
  };

  // Panel sukses hanya jika form aktif & pengiriman sukses
  if (ok && !formDisabled) {
    return (
      <main className="contact" role="main">
        <SEO
          title="Contact"
          description="Hubungi Aditya Anugrah — kirim pesan via form, email, atau WhatsApp untuk kolaborasi."
          path="/contact"
          type="website"
          image="/assets/og-contact.jpg"
          imageAlt="Kontak Aditya Anugrah"
        />
        <div className="container">
          <header className="c-head">
            <h1 className="title">Terima kasih 🙌</h1>
            <p className="lead">
              Pesan kamu sudah terkirim. Aku akan balas secepatnya melalui email/WhatsApp.
            </p>
          </header>

          <div className="c-success" role="status" aria-live="polite">
            <FaCheckCircle className="ok-ic" aria-hidden />
            <div className="ok-body">
              <div className="ok-title">Pesan terkirim</div>
              <p className="ok-text">
                Ingin kirim pesan lagi?{" "}
                <button className="link" onClick={() => setOk(false)}>
                  Buka form
                </button>
              </p>
            </div>
          </div>

          <div className="c-back">
            <Link to="/projects" className="btn">Lihat Proyek</Link>
            <Link to="/" className="btn btn-ghost">Kembali ke Home</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="contact" role="main">
      <SEO
        title="Contact"
        description="Hubungi Aditya Anugrah — kirim pesan via form, email, atau WhatsApp untuk kolaborasi."
        path="/contact"
        type="website"
        image="/assets/og-contact.jpg"
        imageAlt="Kontak Aditya Anugrah"
      />

      <div className="container">
        {/* HEADER */}
        <header className="c-head">
          <h1 className="title">Kontak</h1>
          <p className="lead">
            Ada proyek, ide, atau kolaborasi? Kirim pesan lewat form di bawah.
            Bisa juga langsung via email/WhatsApp—tersedia tombol cepat di samping.
          </p>
        </header>

        {/* ALERT nonaktif */}
        {formDisabled && (
          <div className="c-alert" role="status" aria-live="polite">
            Form sementara <strong>dinonaktifkan</strong>. Silakan gunakan{" "}
            <a href={`mailto:${info.email}`}>Email</a> atau{" "}
            <a href={info.whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp</a>.
          </div>
        )}

        <div className="c-grid">
          {/* ASIDE INFO */}
          <aside className="c-aside" aria-label="Informasi kontak">
            <div className="c-card">
              <h2 className="c-card__title">Hubungi Langsung</h2>

              <ul className="c-list">
                <li className="c-item">
                  <FaEnvelope className="ic" aria-hidden />
                  <div className="col">
                    <div className="label">Email</div>
                    <a href={`mailto:${info.email}`} className="val">{info.email}</a>
                  </div>
                  <button className="copy" onClick={copyEmail} aria-label="Salin email">
                    <FaCopy />
                  </button>
                </li>

                <li className="c-item">
                  <FaWhatsapp className="ic" aria-hidden />
                  <div className="col">
                    <div className="label">WhatsApp</div>
                    <a
                      href={info.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="val"
                    >
                      Chat sekarang
                    </a>
                  </div>
                </li>

                <li className="c-item">
                  <FaPhone className="ic" aria-hidden />
                  <div className="col">
                    <div className="label">Telepon</div>
                    <a href={`tel:${info.phone}`} className="val">{info.phone}</a>
                  </div>
                </li>

                <li className="c-item">
                  <FaMapMarkerAlt className="ic" aria-hidden />
                  <div className="col">
                    <div className="label">Lokasi</div>
                    <div className="val">{info.location}</div>
                  </div>
                </li>
              </ul>

              {(info.socials.github || info.socials.linkedin || info.socials.instagram) && (
                <div className="c-socials">
                  {info.socials.github && (
                    <a
                      href={info.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="s-link"
                      aria-label="GitHub"
                    >
                      <FaGithub /> GitHub
                    </a>
                  )}
                  {info.socials.linkedin && (
                    <a
                      href={info.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="s-link"
                      aria-label="LinkedIn"
                    >
                      <FaLinkedin /> LinkedIn
                    </a>
                  )}
                  {info.socials.instagram && (
                    <a
                      href={info.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="s-link"
                      aria-label="Instagram"
                    >
                      <FaInstagram /> Instagram
                    </a>
                  )}
                </div>
              )}

              {copyMsg && (
                <div className="c-status" role="status" aria-live="polite">
                  {copyMsg}
                </div>
              )}
            </div>
          </aside>

          {/* FORM */}
          <section className="c-formwrap" aria-label="Formulir kontak">
            <form className="c-form" noValidate onSubmit={handleSubmit}>
              {/* Honeypot */}
              <input
                type="text"
                name="company"
                value={values.company}
                onChange={onChange}
                className="hp"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="row">
                <div className="field">
                  <label htmlFor="name">Nama</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Nama lengkap"
                    value={values.name}
                    onChange={onChange}
                    onBlur={onBlur}
                    ref={nameRef}
                    autoComplete="name"
                    maxLength={80}
                    aria-invalid={touched.name && !!errors.name}
                    aria-describedby="name-err"
                  />
                  {touched.name && errors.name && (
                    <div id="name-err" className="err" role="alert">
                      {errors.name}
                    </div>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={values.email}
                    onChange={onChange}
                    onBlur={onBlur}
                    ref={emailRef}
                    autoComplete="email"
                    maxLength={120}
                    aria-invalid={touched.email && !!errors.email}
                    aria-describedby="email-err"
                  />
                  {touched.email && errors.email && (
                    <div id="email-err" className="err" role="alert">
                      {errors.email}
                    </div>
                  )}
                </div>
              </div>

              <div className="field">
                <label htmlFor="subject">Subjek</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="Tentang apa kita bahas?"
                  value={values.subject}
                  onChange={onChange}
                  onBlur={onBlur}
                  ref={subjectRef}
                  autoComplete="off"
                  maxLength={120}
                  aria-invalid={touched.subject && !!errors.subject}
                  aria-describedby="subject-err"
                />
                {touched.subject && errors.subject && (
                  <div id="subject-err" className="err" role="alert">
                    {errors.subject}
                  </div>
                )}
              </div>

              <div className="field">
                <label htmlFor="message">Pesan</label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder="Ceritakan kebutuhanmu secara singkat..."
                  value={values.message}
                  onChange={onChange}
                  onBlur={onBlur}
                  ref={messageRef}
                  aria-invalid={touched.message && !!errors.message}
                  aria-describedby="message-help message-err"
                  maxLength={1000}
                />
                <div id="message-help" className="help">
                  {values.message.length}/1000
                </div>
                {touched.message && errors.message && (
                  <div id="message-err" className="err" role="alert">
                    {errors.message}
                  </div>
                )}
              </div>

              <div className="actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting || formDisabled}
                  aria-disabled={submitting || formDisabled}
                  title={formDisabled ? "Form dinonaktifkan" : undefined}
                >
                  <FaPaperPlane aria-hidden />
                  {formDisabled ? "Form Dinonaktifkan" : (submitting ? "Mengirim..." : "Kirim Pesan")}
                </button>

                <a className="btn btn-ghost" href={`mailto:${info.email}`}>
                  Kirim via Email
                </a>
                <a
                  className="btn btn-ghost"
                  href={info.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </div>

              {/* Status form */}
              {formMsg && (
                <div className="c-status c-status--form" role="status" aria-live="polite">
                  {formMsg}
                </div>
              )}

              {/* reCAPTCHA placeholder hanya tampil jika form aktif */}
              {!formDisabled && <div className="captcha-placeholder" aria-hidden="true" />}
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
