import { useEffect, useRef, useState } from 'react';
import { FaSteamSymbol, FaGamepad, FaSpotify } from 'react-icons/fa';
import { apiUrl } from '../../lib/api';
import { useActiveLocale } from '../../lib/i18n';

function useActivityFeed(path, enabled) {
  const [result, setResult] = useState({ data: null, loading: true, error: false });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let active = true;
    let controller;
    let timeout;
    const load = async () => {
      controller?.abort();
      window.clearTimeout(timeout);
      const request = new AbortController();
      controller = request;
      timeout = window.setTimeout(() => request.abort(), 8000);
      setResult(previous => ({ ...previous, loading: true, error: false }));
      try {
        const response = await fetch(apiUrl(path), { signal: request.signal });
        const data = await response.json();
        if (!response.ok) {
          const error = new Error('Activity unavailable');
          error.code = data?.code;
          throw error;
        }
        if (active && controller === request) setResult({ data, loading: false, error: false });
      } catch (error) {
        if (active && controller === request) setResult({ data: null, loading: false, error: error.code || true });
      } finally {
        if (controller === request) window.clearTimeout(timeout);
      }
    };
    void load();
    const interval = window.setInterval(() => { if (!document.hidden) void load(); }, 60000);
    return () => { active = false; controller?.abort(); window.clearTimeout(timeout); window.clearInterval(interval); };
  }, [path, enabled, attempt]);
  return { ...result, retry: () => setAttempt(value => value + 1) };
}

function externalUrl(value) {
  if (!value) return null;
  try { const url = new URL(value, window.location.origin); return /^https?:$/.test(url.protocol) ? url.href : null; } catch { return null; }
}

function ActivityImage({ src, alt }) {
  const [failedSource, setFailedSource] = useState(null);
  const source = externalUrl(src);
  return source && failedSource !== source ? <img className="activity-avatar" src={source} alt={alt} width="64" height="64" loading="lazy" onError={() => setFailedSource(source)} /> : <span className="activity-avatar activity-avatar-fallback" aria-hidden="true">{alt.charAt(0) || '/'}</span>;
}

function FeedState({ feed, name, id }) {
  if (feed.loading && !feed.data) return <p className="activity-state" role="status">{id ? `Memuat aktivitas ${name}…` : `Loading ${name} activity…`}</p>;
  if (!feed.error) return null;
  if (feed.error === 'SPOTIFY_REAUTH_REQUIRED') return <div className="activity-state"><p>{id ? 'Koneksi Spotify perlu dihubungkan ulang oleh pemilik situs.' : 'The site owner needs to reconnect Spotify.'}</p><button className="activity-link" type="button" onClick={feed.retry}>{id ? 'Periksa lagi' : 'Check again'}</button></div>;
  return <div className="activity-state"><p>{id ? `Aktivitas ${name} belum berhasil dimuat.` : `${name} activity is temporarily unavailable.`}</p><button className="activity-link" type="button" onClick={feed.retry}>{id ? 'Coba lagi' : 'Try again'}</button></div>;
}

