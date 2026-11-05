import http from 'node:http';
import { randomBytes, createHash, timingSafeEqual } from 'node:crypto';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const clientId = process.env.SPOTIFY_CLIENT_ID || process.argv[2];
if (!clientId) throw new Error('Set SPOTIFY_CLIENT_ID or pass the public client ID.');
const redirectUri = 'http://127.0.0.1:8888/callback';
const verifier = randomBytes(48).toString('base64url');
const state = randomBytes(32).toString('hex');
const authorization = new URL('https://accounts.spotify.com/authorize');
authorization.search = new URLSearchParams({ client_id: clientId, response_type: 'code', redirect_uri: redirectUri,
  scope: 'user-read-currently-playing user-read-recently-played', state,
  code_challenge_method: 'S256', code_challenge: createHash('sha256').update(verifier).digest('base64url'), show_dialog: 'true' });
let exchanging = false;
const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  const url = new URL(req.url, redirectUri);
  const received = Buffer.from(url.searchParams.get('state') || '');
  if (url.pathname !== '/callback' || received.length !== state.length || !timingSafeEqual(received, Buffer.from(state))) {
    res.writeHead(400); return res.end('Invalid callback state.');
  }
  if (url.searchParams.has('error')) { res.writeHead(400); return res.end('Otorisasi dibatalkan. Buka kembali tautan otorisasi.'); }
  if (!url.searchParams.get('code') || exchanging) { res.writeHead(400); return res.end('Invalid or duplicate callback.'); }
  exchanging = true;
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', { method: 'POST', signal: AbortSignal.timeout(15000),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: clientId, grant_type: 'authorization_code', code: url.searchParams.get('code'), redirect_uri: redirectUri, code_verifier: verifier }) });
    const data = await response.json();
    if (!response.ok || !data.refresh_token) throw new Error(`Spotify authorization failed (HTTP ${response.status}).`);
    const directory = await mkdtemp(join(tmpdir(), 'porto-spotify-'));
    const path = join(directory, 'credentials.json');
    await writeFile(path, JSON.stringify({ refresh_token: data.refresh_token, scope: data.scope }), { mode: 0o600 });
    console.log(`AUTHORIZED credentials saved privately: ${path}`);
    res.end('Spotify terhubung. Anda boleh menutup tab ini.');
    server.close(); clearTimeout(expiry);
  } catch (error) { exchanging = false; console.error(error.message); res.writeHead(502); res.end('Otorisasi gagal. Buka kembali tautan otorisasi.'); }
});
const expiry = setTimeout(() => { console.log('Authorization session expired. Run the helper again.'); server.close(); }, 45 * 60 * 1000);
server.listen(8888, '127.0.0.1', () => console.log(authorization.href));
