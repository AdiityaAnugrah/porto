/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus } from "react-icons/fa";

const faqs = [
  {
    question: "Do you provide maintenance after the project is done?",
    answer: "Yes! Every project includes a 30-day free support period. I also offer monthly maintenance packages for updates, security, and backups."
  },
  {
    question: "How much does a website cost?",
    answer: "It depends on the complexity. A landing page starts from potential lower range, while custom web apps depend on features. Let's discuss your needs to get an exact quote."
  },
  {
    question: "How long does the development take?",
    answer: "Standard company profiles take 1-2 weeks. Complex custom applications (ERP/POS) can take 4-8 weeks depending on the requirements."
  },
  {
    question: "Can I manage the website content myself?",
    answer: "Absolutely. I build dynamic websites with easy-to-use Admin Panels (CMS) so you can update text, images, and products without coding."
  }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="mt-24 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold font-display text-center mb-8">Frequently Asked Questions</h2>
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
