import { useEffect, useState } from "react";
import { FaSpotify } from "react-icons/fa";

// Contoh endpoint API masa depan:
// const API_URL = "https://api.beliakun.com/spotify/now-playing";

export default function SpotifyCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulasi fetch API
  useEffect(() => {
    const fetchDummyData = () => {
      // Dummy data untuk testing UI
      const dummyResponse = {
        isPlaying: true, // Ganti ke false untuk test UI saat tidak ada musik
        title: "Starboy",
        artist: "The Weeknd, Daft Punk",
        albumImageUrl: "https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452",
        songUrl: "https://open.spotify.com/track/7MXVkk9YMqq6mX5F0m8wL7",
      };

      setTimeout(() => {
        setData(dummyResponse);
        setLoading(false);
      }, 1000);
    };

    fetchDummyData();

    // ── NANTI GANTI DENGAN KODE ASLI INI ──
    // fetch(API_URL)
    //   .then((res) => res.json())
    //   .then((json) => { setData(json); setLoading(false); })
    //   .catch(() => { setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="glass-panel rounded-2xl p-5 animate-pulse border border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-white/10 flex-shrink-0" />
          <div className="space-y-3 flex-1">
            <div className="h-4 w-3/4 bg-white/10 rounded" />
            <div className="h-3 w-1/2 bg-white/5 rounded" />
          </div>
          <div className="w-8 h-8 rounded-full bg-white/5 flex-shrink-0" />
        </div>
      </div>
    );
  }

  // Jika tidak ada data atau tidak sedang play lagu
  if (!data?.isPlaying) {
    return (
      <div className="glass-panel rounded-2xl p-5 flex items-center gap-4 border border-white/10 group hover:border-[#1DB954]/30 transition-colors duration-300">
        <div className="w-12 h-12 rounded-full bg-[#1DB954]/10 flex items-center justify-center text-[#1DB954] text-xl flex-shrink-0">
          <FaSpotify />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Not Playing</h3>
          <p className="text-xs text-white/40">Spotify is currently offline.</p>
        </div>
      </div>
    );
  }

  return (
    <a
      href={data.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative group"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1DB954]/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="glass-panel rounded-2xl p-4 sm:p-5 flex items-center gap-4 border border-white/10 group-hover:border-[#1DB954]/40 transition-colors duration-300 relative overflow-hidden">
        
        {/* Album Art */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shadow-lg shadow-black/50 flex-shrink-0">
          <img
            src={data.albumImageUrl}
            alt={`${data.title} album art`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Soundwave Overlay (Muncul saat hover/play) */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
            <div className="flex items-end justify-center gap-[3px] h-4">
              <span className="w-[3px] bg-[#1DB954] rounded-full animate-[soundBar_1s_infinite_ease-in-out_alternate]" style={{ animationDelay: '0ms' }} />
              <span className="w-[3px] bg-[#1DB954] rounded-full animate-[soundBar_0.8s_infinite_ease-in-out_alternate]" style={{ animationDelay: '200ms' }} />
              <span className="w-[3px] bg-[#1DB954] rounded-full animate-[soundBar_1.2s_infinite_ease-in-out_alternate]" style={{ animationDelay: '400ms' }} />
              <span className="w-[3px] bg-[#1DB954] rounded-full animate-[soundBar_0.9s_infinite_ease-in-out_alternate]" style={{ animationDelay: '100ms' }} />
            </div>
          </div>
        </div>

        {/* Song Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <FaSpotify className="text-[#1DB954] text-xs sm:text-sm" />
            <span className="text-[10px] text-[#1DB954] font-mono uppercase tracking-widest font-bold">Now Playing</span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white truncate leading-tight group-hover:text-[#1DB954] transition-colors">
            {data.title}
          </h3>
          <p className="text-xs sm:text-sm text-white/50 truncate mt-0.5">
            {data.artist}
          </p>
        </div>

        {/* CSS Keyframes for Soundwave */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes soundBar {
            0% { height: 2px; }
            100% { height: 100%; }
          }
        `}} />
      </div>
    </a>
  );
}
