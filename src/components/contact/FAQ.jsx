/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus } from "react-icons/fa";

const faqs = [
  {
    question: "Apakah Anda menyediakan pemeliharaan setelah proyek selesai?",
    answer: "Ya! Setiap proyek mencakup periode dukungan gratis selama 30 hari. Saya juga menawarkan paket pemeliharaan bulanan untuk pembaruan, keamanan, dan pencadangan."
  },
  {
    question: "Berapa biaya pembuatan website?",
    answer: "Itu tergantung pada kompleksitasnya. Halaman arahan dimulai dari kisaran bawah, sedangkan aplikasi web khusus bergantung pada fitur. Mari diskusikan kebutuhan Anda untuk mendapatkan penawaran yang tepat."
  },
  {
    question: "Berapa lama waktu yang dibutuhkan untuk pengembangan?",
    answer: "Profil perusahaan standar memakan waktu 1-2 minggu. Aplikasi khusus yang kompleks (ERP/POS) dapat memakan waktu 4-8 minggu tergantung pada persyaratan."
  },
  {
    question: " Bisakah saya mengelola konten website sendiri?",
    answer: "Tentu saja. Saya membangun website dinamis dengan Panel Admin (CMS) yang mudah digunakan sehingga Anda dapat memperbarui teks, gambar, dan produk tanpa coding."
  }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="mt-24 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold font-display text-center mb-8">Pertanyaan yang Sering Diajukan</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-white/10 rounded-xl bg-white/5 overflow-hidden">
            <button
              onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              className="w-full flex justify-between items-center p-6 text-left hover:bg-white/5 transition-colors"
            >
              <span className="font-bold">{faq.question}</span>
              <span className="text-cyan-400 text-sm">
                {activeIndex === index ? <FaMinus /> : <FaPlus />}
              </span>
            </button>
            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 text-white/60 leading-relaxed border-t border-white/5">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
