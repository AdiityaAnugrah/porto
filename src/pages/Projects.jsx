/* eslint-disable no-unused-vars */
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "../components/projects/ProjectCard";
import SEO from "../components/SEO";
import { projects } from "../data/projects";

const Projects = () => {
  const CATEGORIES = ["All", "Web Apps", "Mobile Apps", "Landing Pages"];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="pt-24 pb-32 px-6 max-w-7xl mx-auto min-h-screen">
      <SEO 
        title="Works | Aditya Anugrah" 
        description="Explore my latest web development projects, ranging from e-commerce platforms to creative landing pages."
      />

      <div className="mb-12">
        <h1 className="text-5xl md:text-7xl font-bold font-display mb-6">
          Selected <span className="text-gradient">Works</span>
        </h1>
        <p className="text-white/60 max-w-xl text-lg">
          A collection of projects where design meets code. 
          Focusing on performance, accessibility, and user experience.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-4 mb-16">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full border transition-all duration-300 ${
              activeCategory === cat
                ? "bg-white text-black border-white"
                : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
      >
        <AnimatePresence>
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Projects;
