import React, { useEffect, useState } from "react";
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
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/45">
      <Eye size={14} aria-hidden="true" />
      <span>Dilihat oleh: {formatCount(count)} orang</span>
    </div>
  );
};

export default VisitorCounter;
