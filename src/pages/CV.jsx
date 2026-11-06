import SEO from '../components/SEO';
import ArchivePage from '../components/archive/ArchivePage';
import { useActiveLocale } from '../lib/i18n';
import './cv.css';

export default function CV() {
  const id = useActiveLocale() === 'id';
  const language = id ? 'id' : 'en';
  const filename = `aditya-anugrah-cv-${language}.pdf`;
  const pdf = `/docs/${filename}`;
  return <><SEO title="CV" description={id ? 'Buka atau unduh CV Aditya Anugrah dalam format PDF profesional.' : 'Open or download Aditya Anugrah’s professional CV as a PDF.'}/>
    <ArchivePage className="cv-page" background={false} eyebrow="Curriculum vitae" title={id ? 'CV dalam format PDF.' : 'My CV, as a PDF.'} subtitle={id ? 'Dokumen CV tersedia saat kamu ingin membukanya. Isi lengkap tidak ditampilkan di halaman website ini.' : 'The CV document is available when you choose to open it. Its full contents are not displayed on this web page.'}>
      <section className="cv-download-card" aria-labelledby="cv-download-title">
        <span className="cv-file-type" aria-hidden="true">PDF</span>
        <div><p className="section-label">{id ? 'Dokumen profesional' : 'Professional document'}</p><h2 id="cv-download-title">Curriculum vitae</h2><p className="cv-file-description">{id ? 'Bahasa Indonesia · 2 halaman A4 · Dengan foto' : 'English · 2 A4 pages · With photo'}</p><p className="cv-file-note">{id ? 'Pengalaman, pendidikan, kompetensi, dan proyek pilihan disusun dalam dokumen yang siap dicetak.' : 'Experience, education, competencies, and selected projects in a document prepared for printing.'}</p>
          <div className="cv-download-actions"><a className="button button-primary" href={pdf} target="_blank" rel="noopener noreferrer">{id ? 'Lihat PDF' : 'View PDF'} <span aria-hidden="true">↗</span></a><a className="button" href={pdf} download={filename}>{id ? 'Unduh PDF' : 'Download PDF'} <span aria-hidden="true">↓</span></a></div>
          <p className="cv-print-note">{id ? 'Untuk mencetak, buka PDF lalu gunakan menu cetak pada pembaca PDF.' : 'To print, open the PDF and use your PDF reader’s print menu.'}</p>
        </div>
      </section>
    </ArchivePage>
  </>;
}
