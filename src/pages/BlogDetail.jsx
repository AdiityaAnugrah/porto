import React, { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, Tag } from "lucide-react";
import { posts } from "../data/posts";
import SEO from "../components/SEO";
import LazyImage from "../components/common/LazyImage";
import { r2Image } from "../lib/media";
import { useLocalizedPath } from "../lib/i18n";
import { usePreferredLanguage } from "../lib/usePreferredLanguage";

const copy = {
  id: {
    back: "Kembali ke Blog",
    readTime: "5 menit baca",
    notFound: "Artikel tidak ditemukan",
    authorBody: "Saya menulis catatan praktis tentang web, sistem bisnis, dan produk digital.",
    discuss: "Diskusi project",
    related: "Artikel terkait",
  },
  en: {
    back: "Back to Blog",
    readTime: "5 min read",
    notFound: "Article not found",
    authorBody: "I write practical notes about web, business systems, and digital products.",
    discuss: "Discuss a project",
    related: "Related articles",
  },
};

export default function BlogDetail() {
  const { language } = usePreferredLanguage();
  const toLocalized = useLocalizedPath();
  const t = copy[language] || copy.en;
  const { id } = useParams();
  const navigate = useNavigate();
  const post = useMemo(() => posts.find((item) => item.id === id), [id]);
  const authorMark = r2Image("brand/aa-mark-primary.png", "/assets/aa-mark-primary.png");

  useEffect(() => {
    let triggered = false;
    const handleScroll = () => {
      if (triggered || !post) return;
      const root = document.documentElement;
      const body = document.body;
      const scrollTop = root.scrollTop || body.scrollTop;
      const scrollHeight = (root.scrollHeight || body.scrollHeight) - root.clientHeight;
      const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

      if (percent > 75) {
        triggered = true;
        if (typeof window.gtag === "function") {
          window.gtag("event", "blog_read_complete", {
            event_category: "Engagement",
            event_label: post.title,
            value: 75,
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [post]);

  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return posts.filter((item) => item.category === post.category && item.id !== post.id).slice(0, 2);
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen px-4 pt-40 text-center sm:px-6">
        <h1 className="mb-4 text-4xl font-bold text-white">{t.notFound}</h1>
        <Link to={toLocalized("/blog")} className="text-cyan-300 hover:text-cyan-200">
          {t.back}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pb-24 pt-24 sm:px-6 md:pb-32 md:pt-28">
      <SEO title={`${post.title} | Blog Aditya Anugrah`} description={post.excerpt} image={post.image} />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-4xl"
      >
        <button
          type="button"
          onClick={() => navigate(toLocalized("/blog"))}
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-white/52 transition-colors hover:text-white"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          {t.back}
        </button>

        <header>
          <div className="mb-5 flex flex-wrap items-center gap-3 text-xs text-white/48">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 font-semibold uppercase text-cyan-100">
              <Tag size={13} aria-hidden="true" />
              {post.category}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={14} aria-hidden="true" />
              {new Date(post.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 size={14} aria-hidden="true" />
              {t.readTime}
            </span>
          </div>

          <h1 className="text-3xl font-bold leading-tight text-white md:text-5xl">{post.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-white/62 md:text-lg">{post.excerpt}</p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
            <div className="aspect-video">
              <LazyImage src={post.image} alt={post.title} />
            </div>
          </div>
        </header>

        <article className="mt-10 rounded-3xl border border-white/10 bg-white/[0.035] p-5 md:p-8">
          <div className="whitespace-pre-wrap text-base leading-8 text-white/76 md:text-lg">
            {post.content}
          </div>
        </article>

        <section className="mt-12 rounded-3xl border border-white/10 bg-white/[0.045] p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-cyan-300/20 bg-black/30">
              <img src={authorMark} alt="Aditya Anugrah" className="h-full w-full object-contain" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">Aditya Anugrah</h2>
              <p className="mt-2 text-sm leading-6 text-white/58">{t.authorBody}</p>
            </div>
            <Link
              to={toLocalized("/contact")}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cyan-100 px-5 font-bold text-black transition-colors hover:bg-white"
            >
              {t.discuss}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>

        {relatedPosts.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-5 text-2xl font-bold text-white">{t.related}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {relatedPosts.map((item) => (
                <Link
                  key={item.id}
                  to={toLocalized(`/blog/${item.id}`)}
                  className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 transition-colors hover:border-cyan-300/30 hover:bg-white/[0.065]"
                >
                  <p className="text-xs font-semibold uppercase text-cyan-200/70">{item.category}</p>
                  <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-white">{item.title}</h3>
                  <p className="mt-3 text-xs text-white/42">
                    {new Date(item.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </motion.div>
    </div>
  );
}
