import '../styles/NotFound.scss';

const NotFound = () => {
  return (
    <main className="nf nf--fx" role="main" aria-labelledby="nf-title">
      {/* dekorasi latar */}
      <div className="nf__bg" aria-hidden="true" />

      <section className="nf__content">
        <h1 id="nf-title" className="nf__title" aria-label="404 Not Found">
          <span className="nf__digit" aria-hidden>4</span>
          <span className="nf__digit" aria-hidden>0</span>
          <span className="nf__digit" aria-hidden>4</span>
        </h1>

        <p className="nf__message">Halaman yang kamu cari tidak ditemukan.</p>

        <a className="nf__cta" href="/" aria-label="Kembali ke Beranda">
          <span>Kembali ke Beranda</span>
        </a>
      </section>
    </main>
  );
};

export default NotFound;
