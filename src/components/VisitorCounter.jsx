import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { apiUrl } from "../lib/api";

const STORAGE_KEY = "aditya_visitor_id";

const getVisitorId = () => {
  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;

    const nextId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    window.localStorage.setItem(STORAGE_KEY, nextId);
    return nextId;
  } catch {
    return "";
  }
};

const formatCount = (value) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(Number(value || 0));

const VisitorCounter = () => {
  const [count, setCount] = useState(null);

  useEffect(() => {
    let active = true;

    fetch(apiUrl("/analytics/view"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorId: getVisitorId(),
        path: window.location.pathname,
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Counter unavailable");
        return response.json();
      })
      .then((data) => {
        if (active) setCount(data.uniqueVisitors || data.totalViews || 0);
      })
      .catch(() => {
        if (active) setCount(null);
      });

    return () => {
      active = false;
    };
  }, []);

  if (count === null) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.35, ease: "easeOut" }}
      className="fixed bottom-24 left-4 z-50 sm:left-6 md:bottom-6"
    >
      <div className="group relative overflow-hidden rounded-full border border-cyan-200/20 bg-[#0d0b08]/86 px-4 py-3 text-white shadow-[0_14px_45px_rgba(0,0,0,0.42)] backdrop-blur-xl transition-colors hover:border-cyan-200/35 hover:bg-[#11100d]/92">
        <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/50 to-transparent" />
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-black shadow-[0_0_26px_rgba(234,223,201,0.18)]">
            <Eye size={17} aria-hidden="true" />
            <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#0d0b08] bg-emerald-300" />
          </div>
          <div className="leading-tight">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-100/62">
              Dilihat oleh
            </p>
            <p className="text-sm font-bold text-white">
              {formatCount(count)} orang
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VisitorCounter;
