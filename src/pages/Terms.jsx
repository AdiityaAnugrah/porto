import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { FaExclamationTriangle, FaFileContract, FaHandshake, FaShieldAlt } from "react-icons/fa";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/8bit-alert";
import { useLocalizedPath } from "../lib/i18n";

const lastUpdated = "June 8, 2026";

const sections = [
  {
    title: "Website Use",
    body: [
      "This website provides information about Aditya Anugrah, portfolio work, articles, contact options, and professional services.",
      "You may not use this website for spam, phishing, illegal activity, attempted intrusion, automated abuse, scraping that disrupts service, or activity that harms the website or other users.",
    ],
  },
  {
    title: "Project Inquiries",
    body: [
      "Submitting a contact form or message does not create a client relationship, contract, service commitment, or guarantee of availability.",
      "Project scope, timeline, pricing, ownership, support, and payment terms must be agreed separately in writing before work begins.",
    ],
  },
  {
    title: "Content And Intellectual Property",
    body: [
      "Website text, design, images, code, and portfolio materials are owned by their respective owners and may not be copied or reused without permission except where allowed by law.",
      "Portfolio entries may reference client or project work for demonstration purposes. Trademarks and third-party assets remain the property of their owners.",
    ],
  },
  {
    title: "Availability And Changes",
    body: [
      "The website is provided on an as-is and as-available basis. Uptime, accuracy, compatibility, and uninterrupted access are not guaranteed.",
      "Content, features, pages, and policies may be changed, removed, or updated as needed for maintenance, security, legal, or business reasons.",
    ],
  },
  {
    title: "Liability",
    body: [
      "To the maximum extent permitted by applicable law, Aditya Anugrah is not liable for indirect, incidental, consequential, special, or business losses related to website use.",
      "Nothing in these terms limits rights or responsibilities that cannot be limited under applicable law.",
    ],
  },
];

const cards = [
  {
    icon: FaHandshake,
    title: "Separate Agreements",
    text: "Client work requires written scope, pricing, and timeline approval.",
  },
  {
    icon: FaShieldAlt,
    title: "Responsible Use",
    text: "Illegal, abusive, harmful, or disruptive use is not allowed.",
  },
  {
    icon: FaExclamationTriangle,
    title: "No Guarantee",
    text: "Website access and content are provided as available.",
  },
];

export default function Terms() {
  const toLocalized = useLocalizedPath();

  return (
    <div className="pt-24 pb-32 px-6 max-w-5xl mx-auto min-h-screen">
      <SEO
        title="Terms of Service | Aditya Anugrah"
        description="Terms of Service for using the Aditya Anugrah website and submitting project inquiries."
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
          These terms govern use of the Aditya Anugrah website and contact channels.
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
        <Alert variant="info" className="mb-9">
          <div className="flex gap-3">
            <FaFileContract className="mt-1 shrink-0 text-xl text-cyan-100" aria-hidden="true" />
            <div>
              <AlertTitle>Website terms</AlertTitle>
              <AlertDescription>
                By accessing or using this website, you agree to these terms. If you do not agree,
                do not use the website.
              </AlertDescription>
            </div>
          </div>
        </Alert>

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
            <Link to={toLocalized("/privacy")} className="text-cyan-300 hover:text-cyan-200 underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
