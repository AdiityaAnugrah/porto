import { useEffect, useRef, useState } from 'react';
import { apiUrl } from '../../lib/api';
import { githubProfile } from '../../data/about';

function useDeveloperActivity() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [feed, setFeed] = useState({ loading: true, data: null, error: false });
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '200px' });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!visible) return;
    let active = true;
    let controller;
    let timer;
    const load = async () => {
      controller?.abort();
      window.clearTimeout(timer);
      const request = new AbortController();
      controller = request;
      timer = window.setTimeout(() => request.abort(), 8000);
      setFeed(previous => ({ ...previous, loading: true, error: false }));
      try {
        const response = await fetch(apiUrl('/developer/activity'), { signal: request.signal });
        if (!response.ok) throw new Error('Activity unavailable');
        const data = await response.json();
        if (active && controller === request) setFeed({ loading: false, data, error: false });
      } catch {
        if (active && controller === request) setFeed({ loading: false, data: null, error: true });
      } finally { if (controller === request) window.clearTimeout(timer); }
    };
    void load();
    const interval = window.setInterval(() => { if (!document.hidden) void load(); }, 300000);
    return () => { active = false; controller?.abort(); window.clearTimeout(timer); window.clearInterval(interval); };
  }, [visible, attempt]);
  return { ref, ...feed, retry: () => setAttempt(value => value + 1) };
}

function githubUrl(value) {
  try { const url = new URL(value); return url.protocol === 'https:' && url.hostname === 'github.com' ? url.href : null; } catch { return null; }
}

function dateLabel(value, id) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString(id ? 'id-ID' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function DeveloperActivity({ id }) {
  const feed = useDeveloperActivity();
  const github = feed.data?.github;
  const waka = feed.data?.wakatime;
  const eventLabels = { PushEvent: id ? 'Kode diperbarui' : 'Code updated', PullRequestEvent: 'Pull request', IssuesEvent: 'Issue', CreateEvent: id ? 'Repository / branch baru' : 'Repository / branch created', ReleaseEvent: 'Release' };
  const retry = <button type="button" className="text-link" onClick={feed.retry}>{id ? 'Periksa lagi' : 'Check again'}</button>;
  return <section className="about-section" id="developer-activity" ref={feed.ref} aria-labelledby="developer-activity-title">
    <div className="section-heading"><div><p className="section-label">{id ? 'Di balik kode' : 'Behind the code'}</p><h2 id="developer-activity-title">{id ? 'Aktivitas developer.' : 'Developer activity.'}</h2></div></div>
    <div className="about-dev-grid">
      <article className="about-integration" aria-labelledby="about-github-title">
        <header className="about-integration-heading"><h3 id="about-github-title">GitHub</h3><a className="text-link" href={githubProfile} target="_blank" rel="noreferrer">@adiityaanugrah <span aria-hidden="true">↗</span></a></header>
        <p className="about-caption">{id ? 'Repository publik yang terakhir diperbarui. Pekerjaan privat tidak tercakup di sini.' : 'Recently updated public repositories. Private work is not included here.'}</p>
        {feed.loading && !github && <p role="status">{id ? 'Memuat aktivitas GitHub…' : 'Loading GitHub activity…'}</p>}
        {(feed.error || (!feed.loading && github?.status !== 'ready')) && <div className="about-feed-state"><p>{id ? 'Aktivitas GitHub belum berhasil dimuat. Profil tetap bisa dibuka.' : 'GitHub activity could not be loaded. You can still visit the profile.'}</p>{retry}</div>}
        {github?.status === 'ready' && <>
          {github.repositories?.length > 0 ? <ul className="about-repositories">{github.repositories.map(repo => <li key={repo.name}><div>{githubUrl(repo.url) ? <a href={githubUrl(repo.url)} target="_blank" rel="noreferrer">{repo.name} <span aria-hidden="true">↗</span></a> : <span>{repo.name}</span>}{repo.language && <span className="about-caption">{repo.language}</span>}</div>{repo.description && <p>{repo.description}</p>}{dateLabel(repo.pushedAt, id) && <p className="about-caption">{id ? 'Pembaruan kode' : 'Code updated'} / <time dateTime={repo.pushedAt}>{dateLabel(repo.pushedAt, id)}</time></p>}</li>)}</ul> : <p>{id ? 'Belum ada repository publik untuk ditampilkan.' : 'No public repositories to display yet.'}</p>}
          <h4 className="about-events-title">{id ? 'Aktivitas publik terbaru' : 'Recent public activity'}</h4>
          {github.events?.length > 0 ? <ul className="about-events">{github.events.map((event, index) => <li key={`${event.repository}-${index}`}><span>{eventLabels[event.type] || (id ? 'Aktivitas repository' : 'Repository activity')} / {event.repository}</span>{dateLabel(event.createdAt, id) && <time dateTime={event.createdAt}>{dateLabel(event.createdAt, id)}</time>}</li>)}</ul> : <p className="about-caption">{github.eventsStatus === 'unavailable' ? (id ? 'Aktivitas publik sementara belum termuat.' : 'Public activity is temporarily unavailable.') : (id ? 'Belum ada aktivitas publik terbaru yang dibagikan GitHub.' : 'GitHub has not shared any recent public activity.')}</p>}
        </>}
      </article>
      <article className="about-integration" aria-labelledby="about-wakatime-title">
        <header className="about-integration-heading"><h3 id="about-wakatime-title">WakaTime</h3><span className="about-caption">{id ? '7 hari terakhir' : 'Last 7 days'}</span></header>
        <p className="about-caption">{id ? 'Ringkasan aktivitas coding yang tercatat, bukan ukuran kemampuan atau seluruh waktu kerja.' : 'Recorded coding activity, not a measure of skill or total working time.'}</p>
        {feed.loading && !waka && <p role="status">{id ? 'Memuat ringkasan coding…' : 'Loading coding summary…'}</p>}
        {!feed.loading && waka?.status === 'not_configured' && <div className="about-feed-state"><p>{id ? 'Aktivitas coding belum dibagikan.' : 'Coding activity has not been shared yet.'}</p><p className="about-caption">{id ? 'Ringkasan akan tampil setelah akun WakaTime terhubung.' : 'The summary will appear once WakaTime is connected.'}</p></div>}
        {!feed.loading && waka?.status === 'processing' && <p role="status">{id ? 'WakaTime sedang menyiapkan ringkasan.' : 'WakaTime is preparing the summary.'}</p>}
        {(feed.error || (!feed.loading && !['ready', 'processing', 'not_configured'].includes(waka?.status))) && <div className="about-feed-state"><p>{id ? 'Ringkasan coding sementara belum tersedia.' : 'The coding summary is temporarily unavailable.'}</p>{retry}</div>}
        {waka?.status === 'ready' && <>
          <p className="about-coding-total">{new Intl.NumberFormat(id ? 'id-ID' : 'en-GB', { maximumFractionDigits: 1 }).format(waka.totalSeconds / 3600)} <span>{id ? 'jam tercatat' : 'hours recorded'}</span></p>
          {waka.totalSeconds === 0 && <p className="about-caption">{id ? 'Belum ada aktivitas tercatat pada periode ini.' : 'No activity recorded during this period.'}</p>}
          <ul className="about-languages">{waka.languages?.map(language => <li key={language.name}><div><span>{language.name}</span><span>{language.percent}%</span></div><meter min="0" max="100" value={language.percent} aria-label={language.name}>{language.percent}%</meter></li>)}</ul>
          {waka.editors?.length > 0 && <p className="about-caption">Editor / {waka.editors.join(', ')}</p>}
        </>}
      </article>
    </div>
  </section>;
}
