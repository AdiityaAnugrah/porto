# Server Context

Last updated: 2026-06-06

Dokumen ini untuk mempercepat sesi berikutnya dan sebagai catatan kalau VPS perlu di-upgrade/reinstall. Jangan taruh secret/API key/password di file ini.

## Infrastruktur

- Provider: Contabo VPS
- OS: Ubuntu 24.04 LTS
- IPv4: `194.233.90.4`
- Resource saat ini: 4 vCPU, RAM efektif sekitar 5.8 GB, swap 2 GB aktif, disk sekitar 90 GB
- Akses: SSH sebagai `root`
- Catatan keamanan: server lama pernah kena malware/botnet, server sekarang hasil reinstall bersih

## Firewall

- Firewall aktif: `firewalld`
- Jangan pakai `ufw`; UFW sudah dimatikan dan bisa konflik
- Port publik yang dipakai:
  - `22` SSH
  - `80` HTTP
  - `443` HTTPS
  - `10000` Virtualmin/Webmin
  - `25565` Minecraft
- Port internal:
  - `3100` API Node, listen hanya di `127.0.0.1`, tidak perlu dibuka ke publik

## DNS Cloudflare

- Nameserver: `ace.ns.cloudflare.com` dan `megan.ns.cloudflare.com`
- SSL/TLS mode Cloudflare harus `Full (strict)`
- `adityaanugrah.me`
  - A record ke `194.233.90.4`
  - Proxied/orange cloud boleh aktif
- `api.adityaanugrah.me`
  - A record ke `194.233.90.4`
  - Proxied/orange cloud boleh aktif
- `play.adityaanugrah.me`
  - A record ke `194.233.90.4`
  - Wajib DNS only/gray cloud untuk Minecraft TCP port `25565`

## Panel dan Stack

- Virtualmin/Webmin: `https://194.233.90.4:10000`
- Login panel: root
- DNS feature Virtualmin dimatikan karena DNS dikelola Cloudflare
- Web server: Apache, bukan Nginx
- Database: MariaDB 10.11
- Node.js: 24 LTS
- Process manager: PM2
- ClamAV dimatikan untuk hemat RAM, tidak dipakai email scanning

## Website Portfolio

- Domain: `https://adityaanugrah.me`
- Project: React + Vite SPA, bukan Next.js
- Repo: `https://github.com/AdiityaAnugrah/porto`
- Path server: `/var/www/adityaanugrah.me`
- Build output/live path: `/var/www/adityaanugrah.me/dist`
- Apache serve dari folder `dist`
- SSL: Let's Encrypt

Deploy/update:

```bash
cd /var/www/adityaanugrah.me
git status --short
git pull origin main
npm install
npm run build
cp .htaccess dist/.htaccess
systemctl reload apache2
```

SPA route fallback penting:

- File `.htaccess` harus ada di `/var/www/adityaanugrah.me/dist/.htaccess`
- Isi minimal:

```apache
RewriteEngine On
RewriteBase /

RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

RewriteRule . /index.html [L]
```

Test route:

```bash
curl -I https://adityaanugrah.me/about
```

Expected: `HTTP/2 200`

## API Portfolio

- Domain: `https://api.adityaanugrah.me`
- Path server: `/opt/aditya-api`
- Source in repo: `server/`
- Runtime: Node native HTTP server, no Express dependency
- PM2 app name: `aditya-api`
- Listen: `127.0.0.1:3100`
- Apache reverse proxy to `http://127.0.0.1:3100/`
- SSL: Let's Encrypt via certbot Apache plugin

Endpoints:

```txt
GET /health
GET /spotify/now-playing
GET /steam/profile
GET /pubg/steam/player/BOKONG_BASAH
```

Current setup commands:

```bash
mkdir -p /opt/aditya-api
cp -r /var/www/adityaanugrah.me/server/* /opt/aditya-api/
cd /opt/aditya-api
cp .env.example .env
nano .env
pm2 start ecosystem.config.cjs
pm2 save
```

