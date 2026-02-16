import React, { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// Register Service Worker for Instant Subsequent Loads
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.log('SW registration failed: ', err);
    });
  });
}
// Smooth Scroll
import Lenis from "lenis";

// Initialize Lenis globally
if (typeof window !== "undefined") {
  new Lenis({
    autoRaf: true,
  });
}

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout.jsx";
import PageLoader from "./components/common/PageLoader.jsx";

// Lazy Load Pages for Performance
const Home = lazy(() => import("./pages/Home.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const Projects = lazy(() => import("./pages/Projects.jsx"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const CV = lazy(() => import("./pages/CV.jsx"));
const Blog = lazy(() => import("./pages/Blog.jsx"));
const BlogDetail = lazy(() => import("./pages/BlogDetail.jsx"));


createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Layout />}>
          {/* Home */}
          <Route index element={<Home />} />

          {/* About */}
          <Route path="about" element={<About />} />
          {/* CV */}
          <Route path="cv" element={<CV />} />

          {/* Projects */}
          <Route path="projects">
              <Route index element={<Projects />} />
              <Route path="web" element={<Projects />} />
              <Route path="mobile" element={<Projects />} />
              <Route path="landing" element={<Projects />} />
              <Route path="item/:id" element={<ProjectDetail />} />
          </Route>

          {/* Contact */}
          <Route path="contact" element={<Contact />} />

          {/* Blog */}
          <Route path="blog">
              <Route index element={<Blog />} />
              <Route path=":id" element={<BlogDetail />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
          </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

