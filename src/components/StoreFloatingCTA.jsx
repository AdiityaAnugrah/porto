import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, ShoppingBag, Sparkles } from "lucide-react";
import { stripLocaleFromPath, useActiveLocale, useLocalizedPath } from "../lib/i18n";

const pulseTransition = {
  duration: 2.8,
  repeat: Infinity,
  ease: "easeInOut",
};

const ctaCopy = {
  id: {
    ariaLabel: "Buka store digital",
    eyebrow: "Digital Store",
    title: "Produk siap beli",
    description: "Klik untuk lihat katalog dan order.",
  },
  en: {
    ariaLabel: "Open digital store",
    eyebrow: "Digital Store",
    title: "Ready-to-buy products",
    description: "Tap to browse the catalog and place an order.",
  },
};

export default function StoreFloatingCTA() {
  const location = useLocation();
  const locale = useActiveLocale();
  const toLocalized = useLocalizedPath();
  const cleanPath = stripLocaleFromPath(location.pathname);
  const copy = ctaCopy[locale] || ctaCopy.en;

  if (cleanPath.startsWith("/store")) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: 0.65, duration: 0.45, ease: "easeOut" }}
      className="fixed bottom-28 right-4 z-50 md:bottom-24 md:right-6"
    >
      <motion.div
        animate={{
          boxShadow: [
            "0 20px 45px rgba(22, 163, 74, 0.18)",
            "0 26px 55px rgba(249, 115, 22, 0.22)",
            "0 20px 45px rgba(22, 163, 74, 0.18)",
          ],
        }}
        transition={pulseTransition}
        className="relative overflow-hidden rounded-[28px] border border-white/12 bg-[linear-gradient(135deg,rgba(22,163,74,0.92),rgba(249,115,22,0.9))] p-px backdrop-blur-xl"
      >
        <motion.div
          aria-hidden="true"
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-white/12 blur-xl"
        />

        <Link
          to={toLocalized("/store")}
          className="group flex min-w-[200px] items-center gap-3 rounded-[27px] bg-[#120f0d]/86 px-4 py-3 text-white transition-transform duration-300 hover:-translate-y-0.5"
          aria-label={copy.ariaLabel}
        >
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/14">
            <motion.div
              aria-hidden="true"
              animate={{ scale: [1, 1.15, 1] }}
              transition={pulseTransition}
              className="absolute inset-0 rounded-2xl border border-white/20"
            />
            <ShoppingBag className="h-6 w-6" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{copy.eyebrow}</span>
            </div>
            <p className="mt-1 text-sm font-semibold leading-tight text-white">
              {copy.title}
            </p>
            <p className="text-xs text-white/72">
              {copy.description}
            </p>
          </div>

          <motion.div
            whileHover={{ x: 2, y: -2 }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10"
          >
            <ArrowUpRight className="h-4.5 w-4.5" />
          </motion.div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
