import React, { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaArrowLeft, FaClock, FaTag } from "react-icons/fa";
import { posts } from "../data/posts";
import SEO from "../components/SEO";
import LazyImage from "../components/common/LazyImage";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = useMemo(() => posts.find(p => p.id === id), [id]);

  if (!post) {
    return (
      <div className="min-h-screen pt-40 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Artikel Tidak Ditemukan</h1>
        <Link to="/blog" className="text-cyan-400 hover:underline">Kembali ke Blog</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen">
      <SEO 
        title={`${post.title} | Blog Aditya Anugrah`}
        description={post.excerpt}
        image={post.image}
      />

      {/* Header */}
      <div className="mb-12">
        <button 
          onClick={() => navigate('/blog')}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Blog
        </button>

        <div className="flex flex-wrap items-center gap-4 text-xs text-white/50 mb-6 font-mono">
            <span className="flex items-center gap-1"><FaTag className="text-cyan-400" /> {post.category}</span>
            <span className="flex items-center gap-1"><FaCalendarAlt /> {new Date(post.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span className="flex items-center gap-1"><FaClock /> 5 min read</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold font-display leading-tight mb-8">
          {post.title}
        </h1>

        <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video mb-12">
            <LazyImage src={post.image} alt={post.title} />
        </div>
      </div>

      {/* Content */}
      <article className="prose prose-invert prose-cyan max-w-none">
        <div className="text-white/80 leading-relaxed text-lg whitespace-pre-wrap">
          {post.content}
        </div>
      </article>

      {/* Footer */}
      <div className="mt-20 pt-10 border-t border-white/10">
        <div className="bg-white/5 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left transition-all hover:bg-white/10 border border-white/10">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-cyan-500/50 shrink-0">
                <img src="/assets/aa-mark-primary.png" alt="Aditya Anugrah" className="w-full h-full object-contain" />
            </div>
            <div>
                <h4 className="font-bold text-lg mb-1">Ditulis oleh Aditya Anugrah</h4>
                <p className="text-white/60 text-sm mb-4">Web Developer & Business Consultant yang berfokus pada efisiensi sistem dan transformasi digital UMKM.</p>
                <Link to="/contact" className="text-cyan-400 font-bold hover:underline">Mari berdiskusi &rarr;</Link>
            </div>
        </div>
      </div>
    </div>
  );
}
