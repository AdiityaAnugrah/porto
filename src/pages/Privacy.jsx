import SEO from '../components/SEO';
import ArchivePage from '../components/archive/ArchivePage';
import { useActiveLocale } from '../lib/i18n';

export default function Privacy() {
  const id = useActiveLocale() === 'id';
  return <><SEO title={id?'Kebijakan privasi':'Privacy policy'} description={id?'Kebijakan privasi website Aditya Anugrah.':'How personal data is handled when you visit Aditya Anugrah’s portfolio or get in touch.'}/>
    <ArchivePage eyebrow={id?'Informasi website':'Website information'} title={id?'Kebijakan privasi.':'Privacy policy.'} subtitle={id?'Ringkasan penggunaan data saat kamu mengunjungi website atau menghubungi saya.':'A summary of data use when you visit this website or get in touch.'}>
      <div className="prose"><h2>{id?'Data yang digunakan':'Data use'}</h2><p>{id?'Website ini hanya mengumpulkan data yang diperlukan untuk komunikasi, analytics dasar, dan peningkatan pengalaman pengguna.':'This website collects data needed for communication, basic analytics, and improving the user experience.'}</p><h2>{id?'Komunikasi project':'Project communications'}</h2><p>{id?'Data kontak yang dikirim melalui WhatsApp atau email digunakan untuk membalas kebutuhan project dan tidak dijual ke pihak lain.':'Contact details shared by WhatsApp or email are used to respond to project enquiries and are not sold to third parties.'}</p><h2>{id?'Layanan pihak ketiga':'Third-party services'}</h2><p>{id?'Beberapa layanan pihak ketiga dapat menyimpan cookie atau metadata sesuai kebijakan mereka masing-masing.':'Third-party services may store cookies or metadata according to their own policies.'}</p></div>
    </ArchivePage>
  </>;
}
