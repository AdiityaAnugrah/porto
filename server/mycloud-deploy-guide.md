# mycloud.adityaanugrah.me Deployment

This guide deploys `zenhosta/9drive` as a separate app on the same VPS as the portfolio.

## Target Architecture

- Domain: `https://mycloud.adityaanugrah.me`
- App path: `/var/www/mycloud.adityaanugrah.me`
- Frontend: Vite static build from `/var/www/mycloud.adityaanugrah.me/frontend/dist`
- Backend: Express API on `127.0.0.1:4000` through PM2 app `mycloud-9drive`
- Public API URL: `https://mycloud.adityaanugrah.me/api`
- Database: MariaDB database `9drive`
- Apache: serve frontend and reverse proxy `/api/` to backend

Use Cloudflare DNS only/gray cloud for this subdomain if large uploads are needed. Cloudflare proxied/orange cloud can block large uploads on lower plans.

## 1. DNS

In Cloudflare:

```txt
mycloud.adityaanugrah.me  A  194.233.90.4
Proxy status: DNS only / gray cloud for large uploads
```

## 2. Clone 9Drive

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/zenhosta/9drive.git mycloud.adityaanugrah.me
cd /var/www/mycloud.adityaanugrah.me
```

Apply the local-only backend bind patch so the API listens on `127.0.0.1:4000` instead of all interfaces:

```bash
git apply /var/www/adityaanugrah.me/server/mycloud-bind-localhost.patch
git config user.name "Server Deploy"
git config user.email "root@adityaanugrah.me"
git add backend/src/server.ts
git commit -m "Bind backend to localhost"
```

If you later fork 9Drive, move this patch into the fork and deploy from that fork instead.

## 3. Database

Create a dedicated database user instead of using MySQL root:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE IF NOT EXISTS `9drive` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '9drive'@'localhost' IDENTIFIED BY 'CHANGE_THIS_DB_PASSWORD';
GRANT ALL PRIVILEGES ON `9drive`.* TO '9drive'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 4. Backend Env

```bash
cd /var/www/mycloud.adityaanugrah.me/backend
nano .env
```

Use this shape:

```env
DATABASE_URL="mysql://9drive:CHANGE_THIS_DB_PASSWORD@127.0.0.1:3306/9drive"
APP_PORT=4000
FRONTEND_URL="https://mycloud.adityaanugrah.me"
JWT_ACCESS_SECRET="CHANGE_THIS_RANDOM_SECRET_AT_LEAST_32_CHARS"
TOKEN_ENCRYPTION_KEY="CHANGE_THIS_RANDOM_SECRET_AT_LEAST_32_CHARS"
ACCESS_TOKEN_TTL_SECONDS=900
REFRESH_TOKEN_TTL_DAYS=30
MAX_UPLOAD_BYTES=5368709120
RECAPTCHA_SECRET_KEY=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_REDIRECT_URI="https://mycloud.adityaanugrah.me/api/connected-accounts/google/callback"
```

Generate secrets on the server:

```bash
openssl rand -base64 48
openssl rand -base64 48
```

## 5. Frontend Env

```bash
cd /var/www/mycloud.adityaanugrah.me/frontend
nano .env
```

```env
VITE_API_URL=https://mycloud.adityaanugrah.me/api
VITE_RECAPTCHA_SITE_KEY=
```

## 6. Google Cloud OAuth

In Google Cloud Console:

- Enable Google Drive API.
- Configure OAuth consent screen.
- Add scopes:
  - `https://www.googleapis.com/auth/drive`
  - `https://www.googleapis.com/auth/userinfo.email`
  - `https://www.googleapis.com/auth/userinfo.profile`
- Authorized JavaScript origins:
  - `https://mycloud.adityaanugrah.me`
- Authorized redirect URIs:
  - `https://mycloud.adityaanugrah.me/api/connected-accounts/google/callback`
  - `https://mycloud.adityaanugrah.me/api/auth/google/callback`

Put the client ID and secret into `backend/.env`.

## 7. Install, Build, Migrate

```bash
cd /var/www/mycloud.adityaanugrah.me/backend
npm install
npm run build
npx prisma migrate deploy
npm run seed:google-config
```

```bash
cd /var/www/mycloud.adityaanugrah.me/frontend
npm install
npm run build
```

## 8. PM2

Copy the PM2 ecosystem file from the portfolio repo if available:

```bash
cp /var/www/adityaanugrah.me/server/ecosystem.9drive.config.cjs /var/www/mycloud.adityaanugrah.me/backend/ecosystem.config.cjs
cd /var/www/mycloud.adityaanugrah.me/backend
pm2 start ecosystem.config.cjs
pm2 save
```

If the portfolio repo is not present, create the same file with app name `mycloud-9drive` and script `/var/www/mycloud.adityaanugrah.me/backend/dist/server.js`.

## 9. Apache

Enable required modules:

```bash
a2enmod proxy proxy_http headers rewrite ssl
```

Install HTTP vhost:

```bash
cp /var/www/adityaanugrah.me/server/apache-mycloud.adityaanugrah.me.conf /etc/apache2/sites-available/mycloud.adityaanugrah.me.conf
a2ensite mycloud.adityaanugrah.me.conf
apache2ctl configtest
systemctl reload apache2
```

Issue SSL certificate:

```bash
certbot --apache -d mycloud.adityaanugrah.me --redirect
apache2ctl configtest
systemctl reload apache2
```

Only copy the `apache-mycloud.adityaanugrah.me-le-ssl.conf` template manually if certbot does not generate a usable SSL vhost.

## 10. Test

```bash
curl -I https://mycloud.adityaanugrah.me/
curl https://mycloud.adityaanugrah.me/api/health
pm2 status
pm2 logs mycloud-9drive
```

Manual browser test:

1. Open `https://mycloud.adityaanugrah.me`.
2. Register with email/password or Google.
3. Connect Google Drive in Settings if needed.
4. Upload a small test file.
5. Confirm the file appears in Google Drive folder `9drive`.

## Update

```bash
cd /var/www/mycloud.adityaanugrah.me
git pull --rebase origin main

cd backend
npm install
npm run build
npx prisma migrate deploy
pm2 restart mycloud-9drive

cd ../frontend
npm install
npm run build

systemctl reload apache2
```