Required env keys in `/opt/aditya-api/.env`:

```env
HOST=127.0.0.1
PORT=3100
REQUEST_TIMEOUT_MS=8000
ALLOWED_ORIGINS=https://adityaanugrah.me,http://localhost:5173,http://127.0.0.1:5173
SPOTIFY_CACHE_TTL_MS=15000
STEAM_CACHE_TTL_MS=60000
PUBG_CACHE_TTL_MS=300000
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REFRESH_TOKEN=
STEAM_API_KEY=
STEAM_ID=
PUBG_API_KEY=
```

Do not commit `/opt/aditya-api/.env`.

Apache setup:

```bash
a2enmod proxy proxy_http headers rewrite ssl
cp /opt/aditya-api/apache-api.adityaanugrah.me.conf /etc/apache2/sites-available/api.adityaanugrah.me.conf
a2ensite api.adityaanugrah.me.conf
apache2ctl configtest
systemctl reload apache2
certbot --apache -d api.adityaanugrah.me --redirect
apache2ctl configtest
systemctl reload apache2
```

Test API:

```bash
curl http://127.0.0.1:3100/health
curl https://api.adityaanugrah.me/health
curl https://api.adityaanugrah.me/steam/profile
curl https://api.adityaanugrah.me/spotify/now-playing
curl https://api.adityaanugrah.me/pubg/steam/player/BOKONG_BASAH
pm2 status
pm2 logs aditya-api
```

## Minecraft Server

- Software: Paper 1.20.1
- Path: `/opt/minecraft`
- systemd service: `minecraft`
- Linux user: `minecraft` non-root
- Auto-start: enabled
- Java heap: `-Xms2G -Xmx2G`
- JVM flags: Aikar flags
- Mode: `offline-mode=true`
- Whitelist: active
- Operator: `Kusuo0`
- Plugins:
  - ViaVersion
  - ViaBackwards
- Client access: `play.adityaanugrah.me`, default port `25565`

Performance/anti-lag settings:

- `view-distance=8`
- `simulation-distance=6`
- `max-players=10`
- entity activation range lowered
- `nerf-spawner-mobs=true`

Useful commands:

```bash
systemctl status minecraft
systemctl restart minecraft
journalctl -u minecraft -n 100 --no-pager
sudo -u minecraft screen -ls
```

If migrating VPS, preserve at least:

```txt
/opt/minecraft/world*
/opt/minecraft/plugins
/opt/minecraft/server.properties
/opt/minecraft/bukkit.yml
/opt/minecraft/spigot.yml
/opt/minecraft/paper-global.yml
/opt/minecraft/paper-world-defaults.yml
/opt/minecraft/ops.json
/opt/minecraft/whitelist.json
/opt/minecraft/banned-players.json
/opt/minecraft/banned-ips.json
```

Also preserve the systemd unit if custom:

```bash
systemctl cat minecraft
```

## Minecraft Info Page

- Domain: `https://play.adityaanugrah.me`
- Repo path: `/var/www/adityaanugrah.me/play`
- Apache document root should be `/var/www/adityaanugrah.me/play`
- Source in repo: `play/index.html`
- Type: static HTML tracked in Git
- SSL: Let's Encrypt
- Donation link: `https://saweria.co/Adityaanugrah`
- Current page includes a donate button/support link
- Keep donation wording as voluntary support for VPS/domain/maintenance
- Do not sell rank, items, or pay-to-win benefits
- Apache vhost templates in repo:
  - `server/apache-play.adityaanugrah.me.conf`
  - `server/apache-play.adityaanugrah.me-le-ssl.conf`

Deploy/update:

```bash
cd /var/www/adityaanugrah.me
git pull origin main
systemctl reload apache2
```

First-time Apache setup or migration from the old manual path:

