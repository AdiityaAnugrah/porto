# Aditya Anugrah Portfolio 🚀

Website portfolio premium untuk Personal Branding & Jasa Konsultasi Web Development.
Dibangun dengan **React**, **Vite**, **Tailwind CSS**, dan **Framer Motion**.

## Fitur Utama
- ⚡ **Super Cepat**: Skor 100/100 (Lazy Load, Code Split, Font Swap).
- 📱 **Mobile First**: Optimal di HP (12px base font, touch-friendly).
- 🌑 **Premium Dark Mode**: Desain elegan untuk pasar high-end.
- 📧 **Working Contact Form**: Integrasi EmailJS (Langsung masuk Gmail).
- 🔍 **SEO Ready**: Dilengkapi `sitemap.xml`, `robots.txt`, dan JSON-LD Schema.

## Cara Menjalankan (Local)

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Jalankan Mode Development**
    ```bash
    npm run dev
    ```
    Buka `http://localhost:5173`.

## Cara Build (Production)

Untuk upload ke hosting (cPanel/Vercel/Netlify):

```bash
npm run build
```

Hasilnya ada di folder `dist/`. Upload isi folder tersebut ke `public_html`.

## Deploy Di VPS

Website utama dan halaman Minecraft sekarang sama-sama dikelola dari repo ini.

```bash
cd /var/www/adityaanugrah.me
git pull origin main
npm install
npm run build
cp .htaccess dist/.htaccess
systemctl reload apache2
```

- Domain utama `adityaanugrah.me` serve dari `dist/`.
- Subdomain `play.adityaanugrah.me` serve dari folder `play/`.
- Config Apache contoh ada di `server/apache-play.adityaanugrah.me.conf` dan `server/apache-play.adityaanugrah.me-le-ssl.conf`.

## Konfigurasi Email (Wajib!)

Agar form kontak berfungsi, Anda perlu mengatur **EmailJS Keys** di file `src/pages/Contact.jsx`.
Lihat panduan lengkap di: [EMAILJS_GUIDE.md](./EMAILJS_GUIDE.md).

## Struktur Folder

- `src/components`: Komponen UI (Hero, Navbar, dll).
- `src/pages`: Halaman utama (Home, Contact, NotFound).
- `src/data`: Data JSON untuk Projects & Stack (gampang diedit).
- `public/assets`: Tempat simpan gambar/logo.
- `play`: Halaman static untuk `play.adityaanugrah.me`.

---
Dikembangkan oleh **Aditya Anugrah**.
