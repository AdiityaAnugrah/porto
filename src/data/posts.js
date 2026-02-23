export const posts = [
  {
    id: 'optimasi-sistem-bisnis-2026',
    title: 'Strategi Optimasi Sistem Bisnis untuk Efisiensi Maksimal di 2026',
    excerpt: 'Bagaimana teknologi cloud dan AI dapat mengubah cara UMKM beroperasi secara lebih cerdas dan hemat biaya.',
    date: '2026-02-15',
    category: 'Business Strategy',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    content: `
      Keberhasilan bisnis di era digital bukan lagi soal siapa yang paling besar, tapi siapa yang paling gesit. 
      Optimasi sistem bisnis melalui integrasi teknologi otomatisasi dapat memangkas waktu operasional hingga 40%.

      ### Kenapa Optimasi itu Penting?
      Banyak bisnis terjebak dalam proses manual yang repetitif. Dengan sistem yang terintegrasi, tim Anda bisa fokus pada inovasi, bukan sekadar administrasi.

      ### Langkah Awal Menuju Digitalisasi:
      1. Audit proses bisnis Anda saat ini.
      2. Identifikasi titik hambat (bottleneck).
      3. Pilih software yang scalable dan sesuai kebutuhan.

      Hubungi saya untuk konsultasi mendalam mengenai transformasi sistem bisnis Anda.
    `
  },
  {
    id: 'manfaat-website-modern-umkm',
    title: 'Kenapa UMKM Butuh Website Modern yang Cepat & SEO-Friendly?',
    excerpt: 'Website bukan hanya sekadar kartu nama digital, tapi mesin pencetak sales yang bekerja 24 jam.',
    date: '2026-02-10',
    category: 'Web Development',
    image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=800',
    content: `
      Di tahun 2026, user tidak akan menunggu website yang loadingnya lebih dari 3 detik. Kecepatan adalah mata uang utama dalam dunia digital.

      ### Keunggulan Website Premium:
      - **Load Time di bawah 2 detik**: Menurunkan bounce rate secara drastis.
      - **SEO Ready**: Muncul di halaman pertama Google saat orang mencari jasa Anda.
      - **Conversion Oriented**: Didesain untuk mengubah pengunjung menjadi pembeli (WhatsApp integration, clear CTA).

      Portfolio saya menunjukkan komitmen terhadap performa ekstrem menggunakan teknologi OpenLiteSpeed dan React.
    `
  },
  {
    id: 'di-balik-layar-load-time-1-7s',
    title: 'Di Balik Layar: Bagaimana Saya Membangun Portofolio dengan Load Time 1.7 Detik',
    excerpt: 'Bedah teknologi di balik website ini: HTTP/3, Brotli Compression, dan OpenLiteSpeed Tuning untuk performa ekstrem.',
    date: '2026-02-16',
    category: 'Technical Case Study',
    image: 'https://images.unsplash.com/photo-1551288049-bbbda536ad79?auto=format&fit=crop&q=80&w=800',
    content: `
      Banyak orang bertanya, "Gimana sih caranya bikin website animasi berat tapi tetap enteng pas dibuka?" 
      Jawabannya bukan cuma di kode frontend, tapi di optimalisasi infrastruktur server. Website portofolio ini adalah buktinya.

      ### 1. Protokol Masa Depan: HTTP/3 (QUIC)
      Saya mengaktifkan HTTP/3 pada OpenLiteSpeed. Berbeda dengan HTTP/2, QUIC mengurangi latency koneksi secara signifikan, terutama pada jaringan seluler (4G/5G) yang sering naik-turun. Hasilnya? Koneksi awal terasa "instan".

      ### 2. Brotli vs Gzip
      Brotli dari Google memberikan kompresi sekitar 20% lebih baik dibanding Gzip untuk aset berbasis teks (HTML, JS, CSS). Ini artinya paket data yang dikirim ke browser pengunjung jadi lebih padat dan cepat sampai.

      ### 3. Service Workers & PWA
      Dengan Service Worker, kunjungan kedua pengunjung akan terasa instan karena aset dasar sudah tersimpan di cache lokal (disk cache). Website ini pun sudah siap diinstall sebagai aplikasi (PWA).

      ### 4. Code Splitting & Lazy Loading
      Halaman dipisah menjadi "chunks" kecil. Pengunjung hanya mendownload kode yang memang mereka butuhkan di halaman tersebut. Ini mengurangi beban bandwidth secara drastis saat awal dibuka.

      Kesimpulannya, performa bukan sekadar angka di Lighthouse, tapi kenyamanan nyata bagi pengunjung. Website yang cepat adalah bentuk profesionalisme tertinggi bagi seorang developer.
    `
  },
  {
    id: 'react-vs-nextjs-company-profile',
    title: 'React.js vs Next.js: Mana yang Terbaik untuk Website Company Profile?',
    excerpt: 'Analisis mendalam mengenai pemilihan arsitektur frontend (CSR vs SSR/SSG) untuk visibilitas SEO perusahaan.',
    date: '2026-02-18',
    category: 'Web Development',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
    content: `
      Salah satu perdebatan paling sering muncul saat memulai proyek *Company Profile* adalah: Pakai React JS biasa atau loncat ke Next.js?
      Keputusan ini sering salah kaprah dan bisa berakibat fatal pada marketing perusahaan.

      ### Kesalahan Umum Memakai React murni (SPA)
      React JS standar berjalan secara *Client-Side Rendering (CSR)*. Halaman dikirim ke browser dalam keadaan kosong, kemudian Javascript disuruh merakit isinya (seperti merakit mainan Lego).
      Kelemahannya? **Bot Google kesulitan dan malas membaca isinya**. Akibatnya? Sulit masuk halaman pertama pencarian.

      ### Kenapa Next.js Menang Telak untuk SEO
      Next.js menghadirkan *Server-Side Rendering (SSR)* atau *Static Site Generation (SSG)*. Halaman sudah dirakit utuh di server saya sebelum dikirim ke pengunjung.
      
      **Keuntungan untuk Bisnis Anda:**
      1. **SEO Level Dewa:** Robot Google langsung membaca semua teks dan meta-data di detik pertama.
      2. **Pre-rendering Cepat:** Pengunjung dengan HP kentang / sinyal susah tidak perlu menunggu "Loading Spinner" yang lama.
      3. **Keamanan:** Logika krusial bisa disembunyikan di dalam *Server Components*.

      Sebagai developer profesional, jika tujuannya adalah portofolio, brosur produk, atau company profile, saya secara default akan menunjuk Next.js sebagai senjata utama.
    `
  },
  {
    id: 'otomatisasi-laporan-whatsapp-bot',
    title: 'Hentikan Rekap Manual: Menghubungkan Backend ke Bot WhatsApp',
    excerpt: 'Studi kasus cara menghemat waktu admin hingga 2 jam/hari dengan otomatisasi notifikasi dan pelaporan via WhatsApp API.',
    date: '2026-02-20',
    category: 'Business Strategy',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800',
    content: `
      "Setiap sore jam 5, admin saya harus merekap semua transaksi harian dari sistem lalu mengirimkannya satu-satu via grup WhatsApp." 
      Ini adalah curhatan klasik dari pemilik UMKM yang saya temui bulan lalu.

      Di tahun 2026, hal ini sepenuhnya *obsolete* (usang). Saya merancang solusi menggunakan Node.js dan Baileys (Library WhatsApp) untuk menyambungkan database mereka langsung ke ponsel pintar semua manajer.

      ### Cara Kerjanya:
      1. Kasir menginput barang terjual dan menekan 'Selesai' di sistem POS/Kasir.
      2. Backend server langsung mendeteksi ada transaksi sukses masuk.
      3. Melalui cron-job rahasia (Scheduler), setiap jam 17:00, server menarik database omset.
      4. Engine mem-parsing angka mentah itu menjadi pesan teks *aesthetic* yang mudah dibaca.
      5. Robot WhatsApp mengirim *Broadcast* Laporan PDF beserta teks ke grup pemegang saham/owner.

      ### The Impact
      Kelelahan, lupa mengirim laporan, dan rawan *typo* angka (human error) sudah musnah sepenuhnya. Waktu 2 jam dari hidup staf admin akhirnya bisa dipakai untuk melayani pelanggan ketimbang menatap Excel.

      Punya masalah operasional repetitif seperti ini? Mari kita otomatisasi.
    `
  },
  {
    id: 'api-security-praktek-terbaik',
    title: 'Mencegah Data Bocor: 3 Lapis Pengamanan API yang Sering Dilupakan',
    excerpt: 'Jangan cuma bisa bikin CRUD. Memahami Rate Limiting, JWT stateless, dan CORS protection adalah kewajiban.',
    date: '2026-02-22',
    category: 'Technical Case Study',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=800',
    content: `
      Membuat REST API itu gampang. Anak magang pun dalam 1 jam bisa membuat fungsi *Get Data* dan mengeksposnya ke publik.
      Namun, membuat REST API yang *Aman, Tahan Gempuran (DDoS), dan Memproteksi Data Klien* adalah urusan lain.

      Berikut adalah resep standar yang selalu saya terapkan di setiap backend yang saya kerjakan:

      ### 1. Proteksi CORS (Cross-Origin Resource Sharing) yang Ketat
      API tidak boleh menerima asal-*request* dari sembarang nama domain (misalnya *hacker-web.xyz*), saya selalu mengunci CORS headers agar API hanya membalas *Say Hello* jika diakses murni dari domain client yang saya percayai (contoh: *adityaanugrah.me*).

      ### 2. Rate Limiting (Pencegahan Spam)
      Pernah lihat saingan bisnis iseng melakukan *Click-spamming* / memborbardir formulir kontak website Anda jutaan kali agar database Anda jebol?
      Disinilah Rate-Limiter bekerja. Saya memasang penahan di proxy (seperti NGINX atau via express-rate-limit) untuk memberikan "ban sementara" (Too Many Requests - Status 429) jika satu IP terdeteksi menembak API ratusan kali dalam 1 menit.

      ### 3. Otentikasi Stateless dengan JWT
      Server modern sebaiknya tidak mengingat siapa yang login (menggunakan Session memori). Alih-alih, klien (Browser) dikabari menggunakan *JSON Web Token* bersandi tingkat tinggi (HS256) menggunakan dua variabel rahasia: *Access Token* (umur 15 menit) dan *Refresh Token* (1 minggu).

      Investasi terbaik dalam pembuatan *Software* bukanlah pada desain UI yang cantik, melainkan kemampuan sistem bertahan hidup ketika di-*stress-test* oleh peretas jahat di alam liar internet.
    `
  }
];
