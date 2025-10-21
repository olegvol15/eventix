import { NavLink } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import '../../styles/footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-wave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-section footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">🎟️</div>
              <h2>eventix</h2>
            </div>
            <p className="footer-tagline">
              Experience unforgettable moments. From sports to concerts, 
              we bring you closer to the events you love.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="social-link" aria-label="YouTube">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><NavLink to="/events">Browse Events</NavLink></li>
              <li><NavLink to="/sports">Sports</NavLink></li>
              <li><NavLink to="/concerts">Concerts</NavLink></li>
              <li><NavLink to="/saved">My Saved</NavLink></li>
              <li><NavLink to="/cart">Cart</NavLink></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Support</h3>
            <ul className="footer-links">
              <li><NavLink to="/help">Help Center</NavLink></li>
              <li><NavLink to="/faq">FAQ</NavLink></li>
              <li><NavLink to="/contact">Contact Us</NavLink></li>
              <li><NavLink to="/refunds">Refund Policy</NavLink></li>
              <li><NavLink to="/terms">Terms of Service</NavLink></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Get in Touch</h3>
            <ul className="footer-contact">
              <li>
                <Mail size={18} />
                <span>support@eventix.com</span>
              </li>
              <li>
                <Phone size={18} />
                <span>+38 (555) 123-4567</span>
              </li>
              <li>
                <MapPin size={18} />
                <span>123 Event Street<br />New York, NY 10001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-newsletter">
          <div className="newsletter-content">
            <h3>Stay Updated</h3>
            <p>Subscribe to get exclusive deals and event notifications</p>
          </div>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="newsletter-input"
              required
            />
            <button type="submit" className="newsletter-btn">
              Subscribe
            </button>
          </form>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              © {currentYear} Eventix. All rights reserved.
            </p>
            <div className="footer-legal">
              <NavLink to="/privacy">Privacy Policy</NavLink>
              <span className="separator">•</span>
              <NavLink to="/cookies">Cookie Policy</NavLink>
              <span className="separator">•</span>
              <NavLink to="/accessibility">Accessibility</NavLink>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-glow"></div>
    </footer>
  );
}