import { useEffect, useState } from "react";

const API_URL = "https://api.beliakun.com/pubg/steam/player/BOKONG_BASAH";

const PUBG_STATS = [
  { label: "Main Map", value: "Erangel", icon: "🗺️" },
  { label: "Mode", value: "Squad", icon: "👥" },
  { label: "Rank", value: "Platinum", icon: "🏅" },
];

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

  if (loading) {
    return (
      <div className="glass-panel rounded-2xl p-5 animate-pulse space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10" />
          <div className="space-y-2">
            <div className="h-3 w-24 bg-white/10 rounded" />
            <div className="h-2 w-16 bg-white/5 rounded" />
          </div>
        </div>
        <div className="h-14 bg-white/5 rounded-xl" />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 flex-1 bg-white/5 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="glass-panel rounded-2xl p-5 border border-red-500/20">
        <div className="flex items-center gap-2 text-red-400 text-sm font-mono">
          <span>⚠</span>
          <span>Gagal memuat data PUBG</span>
        </div>
        <p className="text-white/30 text-xs mt-1 font-mono">{err}</p>
      </div>
    );
  }

  const matchCount = data.recentMatchIds?.length ?? 0;

  return (
    <div className="relative group">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-yellow-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="glass-panel rounded-2xl p-5 space-y-4 relative border border-white/10 group-hover:border-orange-400/30 transition-colors duration-300">

        {/* ── Header ── */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-orange-500/20 flex-shrink-0">
            <span className="text-lg leading-none">🎮</span>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Favorite Game</p>
            <h3 className="text-sm font-bold text-white leading-tight">PUBG: Battlegrounds</h3>
          </div>
          {/* Live badge */}
          <div className="ml-auto flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-2 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-[10px] text-orange-400 font-mono uppercase">Live</span>
          </div>
        </div>

        {/* ── Player Identity Banner ── */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-orange-500/10 to-yellow-500/5 border border-orange-500/20 rounded-xl px-4 py-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl flex-shrink-0">
            🪖
          </div>
          <div className="min-w-0">
            <p className="text-base font-bold text-white tracking-wide">{data.ign}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-mono text-orange-400/80 uppercase tracking-widest bg-orange-500/10 px-1.5 py-0.5 rounded">
                {data.platform}
              </span>
              <span className="text-[10px] text-white/30 font-mono">
                {matchCount} recent matches tracked
              </span>
            </div>
          </div>
        </div>

        {/* ── Quick Stats ── */}
        <div className="grid grid-cols-3 gap-2">
          {PUBG_STATS.map(({ label, value, icon }) => (
            <div key={label} className="flex flex-col items-center gap-1 bg-white/5 border border-white/10 rounded-xl py-3 px-2 hover:bg-white/8 hover:border-orange-500/20 transition-colors duration-200">
              <span className="text-xl leading-none">{icon}</span>
              <span className="text-xs font-bold text-white mt-1">{value}</span>
              <span className="text-[9px] uppercase tracking-widest text-white/30 font-mono">{label}</span>
            </div>
          ))}
        </div>

        {/* ── Player ID (truncated nicely) ── */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
          <span className="text-white/20 text-xs">🔑</span>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] uppercase tracking-widest text-white/30 font-mono">Player ID</p>
            <p className="text-[11px] font-mono text-cyan-400/70 truncate">{data.playerId}</p>
          </div>
          <span className="text-[9px] font-mono text-white/20 flex-shrink-0 bg-white/5 px-1.5 py-0.5 rounded">
            STEAM
          </span>
        </div>

      </div>
    </div>
  );
}
