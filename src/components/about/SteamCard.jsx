import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaSteamSymbol } from "react-icons/fa";
import { apiUrl } from "../../lib/api";

const API_URL = apiUrl("/steam/profile");
const REQUEST_TIMEOUT = 8000;
const FALLBACK_STEAM_DATA = {
  username: "Steam Profile",
  realName: "",
  state: "Offline",
  avatarUrl: "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg",
  gameName: null,
  gameId: null,
  gameArtUrl: "",
  gameLogoUrl: "",
  gameStoreUrl: "",
  profileUrl: "https://steamcommunity.com/",
  countryCode: "",
};

const getStatusColor = (state) => {
  switch (state) {
    case "Online":
      return "bg-blue-500";
    case "In-Game":
      return "bg-green-500";
    case "Busy":
      return "bg-red-500";
    case "Away":
    case "Snooze":
      return "bg-yellow-500";
    case "Looking to Play":
      return "bg-emerald-500";
    case "Looking to Trade":
      return "bg-purple-500";
    case "Offline":
    default:
      return "bg-gray-500";
  }
};

const getStatusBorder = (state) => {
  switch (state) {
    case "Online":
      return "border-blue-500";
    case "In-Game":
      return "border-green-500";
    case "Busy":
      return "border-red-500";
    case "Away":
    case "Snooze":
      return "border-yellow-500";
    case "Looking to Play":
      return "border-emerald-500";
    case "Looking to Trade":
      return "border-purple-500";
    case "Offline":
    default:
      return "border-gray-500";
  }
};

const getStatusText = (state) => {
  switch (state) {
    case "Online":
      return "text-blue-500";
    case "In-Game":
      return "text-green-500";
    case "Busy":
      return "text-red-500";
    case "Away":
    case "Snooze":
      return "text-yellow-500";
    case "Looking to Play":
      return "text-emerald-500";
    case "Looking to Trade":
      return "text-purple-500";
    case "Offline":
    default:
      return "text-gray-500";
  }
};

const SteamCard = () => {
  const [steamData, setSteamData] = useState(FALLBACK_STEAM_DATA);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchSteamProfile = async () => {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      try {
        const response = await fetch(API_URL, { signal: controller.signal });
        if (!response.ok) throw new Error("Steam API gagal dimuat");

        const data = await response.json();
        if (!active) return;

        setSteamData({ ...FALLBACK_STEAM_DATA, ...data });
      } catch {
        if (!active) return;
        setSteamData(FALLBACK_STEAM_DATA);
      } finally {
        window.clearTimeout(timeoutId);
        if (active) setIsLoading(false);
      }
    };

    fetchSteamProfile();
    const interval = window.setInterval(fetchSteamProfile, 60000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const statusLabel = isLoading
    ? "Memuat profil"
    : steamData.state === "In-Game"
      ? "Playing"
      : steamData.state;

  return (
    <motion.div
      whileHover={{ scale: 0.98 }}
      className="group relative bg-[#14120e]/85 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-[#3a3327]/70 overflow-hidden flex flex-col justify-between min-h-[220px] transition-all duration-500 hover:border-cyan-300/35 h-full"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent pointer-events-none" />

      <div className="flex justify-between items-start mb-6 relative z-10 w-full">
        <div className="flex items-center space-x-3">
          <div className="bg-[#1d1912] p-3 rounded-2xl shadow-inner border border-white/5">
            <FaSteamSymbol className="text-3xl text-cyan-300" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-white/80 font-display font-semibold tracking-wide text-sm uppercase">Akun Steam Saya</h2>
            <p className="text-cyan-300 text-xs font-mono font-medium tracking-wider">Profil pribadi dari Steam API</p>
          </div>
        </div>

        {steamData.countryCode && !isLoading && (
          <div className="flex items-center justify-center h-10 px-3 rounded-full border border-white/20 bg-gradient-to-br from-gray-800 to-gray-900 shadow-md">
            <span className="text-white/80 font-mono text-xs tracking-widest">{steamData.countryCode}</span>
          </div>
        )}
      </div>

      <div className={`flex items-center space-x-5 relative z-10 w-full mt-auto transition-opacity duration-500 ${isLoading ? "opacity-60" : "opacity-100"}`}>
        <div className="relative shrink-0">
          <a
            href={steamData.profileUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Buka profil Steam pribadi"
            className="block"
          >
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 ${getStatusBorder(steamData.state)} p-[2px] bg-[#1d1912] transition-colors duration-500`}>
              <img
                src={steamData.avatarUrl}
                alt={`${steamData.username} Steam avatar`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </a>
          <span className={`absolute -bottom-1 -right-1 w-5 h-5 border-2 border-[#14120e] rounded-full ${getStatusColor(steamData.state)} shadow-lg transition-colors duration-500`} aria-hidden="true" />
        </div>

        <div className="flex-grow min-w-0">
          <div className="flex flex-col">
            <a
              href={steamData.profileUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Buka profil Steam pribadi"
              className="block truncate"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-white truncate group-hover:text-cyan-300 transition-colors duration-300">
                {steamData.username}
              </h3>
            </a>
            {steamData.realName && (
              <p className="text-white/40 text-xs truncate uppercase tracking-wider">{steamData.realName}</p>
            )}

            <div className="flex items-center space-x-2 mt-1">
              <span className={`text-xs sm:text-sm font-semibold tracking-wide ${isLoading ? "text-white/40" : getStatusText(steamData.state)} transition-colors duration-500`}>
                {statusLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {steamData.state === "In-Game" && steamData.gameName && (
        <div className="relative z-10 mt-1 rounded-2xl border border-green-300/15 bg-green-300/[0.06] p-3 sm:p-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/35">
              {steamData.gameLogoUrl ? (
                <img
                  src={steamData.gameLogoUrl}
                  alt={`${steamData.gameName} cover`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-green-300">
                  <FaSteamSymbol aria-hidden="true" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-green-200/70">
                Sedang bermain
              </p>
              <p className="mt-1 truncate text-sm font-bold text-white sm:text-base" title={steamData.gameName}>
                {steamData.gameName}
              </p>
            </div>

            {steamData.gameStoreUrl && (
              <a
                href={steamData.gameStoreUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-green-300/20 bg-green-300/10 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-green-100 transition-colors hover:bg-green-300/15"
              >
                Store
              </a>
            )}
          </div>

          {steamData.gameArtUrl && (
            <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
              <img
                src={steamData.gameArtUrl}
                alt={`${steamData.gameName} art`}
                className="h-28 w-full object-cover sm:h-32"
              />
            </div>
          )}
        </div>
      )}

    </motion.div>
  );
};

export default SteamCard;
