import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import VisitorCounter from "./VisitorCounter";

const primaryLinks = [
  { to: "/", label: "Home" },
  { to: "/store", label: "Digital Store" },
  { to: "/projects", label: "Portfolio" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

const serviceLinks = [
  { to: "/#services", label: "Pembuatan Website" },
  { to: "/projects/web", label: "Website Portfolio" },
  { to: "/projects/mobile", label: "Aplikasi Bisnis" },
  { to: "/projects/landing", label: "Landing Page" },
  { to: "/contact", label: "Konsultasi SEO" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/5 bg-[#070605] px-6 pt-12 pb-32 md:pb-12 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-6 relative z-10 mb-12">

        <div className="md:col-span-2">
            <h3 className="text-2xl font-display font-bold text-white mb-4">Aditya Anugrah</h3>
            <p className="text-white/40 text-xs md:text-sm max-w-sm leading-relaxed mb-6">
                Web Developer & Business Consultant profesional di Semarang. 
                Membantu bisnis membangun produk digital yang scalable dengan teknologi modern.
            </p>
            <div className="flex gap-4">
                <a href="https://github.com/adiityaanugrah" aria-label="Visit Aditya's Github" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors text-xl">
                    <FaGithub />
                </a>
                <a href="https://www.linkedin.com/in/aditya-anugrah/" aria-label="Connect on LinkedIn" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors text-xl">
                    <FaLinkedin />
                </a>
                <a href="https://www.instagram.com/adiityaanugrah/" aria-label="Follow on Instagram" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors text-xl">
                    <FaInstagram />
                </a>
            </div>
        </div>

        <div>
            <h4 className="text-white font-bold mb-4">Menu</h4>
            <ul className="space-y-2 text-sm text-white/50" aria-label="Main footer menu">
                {primaryLinks.map((item) => (
                    <li key={item.to}>
                        <Link to={item.to} className="hover:text-cyan-400 transition-colors">
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>

        <div>
            <h4 className="text-white font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-white/50" aria-label="Service pages">
                {serviceLinks.map((item) => (
                    <li key={item.to}>
                        <Link to={item.to} className="hover:text-cyan-400 transition-colors">
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>

        <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-white/50" aria-label="Legal pages">
                <li>
                    <Link to="/privacy" className="hover:text-cyan-400 transition-colors">
                        Privacy Policy
                    </Link>
                </li>
                <li>
                    <Link to="/terms" className="hover:text-cyan-400 transition-colors">
                        Terms of Service
                    </Link>
                </li>
            </ul>
        </div>

        <div>
            <h4 className="text-white font-bold mb-4">Informasi Kontak</h4>
            <ul className="space-y-2 text-sm text-white/50" aria-label="Contact details">
                <li>
                    <a href="mailto:admin@adityaanugrah.me" aria-label="Send Email" className="hover:text-cyan-400 transition-colors flex items-center gap-2">
                        <FaEnvelope aria-hidden="true" /> admin@adityaanugrah.me
                    </a>
                </li>
                <li>
                     <a href="https://wa.me/6281379430432" aria-label="Chat on WhatsApp" className="hover:text-green-400 transition-colors flex items-center gap-2">
                        <FaWhatsapp aria-hidden="true" /> +62 813 7943 0432
                    </a>
                </li>
                <li className="pt-2">
                    <span className="sr-only">Location: </span> Semarang, Indonesia (WIB)
                </li>
            </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
        <p>&copy; {currentYear} Aditya Anugrah</p>
        <VisitorCounter />
      </div>
    </footer>
  );
};

export default Footer;
