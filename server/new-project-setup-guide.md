# New Project Setup Guide

Last updated: 2026-06-08

Panduan ini dipakai saat VPS yang sama ingin host beberapa website, subdomain, atau aplikasi baru.

Nama konsepnya:

- **Virtual host / vhost**: Apache memilih website berdasarkan domain yang diminta browser.
- **Reverse proxy**: Apache menerima HTTPS publik lalu meneruskan request ke aplikasi internal, misalnya Node.js di `127.0.0.1:3200`.
- **Multi-site hosting**: satu VPS menjalankan banyak domain/subdomain.

## Server Pattern Saat Ini

- Login SSH: `aditya@194.233.90.4` memakai SSH key.
- Root shell: `sudo -i`.
- Web server publik: Apache.
- DNS: Cloudflare.
- SSL: Let's Encrypt via `certbot --apache`.
- Process manager Node: PM2.
- Database: MariaDB.
- Firewall: `firewalld`, jangan pakai UFW.
- Port publik normal: `80`, `443`, `22`.
- Port aplikasi internal harus bind ke `127.0.0.1`, bukan `0.0.0.0`.

## Pilih Tipe Project

### 1. Static HTML

Contoh: landing page, dokumentasi, halaman info.

- Source/live path: `/var/www/example.com`
- Apache `DocumentRoot`: `/var/www/example.com`
- Tidak butuh PM2.
- Tidak butuh port internal.

### 2. React/Vite SPA

Contoh: portfolio, admin frontend statis, website company profile.

- Repo path: `/var/www/example.com`
- Build output: `/var/www/example.com/dist`
- Apache `DocumentRoot`: `/var/www/example.com/dist`
- Butuh `.htaccess` route fallback kalau memakai React Router.
- Tidak butuh PM2 kecuali ada backend.

### 3. Node API

Contoh: REST API, webhook, backend kecil.

- App path: `/opt/example-api` atau `/var/www/example.com/backend`
- Listen: `127.0.0.1:<internal-port>`
- PM2 app name: `example-api`
- Apache reverse proxy dari domain publik ke port internal.
- Jangan buka port internal di firewall.

### 4. Fullstack

Contoh: frontend Vite + backend Node.

- Frontend path: `/var/www/example.com/frontend`
- Frontend build: `/var/www/example.com/frontend/dist`
- Backend path: `/var/www/example.com/backend`
- Backend listen: `127.0.0.1:<internal-port>`
- Apache serve frontend dan proxy `/api/` ke backend.

## Naming Convention

Gunakan format yang konsisten:

```txt
Domain:        app.example.com
Web path:      /var/www/app.example.com
Apache conf:   /etc/apache2/sites-available/app.example.com.conf
PM2 name:      app-example
Internal port: 3200, 3201, 3202, ...
Log prefix:    app.example.com
Database:      app_example
DB user:       app_example
```

Catat setiap project baru di `server-context.md`.

## Port Internal

Sebelum memilih port:

```bash
ss -ltnp
```

Rekomendasi alokasi:

```txt
3100  aditya-api
3200+ project Node/API berikutnya
4000+ optional fullstack/private apps
```

Aturan:

- Backend harus listen ke `127.0.0.1`.
- Jangan pakai port `80`, `443`, `22`, `25565`, atau `10000`.
- Jangan buka port backend di Cloudflare/firewalld.

## DNS Cloudflare

Untuk website HTTP/HTTPS:

```txt
Type: A
Name: app
IPv4: 194.233.90.4
Proxy: Proxied/orange cloud boleh aktif
SSL/TLS mode: Full (strict)
```

Untuk layanan non-HTTP seperti Minecraft:

```txt
Proxy: DNS only/gray cloud
```

Tunggu DNS resolve:

```bash
dig +short app.example.com
```

Expected:

```txt
194.233.90.4
```

## Checklist Static Site

Ganti `app.example.com` sesuai domain.

