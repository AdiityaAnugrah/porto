import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, FileText } from "lucide-react";
import { posts } from "../data/posts";
import SEO from "../components/SEO";
import LazyImage from "../components/common/LazyImage";
import { useLocalizedPath } from "../lib/i18n";
import { usePreferredLanguage } from "../lib/usePreferredLanguage";

const copy = {
  id: {
    seoTitle: "Blog | Aditya Anugrah",
    seoDescription:
      "Catatan singkat tentang web development, sistem bisnis, produk digital, dan proses membangun website yang lebih rapi.",
    badge: "Notes",
    title: "Catatan tentang web, sistem bisnis, dan produk digital.",
    body:
      "Tulisan ini menjadi pendukung portfolio: pendek, praktis, dan berhubungan dengan cara saya membangun produk digital.",
    read: "Baca artikel",
  },
  en: {
    seoTitle: "Blog | Aditya Anugrah",
    seoDescription:
      "Short notes about web development, business systems, digital products, and building cleaner websites.",
    badge: "Notes",
    title: "Notes about web, business systems, and digital products.",
    body:
      "These posts support the portfolio: concise, practical, and connected to how I build digital products.",
    read: "Read article",
  },
};

const BlogCard = ({ post, index, readLabel }) => {
  const toLocalized = useLocalizedPath();

  return (
  <motion.article
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.45, delay: index * 0.05 }}
    className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] transition-colors hover:border-cyan-300/30 hover:bg-white/[0.065]"
  >
    <Link to={toLocalized(`/blog/${post.id}`)} className="block">
      <div className="aspect-video overflow-hidden">
        <LazyImage src={post.image} alt={post.title} className="transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-white/45">
          <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 font-semibold uppercase text-cyan-100">
            {post.category}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={14} aria-hidden="true" />
            {new Date(post.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>
        <h2 className="line-clamp-2 text-xl font-bold leading-snug text-white transition-colors group-hover:text-cyan-100">
          {post.title}
        </h2>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-white/55">{post.excerpt}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-cyan-200">
          {readLabel}
          <ArrowRight size={16} aria-hidden="true" />
        </span>
      </div>
    </Link>
  </motion.article>
  );
};

export default function Blog() {
  const { language } = usePreferredLanguage();
  const t = copy[language] || copy.en;
  const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="min-h-screen px-4 pb-24 pt-24 sm:px-6 md:pb-32 md:pt-28">
      <SEO title={t.seoTitle} description={t.seoDescription} path="/blog" />

      <div className="mx-auto max-w-7xl">
        <header className="mb-10 border-b border-white/10 pb-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-white/[0.055] px-4 py-2 text-sm text-cyan-100">
            <FileText size={16} aria-hidden="true" />
            {t.badge}
          </div>
          <h1 className="max-w-4xl text-3xl font-bold leading-tight text-white sm:text-4xl md:text-6xl">
            {t.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/62 md:text-lg">{t.body}</p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedPosts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} readLabel={t.read} />
          ))}
        </div>
      </div>
    </div>
  );
}
