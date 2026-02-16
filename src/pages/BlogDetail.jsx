import React, { useMemo, useEffect } from "react";
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
  
  // Logic Artikel Terkait: Cari kategori yang sama, maksimal 2 artikel
  const relatedPosts = useMemo(() => {
    return posts
      .filter(p => p.category === post?.category && p.id !== post?.id)
      .slice(0, 2);
  }, [post]);

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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-12">
            <button 
                onClick={() => navigate('/blog')}
                className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 group"
            >
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Blog
            </button>

            <div className="flex flex-wrap items-center gap-4 text-xs text-white/50 mb-6 font-mono">
                <span className="flex items-center gap-1 uppercase tracking-tighter bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20">
                    <FaTag className="text-xs" /> {post.category}
                </span>
                <span className="flex items-center gap-1"><FaCalendarAlt /> {new Date(post.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span className="flex items-center gap-1"><FaClock /> 5 min read</span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-display leading-[1.1] mb-8 text-white">
                {post.title}
            </h1>

            <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video mb-12 shadow-2xl">
                <LazyImage src={post.image} alt={post.title} />
            </div>
        </div>

        {/* Content */}
        <article className="prose prose-invert prose-cyan max-w-none">
            <div className="text-white/80 leading-[1.8] text-lg md:text-xl whitespace-pre-wrap font-sans tracking-wide">
                {post.content}
            </div>
        </article>

        {/* Author Footer */}
        <div className="mt-20 pt-10 border-t border-white/10">
            <div className="bg-white/5 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 text-center md:text-left transition-all hover:bg-white/10 border border-white/10 group">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-cyan-500/50 shrink-0 relative z-10">
                        <img src="/assets/aa-mark-primary.png" alt="Aditya Anugrah" className="w-full h-full object-contain" />
                    </div>
                    <div className="absolute inset-0 bg-cyan-500/30 blur-2xl rounded-full scale-75 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                    <h4 className="font-bold text-xl mb-1 text-white">Aditya Anugrah</h4>
                    <p className="text-white/60 text-base mb-4 max-w-md">Web Developer & Business Consultant yang berfokus pada efisiensi sistem dan transformasi digital UMKM.</p>
                    <Link to="/contact" className="inline-flex items-center gap-2 text-cyan-400 font-bold hover:text-cyan-300 transition-colors">
                        Mari berdiskusi proyek Anda &rarr;
                    </Link>
                </div>
            </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
            <div className="mt-20">
                <h3 className="text-2xl font-bold mb-8 font-display">Artikel <span className="text-gradient">Terkait</span></h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {relatedPosts.map(rp => (
                        <Link 
                            key={rp.id} 
                            to={`/blog/${rp.id}`}
                            className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all block"
                        >
                            <div className="text-xs text-cyan-400 font-bold mb-2 uppercase tracking-widest">{rp.category}</div>
                            <h4 className="font-bold group-hover:text-cyan-400 transition-colors line-clamp-2 mb-2">{rp.title}</h4>
                            <div className="text-xs text-white/40 flex items-center gap-1">
                                <FaCalendarAlt /> {new Date(rp.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        )}
      </motion.div>
    </div>
  );
}
