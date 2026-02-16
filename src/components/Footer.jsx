import React from "react";
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/5 bg-black py-12 px-6 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-cyan-500/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 relative z-10 mb-12">
        
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
                <a href="https://www.instagram.com/adityaanugrah" aria-label="Follow on Instagram" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors text-xl">
                    <FaInstagram />
                </a>
            </div>
        </div>

        <div>
            <h4 className="text-white font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-white/50" aria-label="Expertise area">
                <li>Web Application Development</li>
                <li>E-Commerce Solutions</li>
                <li>Landing Pages for Business</li>
                <li>Technical SEO & Optimization</li>
            </ul>
        </div>

        <div>
            <h4 className="text-white font-bold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-sm text-white/50" aria-label="Contact details">
                <li>
                    <a href="mailto:admin@adityaanugra.me" aria-label="Send Email" className="hover:text-cyan-400 transition-colors flex items-center gap-2">
                        <FaEnvelope aria-hidden="true" /> admin@adityaanugra.me
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
        <p>&copy; {currentYear} Aditya Anugrah. All rights reserved.</p>
        <p>Built with React, Tailwind & Framer Motion.</p>
      </div>
    </footer>
  );
};

export default Footer;
