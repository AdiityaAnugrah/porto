/* eslint-disable no-unused-vars */
import React from "react";
import { FaCode, FaMobileAlt, FaChartLine, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";

const services = [
  {
    icon: FaCode,
    title: "Web Development",
    desc: "Custom websites built with React & Next.js. Fast, secure, and SEO-friendly.",
    tags: ["Company Profile", "E-Commerce", "Landing Page"]
  },
  {
    icon: FaMobileAlt,
    title: "App Development",
    desc: "Scalable web applications and PWA solutions for complex business needs.",
    tags: ["SaaS", "Dashboard", "Internal Tools"]
  },
  {
    icon: FaChartLine,
    title: "Business Systems",
    desc: "Digitalize your workflow with custom ERP, POS, and Inventory systems.",
    tags: ["Automation", "Data Management", "Efficiency"]
  },
  {
    icon: FaSearch,
    title: "SEO & Digital Strategy",
    desc: "Rank higher on Google and reach more local customers in Semarang & Indonesia.",
    tags: ["Local SEO", "Performance", "Analytics"]
  }
];

const Services = () => {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[800px] h-[400px] bg-blue-900/10 blur-[60px] md:blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">How I Can Help Your Business</h2>
                <p className="text-white/50 max-w-2xl mx-auto">
                    Offering end-to-end digital solutions to modernise your operations and boost your online presence.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-2xl mb-6 group-hover:scale-110 transition-transform">
                            <service.icon />
                        </div>
                        <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                        <p className="text-white/60 text-xs md:text-sm leading-relaxed mb-4">
                            {service.desc}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {service.tags.map(tag => (
                                <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-white/5 text-white/40">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
  );
};

export default Services;
