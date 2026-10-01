import React, { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppCTA from "./components/WhatsAppCTA";
import MouseGlow from "./components/common/MouseGlow";
import PageLoader from "./components/common/PageLoader";
import VisitorCounter from "./components/VisitorCounter";
import StoreFloatingCTA from "./components/StoreFloatingCTA";

const Layout = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      window.setTimeout(() => {
        document.querySelector(location.hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
      return;
    }

    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen flex flex-col relative text-white bg-black font-sans selection:bg-cyan-500/30 overflow-x-hidden pb-24 md:pb-0">
        <MouseGlow />
        
        <div className="fixed inset-0 z-0 pointer-events-none bg-[#050814]" />
        <div className="fixed inset-0 z-0 pointer-events-none portfolio-grid-bg opacity-80" />
        <div className="fixed -left-32 top-10 z-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-[130px] pointer-events-none" />
        <div className="fixed -right-24 top-1/3 z-0 h-[30rem] w-[30rem] rounded-full bg-cyan-700/20 blur-[160px] pointer-events-none" />
        <div className="fixed inset-x-0 bottom-0 z-0 h-56 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none" />
        
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
        <VisitorCounter />
        <StoreFloatingCTA />
        <WhatsAppCTA />
    </div>
  );
};


export default Layout;

