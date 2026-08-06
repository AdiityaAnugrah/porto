import { useEffect, useState } from "react";
import { FaExternalLinkAlt, FaGamepad, FaUser } from "react-icons/fa";
import { Alert, AlertDescription, AlertTitle } from "../ui/8bit-alert";
import { apiUrl } from "../../lib/api";

const API_URL = apiUrl("/pubg/steam/player/BOKONG_BASAH");
const OPGG_URL = "https://pubg.op.gg/user/BOKONG_BASAH";
const REQUEST_TIMEOUT = 8000;

export default function PubgCard() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    fetch(API_URL, { signal: controller.signal })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Failed to load PUBG data");
        return json;
      })
      .then((json) => {
        if (!active) return;
        setData(json);
        setErr(null);
      })
      .catch((e) => {
        if (!active) return;
        setErr(e.name === "AbortError" ? "PUBG API timeout" : e.message);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
        window.clearTimeout(timeoutId);
      });

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  if (loading) {
    return (
      <div className="glass-panel rounded-2xl p-5 animate-pulse space-y-4 min-h-[220px]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10" />
          <div className="space-y-2 flex-1">
            <div className="h-2.5 w-24 bg-white/10 rounded" />
            <div className="h-2 w-36 bg-white/5 rounded" />
          </div>
          <div className="h-6 w-14 bg-white/5 rounded-full" />
        </div>
        <div className="h-16 bg-white/5 rounded-xl" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-white/5 rounded-lg" />
          ))}
        </div>
        <div className="h-9 bg-white/5 rounded-xl" />
      </div>
    );
  }

  if (err) {
    return (
      <div className="glass-panel rounded-2xl p-5 border border-orange-500/20 min-h-[220px] flex flex-col justify-between">
        <Alert variant="warning">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-orange-200/25 bg-orange-400/10 text-orange-100">
              <FaGamepad aria-hidden="true" />
            </div>
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-widest text-orange-100/70 font-mono">PUBG Profile</p>
              <AlertTitle>Data sementara tidak tersedia</AlertTitle>
              <AlertDescription>
                <p>Statistik PUBG gagal dimuat dari backend. Profil tetap bisa dicek langsung lewat OP.GG.</p>
                <p className="font-mono text-[10px] text-orange-50/40">{err}</p>
              </AlertDescription>
            </div>
          </div>
        </Alert>
        <a
          href={OPGG_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Buka profil PUBG di OP.GG"
          className="mt-5 inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 hover:border-orange-500/40 text-orange-300 hover:text-orange-200 text-[11px] font-mono uppercase tracking-widest transition-colors"
        >
          Lihat OP.GG <FaExternalLinkAlt className="text-[10px]" aria-hidden="true" />
        </a>
      </div>
    );
  }

  const playerName = data?.ign || "BOKONG_BASAH";
  const platform = data?.platform || "Steam";
  const recentMatches = data?.recentMatchIds?.length ?? 0;

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-yellow-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="glass-panel rounded-2xl overflow-hidden relative border border-white/10 group-hover:border-orange-400/30 transition-colors duration-300">
        <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-orange-500/20 flex-shrink-0">
            <FaGamepad className="text-black/80" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Game Favorit</p>
            <h3 className="text-sm font-bold text-white leading-tight">PUBG: Battlegrounds</h3>
          </div>
          <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" aria-hidden="true" />
            <span className="text-[10px] text-orange-400 font-mono uppercase tracking-wider">Live</span>
          </div>
        </div>

        <div className="mx-5 mt-4 flex items-center gap-3 bg-gradient-to-r from-orange-500/10 via-yellow-500/5 to-transparent border border-orange-500/20 rounded-xl px-4 py-3">
          <div className="w-10 h-10 rounded-lg bg-black/20 border border-orange-500/15 flex items-center justify-center text-orange-300 flex-shrink-0">
            <FaUser aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-base tracking-wide truncate">{playerName}</p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-[9px] font-mono uppercase tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 rounded">
                {platform}
              </span>
              <span className="text-[10px] text-white/30 font-mono">
                {recentMatches} pertandingan terakhir
              </span>
            </div>
          </div>
          <a
            href={OPGG_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Buka profil PUBG di OP.GG"
            className="flex-shrink-0 text-[10px] font-mono text-orange-400/70 hover:text-orange-400 bg-orange-500/5 hover:bg-orange-500/10 border border-orange-500/15 hover:border-orange-500/30 px-2.5 py-1.5 rounded-lg transition-all duration-200"
          >
            OP.GG <FaExternalLinkAlt className="inline text-[9px] ml-1" aria-hidden="true" />
          </a>
        </div>

        <div className="px-5 pb-5 pt-3">
          <a
            href={OPGG_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Lihat profil PUBG di OP.GG"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500/15 to-yellow-500/10 border border-orange-500/20 hover:border-orange-500/40 hover:from-orange-500/25 hover:to-yellow-500/15 text-orange-300 hover:text-orange-200 text-[11px] font-mono uppercase tracking-widest transition-all duration-300 group/cta"
          >
            <span>Lihat PUBG OP.GG</span>
            <FaExternalLinkAlt className="text-[10px] translate-x-0 group-hover/cta:translate-x-1 transition-transform duration-200" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
