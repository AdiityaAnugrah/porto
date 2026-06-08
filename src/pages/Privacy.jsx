import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { FaDatabase, FaGoogleDrive, FaLock, FaTrashAlt, FaUserShield } from "react-icons/fa";

const lastUpdated = "June 8, 2026";

const sections = [
  {
    title: "Information We Collect",
    body: [
      "When you use MyCloud, we may collect account information such as your name, email address, profile picture, and login method.",
      "If you connect Google Drive, the app stores encrypted OAuth tokens so the service can create, list, upload, preview, rename, and delete files you manage through MyCloud.",
      "Operational data such as file names, folder names, MIME types, file sizes, upload status, storage quota, timestamps, and audit records may be stored in the MyCloud database.",
    ],
  },
  {
    title: "How Google Drive Data Is Used",
    body: [
      "MyCloud uses Google Drive access only to provide the cloud file management features requested by the signed-in user.",
      "Files are stored in the connected Google Drive account. MyCloud keeps metadata in its own database so the dashboard can show files, folders, storage accounts, sharing records, and upload history.",
      "Google user data is not sold, used for advertising, or shared with unrelated third parties.",
    ],
  },
  {
    title: "Storage And Security",
    body: [
      "Google OAuth refresh tokens and access tokens are encrypted before being stored in the database.",
      "Database access is limited to the server environment. Public traffic reaches the backend through HTTPS and the configured API proxy.",
      "No system can be guaranteed perfectly secure, but reasonable technical controls are used to reduce unauthorized access risk.",
    ],
  },
  {
    title: "Google API Limited Use",
    body: [
      "MyCloud's use and transfer of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements.",
      "Google user data is used only for user-facing file management features and is not used to build advertising profiles or train generalized AI models.",
    ],
  },
  {
    title: "Data Retention And Deletion",
    body: [
      "Account, token, file metadata, upload, and audit records may be retained while the account is active and as needed for service operation, security, debugging, and legal compliance.",
      "You may revoke Google access at any time from your Google Account permissions page.",
      "You may request deletion of your MyCloud account data by contacting the operator at admin@adityaanugrah.me.",
    ],
  },
];

const highlights = [
  {
    icon: FaGoogleDrive,
    title: "Google Drive Access",
    text: "Used only to operate MyCloud file management features.",
  },
  {
    icon: FaLock,
    title: "Encrypted Tokens",
    text: "OAuth tokens are encrypted before database storage.",
  },
  {
    icon: FaUserShield,
    title: "No Data Sale",
    text: "Google user data is not sold or used for advertising.",
  },
  {
    icon: FaTrashAlt,
    title: "Deletion Requests",
    text: "Users can request account data deletion by email.",
  },
];

export default function Privacy() {
  return (
    <div className="pt-24 pb-32 px-6 max-w-5xl mx-auto min-h-screen">
      <SEO
        title="Privacy Policy | Aditya Anugrah"
        description="Privacy Policy for Aditya Anugrah services, including MyCloud Google Drive integration and OAuth data handling."
        path="/privacy"
        type="website"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Privacy Policy",
          url: "https://adityaanugrah.me/privacy",
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
          Privacy <span className="text-gradient">Policy</span>
        </h1>
        <p className="mt-5 max-w-3xl text-white/60 leading-relaxed">
          This policy explains how Aditya Anugrah and the MyCloud service handle account data,
          Google Drive access, stored metadata, and deletion requests.
        </p>
        <p className="mt-4 text-sm text-white/35">Last updated: {lastUpdated}</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {highlights.map((item) => (
          <article key={item.title} className="glass-panel rounded-2xl p-5">
            <item.icon className="mb-4 text-2xl text-cyan-300" aria-hidden="true" />
            <h2 className="text-base font-bold text-white">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/55">{item.text}</p>
          </article>
        ))}
      </section>

      <div className="glass-panel rounded-3xl p-6 md:p-10">
        <div className="mb-8 flex items-start gap-4 rounded-2xl border border-cyan-300/15 bg-cyan-300/5 p-5">
          <FaDatabase className="mt-1 shrink-0 text-xl text-cyan-300" aria-hidden="true" />
          <p className="text-sm md:text-base leading-relaxed text-white/65">
            MyCloud is a file management service hosted at{" "}
            <a
              href="https://mycloud.adityaanugrah.me"
              className="text-cyan-300 hover:text-cyan-200 underline underline-offset-4"
            >
              mycloud.adityaanugrah.me
            </a>
            . It connects to user-authorized Google Drive accounts and performs file actions
            only after user authentication and consent.
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
          <h2 className="text-xl md:text-2xl font-bold text-white">Contact</h2>
          <p className="mt-4 text-sm md:text-base leading-relaxed text-white/60">
            For privacy requests, account deletion, or questions about data handling, contact{" "}
            <a
              href="mailto:admin@adityaanugrah.me"
              className="text-cyan-300 hover:text-cyan-200 underline underline-offset-4"
            >
              admin@adityaanugrah.me
            </a>
            .
          </p>
          <p className="mt-4 text-sm text-white/45">
            See also the{" "}
            <Link to="/terms" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-4">
              Terms of Service
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
