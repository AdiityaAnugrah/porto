import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const path = process.argv[2] || 'server/api-server.mjs';
const baseline = process.argv.includes('--baseline');
const source = readFileSync(path, 'utf8');
const block = source.slice(source.indexOf('async function getSpotifyAccessToken()'), source.indexOf('async function getSteamProfile()'));
const track = name => ({ name, artists: [{ name: 'Artist' }], external_urls: { spotify: `https://open.spotify.com/track/${name}` } });
const fail = (status, publicDetail) => Object.assign(new Error(`HTTP ${status}`), { status, publicDetail });
async function run({ tokenError, current = null, recent = [], currentError, recentError } = {}) {
  const context = vm.createContext({ Buffer, URLSearchParams, console: { warn() {} }, requireEnv: () => 'fixture',
    requestJson: async url => {
      if (url.includes('/api/token')) { if (tokenError) throw tokenError; return { data: { access_token: 'fixture' } }; }
      if (url.includes('currently-playing')) { if (currentError) throw currentError; return { data: current }; }
      if (recentError) throw recentError;
      return { data: { items: recent.map(name => ({ track: track(name), played_at: '2026-11-05T00:00:00Z' })) } };
    } });
  vm.runInContext(block, context);
  return JSON.parse(JSON.stringify(await vm.runInContext('getSpotifyTracks()', context)));
}
if (baseline) {
  assert.deepEqual(await run({ tokenError: fail(400, 'invalid_grant') }), []);
  assert.deepEqual(await run({ current: { item: track('Current'), is_playing: true }, recentError: fail(502) }), []);
  console.log('BASELINE: revoked token => []; current + history failure => []; reproduced 2 bugs');
} else {
  await assert.rejects(run({ tokenError: fail(400, 'invalid_grant') }), error => error.status === 503 && error.code === 'SPOTIFY_REAUTH_REQUIRED');
  assert.equal((await run({ current: { item: track('Current'), is_playing: true }, recentError: fail(502) }))[0].title, 'Current');
  assert.equal((await run({ currentError: fail(502), recent: ['Recent'] }))[0].title, 'Recent');
  assert.deepEqual(await run(), []);
  assert.deepEqual(await run({ currentError: fail(404) }), []);
  await assert.rejects(run({ recentError: fail(403) }), error => error.code === 'SPOTIFY_REAUTH_REQUIRED');
  await assert.rejects(run({ currentError: fail(502), recentError: fail(429) }), error => error.code === 'SPOTIFY_UNAVAILABLE');
  const list = await run({ current: { item: track('A'), is_playing: false }, recent: ['A', 'B', 'B', 'C', 'D', 'E', 'F'] });
  assert.equal(list.length, 5); assert.equal(list[0].isPlaying, false); assert.equal(new Set(list.map(item => item.songUrl)).size, 5);
  await assert.rejects(run({ tokenError: fail(400, 'invalid_client') }), error => error.code === 'SPOTIFY_CONFIGURATION_ERROR');
  console.log('MODIFIED: 9 scenarios passed; reauth=503/SPOTIFY_REAUTH_REQUIRED; partial feeds preserved; empty/dedup/paused/limit passed');
}
