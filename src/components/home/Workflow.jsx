/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { FaRegComments, FaCode, FaRocket } from "react-icons/fa";

const steps = [
  {
    icon: FaRegComments,
    title: "1. Discovery & Strategy",
    desc: "We don't just write code. We analyze your business goals, target audience, and competitors to build a solution that actually solves problems.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20"
  },
  {
    icon: FaCode,
    title: "2. Agile Development",
    desc: "Transparent progress. You get regular updates and demos. We build scalable systems with modern tech stacks (React, Next.js, Cloud).",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/20"
  },
  {
    icon: FaRocket,
    title: "3. Launch & Growth",
    desc: "Deployment is just the beginning. I ensure your site is fast, secure, and SEO-optimized so you can start getting traffic immediately.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20"
  }
];

const Workflow = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
                    Why <span className="text-gradient">Choose Me?</span>
                </h2>
                <p className="text-white/50 max-w-2xl mx-auto">
                    I work as your strategic technical partner, not just a freelancer. 
                    Here is how I ensure your project succeeds.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2, duration: 0.6 }}
                        className={`p-8 rounded-3xl border ${step.border} bg-white/5 backdrop-blur-sm hover:translate-y-[-5px] transition-transform duration-300 relative group`}
                    >
                        <div className={`w-14 h-14 rounded-2xl ${step.bg} ${step.color} flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform`}>
                            <step.icon />
                        </div>
                        <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                        <p className="text-white/60 leading-relaxed text-sm">
                            {step.desc}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
  );
};

export default Workflow;