export default function PersonalActivity() {
  const id = useActiveLocale() === 'id';
  const root = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '150px', threshold: 0 });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  const steam = useActivityFeed('/steam/profile', visible);
  const pubg = useActivityFeed('/pubg/steam/player/BOKONG_BASAH', visible);
  const spotify = useActivityFeed('/spotify/now-playing', visible);
  const steamProfile = steam.data;
  const playing = steamProfile?.state === 'In-Game' && steamProfile?.gameName;
  const tracks = (Array.isArray(spotify.data) ? spotify.data : spotify.data?.title ? [spotify.data] : []).filter(track => track?.title).slice(0, 3);
  const pubgProfile = pubg.data;

  return <section ref={root} id="personal-activity" className="personal-activity" aria-labelledby="personal-activity-title">
    <div className="section-heading"><div><p className="section-label">{id ? 'Gaming & musik' : 'Gaming & music'}</p><h2 id="personal-activity-title">{id ? 'Di luar pekerjaan.' : 'Outside of work.'}</h2></div></div>
    <p className="activity-intro">{id ? 'Sisi lain dari keseharian saya: game yang dimainkan dan musik yang menemani. Aktivitas diambil dari integrasi Steam, PUBG, dan Spotify.' : 'Another side of my day: the games I play and the music that keeps me company. Activity comes from Steam, PUBG, and Spotify integrations.'}</p>
    <div className="activity-grid">
      <article className="activity-card" aria-labelledby="steam-activity-title">
        <header className="activity-card-heading"><FaSteamSymbol aria-hidden="true"/><h3 id="steam-activity-title">Steam</h3><span>{id ? 'Profil & game' : 'Profile & games'}</span></header>
        <FeedState feed={steam} name="Steam" id={id}/>
        {!steam.loading && !steam.error && !steamProfile && <p className="activity-state">{id ? 'Belum ada aktivitas Steam yang tersedia.' : 'No Steam activity is available right now.'}</p>}
        {!steam.error && steamProfile && <>
          <div className="activity-profile"><ActivityImage src={steamProfile.avatarUrl} alt={steamProfile.username || 'Steam'}/><div><h4>{steamProfile.username || 'Steam'}</h4><p>{steamProfile.realName || (id ? 'Profil Steam saya' : 'My Steam profile')}</p></div></div>
          <p className={`activity-status${playing ? ' activity-status-playing' : ''}`}>{steamProfile.state || (id ? 'Status belum tersedia' : 'Status unavailable')}{steamProfile.countryCode ? ` / ${steamProfile.countryCode}` : ''}</p>
          <div className="activity-game"><p className="section-label">{playing ? (id ? 'Sedang bermain' : 'Currently playing') : (id ? 'Aktivitas game' : 'Game activity')}</p><p>{playing ? steamProfile.gameName : (id ? 'Tidak ada game yang sedang ditampilkan di profil.' : 'No active game is currently shown on the profile.')}</p>{playing && externalUrl(steamProfile.gameStoreUrl) && <a className="activity-link" href={externalUrl(steamProfile.gameStoreUrl)} target="_blank" rel="noreferrer">{id ? 'Lihat game di Steam' : 'View game on Steam'}</a>}</div>
          {externalUrl(steamProfile.profileUrl) && <a className="activity-link" href={externalUrl(steamProfile.profileUrl)} target="_blank" rel="noreferrer">{id ? 'Buka profil Steam' : 'Open Steam profile'} <span aria-hidden="true">↗</span></a>}
        </>}
      </article>
      <article className="activity-card" aria-labelledby="pubg-activity-title">
        <header className="activity-card-heading"><FaGamepad aria-hidden="true"/><h3 id="pubg-activity-title">PUBG</h3><span>Battlegrounds</span></header>
        <FeedState feed={pubg} name="PUBG" id={id}/>
        {!pubg.loading && !pubg.error && !pubgProfile && <p className="activity-state">{id ? 'Belum ada aktivitas PUBG yang tersedia.' : 'No PUBG activity is available right now.'}</p>}
        {!pubg.error && pubgProfile && <>
          <div className="activity-player"><p className="section-label">{id ? 'Nama pemain' : 'Player name'}</p><h4>{pubgProfile.ign || 'BOKONG_BASAH'}</h4><p>{pubgProfile.platform || 'Steam'}</p></div>
          <dl className="activity-stat"><dt>{id ? 'Pertandingan terakhir terdaftar' : 'Recent matches listed'}</dt><dd>{Array.isArray(pubgProfile.recentMatchIds) ? pubgProfile.recentMatchIds.length : (id ? 'Belum tersedia' : 'Unavailable')}</dd></dl>
          <p className="activity-note">{id ? 'Daftar pertandingan dari API, bukan total pertandingan atau statistik kemenangan.' : 'Match entries from the API, not lifetime matches or win statistics.'}</p>
        </>}
        <a className="activity-link" href="https://pubg.op.gg/user/BOKONG_BASAH" target="_blank" rel="noreferrer">{id ? 'Buka profil PUBG' : 'Open PUBG profile'} <span aria-hidden="true">↗</span></a>
      </article>
      <article className="activity-card" aria-labelledby="spotify-activity-title">
        <header className="activity-card-heading"><FaSpotify aria-hidden="true"/><h3 id="spotify-activity-title">Spotify</h3><span>{id ? 'Musik' : 'Music'}</span></header>
        <FeedState feed={spotify} name="Spotify" id={id}/>
        {!spotify.loading && !spotify.error && tracks.length === 0 && <p className="activity-state">{id ? 'Belum ada aktivitas musik yang tersedia.' : 'No music activity is available right now.'}</p>}
        {!spotify.error && tracks.length > 0 && <ul className="activity-tracks">{tracks.map((track, index) => <li key={`${track.songUrl || track.title}-${index}`}><ActivityImage src={track.albumImageUrl} alt={track.title}/><div><p className="activity-track-label">{index === 0 ? (track.isPlaying ? (id ? 'Sedang didengarkan' : 'Now listening') : (id ? 'Terakhir didengarkan' : 'Recently listened')) : (id ? 'Sebelumnya' : 'Previously')}</p><h4>{externalUrl(track.songUrl) ? <a href={externalUrl(track.songUrl)} target="_blank" rel="noreferrer">{track.title}</a> : track.title}</h4><p>{track.artist}</p></div></li>)}</ul>}
      </article>
    </div>
    <p className="activity-footnote">{id ? 'Aktivitas diperiksa ulang setiap menit selama bagian ini terlihat dan tab aktif. Status mengikuti data yang dibagikan tiap platform.' : 'Activity is checked every minute while this section is visible and the tab is active. Status follows the data each platform shares.'}</p>
  </section>;
}
