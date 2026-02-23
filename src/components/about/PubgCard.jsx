import { useEffect, useState } from "react";

const API_URL = "https://api.beliakun.com/pubg/steam/player/BOKONG_BASAH";

const StatBadge = ({ label, value }) => (
  <div className="flex flex-col items-center px-4 py-2 rounded-xl bg-white/5 border border-white/10">
    <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">{label}</span>
    <span className="text-sm font-bold text-white mt-1">{value}</span>
  </div>
);

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

  /* ── Skeleton / Error states ── */
  if (loading) {
    return (
      <div className="glass-panel rounded-2xl p-5 animate-pulse space-y-3">
        <div className="h-4 w-32 bg-white/10 rounded" />
        <div className="h-3 w-48 bg-white/5 rounded" />
        <div className="flex gap-2 mt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 w-20 bg-white/5 rounded-xl" />
          ))}
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

  const recentIds = data.recentMatchIds?.slice(0, 5) ?? [];

  return (
    <div className="relative group">
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-yellow-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="glass-panel rounded-2xl p-5 space-y-5 relative border border-white/10 group-hover:border-orange-400/30 transition-colors duration-300">

        {/* Header */}
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

        {/* Player Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl flex-shrink-0">
            🪖
          </div>
          <div>
            <p className="text-base font-bold text-white">{data.ign}</p>
            <p className="text-[11px] text-white/40 font-mono capitalize">{data.platform} Platform</p>
          </div>
        </div>

        {/* Player ID */}
        <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2">
          <p className="text-[9px] uppercase tracking-widest text-white/30 font-mono mb-1">Player ID</p>
          <p className="text-xs font-mono text-cyan-400 truncate">{data.playerId}</p>
        </div>

        {/* Recent Matches */}
        {recentIds.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-mono mb-2">Recent Matches</p>
            <ul className="space-y-1.5">
              {recentIds.map((id, idx) => (
                <li
                  key={id}
                  className="flex items-center gap-2.5 bg-white/5 border border-white/5 rounded-lg px-3 py-1.5"
                >
                  <span className="text-[10px] text-white/20 font-mono w-3 flex-shrink-0">#{idx + 1}</span>
                  <span className="text-[11px] font-mono text-white/50 truncate">{id}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
