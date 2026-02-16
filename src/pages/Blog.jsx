import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import { posts } from "../data/posts";
import SEO from "../components/SEO";
import LazyImage from "../components/common/LazyImage";

const BlogCard = ({ post, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-colors"
  >
    <Link to={`/blog/${post.id}`} className="block">
      <div className="aspect-video overflow-hidden">
        <LazyImage 
          src={post.image} 
          alt={post.title} 
          className="group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-4 text-xs text-white/50 mb-3">
          <span className="px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-wider font-bold">
            {post.category}
          </span>
          <span className="flex items-center gap-1">
            <FaCalendarAlt /> {new Date(post.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
        <h2 className="text-xl font-bold mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2">
          {post.title}
        </h2>
        <p className="text-white/60 text-sm mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        <span className="inline-flex items-center gap-2 text-white font-bold group-hover:gap-3 transition-all">
          Baca Selengkapnya <FaArrowRight className="text-cyan-400" />
        </span>
      </div>
    </Link>
  </motion.div>
);

export default function Blog() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <SEO 
        title="Blog & Insights | Aditya Anugrah"
        description="Artikel seputar strategi bisnis, pengembangan software, dan optimasi digital untuk UMKM dan Profesional."
      />

      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold font-display mb-4"
        >
          Blog & <span className="text-gradient">Insights</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/60 max-w-2xl mx-auto"
        >
          Berbagi pemikiran tentang teknologi, efisiensi bisnis, dan cara membangun produk digital yang berdampak nyata.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...posts].reverse().map((post, index) => (
          <BlogCard key={post.id} post={post} index={index} />
        ))}
      </div>
    </div>
  );
}
