import test from 'node:test';
import assert from 'node:assert/strict';
import { getDeveloperActivity, getGithubActivity, getWakatimeActivity } from './developer-activity.mjs';

const originalFetch = globalThis.fetch;
const originalToken = process.env.WAKATIME_ACCESS_TOKEN;
test.afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalToken === undefined) delete process.env.WAKATIME_ACCESS_TOKEN;
  else process.env.WAKATIME_ACCESS_TOKEN = originalToken;
});
const response = (body, status = 200) => ({ ok: status >= 200 && status < 300, status, json: async () => body });

test('GitHub exposes only three active public original repositories and safe URLs', async () => {
  globalThis.fetch = async url => response(url.includes('/repos?') ? [
    { name: 'fork', fork: true }, { name: 'archived', archived: true }, { name: 'private', private: true },
    ...['one', 'two', 'three', 'four'].map(name => ({ name, description: 'Description', html_url: 'javascript:invalid', language: 'JavaScript' })),
  ] : [{ type: 'PushEvent', repo: { name: 'adiityaanugrah/one' }, created_at: '2026-11-05T00:00:00Z', payload: { secret: 'not-public-output' } }]);
  const data = await getGithubActivity();
  assert.equal(data.repositories.length, 3);
  assert.equal(data.repositories[0].url, 'https://github.com/adiityaanugrah/one');
  assert.equal(data.events.length, 1);
  assert.equal(JSON.stringify(data).includes('not-public-output'), false);
});
test('GitHub events failure preserves repositories', async () => {
  globalThis.fetch = async url => response(url.includes('/repos?') ? [] : {}, url.includes('/repos?') ? 200 : 403);
  const data = await getGithubActivity();
  assert.equal(data.status, 'ready'); assert.equal(data.eventsStatus, 'unavailable');
});
test('GitHub rate limit is an unavailable state, not fake empty success', async () => {
  delete process.env.WAKATIME_ACCESS_TOKEN;
  globalThis.fetch = async () => response({}, 429);
  const data = await getDeveloperActivity();
  assert.equal(data.github.status, 'unavailable');
  assert.equal(data.wakatime.status, 'not_configured');
});
test('WakaTime does not request anything without configuration', async () => {
  delete process.env.WAKATIME_ACCESS_TOKEN;
  globalThis.fetch = async () => { throw new Error('Unexpected network call'); };
  assert.deepEqual(await getWakatimeActivity(), { status: 'not_configured' });
});
test('WakaTime sends server-only OAuth and omits projects, token, and machine names', async () => {
  process.env.WAKATIME_ACCESS_TOKEN = 'fixture-private-token';
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://api.wakatime.com/api/v1/users/current/stats/last_7_days');
    assert.equal(options.headers.Authorization, 'Bearer fixture-private-token');
    return response({ data: { total_seconds: 7200, languages: [{ name: 'TypeScript', percent: 70 }], editors: [{ name: 'VS Code' }], projects: ['private-project'], machines: ['private-machine'] } });
  };
  const data = await getWakatimeActivity();
  assert.equal(data.totalSeconds, 7200); assert.equal(data.languages[0].percent, 70);
  assert.equal(JSON.stringify(data).includes('private'), false);
});
test('WakaTime processing is not rendered as zero coding activity', async () => {
  process.env.WAKATIME_ACCESS_TOKEN = 'fixture';
  globalThis.fetch = async () => response({}, 202);
  assert.deepEqual(await getWakatimeActivity(), { status: 'processing' });
});
test('WakaTime percentages are bounded and missing totals rejected', async () => {
  process.env.WAKATIME_ACCESS_TOKEN = 'fixture';
  globalThis.fetch = async () => response({ data: { total_seconds: 0, languages: [{ name: 'A', percent: 200 }, { name: 'B', percent: -10 }] } });
  assert.deepEqual((await getWakatimeActivity()).languages.map(item => item.percent), [100, 0]);
  globalThis.fetch = async () => response({ data: {} });
  await assert.rejects(getWakatimeActivity());
});
test('WakaTime auth failure does not remove successful GitHub data', async () => {
  process.env.WAKATIME_ACCESS_TOKEN = 'fixture';
  globalThis.fetch = async url => response(url.includes('wakatime') ? {} : [], url.includes('wakatime') ? 401 : 200);
  const data = await getDeveloperActivity();
  assert.equal(data.github.status, 'ready'); assert.equal(data.wakatime.status, 'unavailable');
});
