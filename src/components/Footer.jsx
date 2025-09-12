import '../styles/Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__text">
          Copyright &copy; {new Date().getFullYear()} A_A.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
