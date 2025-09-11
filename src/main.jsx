import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Pages
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import NotFond from "./pages/NotFond.jsx";

// Projects
import Projects from "./pages/Projects.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";

import Contact from "./pages/Contact.jsx";
import CV from "./pages/CV.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          {/* Home */}
          <Route index element={<Home />} />

          {/* About */}
          <Route path="about" element={<About />} />
          {/* CV */}
          <Route path="cv" element={<CV />} />

          {/* Projects:
              /projects             -> semua project
              /projects/web         -> kategori "Web Apps"
              /projects/mobile      -> kategori "Mobile Apps"
              /projects/landing     -> kategori "Landing Pages"
              /projects/item/:id    -> halaman detail project */}
          <Route path="projects">
            <Route index element={<Projects />} />
            <Route path="web" element={<Projects />} />
            <Route path="mobile" element={<Projects />} />
            <Route path="landing" element={<Projects />} />
            <Route path="item/:id" element={<ProjectDetail />} />
          </Route>

            {/* Contact */}
            <Route path="contact" element={<Contact />} />

          {/* 404 */}
          <Route path="*" element={<NotFond />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
