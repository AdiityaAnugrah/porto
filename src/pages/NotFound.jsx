import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden text-center px-6">
      <SEO title="Page Not Found | Aditya Anugrah" />
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-black to-black" />

      <h1 className="text-8xl md:text-9xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 mb-4 select-none animate-pulse">
        404
      </h1>

      <p className="text-xl text-white/50 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>

      <Link 
        to="/" 
        className="px-8 py-3 rounded-full bg-cyan-500 text-white font-bold hover:bg-cyan-400 transition-all hover:scale-105 flex items-center gap-2"
      >
        <span>Back to Home</span>
        <span className="text-xl">&rarr;</span>
      </Link>
    </div>
  );
};

export default NotFound;
