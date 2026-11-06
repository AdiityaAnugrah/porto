export const cvIdentity = {
  name: 'Aditya Anugrah', role: 'Full-stack Developer', location: 'Semarang, Indonesia',
  email: 'hello@adityaanugrah.me', phone: '+62 813 7943 0432',
  website: 'https://adityaanugrah.me', github: 'https://github.com/adiityaanugrah',
  linkedin: 'https://www.linkedin.com/in/aditya-anugrah/',
};

export const cvSummary = {
  id: 'Full-stack developer yang membangun website bisnis, e-commerce, dashboard operasional, dan integrasi sistem. Memiliki latar pengembangan Android, pelatihan UI/UX, serta pengalaman administrasi. Menghubungkan kebutuhan pengguna dengan antarmuka yang mudah dipakai, database yang terstruktur, dan proses bisnis yang saling terhubung.',
  en: 'Full-stack developer building business websites, e-commerce, operational dashboards, and system integrations. Background in Android development, UI/UX training, and administration. Connects user needs with usable interfaces, structured databases, and integrated business processes.',
};

export const cvSkills = [
  { id: 'Frontend', en: 'Frontend', items: ['React', 'Next.js', 'JavaScript', 'TypeScript', 'HTML', 'CSS/SCSS', 'Bootstrap', 'Tailwind CSS'] },
  { id: 'Backend & database', en: 'Backend & databases', items: ['PHP', 'CodeIgniter', 'Laravel', 'Node.js', 'MySQL', 'PostgreSQL'] },
  { id: 'Android & desain', en: 'Android & design', items: ['Java', 'Kotlin', 'Figma', 'UI/UX'] },
  { id: 'Integrasi & delivery', en: 'Integrations & delivery', items: ['REST API', 'Payment gateway', 'Shipping API', 'Git/GitHub', 'Deployment'] },
  { id: 'Produktivitas', en: 'Productivity', items: ['Microsoft Office'] },
];

export const cvEmployment = [{
  organization: 'Kantor Kesyahbandaran', location: 'Palembang, Indonesia', period: '2021–2022',
  role: { id: 'Staf Administrasi', en: 'Administrative Staff' },
  points: {
    id: ['Menyiapkan administrasi surat izin kapal berlayar dan melintas, serta menjaga komunikasi dengan pihak terkait.', 'Dipercaya menangani penyusunan surat perizinan untuk mendukung pekerjaan Kesyahbandaran dan Otoritas Pelabuhan.'],
    en: ['Prepared administrative documents for vessel sailing and passage permits and maintained communication with relevant parties.', 'Entrusted with preparing permit documentation to support harbourmaster and port authority operations.'],
  },
}];

export const cvTraining = [
  { organization: 'Bangkit Academy by Google, GoTo, Traveloka', location: 'Bandung, Indonesia', year: '2022',
    title: { id: 'Android Development', en: 'Android Development' },
    points: { id: ['Mempelajari dasar hingga pengembangan aplikasi Android tingkat menengah.', 'Mengembangkan kemampuan pemrograman Android menggunakan Kotlin dan Java.'], en: ['Studied Android application fundamentals through intermediate development.', 'Developed Android programming skills using Kotlin and Java.'] } },
  { organization: 'PT Greatedu Global Mahardika', location: 'Jakarta, Indonesia', year: '2022',
    title: { id: 'UI/UX Design', en: 'UI/UX Design' },
    points: { id: ['Mempelajari dasar UI/UX, proses desain aplikasi, dan penggunaan perangkat lunak desain.', 'Membuat rancangan antarmuka untuk aplikasi berbasis Android.'], en: ['Studied UI/UX fundamentals, the application design process, and design software.', 'Created interface designs for Android applications.'] } },
];

export const cvEducation = [
  { institution: 'Universitas Dian Nuswantoro', year: '2023', qualification: { id: 'S1 Teknik Informatika', en: 'Bachelor’s degree in Informatics Engineering' }, detail: { id: 'IPK 3,33', en: 'GPA 3.33' } },
  { institution: 'SMAN 1 Semendawai Suku III', year: '2019', qualification: { id: 'Ilmu Pengetahuan Alam (IPA)', en: 'Natural Sciences' } },
];
export const cvOrganizations = {
  id: ['Multimedia Developer di DNCC (Dian Nuswantoro Computer Club).', 'Anggota organisasi Basket Dian Nuswantoro.'],
  en: ['Multimedia Developer at DNCC (Dian Nuswantoro Computer Club).', 'Member of the Dian Nuswantoro basketball organization.'],
};
export const cvCompetencies = {
  id: ['Riset dan analisis kebutuhan', 'Kerja sama tim dan komunikasi', 'Manajemen waktu', 'Kreativitas dan editing'],
  en: ['Research and requirements analysis', 'Teamwork and communication', 'Time management', 'Creativity and editing'],
};

// Dates, roles, technologies, and live URLs come from the existing portfolio projects.
export const cvProjectNotes = [
  { projectId: 'absensi-site', points: {
    id: ['Merancang database dan API untuk platform absensi, serta membangun antarmuka berbasis Next.js.', 'Menerapkan login NIK, kalender shift, dan akses berbasis peran dengan aturan sesi sesuai perangkat.'],
    en: ['Designed the attendance platform database and API and built its Next.js interface.', 'Implemented employee-ID login, shift calendars, and role-based access with device-aware session rules.'],
  } },
  { projectId: 'BLCC', points: {
    id: ['Merancang skema database dan relasi untuk pengelolaan anggota, kehadiran, donasi, dan laporan.', 'Membangun antarmuka administrasi modular dengan Laravel, Bootstrap, dan MySQL; proyek mencakup Kotlin.'],
    en: ['Designed database schemas and relations for members, attendance, donations, and reports.', 'Built modular administration interfaces using Laravel, Bootstrap, and MySQL; the project also includes Kotlin.'],
  } },
  { projectId: 'titanium-group', points: {
    id: ['Merancang database, REST endpoints, dan antarmuka dashboard berbasis CodeIgniter 4.', 'Menerapkan pelacakan tahapan pekerjaan bengkel, pencarian/filter, serta ekspor PDF per pesanan.'],
    en: ['Designed the database, REST endpoints, and CodeIgniter 4 dashboard interface.', 'Implemented workshop workflow tracking, search and filters, and per-order PDF exports.'],
  } },
  { projectId: 'ilenafurniture', points: {
    id: ['Mengintegrasikan katalog, autentikasi, keranjang, dan pesanan dengan API; menangani deployment dan monitoring.', 'Membangun fitur SKU/varian produk, pengelolaan stok/pesanan, dan kalkulator ongkir berdasarkan dimensi serta berat.'],
    en: ['Integrated the catalog, authentication, cart, and orders with APIs; handled deployment and monitoring.', 'Built product variants and SKU features, stock/order management, and dimension- and weight-based shipping calculations.'],
  } },
];
export const cvOtherProjects = [
  { projectId: 'Lunarea Furniture', description: { id: 'E-commerce, filter produk, wishlist, dan integrasi pembayaran.', en: 'E-commerce, product filters, wishlists, and payment integration.' } },
  { projectId: 'cargomate', description: { id: 'Landing page jasa pengiriman, form lead, dan analitik.', en: 'A shipping-service landing page, lead form, and analytics.' } },
];
