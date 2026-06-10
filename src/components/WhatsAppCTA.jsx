import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

const WhatsAppCTA = () => {
  return (
    <motion.a
      href="https://wa.me/6281379430432?text=Halo%20Aditya,%20saya%20tertarik%20untuk%20berdiskusi%20tentang%20proyek%20web/app."
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'conversion', {
            'send_to': 'whatsapp_contact',
            'event_category': 'Engagement',
            'event_label': 'WhatsApp Chat'
          });
        }
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring" }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-6 right-6 z-50 hidden items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-[0_4px_20px_rgba(37,211,102,0.4)] transition-shadow hover:shadow-[0_6px_30px_rgba(37,211,102,0.6)] md:flex group"
    >

      <FaWhatsapp className="text-2xl" />
      <span className="font-bold pr-1 hidden group-hover:block whitespace-nowrap overflow-hidden animate-in fade-in slide-in-from-right-2 duration-300">
        Chat via WhatsApp
      </span>
    </motion.a>
  );
};

export default WhatsAppCTA;
