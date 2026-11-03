import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ArchivePage from '../components/archive/ArchivePage';
import { useActiveLocale, useLocalizedPath } from '../lib/i18n';

export default function Invoice() {
  const id = useActiveLocale() === 'id';
  const to = useLocalizedPath();
  return <><SEO title="Invoice | Aditya Anugrah" description="Informasi invoice dan administrasi project Aditya Anugrah."/>
    <ArchivePage eyebrow={id?'Administrasi project':'Project administration'} title={id?'Invoice & pembayaran.':'Invoices & payments.'} subtitle={id?'Detail penagihan dikirim langsung melalui komunikasi project agar informasi klien tetap terjaga.':'Billing details are shared directly through project communications to keep client information private.'}>
      <div className="billing-panel"><div><h2>{id?'Butuh salinan invoice?':'Need an invoice copy?'}</h2><p>{id?'Sebutkan nama bisnis dan project saat menghubungi saya. Untuk invoice aktif, gunakan tautan yang sudah dikirim melalui email atau WhatsApp.':'Include your business and project name when you contact me. For an existing invoice, use the link already sent by email or WhatsApp.'}</p></div><Link className="button button-primary" to={to('/contact')}>{id?'Minta tautan invoice':'Request invoice link'}</Link></div>
    </ArchivePage>
  </>;
}
