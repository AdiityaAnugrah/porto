import { Buffer } from "node:buffer";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import http from "node:http";

const __dirname = dirname(fileURLToPath(import.meta.url));

loadEnvFile(join(__dirname, ".env"));

const PORT = Number(process.env.PORT || 3100);
const HOST = process.env.HOST || "127.0.0.1";
const REQUEST_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS || 8000);
const CACHE_TTL = {
  spotify: Number(process.env.SPOTIFY_CACHE_TTL_MS || 15000),
  steam: Number(process.env.STEAM_CACHE_TTL_MS || 60000),
  pubg: Number(process.env.PUBG_CACHE_TTL_MS || 300000),
};

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ||
  "https://adityaanugrah.me,http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const cache = new Map();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (!applyCors(req, res)) {
    return sendJson(res, 403, { error: "Origin not allowed" });
  }

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  if (req.method !== "GET") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    if (url.pathname === "/health") {
      return sendJson(res, 200, {
        ok: true,
        service: "adityaanugrah-api",
        time: new Date().toISOString(),
      });
    }

    if (url.pathname === "/spotify/now-playing") {
      const data = await cached("spotify:now-playing", CACHE_TTL.spotify, getSpotifyTracks);
      return sendJson(res, 200, data);
    }

    if (url.pathname === "/steam/profile") {
      const data = await cached("steam:profile", CACHE_TTL.steam, getSteamProfile);
      return sendJson(res, 200, data);
    }

    const pubgMatch = url.pathname.match(/^\/pubg\/steam\/player\/([^/]+)$/);
    if (pubgMatch) {
      const ign = decodeURIComponent(pubgMatch[1]);
      const data = await cached(`pubg:steam:${ign.toLowerCase()}`, CACHE_TTL.pubg, () => getPubgPlayer(ign));
      return sendJson(res, 200, data);
    }

    return sendJson(res, 404, { error: "Not found" });
  } catch (error) {
    const status = error.status || 500;
    const message = status >= 500 ? "Upstream API error" : error.message;

    console.error(`[${new Date().toISOString()}] ${req.method} ${url.pathname}`, error);
    return sendJson(res, status, {
      error: message,
      detail: error.publicDetail || undefined,
    });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`adityaanugrah-api listening on http://${HOST}:${PORT}`);
});

function loadEnvFile(filePath) {
  try {
    const content = readFileSync(filePath, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const index = trimmed.indexOf("=");
      if (index === -1) continue;

      const key = trimmed.slice(0, index).trim();
      let value = trimmed.slice(index + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch {
    // A .env file is optional because PM2/systemd can inject env vars too.
  }
}

function applyCors(req, res) {
  const origin = req.headers.origin;
  const allowAll = ALLOWED_ORIGINS.includes("*");

  if (origin && !allowAll && !ALLOWED_ORIGINS.includes(origin)) {
    return false;
  }

  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", allowAll ? "*" : origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Max-Age", "86400");
  return true;
}

function sendJson(res, status, data) {
  const body = JSON.stringify(data);

  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

async function cached(key, ttlMs, load) {
  const hit = cache.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.data;

  const data = await load();
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
  return data;
}

async function requestJson(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}`);
      error.status = response.status >= 400 && response.status < 500 ? response.status : 502;
      error.publicDetail = data?.error?.message || data?.errors?.[0]?.title || data?.error || undefined;
      throw error;
    }

    return { response, data };
  } catch (error) {
    if (error.name === "AbortError") {
      const timeoutError = new Error("Request timeout");
      timeoutError.status = 504;
      throw timeoutError;
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    const error = new Error(`${name} is not configured`);
    error.status = 503;
    throw error;
  }
  return value;
}

async function getSpotifyAccessToken() {
  const clientId = requireEnv("SPOTIFY_CLIENT_ID");
  const clientSecret = requireEnv("SPOTIFY_CLIENT_SECRET");
  const refreshToken = requireEnv("SPOTIFY_REFRESH_TOKEN");
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const { data } = await requestJson("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  return data.access_token;
}

async function getSpotifyTracks() {
  const accessToken = await getSpotifyAccessToken();
  const headers = { Authorization: `Bearer ${accessToken}` };
  const tracks = [];

  const current = await requestJson("https://api.spotify.com/v1/me/player/currently-playing", {
    headers,
  }).catch((error) => {
    if (error.status === 404) return { data: null };
    throw error;
  });

  const currentTrack = mapSpotifyCurrentTrack(current.data);
  if (currentTrack) tracks.push(currentTrack);

  const { data: recentData } = await requestJson("https://api.spotify.com/v1/me/player/recently-played?limit=5", {
    headers,
  });

  const recentTracks = (recentData?.items || [])
    .map(mapSpotifyRecentTrack)
    .filter(Boolean)
    .filter((track) => !tracks.some((existing) => existing.songUrl === track.songUrl));

  return tracks.concat(recentTracks).slice(0, 5);
}

function mapSpotifyCurrentTrack(data) {
  if (!data?.item) return null;
  return mapSpotifyTrack(data.item, {
    isPlaying: Boolean(data.is_playing),
    playedAt: null,
  });
}

function mapSpotifyRecentTrack(item) {
  if (!item?.track) return null;
  return mapSpotifyTrack(item.track, {
    isPlaying: false,
    playedAt: item.played_at || null,
  });
}

function mapSpotifyTrack(track, meta) {
  return {
    title: track.name,
    artist: (track.artists || []).map((artist) => artist.name).join(", ") || "Unknown Artist",
    album: track.album?.name || "",
    albumImageUrl: track.album?.images?.[0]?.url || "",
    songUrl: track.external_urls?.spotify || "https://open.spotify.com",
    isPlaying: meta.isPlaying,
    playedAt: meta.playedAt,
  };
}

async function getSteamProfile() {
  const apiKey = requireEnv("STEAM_API_KEY");
  const steamId = requireEnv("STEAM_ID");
  const url = new URL("https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("steamids", steamId);

  const { data } = await requestJson(url);
  const player = data?.response?.players?.[0];

  if (!player) {
    const error = new Error("Steam profile not found");
    error.status = 404;
    throw error;
  }

  const state = player.gameextrainfo ? "In-Game" : mapSteamState(player.personastate);

  return {
    username: player.personaname || "Aditya",
    realName: player.realname || "",
    state,
    avatarUrl: player.avatarfull || player.avatarmedium || "",
    gameName: player.gameextrainfo || null,
    gameId: player.gameid || null,
    profileUrl: player.profileurl || "https://steamcommunity.com/id/claraikaa/",
    countryCode: player.loccountrycode || "",
  };
}

function mapSteamState(state) {
  switch (Number(state)) {
    case 1:
      return "Online";
    case 2:
      return "Busy";
    case 3:
      return "Away";
    case 4:
      return "Snooze";
    case 5:
      return "Looking to Trade";
    case 6:
      return "Looking to Play";
    case 0:
    default:
      return "Offline";
  }
}

async function getPubgPlayer(ign) {
  const apiKey = requireEnv("PUBG_API_KEY");
  const url = new URL("https://api.pubg.com/shards/steam/players");
  url.searchParams.set("filter[playerNames]", ign);

  const { data } = await requestJson(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/vnd.api+json",
    },
  });

  const player = data?.data?.[0];
  if (!player) {
    const error = new Error("PUBG player not found");
    error.status = 404;
    throw error;
  }

  return {
    ign: player.attributes?.name || ign,
    platform: "Steam",
    playerId: player.id,
    recentMatchIds: (player.relationships?.matches?.data || []).map((match) => match.id),
    shard: "steam",
  };
}
