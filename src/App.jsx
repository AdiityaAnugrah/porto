import React from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="app-shell">
      {/* FX latar global (elegan & ringan) */}
      <div className="app-fx" aria-hidden="true">
        <div className="app-fx__aurora">
          <span className="a a1" />
          <span className="a a2" />
          <span className="a a3" />
        </div>
        <div className="app-fx__grid" />
        <span className="app-fx__orb o1" />
        <span className="app-fx__orb o2" />
      </div>

      <Navbar />

      {/* Jangan hardcode background di sini */}
      <main className="main-content" role="main">
        <Outlet />
      </main>

      <div className="footer-desktop">
        <Footer />
      </div>
    </div>
  );
}
