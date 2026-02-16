import React, { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { FaArrowLeft, FaExpand, FaExternalLinkAlt, FaTimes } from "react-icons/fa";

const DRIVE_FILE_ID = "1M66SJlH_9zlT4EePbq-VrYYxctgjua9M";
const PREVIEW_URL = `https://drive.google.com/file/d/${DRIVE_FILE_ID}/preview`;
const VIEW_URL = `https://drive.google.com/file/d/${DRIVE_FILE_ID}/view?usp=sharing`;

export default function CV() {
  const [loaded, setLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="pt-24 pb-32 px-6 max-w-5xl mx-auto min-h-screen">
      <SEO
        title="CV | Aditya Anugrah"
        description="Curriculum Vitae of Aditya Anugrah."
      />

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
            <Link to="/about" className="text-white/50 hover:text-white flex items-center gap-2 mb-2 transition-colors">
                <FaArrowLeft /> Back to About
            </Link>
            <h1 className="text-3xl font-bold font-display">Curriculum Vitae</h1>
        </div>
        
        <div className="flex gap-4">
            <button 
                onClick={() => setModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center gap-2 transition-colors"
            >
                <FaExpand /> Fullscreen
            </button>
            <a 
                href={VIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-2 transition-colors"
            >
                Open in Drive <FaExternalLinkAlt className="text-sm" />
            </a>
        </div>
      </div>

      <div className="w-full aspect-[1/1.4] md:aspect-[16/9] bg-white/5 rounded-2xl overflow-hidden border border-white/10 relative">
        {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-cyan-500 rounded-full animate-spin" />
            </div>
        )}
        <iframe
            src={PREVIEW_URL}
            className="w-full h-full"
            onLoad={() => setLoaded(true)}
            allow="autoplay"
        />
      </div>

      {/* Modal Overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
            <button 
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                aria-label="Close"
            >
                <FaTimes />
            </button>
            
            <div className="w-full h-full max-w-6xl bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                <iframe
                    src={PREVIEW_URL}
                    className="w-full h-full"
                    allow="autoplay"
                />
            </div>
        </div>
      )}
    </div>
  );
}
