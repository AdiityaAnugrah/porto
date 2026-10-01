import React from "react";
import { Link, useParams } from "react-router-dom";
import SEO from "../components/SEO";
import ArchivePage from "../components/archive/ArchivePage";
import { posts } from "../data/posts";
import { useLocalizedPath } from "../lib/i18n";

const renderContent = (content = "") => content.trim().split("\n").filter(Boolean).map((line, index) => {
  const clean = line.trim();
  if (clean.startsWith("###")) return <h2 key={index} className="mt-7 text-2xl font-black uppercase tracking-[-0.03em] text-white">{clean.replace(/^###\s*/, "")}</h2>;
  if (clean.startsWith("- ")) return <li key={index} className="ml-5 list-disc text-slate-300">{clean.replace(/^-\s*/, "")}</li>;
  return <p key={index} className="text-base leading-8 text-slate-300">{clean}</p>;
});

const BlogDetail = () => {
  const { id } = useParams();
  const toLocalized = useLocalizedPath();
  const post = posts.find((item) => item.id === id) || posts[0];

  return (
    <>
      <SEO title={`${post.title} | Notes`} description={post.excerpt} image={post.image} type="article" />
      <ArchivePage eyebrow={`${post.category} / ${post.date}`} title="Read" subtitle={post.title} backTo="/blog" contentClassName="lg:min-h-[66svh]">
        <article className="space-y-5">
          <div className="overflow-hidden rounded-[1.5rem] border border-cyan-100/10 bg-black/30">
            <img src={post.image} alt={post.title} className="h-56 w-full object-cover opacity-75" loading="lazy" />
          </div>
          <p className="text-lg leading-8 text-cyan-50">{post.excerpt}</p>
          <div className="space-y-4">{renderContent(post.content)}</div>
          <Link to={toLocalized("/blog")} className="archive-btn">← Back to notes</Link>
        </article>
      </ArchivePage>
    </>
  );
};

export default BlogDetail;
