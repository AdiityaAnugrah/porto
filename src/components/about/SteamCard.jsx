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
      whileHover={{ scale: 0.995 }}
      className="group relative flex h-full min-h-[250px] flex-col justify-between overflow-hidden rounded-3xl border border-[#3a3327]/70 bg-[#14120e]/85 p-5 backdrop-blur-md transition-all duration-500 hover:border-cyan-300/35 md:min-h-[300px] md:p-8"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent pointer-events-none" />

      <div className="relative z-10 mb-4 flex w-full flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/5 bg-[#1d1912] shadow-inner">
            <FaSteamSymbol className="text-2xl text-cyan-300" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white/80 md:text-sm">Akun Steam Saya</h2>
            <p className="text-xs font-medium tracking-wider text-cyan-300">Profil pribadi dari Steam API</p>
          </div>
        </div>

        {steamData.countryCode && !isLoading && (
          <div className="flex h-9 items-center justify-center self-start rounded-full border border-white/20 bg-gradient-to-br from-gray-800 to-gray-900 px-3 shadow-md sm:self-auto">
            <span className="text-white/80 font-mono text-xs tracking-widest">{steamData.countryCode}</span>
          </div>
        )}
      </div>

      <div className={`relative z-10 mt-auto flex w-full items-center gap-4 transition-opacity duration-500 ${isLoading ? "opacity-60" : "opacity-100"}`}>
        <div className="relative shrink-0">
          <a
            href={steamData.profileUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Buka profil Steam pribadi"
            className="block"
          >
            <div className={`h-14 w-14 overflow-hidden rounded-xl border-2 p-[2px] ${getStatusBorder(steamData.state)} bg-[#1d1912] transition-colors duration-500 sm:h-16 sm:w-16`}>
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
              <h3 className="truncate text-lg font-bold text-white transition-colors duration-300 group-hover:text-cyan-300 sm:text-2xl">
                {steamData.username}
              </h3>
            </a>
            {steamData.realName && (
              <p className="text-white/40 text-xs truncate uppercase tracking-wider">{steamData.realName}</p>
            )}

            <div className="mt-1 flex items-center gap-2">
              <span className={`text-xs font-semibold tracking-wide sm:text-sm ${isLoading ? "text-white/40" : getStatusText(steamData.state)} transition-colors duration-500`}>
                {statusLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {steamData.state === "In-Game" && steamData.gameName && (
        <div className="relative z-10 mt-3 overflow-hidden rounded-3xl border border-green-300/15 bg-black/35">
          <div className="relative isolate">
            {steamData.gameArtUrl ? (
              <img
                src={steamData.gameArtUrl}
                alt={`${steamData.gameName} art`}
                className="h-28 w-full object-cover sm:h-32 md:h-36"
              />
            ) : (
              <div className="flex h-28 w-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(74,222,128,0.18),_rgba(0,0,0,0.35)_70%)] sm:h-32 md:h-36">
                <FaSteamSymbol className="text-4xl text-green-200/70" aria-hidden="true" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />

            <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-green-300/20 bg-black/45 px-3 py-1 backdrop-blur-md sm:left-4 sm:top-4">
              <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.75)]" aria-hidden="true" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-green-100">Live</span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-green-200/75">
                    Sedang bermain
                  </p>
                  <p className="mt-1 truncate text-sm font-bold text-white sm:text-base md:text-lg" title={steamData.gameName}>
                    {steamData.gameName}
                  </p>
                  <p className="mt-1 text-[11px] leading-5 text-white/60 sm:text-xs">
                    Game aktif di profil Steam pribadi kamu.
                  </p>
                </div>

                {steamData.gameStoreUrl && (
                  <a
                    href={steamData.gameStoreUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-9 shrink-0 items-center justify-center rounded-full border border-green-300/20 bg-white/10 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-white/15 sm:h-10"
                  >
                    Store
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 border-t border-white/10 bg-black/25 sm:grid-cols-2">
            <div className="flex items-center gap-3 px-4 py-3 sm:px-5">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/35">
                {steamData.gameLogoUrl ? (
                  <img
                    src={steamData.gameLogoUrl}
                    alt={`${steamData.gameName} logo`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-green-300">
                    <FaSteamSymbol aria-hidden="true" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">Status</p>
                <p className="truncate text-sm font-bold text-white">{steamData.state}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3 sm:border-l sm:border-t-0 sm:px-5">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">App ID</p>
                <p className="truncate font-mono text-sm text-white/90">{steamData.gameId || "-"}</p>
              </div>
              <span className="inline-flex items-center rounded-full border border-green-300/15 bg-green-300/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-green-100">
                Steam
              </span>
            </div>
          </div>
        </div>
      )}

    </motion.div>
  );
};

export default SteamCard;
