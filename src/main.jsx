import React, { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// Register Service Worker for Instant Subsequent Loads
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js?v=20260626-store-fix').catch(err => {
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
import LocaleGate from "./components/LocaleGate.jsx";
import LocaleRedirect from "./components/LocaleRedirect.jsx";

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
const Privacy = lazy(() => import("./pages/Privacy.jsx"));
const Terms = lazy(() => import("./pages/Terms.jsx"));
const Store = lazy(() => import("./pages/Store.jsx"));
const StoreOrder = lazy(() => import("./pages/StoreOrder.jsx"));
const StoreAdmin = lazy(() => import("./pages/StoreAdmin.jsx"));
const Invoice = lazy(() => import("./pages/Invoice.jsx"));


createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Layout />}>
          {/* Legacy URLs redirect to the preferred localized URL. */}
          <Route index element={<LocaleRedirect to="/" />} />
          <Route path="about" element={<LocaleRedirect to="/about" />} />
          <Route path="cv" element={<LocaleRedirect to="/cv" />} />
          <Route path="contact" element={<LocaleRedirect to="/contact" />} />
          <Route path="invoice" element={<LocaleRedirect to="/invoice" />} />
          <Route path="privacy" element={<LocaleRedirect to="/privacy" />} />
          <Route path="terms" element={<LocaleRedirect to="/terms" />} />

          <Route path="projects">
              <Route index element={<LocaleRedirect to="/projects" />} />
              <Route path="web" element={<LocaleRedirect to="/projects/web" />} />
              <Route path="mobile" element={<LocaleRedirect to="/projects/mobile" />} />
              <Route path="landing" element={<LocaleRedirect to="/projects/landing" />} />
              <Route path="item/:id" element={<LocaleRedirect to={null} />} />
          </Route>

          <Route path="store">
              <Route index element={<LocaleRedirect to="/store" />} />
              <Route path="order/:ref" element={<LocaleRedirect to={null} />} />
              <Route path="admin" element={<LocaleRedirect to="/store/admin" />} />
          </Route>

          <Route path="blog">
              <Route index element={<LocaleRedirect to="/blog" />} />
              <Route path=":id" element={<LocaleRedirect to={null} />} />
          </Route>

          <Route path=":locale" element={<LocaleGate />}>
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
          <Route path="invoice" element={<Invoice />} />

          {/* Store */}
          <Route path="store">
              <Route index element={<Store />} />
              <Route path="order/:ref" element={<StoreOrder />} />
              <Route path="admin" element={<StoreAdmin />} />
          </Route>

          {/* Legal */}
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />

          {/* Blog */}
          <Route path="blog">
              <Route index element={<Blog />} />
              <Route path=":id" element={<BlogDetail />} />
          </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
          </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

