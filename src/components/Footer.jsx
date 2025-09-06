import '../styles/Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__text">
          Copyright &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
        {/* (Opsional)
        <nav className="footer__links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </nav>
        */}
      </div>
    </footer>
  );
};

export default Footer;
