import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { Mail, MessageCircle, Send, ShieldCheck } from "lucide-react";
import SEO from "../components/SEO";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/8bit-alert";
import { usePreferredLanguage } from "../lib/usePreferredLanguage";

const copy = {
  id: {
    seoTitle: "Contact | Aditya Anugrah",
    seoDescription:
      "Hubungi Aditya Anugrah untuk website bisnis, dashboard, API, integrasi, dan produk digital.",
    badge: "Contact",
    title: "Ceritakan kebutuhan website atau sistem yang ingin kamu bangun.",
    body:
      "Kirim konteks singkat: jenis bisnis, tujuan utama, fitur yang dibutuhkan, dan timeline. Saya akan balas dengan arah pengerjaan yang paling masuk akal.",
    directTitle: "Kontak langsung",
    directBody: "Untuk kebutuhan cepat, WhatsApp biasanya paling efisien.",
    email: "Email",
    whatsapp: "WhatsApp",
    formTitle: "Project inquiry",
    name: "Nama",
    emailLabel: "Email",
    message: "Kebutuhan project",
    namePlaceholder: "Nama kamu",
    emailPlaceholder: "email@example.com",
    messagePlaceholder: "Contoh: butuh company profile, katalog produk, dashboard admin, atau integrasi pembayaran.",
    sending: "Mengirim...",
    send: "Kirim inquiry",
    successTitle: "Inquiry terkirim",
    successBody: "Terima kasih. Saya akan balas melalui email secepatnya.",
    error: "Pesan gagal dikirim. Coba lagi atau hubungi via WhatsApp.",
    points: [
      "Website company profile dan landing page",
      "Dashboard internal dan workflow bisnis",
      "API, payment gateway, email, storage, analytics",
    ],
  },
  en: {
    seoTitle: "Contact | Aditya Anugrah",
    seoDescription:
      "Contact Aditya Anugrah for business websites, dashboards, APIs, integrations, and digital products.",
    badge: "Contact",
    title: "Tell me what website or system you want to build.",
    body:
      "Send a short context: business type, main goal, required features, and timeline. I will respond with the most practical direction.",
    directTitle: "Direct contact",
    directBody: "For quick needs, WhatsApp is usually the most efficient channel.",
    email: "Email",
    whatsapp: "WhatsApp",
    formTitle: "Project inquiry",
    name: "Name",
    emailLabel: "Email",
    message: "Project needs",
    namePlaceholder: "Your name",
    emailPlaceholder: "email@example.com",
    messagePlaceholder: "Example: company profile, product catalog, admin dashboard, or payment integration.",
    sending: "Sending...",
    send: "Send inquiry",
    successTitle: "Inquiry sent",
    successBody: "Thank you. I will reply by email as soon as possible.",
    error: "Message failed. Try again or contact me through WhatsApp.",
    points: [
      "Company profiles and landing pages",
      "Internal dashboards and business workflows",
      "APIs, payment gateways, email, storage, analytics",
    ],
  },
};

const Contact = () => {
  const { language } = usePreferredLanguage();
  const t = copy[language] || copy.en;
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const SERVICE_ID = "service_vr0p9hi";
  const TEMPLATE_ID = "template_dv924xl";
  const PUBLIC_KEY = "sIWIuNBhbXcJPGjrE";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("sending");

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_name: "Aditya Anugrah",
        },
        PUBLIC_KEY
      );

      if (typeof window.gtag === "function") {
        window.gtag("event", "generate_lead", {
          event_category: "Contact",
          event_label: "Contact Form Success",
        });
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus(""), 5000);
    } catch (error) {
      console.error("EmailJS Error:", error);
      setStatus("error");
      setTimeout(() => setStatus(""), 5000);
    }
  };

  return (
    <div className="min-h-screen px-4 pb-24 pt-24 sm:px-6 md:pb-32 md:pt-28">
      <SEO title={t.seoTitle} description={t.seoDescription} path="/contact" />

      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <section>
          <div className="mb-5 inline-flex rounded-full border border-cyan-300/20 bg-white/[0.055] px-4 py-2 text-sm text-cyan-100">
            {t.badge}
          </div>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl md:text-6xl">
            {t.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/62 md:text-lg">{t.body}</p>

          <div className="mt-8 grid gap-3">
            {t.points.map((point) => (
              <div key={point} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <ShieldCheck className="mt-0.5 shrink-0 text-cyan-200" size={18} aria-hidden="true" />
                <p className="text-sm leading-6 text-white/68">{point}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.045] p-5">
            <h2 className="text-xl font-bold text-white">{t.directTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-white/55">{t.directBody}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <a href="mailto:admin@adityaanugrah.me" className="flex min-h-14 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 transition-colors hover:bg-white/[0.07]">
                <Mail className="text-cyan-200" size={20} aria-hidden="true" />
                <div>
                  <p className="text-xs text-white/38">{t.email}</p>
                  <p className="text-sm font-bold text-white">admin@adityaanugrah.me</p>
                </div>
              </a>
              <a href="https://wa.me/6281379430432" target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 transition-colors hover:bg-white/[0.07]">
                <MessageCircle className="text-green-300" size={20} aria-hidden="true" />
                <div>
                  <p className="text-xs text-white/38">{t.whatsapp}</p>
                  <p className="text-sm font-bold text-white">+62 813 7943 0432</p>
                </div>
              </a>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-[#0d0b08]/92 p-5 shadow-2xl shadow-black/25 md:p-7">
          <h2 className="text-2xl font-bold text-white">{t.formTitle}</h2>

          {status === "success" ? (
            <Alert variant="success" className="mt-6">
              <AlertTitle>{t.successTitle}</AlertTitle>
              <AlertDescription>{t.successBody}</AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-white/78">{t.name}</span>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  className="min-h-12 w-full rounded-xl border border-white/10 bg-white/[0.055] px-4 text-base text-white outline-none transition-colors placeholder:text-white/32 focus:border-cyan-200/55"
                  placeholder={t.namePlaceholder}
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-white/78">{t.emailLabel}</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  className="min-h-12 w-full rounded-xl border border-white/10 bg-white/[0.055] px-4 text-base text-white outline-none transition-colors placeholder:text-white/32 focus:border-cyan-200/55"
                  placeholder={t.emailPlaceholder}
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-white/78">{t.message}</span>
                <textarea
                  required
                  rows="6"
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.055] px-4 py-3 text-base text-white outline-none transition-colors placeholder:text-white/32 focus:border-cyan-200/55"
                  placeholder={t.messagePlaceholder}
                  value={formData.message}
                  onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                />
              </label>

              {status === "error" && (
                <Alert variant="destructive">
                  <AlertTitle>{language === "id" ? "Pesan gagal" : "Message failed"}</AlertTitle>
                  <AlertDescription>{t.error}</AlertDescription>
                </Alert>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-cyan-100 px-5 text-base font-bold text-black transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === "sending" ? t.sending : t.send}
                <Send size={17} aria-hidden="true" />
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};

export default Contact;
