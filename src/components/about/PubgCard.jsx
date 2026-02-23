import { useEffect, useState } from "react";

const API_URL = "https://api.beliakun.com/pubg/steam/player/BOKONG_BASAH";
const OPGG_URL = "https://pubg.op.gg/user/BOKONG_BASAH";

/* ── Map colour palette ── */
const MAP_COLORS = [
  "from-emerald-500/20 to-green-500/10 border-emerald-500/20",
  "from-orange-500/20 to-amber-500/10 border-orange-500/20",
  "from-sky-500/20 to-blue-500/10 border-sky-500/20",
  "from-purple-500/20 to-violet-500/10 border-purple-500/20",
  "from-rose-500/20 to-pink-500/10 border-rose-500/20",
];

/* Shorten UUID to a readable Match ID */
const shortId = (id) => id.split("-")[0].toUpperCase();

/* Simulate "X hours ago" labels */
const AGO_LABELS = ["1h ago", "3h ago", "5h ago", "Yesterday", "2d ago", "3d ago", "4d ago", "5d ago", "6d ago", "7d ago"];

export default function PubgCard() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Failed to load PUBG data");
        return json;
      })
      .then((json) => { setData(json); setLoading(false); })
      .catch((e) => { setErr(e.message); setLoading(false); });
  }, []);

  /* ── Skeleton ── */
  if (loading) {
    return (
      <div className="glass-panel rounded-2xl p-5 animate-pulse space-y-4">
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
          {[1, 2, 3].map(i => <div key={i} className="h-10 bg-white/5 rounded-lg" />)}
        </div>
        <div className="h-9 bg-white/5 rounded-xl" />
      </div>
    );
  }

  /* ── Error ── */
  if (err) {
    return (
      <div className="glass-panel rounded-2xl p-5 border border-red-500/20">
        <div className="flex items-center gap-2 text-red-400 text-sm font-mono">
          <span>⚠</span><span>Gagal memuat data PUBG</span>
        </div>
        <p className="text-white/30 text-xs mt-1 font-mono">{err}</p>
      </div>
    );
  }

  const matches = (data.recentMatchIds ?? []).slice(0, 5);

  return (
    <div className="relative group">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-yellow-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="glass-panel rounded-2xl overflow-hidden relative border border-white/10 group-hover:border-orange-400/30 transition-colors duration-300">

        {/* ── Top bar ── */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-orange-500/20 flex-shrink-0">
            <span className="text-lg leading-none">🎮</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Favorite Game</p>
            <h3 className="text-sm font-bold text-white leading-tight">PUBG: Battlegrounds</h3>
          </div>
          <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-[10px] text-orange-400 font-mono uppercase tracking-wider">Live</span>
          </div>
        </div>

        {/* ── Player banner ── */}
        <div className="mx-5 mt-4 flex items-center gap-3 bg-gradient-to-r from-orange-500/10 via-yellow-500/5 to-transparent border border-orange-500/20 rounded-xl px-4 py-3">
          <span className="text-2xl leading-none flex-shrink-0">🪖</span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-base tracking-wide truncate">{data.ign}</p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-[9px] font-mono uppercase tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 rounded">
                {data.platform}
              </span>
              <span className="text-[10px] text-white/30 font-mono">
                {data.recentMatchIds?.length ?? 0} recent matches
              </span>
            </div>
          </div>
          <a
            href={OPGG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-[10px] font-mono text-orange-400/70 hover:text-orange-400 bg-orange-500/5 hover:bg-orange-500/10 border border-orange-500/15 hover:border-orange-500/30 px-2.5 py-1.5 rounded-lg transition-all duration-200"
          >
            OP.GG ↗
          </a>
        </div>


        {/* ── CTA Footer ── */}
        <div className="px-5 pb-5 pt-3">
          <a
            href={OPGG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500/15 to-yellow-500/10 border border-orange-500/20 hover:border-orange-500/40 hover:from-orange-500/25 hover:to-yellow-500/15 text-orange-300 hover:text-orange-200 text-[11px] font-mono uppercase tracking-widest transition-all duration-300 group/cta"
          >
            <span>View Full Stats on PUBG OP.GG</span>
            <span className="translate-x-0 group-hover/cta:translate-x-1 transition-transform duration-200">→</span>
          </a>
        </div>

      </div>
    </div>
  );
}
