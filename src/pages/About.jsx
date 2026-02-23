import React from "react";
import { motion } from "framer-motion";
import SEO from "../components/SEO";
import LazyImage from "../components/common/LazyImage";
import { FaDownload, FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import PubgCard from "../components/about/PubgCard";
import SpotifyCard from "../components/about/SpotifyCard";
import SteamCard from "../components/about/SteamCard";

const About = () => {
  // Variabel animasi untuk efek stagger bergelombang
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4, duration: 0.8 } }
  };

  return (
    <div className="pt-24 pb-32 px-6 max-w-5xl mx-auto min-h-screen">
      <SEO 
        title="Aditya Anugrah â€“ Web Developer Semarang & Palembang"
        description="Aditya Anugrah adalah Full-Stack Web Developer & Software Engineer dari Semarang dan Palembang dengan 3+ tahun pengalaman. Ahli React, Next.js, Node.js, PHP, dan MySQL. Tersedia untuk jasa website, REST API, dan sistem bisnis di seluruh Indonesia."
        path="/about"
        type="profile"
        imageAlt="Aditya Anugrah â€“ Web Developer Semarang & Palembang"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Aditya Anugrah",
          "alternateName": [
            "Aditya Anugrah Dev",
            "Aditya Anugrah web developer",
            "full stack engineer Aditya Anugrah",
            "adiityaanugrah"
          ],
          "url": "https://adityaanugrah.me/about",
          "image": "https://adityaanugrah.me/assets/me-sunset.webp",
          "jobTitle": "Full-Stack Web Developer",
          "description": "Full-Stack Web Developer & Software Engineer berbasis di Semarang dan Palembang, Indonesia. Spesialisasi React, Next.js, Node.js, PHP, CodeIgniter, MySQL. Tersedia untuk proyek web developer Semarang, web developer Palembang, dan seluruh Indonesia.",
          "email": "adityaanugrah494@gmail.com",
          "nationality": "Indonesian",
          "homeLocation": [
            {
              "@type": "City",
              "name": "Semarang",
              "addressCountry": "ID"
            },
            {
              "@type": "City",
              "name": "Palembang",
              "addressCountry": "ID"
            }
          ],
          "sameAs": [
            "https://github.com/adiityaanugrah",
            "https://www.linkedin.com/in/aditya-anugrah/",
            "https://steamcommunity.com/id/claraikaa/"
          ],
          "knowsAbout": [
            "React", "Next.js", "Node.js", "PHP", "CodeIgniter", "MySQL",
            "JavaScript", "TypeScript", "Web Development", "REST API",
            "Kotlin", "Android Development",
            "Jasa Website Semarang", "Jasa Website Palembang",
            "Web Developer Semarang", "Web Developer Palembang",
            "Programmer Semarang", "Programmer Palembang"
          ],
          "worksFor": {
            "@type": "Organization",
            "name": "PT Catur Bahkti Mandiri",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Semarang",
              "addressRegion": "Jawa Tengah",
              "addressCountry": "ID"
            }
          }
        }}
      />

      <div className="grid md:grid-cols-[1fr_2fr] gap-12 items-start">
        {/* Sidebar / Image (Animasi masuk dari kiri) */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-8 sticky top-24"
        >
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="aspect-[3/4] rounded-2xl overflow-hidden glass-panel relative border border-white/10 group-hover:border-white/20 transition-colors">
                    <LazyImage 
                        src="/assets/me-sunset.webp" 
                        alt="Aditya Anugrah"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
            </div>
            
            <div className="flex flex-col gap-4">
                <a href="https://drive.google.com/file/d/1M66SJlH_9zlT4EePbq-VrYYxctgjua9M/preview" target="_blank" rel="noopener noreferrer" className="btn-primary w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-white text-black hover:bg-cyan-50 transition-colors">
                    <FaDownload /> Download CV
                </a>
                <div className="flex justify-center gap-6 text-2xl text-white/50">
                     <a href="https://github.com/adiityaanugrah" className="hover:text-white transition-colors"><FaGithub /></a>
                     <a href="https://www.linkedin.com/in/aditya-anugrah/" className="hover:text-white transition-colors"><FaLinkedin /></a>
                     <a href="mailto:adityaanugrah494@gmail.com" className="hover:text-white transition-colors"><FaEnvelope /></a>
                </div>
            </div>
        </motion.div>

        {/* Content Area - hanya Intro di sini */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
                {/* Intro Header */}
            <motion.section variants={itemVariants} className="relative">
                <div className="absolute -inset-x-6 -inset-y-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-2xl rounded-full opacity-50 pointer-events-none" />

                {/* H1 â€” SATU, SEO-rich, sebut profesi + lokasi */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display mb-2 tracking-tight relative z-10 leading-tight">
                    Aditya Anugrah <span className="sr-only">â€”</span><br />
                    <span className="text-gradient text-4xl md:text-5xl lg:text-6xl">Full-Stack Web Developer</span>
                </h1>
                <p className="text-white/40 font-mono text-sm uppercase tracking-widest mb-6 relative z-10">
                    Semarang &amp; Palembang, Indonesia
                </p>

                {/* ===== BIO CONTENT (SEO-friendly, 300+ kata) ===== */}
                <div className="space-y-5 text-white/70 text-sm md:text-base leading-relaxed max-w-2xl relative z-10">

                    {/* Paragraf 1 â€” Perkenalan + lokasi + profesi */}
                    <p>
                        Saya <strong className="text-white">Aditya Anugrah</strong>, seorang{" "}
                        <strong className="text-white">Full-Stack Web Developer</strong> berbasis di{" "}
                        <strong className="text-cyan-400">Semarang dan Palembang</strong>, Indonesia, dengan pengalaman lebih dari 3 tahun membangun produk digital â€” mulai dari backend skala perusahaan hingga antarmuka frontend yang halus. Perjalanan saya dimulai dari rasa ingin tahu bagaimana internet bekerja, yang dengan cepat berubah menjadi karier membangun solusi digital yang bermakna.
                    </p>

                    {/* H2 â€” Keahlian Teknis */}
                    <h2 className="text-base md:text-lg font-bold text-white pt-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" />
                        Keahlian &amp; Teknologi
                    </h2>
                    <p>
                        Saya berspesialisasi dalam ekosistem JavaScript modern â€”{" "}
                        <span className="text-cyan-400">React</span>,{" "}
                        <span className="text-cyan-400">Next.js</span>, dan{" "}
                        <span className="text-cyan-400">Node.js</span> â€” serta fondasi server-side yang kuat menggunakan{" "}
                        <span className="text-purple-400">PHP / CodeIgniter</span> dan{" "}
                        <span className="text-purple-400">MySQL</span>. Saya telah membangun berbagai jenis sistem: REST API high-traffic, WebSocket real-time, hingga aplikasi mobile Android menggunakan Kotlin.
                    </p>

                    {/* H2 â€” Pengalaman */}
                    <h2 className="text-base md:text-lg font-bold text-white pt-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
                        Pengalaman sebagai Full-Stack Developer
                    </h2>
                    <p>
                        Selama lebih dari 3 tahun, saya membantu UMKM, startup, dan perusahaan dalam merancang solusi digital yang cepat, aman, dan <em>scalable</em>. Saya terbiasa mengerjakan proyek secara end-to-end â€” dari perencanaan arsitektur, pengembangan, hingga deployment. Fokus saya adalah <span className="text-cyan-400">clean code</span>, <span className="text-purple-400">performansi</span>, dan <span className="text-pink-400">user experience</span>.
                    </p>

                    {/* H2 â€” Lokasi & Jangkauan */}
                    <h2 className="text-base md:text-lg font-bold text-white pt-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-pink-500 inline-block" />
                        Web Developer Semarang &amp; Palembang
                    </h2>
                    <p>
                        Meski berbasis di <strong className="text-white">Semarang</strong> dan <strong className="text-white">Palembang</strong>, saya melayani klien dari seluruh Indonesia secara <em>remote</em> maupun tatap muka. Setiap proyek saya tangani dengan profesionalisme penuh â€” dari konsultasi kebutuhan awal hingga serah terima produk akhir.
                    </p>

                    {/* Internal Links */}
                    <p className="text-white/50 text-sm border-t border-white/10 pt-4">
                        Lihat hasil kerja saya di{" "}
                        <a href="/projects" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors font-medium">
                            halaman Portfolio Proyek
                        </a>
                        {" "}atau{" "}
                        <a href="/contact" className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors font-medium">
                            hubungi saya langsung
                        </a>
                        {" "}untuk diskusi proyek. Di luar kode, saya juga seorang gamer ðŸŽ® dan music enthusiast ðŸŽ§.
                    </p>
                </div>
            </motion.section>
        </motion.div>
      </div>

      {/* ===== FULL-WIDTH BENTO SECTION (below hero) ===== */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mt-12"
      >
            {/* BENTO GRID LAYOUT */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 relative z-10 w-full mb-8">
                
                {/* ---------- BENTO 1: TECH STACK (12 cols) ---------- */}
                <motion.div variants={itemVariants} className="md:col-span-12 glass-panel p-6 sm:p-8 rounded-3xl relative group overflow-hidden border border-white/10 hover:border-purple-500/30 transition-colors duration-500 flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 blur-3xl rounded-full transition-transform duration-700 group-hover:scale-150 pointer-events-none" />
                    <div className="flex-shrink-0">
                        <h2 className="text-xs sm:text-sm font-mono uppercase tracking-widest text-white/40 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-purple-500 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                            Tech Stack
                        </h2>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 text-[10px] sm:text-xs font-mono">
                        {["JavaScript", "TypeScript", "React", "Next.js", "Tailwind", "Node.js", "PHP", "CodeIgniter", "MySQL", "Git" , "Kotlin"].map(tech => (
                            <span key={tech} className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all cursor-default relative overflow-hidden group/badge">
                                <span className="absolute inset-0 bg-white/5 translate-y-full group-hover/badge:translate-y-0 transition-transform" />
                                <span className="relative z-10">{tech}</span>
                            </span>
                        ))}
                    </div>
                </motion.div>

                {/* ---------- BENTO 2: MUSIC VIBES (4 cols) ---------- */}
                <motion.div variants={itemVariants} className="md:col-span-6 lg:col-span-4 flex flex-col relative group h-full pb-2 md:pb-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1DB954]/5 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <div className="mb-4 pl-3">
                        <h2 className="text-xs sm:text-sm font-mono uppercase tracking-widest text-white/40 flex items-center gap-2">
                            <span className="text-base sm:text-xl">ðŸŽ§</span> Music Flow
                        </h2>
                    </div>
                    {/* Mengisi sisa flex */}
                    <div className="flex-1 transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.01] h-full">
                        <SpotifyCard />
                    </div>
                </motion.div>

                {/* ---------- BENTO 3: GAMING PUBG (4 cols) ---------- */}
                <motion.div variants={itemVariants} className="md:col-span-6 lg:col-span-4 flex flex-col relative group h-full pb-2 md:pb-0">
                    <div className="absolute inset-0 bg-gradient-to-tl from-orange-500/5 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <div className="mb-4 pl-3">
                        <h2 className="text-xs sm:text-sm font-mono uppercase tracking-widest text-white/40 flex items-center gap-2">
                            <span className="text-base sm:text-xl">ðŸŽ®</span> PUBG STEAM
                        </h2>
                    </div>
                    <div className="flex-1 transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.01]">
                        <PubgCard />
                    </div>
                </motion.div>

                {/* ---------- BENTO 4: GAMING STEAM (4 cols) ---------- */}
                <motion.div variants={itemVariants} className="md:col-span-12 lg:col-span-4 flex flex-col relative group h-full pb-2 md:pb-0">
                    <div className="absolute inset-0 bg-gradient-to-tl from-[#66c0f4]/5 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <div className="mb-4 pl-3">
                        <h2 className="text-xs sm:text-sm font-mono uppercase tracking-widest text-white/40 flex items-center gap-2">
                            <span className="text-base sm:text-xl">ðŸ‘¾</span> Steam Profile
                        </h2>
                    </div>
                    <div className="flex-1 transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.01]">
                        <SteamCard />
                    </div>
                </motion.div>

                {/* ---------- BENTO 5: EXPERIENCE (12 cols, 2 column inner grid) ---------- */}
                <motion.div variants={itemVariants} className="md:col-span-12 glass-panel p-6 sm:p-8 rounded-3xl relative group overflow-hidden border border-white/10 hover:border-cyan-500/30 transition-colors duration-500 mt-2">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-cyan-500/5 blur-3xl rounded-full transition-transform duration-700 group-hover:scale-150 pointer-events-none" />
                    <h2 className="text-xs sm:text-sm font-mono uppercase tracking-widest text-white/40 mb-8 flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                        Perjalanan Karier
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 border-l border-white/10 pl-6 relative">
                         <div className="relative group/item">
                            <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-cyan-500 border-2 border-[#0a0a0a] group-hover/item:scale-150 transition-transform" />
                            <h3 className="text-base sm:text-lg font-bold text-white group-hover/item:text-cyan-300 transition-colors">Full-stack Developer</h3>
                            <p className="text-cyan-500/70 text-[10px] sm:text-xs font-mono mb-2">Ilena Furniture â€¢ 2023 - Sekarang</p>
                            <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
                                Membangun storefront Next.js dengan SSR/ISR untuk SEO optimal. Mengintegrasikan kalkulator ongkos kirim dan sistem matriks SKU.
                            </p>
                         </div>

                         <div className="relative group/item">
                            <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-green-500 border-2 border-[#0a0a0a] group-hover/item:scale-150 transition-transform" />
                            <h3 className="text-base sm:text-lg font-bold text-white group-hover/item:text-green-300 transition-colors">Web Developer</h3>
                            <p className="text-green-500/70 text-[10px] sm:text-xs font-mono mb-2">PT Catur Bahkti Mandiri â€¢ Semarang â€¢ 2022 - Sekarang</p>
                            <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-2">
                                Mengembangkan aplikasi web menggunakan HTML, CSS, PHP, dan CodeIgniter. Meningkatkan performa web hingga 30% melalui optimasi kode dan teknik SEO.
                            </p>
                            <ul className="list-disc list-outside ml-4 text-white/50 text-[10px] sm:text-xs space-y-1">
                                <li>Berkolaborasi dalam tim Agile untuk memastikan pengiriman tepat waktu.</li>
                                <li>Mengelola database untuk integrasi backend yang akurat.</li>
                            </ul>
                         </div>
    
                         <div className="relative group/item">
                            <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-purple-500 border-2 border-[#0a0a0a] group-hover/item:scale-150 transition-transform" />
                            <h3 className="text-base sm:text-lg font-bold text-white group-hover/item:text-purple-300 transition-colors">Backend + UI Developer</h3>
                            <p className="text-purple-500/70 text-[10px] sm:text-xs font-mono mb-2">Titanium Group â€¢ 2024 - 2025</p>
                            <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
                                Merancang skema database dan REST API menggunakan CodeIgniter 4. Mengembangkan dashboard manajemen bengkel dan laporan PDF otomatis.
                            </p>
                         </div>

                         <div className="relative group/item">
                            <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-orange-500 border-2 border-[#0a0a0a] group-hover/item:scale-150 transition-transform" />
                            <h3 className="text-base sm:text-lg font-bold text-white group-hover/item:text-orange-300 transition-colors">Android Development</h3>
                            <p className="text-orange-500/70 text-[10px] sm:text-xs font-mono mb-2">Bangkit Academy By Google, GoTo, Traveloka â€¢ Bandung â€¢ 2022</p>
                            <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-2">
                                Mengembangkan aplikasi Android tingkat menengah menggunakan Kotlin dan Java. 
                            </p>
                            <ul className="list-disc list-outside ml-4 text-white/50 text-[10px] sm:text-xs space-y-1">
                                <li>Mendapat pengalaman langsung dalam Android lifecycle dan desain UI.</li>
                                <li>Berkolaborasi dalam proyek tim nyata untuk membangun aplikasi.</li>
                            </ul>
                         </div>

                         <div className="relative group/item">
                            <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-pink-500 border-2 border-[#0a0a0a] group-hover/item:scale-150 transition-transform" />
                            <h3 className="text-base sm:text-lg font-bold text-white group-hover/item:text-pink-300 transition-colors">UI/UX Design</h3>
                            <p className="text-pink-500/70 text-[10px] sm:text-xs font-mono mb-2">PT. Greatedu Global Mahardika â€¢ Jakarta â€¢ 2022</p>
                            <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-2">
                                Mempelajari prinsip UI/UX dan proses desain aplikasi mobile yang intuitif.
                            </p>
                            <ul className="list-disc list-outside ml-4 text-white/50 text-[10px] sm:text-xs space-y-1">
                                <li>Membuat mockup dan prototipe Android menggunakan software desain.</li>
                                <li>Berkolaborasi dengan tim untuk meningkatkan elemen UX.</li>
                            </ul>
                         </div>

                         <div className="relative group/item">
                            <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-gray-500 border-2 border-[#0a0a0a] group-hover/item:scale-150 transition-transform" />
                            <h3 className="text-base sm:text-lg font-bold text-white group-hover/item:text-gray-300 transition-colors">Staff Admin</h3>
                            <p className="text-gray-500/70 text-[10px] sm:text-xs font-mono mb-2">Kantor Kesahbandaran â€¢ Palembang â€¢ 2021 - 2022</p>
                            <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
                                Mengelola tugas administrasi, menyiapkan surat clearance kapal, dan berkomunikasi dengan otoritas pelabuhan. Dipercaya menangani dokumen penting operasional pelabuhan.
                            </p>
                         </div>
                    </div>
                </motion.div>
            </div>
      </motion.div>
    </div>
  );
};

export default About;

