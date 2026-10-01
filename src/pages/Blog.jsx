import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import ArchivePage from "../components/archive/ArchivePage";
import { posts } from "../data/posts";
import { useLocalizedPath } from "../lib/i18n";

const Blog = () => {
  const toLocalized = useLocalizedPath();
  const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <>
      <SEO title="Notes | Aditya Anugrah" description="Catatan tentang website, sistem, bisnis digital, dan performa." />
      <ArchivePage eyebrow="Notes archive" title="Notes" subtitle="Tulisan dibuat ringkas seperti katalog arsip. Pilih topik yang ingin dibaca tanpa distraksi.">
        <div className="space-y-3">
          {sortedPosts.map((post, index) => (
            <Link key={post.id} to={toLocalized(`/blog/${post.id}`)} className="archive-row group">
              <span className="font-display text-4xl font-black text-cyan-200/45">{String(index + 1).padStart(2, "0")}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-200/45">{post.category} / {post.date}</p>
                <h2 className="mt-1 text-xl font-black uppercase tracking-[-0.03em] text-white group-hover:text-cyan-100 sm:text-3xl">{post.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm leading-7 text-slate-300">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </ArchivePage>
    </>
  );
};

export default Blog;
