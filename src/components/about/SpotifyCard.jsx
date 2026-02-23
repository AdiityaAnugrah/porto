import { useEffect, useState } from "react";
import { FaSpotify } from "react-icons/fa";

// Endpoint API backend milik user:
const API_URL = "https://api.beliakun.com/spotify/now-playing";

export default function SpotifyCard() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch Spotify data");
        return res.json();
      })
      .then((json) => {
        // Handle kompatibilitas: JSON Array = Format Baru, JSON Object = Format Lama
        if (Array.isArray(json)) {
          setTracks(json);
        } else if (json && typeof json === 'object') {
          // Format objek tunggal lama
          if (json.isPlaying) {
            setTracks([json]);
          } else {
            setTracks([]);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Spotify API Error:", err);
        setLoading(false);
      });
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

  // Jika tidak ada data atau tidak ada lagu sama sekali
  if (tracks.length === 0) {
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

  // Pisahkan lagu utama (pertama) dan riwayat lagu (sisanya)
  const mainTrack = tracks[0];
  const history = tracks.slice(1);

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* 1. Track Utama (Sedang Diputar / Terakhir Diputar) */}
      <a
        href={mainTrack.songUrl || "https://open.spotify.com"}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative group flex-shrink-0"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#1DB954]/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="glass-panel rounded-2xl p-4 sm:p-5 flex items-center gap-4 border border-white/10 group-hover:border-[#1DB954]/40 transition-colors duration-300 relative overflow-hidden">
          
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shadow-lg shadow-black/50 flex-shrink-0 border border-white/10">
            <img
              src={mainTrack.albumImageUrl}
              alt={`${mainTrack.title} album art`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Overlay animasi batang lagu, menyala terus jika isPlaying true, atau muncul saat di-hover jika hanya history */}
            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 backdrop-blur-[2px] ${mainTrack.isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              <div className="flex items-end justify-center gap-[3px] h-4">
                <span className="w-[3px] bg-[#1DB954] rounded-full animate-[soundBar_1s_infinite_ease-in-out_alternate]" style={{ animationDelay: '0ms' }} />
                <span className="w-[3px] bg-[#1DB954] rounded-full animate-[soundBar_0.8s_infinite_ease-in-out_alternate]" style={{ animationDelay: '200ms' }} />
                <span className="w-[3px] bg-[#1DB954] rounded-full animate-[soundBar_1.2s_infinite_ease-in-out_alternate]" style={{ animationDelay: '400ms' }} />
                <span className="w-[3px] bg-[#1DB954] rounded-full animate-[soundBar_0.9s_infinite_ease-in-out_alternate]" style={{ animationDelay: '100ms' }} />
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <FaSpotify className={`text-[#1DB954] text-xs sm:text-sm ${mainTrack.isPlaying ? 'animate-pulse' : ''}`} />
              <span className="text-[10px] text-[#1DB954] font-mono uppercase tracking-widest font-bold">
                {mainTrack.isPlaying ? 'Now Playing' : 'Recently Played'}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white truncate leading-tight group-hover:text-[#1DB954] transition-colors">
              {mainTrack.title}
            </h3>
            <p className="text-xs sm:text-sm text-white/50 truncate mt-0.5">
              {mainTrack.artist}
            </p>
          </div>
        </div>
      </a>

      {/* 2. Daftar Riwayat Lagu (History) */}
      {history.length > 0 && (
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/10 flex flex-col gap-3 flex-1">
          <h4 className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" /> Previous Tracks
          </h4>
          
          <div className="flex flex-col gap-3 justify-center flex-1">
            {history.map((track, idx) => (
              <a 
                key={idx}
                href={track.songUrl || "https://open.spotify.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-md overflow-hidden flex-shrink-0 relative border border-white/5">
                  <img src={track.albumImageUrl} alt="album" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                      <FaSpotify className="text-[#1DB954] text-[10px]" />
                  </div>
                </div>
                <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white/80 group-hover:text-white truncate transition-colors">
                      {track.title}
                    </p>
                    <p className="text-[10px] text-white/40 truncate">
                      {track.artist}
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-white/20 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block">
                    OPEN
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* CSS Keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes soundBar {
          0% { height: 2px; }
          100% { height: 100%; }
        }
      `}} />
    </div>
  );
}
