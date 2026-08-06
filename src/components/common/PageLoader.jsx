import React from "react";
import TetrisLoading from "../ui/tetris-loader";

const PageLoader = ({ text = "Loading..." }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#090806] px-6 text-white">
    <div className="relative">
      <div className="absolute inset-0 -m-8 bg-cyan-300/8 blur-3xl" />
      <div className="relative rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/40">
        <TetrisLoading size="md" speed="fast" loadingText={text} />
      </div>
    </div>
  </div>
);

export default PageLoader;