```bash
sudo -i
mkdir -p /var/www/app.example.com
chown -R aditya:www-data /var/www/app.example.com
chmod -R 755 /var/www/app.example.com
```

Buat `/etc/apache2/sites-available/app.example.com.conf`:

```apache
<VirtualHost *:80>
    ServerName app.example.com
    DocumentRoot /var/www/app.example.com

    <Directory /var/www/app.example.com>
        Options -Indexes +FollowSymLinks
        AllowOverride None
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/app.example.com-error.log
    CustomLog ${APACHE_LOG_DIR}/app.example.com-access.log combined
</VirtualHost>
```

Enable:

```bash
a2ensite app.example.com.conf
apache2ctl configtest
systemctl reload apache2
certbot --apache -d app.example.com --redirect
apache2ctl configtest
systemctl reload apache2
```

Test:

```bash
curl -I https://app.example.com/
```

## Checklist React/Vite SPA

Clone project:

```bash
sudo -i
cd /var/www
git clone REPO_URL app.example.com
cd /var/www/app.example.com
npm install
npm run build
```

Jika pakai React Router, buat `.htaccess` di root repo dan copy ke `dist`:

```apache
RewriteEngine On
RewriteBase /

RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

RewriteRule . /index.html [L]
```

```bash
cp .htaccess dist/.htaccess
```

Buat Apache config:

```apache
<VirtualHost *:80>
    ServerName app.example.com
    DocumentRoot /var/www/app.example.com/dist

    <Directory /var/www/app.example.com/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/app.example.com-error.log
    CustomLog ${APACHE_LOG_DIR}/app.example.com-access.log combined
</VirtualHost>
```

Enable SSL:

```bash
a2ensite app.example.com.conf
apache2ctl configtest
systemctl reload apache2
certbot --apache -d app.example.com --redirect
apache2ctl configtest
systemctl reload apache2
```

Test route:

```bash
curl -I https://app.example.com/
curl -I https://app.example.com/some-spa-route
```

Expected: `200`.

## Checklist Node API

Contoh pakai port `3200`.

Environment aplikasi harus bind lokal:

```env
HOST=127.0.0.1
PORT=3200
```

PM2 ecosystem example:

```js
module.exports = {
  apps: [
    {
      name: "app-api",
      script: "server.js",
      cwd: "/opt/app-api",
      env: {
        NODE_ENV: "production",
      },
      max_memory_restart: "300M",
    },
  ],
};
```

Start:

```bash
cd /opt/app-api
npm install
npm run build
pm2 start ecosystem.config.cjs
pm2 save
```

Apache reverse proxy:

```apache
<VirtualHost *:80>
    ServerName api.app.example.com

    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:3200/
    ProxyPassReverse / http://127.0.0.1:3200/

    RequestHeader set X-Forwarded-Proto "http"
    RequestHeader set X-Forwarded-Port "80"

    ErrorLog ${APACHE_LOG_DIR}/api.app.example.com-error.log
    CustomLog ${APACHE_LOG_DIR}/api.app.example.com-access.log combined
</VirtualHost>
```

Enable modules once if not already enabled:

```bash
a2enmod proxy proxy_http headers rewrite ssl
```

Enable site:

```bash
a2ensite api.app.example.com.conf
apache2ctl configtest
systemctl reload apache2
certbot --apache -d api.app.example.com --redirect
```

Test:

```bash
curl http://127.0.0.1:3200/health
curl https://api.app.example.com/health
pm2 status
pm2 logs app-api --lines 60 --nostream
```

## Checklist Fullstack Frontend + API

Apache config pattern:

```apache
<VirtualHost *:80>
    ServerName app.example.com
    DocumentRoot /var/www/app.example.com/frontend/dist

    <Directory /var/www/app.example.com/frontend/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ProxyPreserveHost On
    ProxyPass /api/ http://127.0.0.1:3200/
    ProxyPassReverse /api/ http://127.0.0.1:3200/

    ErrorLog ${APACHE_LOG_DIR}/app.example.com-error.log
    CustomLog ${APACHE_LOG_DIR}/app.example.com-access.log combined
</VirtualHost>
```