```bash
cp /var/www/adityaanugrah.me/server/apache-play.adityaanugrah.me.conf /etc/apache2/sites-available/play.adityaanugrah.me.conf
cp /var/www/adityaanugrah.me/server/apache-play.adityaanugrah.me-le-ssl.conf /etc/apache2/sites-available/play.adityaanugrah.me-le-ssl.conf
a2ensite play.adityaanugrah.me.conf
a2ensite play.adityaanugrah.me-le-ssl.conf
apache2ctl configtest
systemctl reload apache2
```

Run certbot only if the certificate does not exist yet:

```bash
certbot --apache -d play.adityaanugrah.me --redirect
```

Backup before editing:

```bash
cp /var/www/adityaanugrah.me/play/index.html /var/www/adityaanugrah.me/play/index.html.bak
```

Test:

```bash
curl -I https://play.adityaanugrah.me/
```

## Backup Checklist Before VPS Upgrade/Reinstall

Create backup directory:

```bash
mkdir -p /root/server-backup
```

Website and API:

```bash
tar -czf /root/server-backup/www-adityaanugrah.tar.gz /var/www/adityaanugrah.me
tar -czf /root/server-backup/aditya-api.tar.gz /opt/aditya-api
```

Minecraft:

```bash
systemctl stop minecraft
tar -czf /root/server-backup/minecraft.tar.gz /opt/minecraft
systemctl start minecraft
```

Apache config and certificates:

```bash
tar -czf /root/server-backup/apache-sites.tar.gz /etc/apache2/sites-available /etc/apache2/sites-enabled
tar -czf /root/server-backup/letsencrypt.tar.gz /etc/letsencrypt
```

PM2:

```bash
pm2 save
tar -czf /root/server-backup/pm2-root.tar.gz /root/.pm2
pm2 status > /root/server-backup/pm2-status.txt
```

Firewall:

```bash
firewall-cmd --list-all-zones > /root/server-backup/firewalld-zones.txt
```

MariaDB:

```bash
mysqldump --all-databases --single-transaction --routines --events > /root/server-backup/all-databases.sql
```

System/package reference:

```bash
dpkg -l > /root/server-backup/dpkg-list.txt
systemctl list-unit-files > /root/server-backup/systemd-unit-files.txt
systemctl list-units --type=service --state=running > /root/server-backup/running-services.txt
```

Archive all backups:

```bash
tar -czf /root/server-backup-$(date +%F).tar.gz -C /root server-backup
```

Copy off the VPS before reinstalling:

```bash
scp root@194.233.90.4:/root/server-backup-YYYY-MM-DD.tar.gz .
```

## Fresh Server Restore Outline

1. Install Ubuntu 24.04 LTS.
2. Secure SSH and root access.
3. Install Apache, MariaDB, Node.js 24 LTS, PM2, firewalld, certbot.
4. Do not enable UFW.
5. Restore `/var/www/adityaanugrah.me`, `/opt/aditya-api`, `/opt/minecraft`.
6. Restore Apache vhosts or recreate them.
7. Reissue Let's Encrypt certs if restoring `/etc/letsencrypt` is not appropriate.
8. Restore PM2 app:

```bash
cd /opt/aditya-api
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

9. Restore Minecraft service and enable:

```bash
systemctl daemon-reload
systemctl enable minecraft
systemctl start minecraft
```

10. Recreate firewalld rules for ports `22`, `80`, `443`, `10000`, `25565`.
11. Verify Cloudflare DNS and SSL mode `Full (strict)`.
12. Test:

```bash
curl -I https://adityaanugrah.me/about
curl https://api.adityaanugrah.me/health
curl -I https://play.adityaanugrah.me/
systemctl status minecraft
pm2 status
```

## Known Caveats

- `api.adityaanugrah.me/` root returns `{"error":"Not found"}` by design. Use `/health`.
- If `adityaanugrah.me/about` returns 404, check `dist/.htaccess` and Apache `AllowOverride`.
- If browser shows stale pages, try hard refresh or clear Cloudflare/browser cache.
- `npm install` currently warns about `react-helmet` peer dependency with React 19; build still succeeds.
- `npm audit` reports vulnerabilities. Handle separately with care because forced upgrades may introduce breaking changes.
