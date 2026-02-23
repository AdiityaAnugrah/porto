/**
 * CARA IMPLEMENTASI ENDPOINT SPOTIFY DI BACKEND KAMU (api.beliakun.com)
 * 
 * UPDATE: Mengambil lagu yang Sedang Diputar (1) + Riwayat (4) = Total 5 Lagu
 */

const express = require('express');
const fetch = require('node-fetch'); // atau axios
const querystring = require('querystring');

const router = express.Router();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN; 

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=5`;

const getAccessToken = async () => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  });
  return response.json();
};

router.get('/spotify/now-playing', async (req, res) => {
  try {
    const { access_token } = await getAccessToken();

    // 1. Cek lagu yang sedang diputar
    const nowPlayingRes = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    let currentTrack = null;
    if (nowPlayingRes.status === 200) {
      const song = await nowPlayingRes.json();
      if (song.currently_playing_type === 'track' && song.is_playing) {
        currentTrack = {
          isPlaying: true,
          title: song.item.name,
          artist: song.item.artists.map((_artist) => _artist.name).join(', '),
          albumImageUrl: song.item.album.images[0].url,
          songUrl: song.item.external_urls.spotify,
        };
      }
    }

    // 2. Ambil lagu yang baru saja diputar (History)
    const recentRes = await fetch(RECENTLY_PLAYED_ENDPOINT, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    let recentTracks = [];
    if (recentRes.status === 200) {
      const recentData = await recentRes.json();
      recentTracks = recentData.items.map(item => ({
        isPlaying: false,
        title: item.track.name,
        artist: item.track.artists.map((_artist) => _artist.name).join(', '),
        albumImageUrl: item.track.album.images[0].url,
        songUrl: item.track.external_urls.spotify,
      }));
    }

    // 3. Gabungkan hasilnya (Maksimal 5 lagu)
    let tracks = [];
    if (currentTrack) {
        tracks.push(currentTrack);
        // Buang History yang lagunya persis sama dengan yang sedang diputar (Mencegah duplikat)
        recentTracks = recentTracks.filter(t => t.songUrl !== currentTrack.songUrl);
        tracks = [...tracks, ...recentTracks].slice(0, 5);
    } else {
        tracks = recentTracks.slice(0, 5);
    }

    // Response sekarang berupa Array
    return res.status(200).json(tracks);

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Failed to fetch Spotify data' });
  }
});

module.exports = router;