Important:

- Frontend env should use public API path, for example `VITE_API_URL=https://app.example.com/api`.
- Backend CORS should allow `https://app.example.com`.
- Backend should still listen only on `127.0.0.1:3200`.

## MariaDB Project Setup

Create database and user:

```bash
mariadb
```

```sql
CREATE DATABASE app_example CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'app_example'@'localhost' IDENTIFIED BY 'CHANGE_THIS_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON app_example.* TO 'app_example'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Use `.env`:

```env
DATABASE_URL="mysql://app_example:CHANGE_THIS_STRONG_PASSWORD@127.0.0.1:3306/app_example"
```

Never commit `.env`.

## Deploy Update Pattern

Static/Vite:

```bash
cd /var/www/app.example.com
git status --short
git pull origin main
npm install
npm run build
cp .htaccess dist/.htaccess
systemctl reload apache2
```

Node API:

```bash
cd /opt/app-api
git status --short
git pull origin main
npm install
npm run build
pm2 restart app-api
pm2 save
```

## Health Checks

Run after every deploy:

```bash
apache2ctl configtest
systemctl status apache2 --no-pager
pm2 status
ss -ltnp
curl -I https://app.example.com/
curl https://api.app.example.com/health
tail -n 80 /var/log/apache2/app.example.com-error.log
```

## Backup Before Major Changes

```bash
mkdir -p /root/server-backup
tar -czf /root/server-backup/app.example.com-www.tar.gz /var/www/app.example.com
tar -czf /root/server-backup/app-api.tar.gz /opt/app-api
mysqldump app_example > /root/server-backup/app_example.sql
cp /etc/apache2/sites-available/app.example.com.conf /root/server-backup/
pm2 save
```

## Remove A Project

Stop process:

```bash
pm2 delete app-api
pm2 save
```

Disable Apache:

```bash
a2dissite app.example.com.conf
a2dissite app.example.com-le-ssl.conf
apache2ctl configtest
systemctl reload apache2
```

Delete files:

```bash
rm -rf /var/www/app.example.com
rm -rf /opt/app-api
rm -f /etc/apache2/sites-available/app.example.com.conf
rm -f /etc/apache2/sites-available/app.example.com-le-ssl.conf
rm -f /etc/apache2/sites-enabled/app.example.com.conf
rm -f /etc/apache2/sites-enabled/app.example.com-le-ssl.conf
```

Delete certificate:

```bash
certbot certificates
certbot delete --cert-name app.example.com
```

Delete database only after backup:

```bash
mariadb -e "DROP DATABASE IF EXISTS app_example;"
mariadb -e "DROP USER IF EXISTS 'app_example'@'localhost';"
mariadb -e "FLUSH PRIVILEGES;"
```

Final check:

```bash
pm2 status
apache2ctl -S 2>&1 | grep -i app.example.com || true
certbot certificates | grep -i app.example.com || true
ss -ltnp | grep -E ':(3200)\b' || true
```

Also remove the DNS record from Cloudflare.

## Security Rules

- Do not expose app ports publicly.
- Do not run app processes as root if the app can run as a normal user.
- Do not commit `.env`, private keys, database dumps, OAuth secrets, or API tokens.
- Use HTTPS for public sites.
- Keep Cloudflare SSL/TLS mode at `Full (strict)`.
- Use `apache2ctl configtest` before every Apache reload.
- Keep `pm2 save` updated after adding/removing Node apps.
- Prefer one domain/subdomain per app.
- Keep project notes in `server-context.md`.

## New Project Quick Template

Copy and fill this before starting:

```txt
Project name:
Domain:
Type: static / Vite SPA / Node API / fullstack
Repo:
Server path:
Build output:
Internal port:
PM2 app name:
Database name:
Database user:
Cloudflare proxied: yes/no
Apache conf:
Health endpoint:
Deploy command:
Rollback plan:
```
