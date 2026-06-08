import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { FaEnvelope, FaLock, FaServer, FaUserShield } from "react-icons/fa";

const lastUpdated = "June 8, 2026";

const sections = [
  {
    title: "Information We Collect",
    body: [
      "When you contact Aditya Anugrah through this website, we may receive the information you choose to send, such as your name, email address, phone number, company name, project details, and message content.",
      "Basic technical information such as browser type, device information, pages visited, timestamps, and security logs may be processed by the hosting provider or website infrastructure.",
    ],
  },
  {
    title: "How Information Is Used",
    body: [
      "Contact details and project information are used to reply to inquiries, prepare estimates, discuss collaboration, provide support, and maintain business records.",
      "Technical logs are used for security monitoring, troubleshooting, abuse prevention, and keeping the website available.",
    ],
  },
  {
    title: "Sharing",
    body: [
      "Personal information is not sold.",
      "Information may be shared only when needed to operate the website, respond to your request, comply with law, prevent abuse, or work with trusted service providers involved in hosting, email delivery, analytics, or security.",
    ],
  },
  {
    title: "Security And Retention",
    body: [
      "Reasonable technical and organizational measures are used to protect information from unauthorized access, loss, misuse, or alteration.",
      "Messages and business records may be retained as long as needed for communication, accounting, security, legal compliance, and legitimate business purposes.",
    ],
  },
  {
    title: "Your Choices",
    body: [
      "You may request correction or deletion of personal information you have provided, subject to legal, security, and business record requirements.",
      "You can avoid sending personal data through the contact form by contacting only with the information you are comfortable sharing.",
    ],
  },
];

const highlights = [
  {
    icon: FaEnvelope,
    title: "Contact Data",
    text: "Used to reply to inquiries and discuss project work.",
  },
  {
    icon: FaServer,
    title: "Server Logs",
    text: "Used for security, diagnostics, and uptime monitoring.",
  },
  {
    icon: FaUserShield,
    title: "No Data Sale",
    text: "Personal information is not sold.",
  },
  {
    icon: FaLock,
    title: "Reasonable Controls",
    text: "Security controls are used to reduce unauthorized access risk.",
  },
];

export default function Privacy() {
  return (
    <div className="pt-24 pb-32 px-6 max-w-5xl mx-auto min-h-screen">
      <SEO
        title="Privacy Policy | Aditya Anugrah"
        description="Privacy Policy for the Aditya Anugrah website, contact forms, server logs, and project inquiries."
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
          This policy explains how information submitted through this website is handled.
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
            For privacy requests or questions about data handling, contact{" "}
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
