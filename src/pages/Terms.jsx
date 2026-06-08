import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { FaCloudUploadAlt, FaExclamationTriangle, FaFileContract, FaShieldAlt } from "react-icons/fa";

const lastUpdated = "June 8, 2026";

const sections = [
  {
    title: "Use Of The Service",
    body: [
      "MyCloud is provided as a web-based file management interface for user-authorized Google Drive accounts.",
      "You are responsible for the files you upload, store, share, rename, delete, or otherwise manage through the service.",
      "You must not use the service for malware, phishing, illegal content, copyright infringement, spam, abuse, or activity that disrupts the server or other users.",
    ],
  },
  {
    title: "Google Drive Connection",
    body: [
      "To use Google Drive storage features, you must authorize the application through Google's OAuth flow.",
      "The service may request Google Drive permissions needed to create, list, upload, preview, rename, and delete files through MyCloud.",
      "You can revoke access from your Google Account permissions page at any time.",
    ],
  },
  {
    title: "Account Responsibility",
    body: [
      "You are responsible for keeping your account credentials safe and for all activity performed from your account.",
      "If you believe your account is compromised, revoke Google access and contact the operator as soon as possible.",
      "The operator may restrict, suspend, or remove accounts that appear abusive, risky, or harmful to the service.",
    ],
  },
  {
    title: "Availability And Changes",
    body: [
      "The service is provided on an as-is and as-available basis. Uptime, storage performance, and third-party API availability are not guaranteed.",
      "Features may change as the service is maintained, upgraded, or adjusted for security, capacity, legal, or Google API policy reasons.",
      "The service depends on Google APIs, Google Drive, server infrastructure, DNS, SSL certificates, and network providers that are outside full operator control.",
    ],
  },
  {
    title: "Liability",
    body: [
      "To the maximum extent permitted by applicable law, the operator is not liable for indirect, incidental, consequential, or special damages related to use of the service.",
      "You should keep your own backups of important files. Do not rely on MyCloud as the only copy of critical data.",
      "Nothing in these terms limits rights that cannot be limited under applicable law.",
    ],
  },
];

const cards = [
  {
    icon: FaCloudUploadAlt,
    title: "User Managed Files",
    text: "You control the files you upload and manage through connected Google Drive accounts.",
  },
  {
    icon: FaShieldAlt,
    title: "Responsible Use",
    text: "Illegal, abusive, harmful, or disruptive use is not allowed.",
  },
  {
    icon: FaExclamationTriangle,
    title: "No Sole Backup",
    text: "Keep separate backups for important data and business-critical files.",
  },
];

export default function Terms() {
  return (
    <div className="pt-24 pb-32 px-6 max-w-5xl mx-auto min-h-screen">
      <SEO
        title="Terms of Service | Aditya Anugrah"
        description="Terms of Service for Aditya Anugrah services, including MyCloud Google Drive file management."
        path="/terms"
        type="website"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Terms of Service",
          url: "https://adityaanugrah.me/terms",
          dateModified: "2026-06-08",
          publisher: {
            "@type": "Person",
            name: "Aditya Anugrah",
          },
        }}
      />

      <header className="mb-10">
        <p className="mb-4 text-xs font-mono uppercase tracking-[0.24em] text-cyan-300/80">
          Legal
        </p>
        <h1 className="text-4xl md:text-6xl font-bold font-display tracking-tight">
          Terms of <span className="text-gradient">Service</span>
        </h1>
        <p className="mt-5 max-w-3xl text-white/60 leading-relaxed">
          These terms govern use of Aditya Anugrah services, including the MyCloud file
          management service hosted at mycloud.adityaanugrah.me.
        </p>
        <p className="mt-4 text-sm text-white/35">Last updated: {lastUpdated}</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {cards.map((item) => (
          <article key={item.title} className="glass-panel rounded-2xl p-5">
            <item.icon className="mb-4 text-2xl text-cyan-300" aria-hidden="true" />
            <h2 className="text-base font-bold text-white">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/55">{item.text}</p>
          </article>
        ))}
      </section>

      <div className="glass-panel rounded-3xl p-6 md:p-10">
        <div className="mb-8 flex items-start gap-4 rounded-2xl border border-cyan-300/15 bg-cyan-300/5 p-5">
          <FaFileContract className="mt-1 shrink-0 text-xl text-cyan-300" aria-hidden="true" />
          <p className="text-sm md:text-base leading-relaxed text-white/65">
            By accessing or using MyCloud, you agree to these terms. If you do not agree,
            do not use the service or connect your Google Drive account.
          </p>
        </div>

        <div className="space-y-9">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl md:text-2xl font-bold text-white">{section.title}</h2>
              <div className="mt-4 space-y-3">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-sm md:text-base leading-relaxed text-white/60">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-10 border-t border-white/10 pt-8">
          <h2 className="text-xl md:text-2xl font-bold text-white">Contact And Privacy</h2>
          <p className="mt-4 text-sm md:text-base leading-relaxed text-white/60">
            Questions about these terms can be sent to{" "}
            <a
              href="mailto:admin@adityaanugrah.me"
              className="text-cyan-300 hover:text-cyan-200 underline underline-offset-4"
            >
              admin@adityaanugrah.me
            </a>
            .
          </p>
          <p className="mt-4 text-sm text-white/45">
            For data handling details, read the{" "}
            <Link to="/privacy" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
