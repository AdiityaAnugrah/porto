# api.adityaanugrah.me

Backend kecil untuk widget portfolio:

- `GET /health`
- `GET /spotify/now-playing`
- `GET /steam/profile`
- `GET /pubg/steam/player/:ign`

Server ini memakai Node.js bawaan saja, tanpa Express dan tanpa dependency tambahan.

## DNS

Di Cloudflare:

- `api.adityaanugrah.me` -> A record `194.233.90.4`
- Proxied boleh aktif untuk API ini
- SSL/TLS mode tetap `Full (strict)`

## Deploy Di VPS

Jalankan sebagai `root`.

```bash
mkdir -p /opt/aditya-api
cp -r server/* /opt/aditya-api/
cd /opt/aditya-api
cp .env.example .env
nano .env
```

Isi credential:

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REFRESH_TOKEN`
- `STEAM_API_KEY`
- `STEAM_ID`
- `PUBG_API_KEY`

Test lokal:

```bash
node api-server.mjs
curl http://127.0.0.1:3100/health
```

Jalankan via PM2:

```bash
cd /opt/aditya-api
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

## Apache Reverse Proxy

Aktifkan module Apache yang dibutuhkan:

```bash
a2enmod proxy proxy_http headers rewrite ssl
```

Pasang vhost HTTP awal:

```bash
cp /opt/aditya-api/apache-api.adityaanugrah.me.conf /etc/apache2/sites-available/api.adityaanugrah.me.conf
a2ensite api.adityaanugrah.me.conf
apache2ctl configtest
systemctl reload apache2
```

Pasang SSL Let's Encrypt dan redirect HTTPS:

```bash
certbot --apache -d api.adityaanugrah.me --redirect
apache2ctl configtest
systemctl reload apache2
```

Test public:

```bash
curl https://api.adityaanugrah.me/health
curl https://api.adityaanugrah.me/steam/profile
curl https://api.adityaanugrah.me/spotify/now-playing
curl https://api.adityaanugrah.me/pubg/steam/player/BOKONG_BASAH
```

## Firewall

Tidak perlu buka port `3100` ke publik. Node hanya listen di `127.0.0.1`, publik masuk lewat Apache port `443`.

Jangan pakai UFW di server ini. Firewall tetap `firewalld`.

## Spotify Refresh Token

Refresh token harus punya scope:

```txt
user-read-currently-playing user-read-recently-played
```

Kalau Spotify endpoint mengembalikan `403`, biasanya refresh token dibuat tanpa scope yang tepat.
