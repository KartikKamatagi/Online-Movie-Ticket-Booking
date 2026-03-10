import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <section className="footer-col">
          <h3 className="footer-brand">FOTX Movies</h3>
          <p className="footer-text">
            Book movie tickets easily and discover the latest movies, theaters, and show timings near you.
          </p>
        </section>

        <section className="footer-col">
          <h4>Quick Links</h4>
          <nav className="footer-links" aria-label="Quick links">
            <Link to="/home">Home</Link>
            <Link to="/movies">Movies</Link>
            <Link to="/theaters">Theaters</Link>
            <Link to="/my-bookings">My Bookings</Link>
            <Link to="/login">Login</Link>
          </nav>
        </section>

        <section className="footer-col">
          <h4>Support</h4>
          <div className="footer-links">
            <a href="#">Help Center</a>
            <a href="#">Contact Us</a>
            <a href="#">Terms &amp; Conditions</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Refund Policy</a>
          </div>
        </section>

        <section className="footer-col">
          <h4>Follow Us</h4>
          <div className="footer-social" aria-label="Social media">
            <a href="#" aria-label="Facebook" title="Facebook">f</a>
            <a href="#" aria-label="Instagram" title="Instagram">ig</a>
            <a href="#" aria-label="Twitter" title="Twitter">x</a>
            <a href="#" aria-label="YouTube" title="YouTube">yt</a>
          </div>
        </section>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 FOTX Movies. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
