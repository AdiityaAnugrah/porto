const GITHUB_USER = 'adiityaanugrah';

async function json(url, options = {}) {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(6500) });
  if (!response.ok) throw new Error(`Activity HTTP ${response.status}`);
  return { status: response.status, body: await response.json() };
}

export async function getGithubActivity() {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'aditya-portfolio' };
  const [repos, events] = await Promise.allSettled([
    json(`https://api.github.com/users/${GITHUB_USER}/repos?sort=pushed&per_page=30`, { headers }),
    json(`https://api.github.com/users/${GITHUB_USER}/events/public?per_page=10`, { headers }),
  ]);
  if (repos.status === 'rejected') throw new Error('GitHub unavailable');
  if (!Array.isArray(repos.value.body)) throw new Error('Invalid GitHub response');
  return {
    status: 'ready', username: GITHUB_USER, profileUrl: `https://github.com/${GITHUB_USER}`,
    repositories: repos.value.body.filter(repo => !repo.fork && !repo.archived && !repo.private)
      .slice(0, 3).map(repo => ({ name: repo.name, description: repo.description || '',
        url: `https://github.com/${GITHUB_USER}/${encodeURIComponent(repo.name)}`,
        language: repo.language, pushedAt: repo.pushed_at })),
    eventsStatus: events.status === 'fulfilled' ? 'ready' : 'unavailable',
    events: (events.status === 'fulfilled' && Array.isArray(events.value.body) ? events.value.body : [])
      .filter(event => event.repo?.name && event.created_at).slice(0, 3)
      .map(event => ({ type: event.type, repository: event.repo.name, createdAt: event.created_at })),
  };
}

export async function getWakatimeActivity() {
  const token = process.env.WAKATIME_ACCESS_TOKEN?.trim();
  if (!token) return { status: 'not_configured' };
  const { status, body } = await json('https://api.wakatime.com/api/v1/users/current/stats/last_7_days', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (status === 202 || body.data?.is_up_to_date === false) return { status: 'processing' };
  const data = body.data;
  if (!data || !Number.isFinite(data.total_seconds)) throw new Error('Invalid WakaTime response');
  return { status: 'ready', totalSeconds: Math.max(0, data.total_seconds),
    languages: (data.languages || []).slice(0, 4).map(item => ({ name: item.name,
      percent: Math.min(100, Math.max(0, Number(item.percent) || 0)) })),
    editors: (data.editors || []).slice(0, 2).map(item => item.name),
    range: 'last_7_days', updatedAt: data.modified_at || null };
}

export async function getDeveloperActivity() {
  const [github, wakatime] = await Promise.allSettled([getGithubActivity(), getWakatimeActivity()]);
  return { github: github.status === 'fulfilled' ? github.value : { status: 'unavailable' },
    wakatime: wakatime.status === 'fulfilled' ? wakatime.value : { status: 'unavailable' } };
}
