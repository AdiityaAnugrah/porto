import SEO from '../components/SEO';
import ArchivePage from '../components/archive/ArchivePage';
import { useActiveLocale } from '../lib/i18n';

export default function Contact() {
  const id = useActiveLocale() === 'id';
  const links = [['WhatsApp','https://wa.me/6281379430432',id?'Diskusi awal, kebutuhan project, atau konsultasi.':'For an initial conversation, a project brief, or consultation.'],['Email','mailto:hello@adityaanugrah.me','hello@adityaanugrah.me'],['GitHub','https://github.com/adiityaanugrah',id?'Kode dan eksperimen yang saya kerjakan.':'Code and experiments I’m working on.'],['LinkedIn','https://www.linkedin.com/in/aditya-anugrah/',id?'Profil profesional dan koneksi.':'Professional profile and connections.']];
  return <><SEO title={id?'Kontak | Aditya Anugrah':'Contact | Aditya Anugrah'} description={id?'Diskusikan website, aplikasi, dan kebutuhan sistem bisnis bersama Aditya Anugrah.':'Discuss your website, application, or business-system project with Aditya Anugrah.'}/>
    <ArchivePage eyebrow={id?'Mulai percakapan':'Start a conversation'} title={id?'Ceritakan idemu.':'Tell me your idea.'} subtitle={id?'Sudah punya brief lengkap atau baru berupa gambaran? Kita bisa mulai dari sana.':'Have a detailed brief, or just the start of an idea? We can take it from there.'}>
      <div className="contact-layout"><div><h2>{id?'Mulai dari masalahnya.':'Start with the problem.'}</h2><div className="prose"><p>{id?'Ceritakan apa yang ingin kamu buat, siapa yang akan memakainya, dan kendala yang ingin diselesaikan. Saya akan bantu menyusun langkah berikutnya.':'Tell me what you want to build, who will use it, and what needs to change. I’ll help work out the next step.'}</p></div><div className="brief-box"><p className="section-label">{id?'Yang bisa kamu siapkan':'A useful starting point'}</p><ul>{(id?['Nama bisnis dan proses yang berjalan','Masalah atau tujuan utama','Fitur wajib dan perkiraan waktu','Contoh website yang kamu suka']:['Your business and current process','The main problem or goal','Essential features and timing','Websites you like']).map(item => <li key={item}>{item}</li>)}</ul></div></div>
      <div className="contact-links">{links.map(([label,href,desc]) => <a className="contact-link" key={label} href={href} target={href.startsWith('https:')?'_blank':undefined} rel="noreferrer"><div><h3>{label}</h3><p>{desc}</p></div><span aria-hidden="true">↗</span></a>)}</div></div>
    </ArchivePage>
  </>;
}
