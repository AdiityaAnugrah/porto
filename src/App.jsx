import React from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="app-shell">
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
