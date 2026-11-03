export default function PageLoader({ text = 'Memuat halaman…' }) {
  return <div className="page-loading" role="status"><span className="loading-mark" aria-hidden="true">/</span><p>{text}</p></div>;
}
