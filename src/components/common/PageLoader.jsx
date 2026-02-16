import React from "react";

const PageLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white">
    <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
        <p className="text-sm font-mono animate-pulse">Loading...</p>
    </div>
  </div>
);

export default PageLoader;
