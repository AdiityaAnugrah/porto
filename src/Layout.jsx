import React, { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppCTA from "./components/WhatsAppCTA";
import MouseGlow from "./components/common/MouseGlow";
import PageLoader from "./components/common/PageLoader";

const Layout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col relative text-white bg-black font-sans selection:bg-cyan-500/30 overflow-x-hidden pb-24 md:pb-0">
        <MouseGlow />
        
        {/* Premium Background Gradient */}
        <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black opacity-80" />
        
        {/* Navbar is fixed/sticky inside itself, so we just render it */}
        <Navbar />
        
        <main className="flex-grow z-10 w-full relative">
            <AnimatePresence mode="wait">
                <Suspense fallback={<PageLoader />}>
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="w-full"
                    >
                        <Outlet />
                    </motion.div>
                </Suspense>
            </AnimatePresence>
        </main>

        <Footer />
        <WhatsAppCTA />
    </div>
  );
};


export default Layout;

