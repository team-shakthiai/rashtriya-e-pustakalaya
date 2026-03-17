import { assetUrl } from '../utils/assetUrl'
import './Footer.css'

const noop = (e) => e.preventDefault()

export default function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-upper">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-logo">
              <img src={assetUrl('assets/logo.png')} alt="Rashtriya e-Pustakalya" className="logo-icon" width="40" height="40" />
              <span className="logo-text english">National Digital Library of India</span>
              <span className="logo-text hindi devanagari">राष्ट्रीय डिजिटल पुस्तकालय</span>
            </span>
            <p className="footer-service">A service by NDL-INDIA</p>
            <p className="footer-desc">
              Ministry of Education, Government of India. Contact Us for support and feedback.
            </p>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li><a href="#" onClick={noop}>Home</a></li>
              <li><a href="#" onClick={noop}>About</a></li>
              <li><a href="#" onClick={noop}>Contact Us</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">Discover</h3>
            <ul className="footer-links">
              <li><a href="#" onClick={noop}>Subject</a></li>
              <li><a href="#" onClick={noop}>Language</a></li>
              <li><a href="#" onClick={noop}>Content Type</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">Resources</h3>
            <ul className="footer-links">
              <li><a href="#" onClick={noop}>Terms and Conditions</a></li>
              <li><a href="#" onClick={noop}>Privacy Policy</a></li>
              <li><a href="#" onClick={noop}>Disclaimer</a></li>
              <li><a href="#" onClick={noop}>Sitemap</a></li>
            </ul>
          </div>

          <div className="footer-col footer-col-connect">
            <h3 className="footer-heading">Stay Connected</h3>
            <div className="social-icons">
              <a href="#" aria-label="Facebook" className="social-icon" onClick={noop}>f</a>
              <a href="#" aria-label="X (Twitter)" className="social-icon" onClick={noop}>X</a>
              <a href="#" aria-label="YouTube" className="social-icon" onClick={noop}>▶</a>
              <a href="#" aria-label="Instagram" className="social-icon" onClick={noop}>IG</a>
            </div>
            <h3 className="footer-heading">Download our App</h3>
            <div className="app-downloads">
              <a href="#" className="app-btn" title="Get it on Google Play" onClick={noop}>
                <span className="app-btn-placeholder">Google Play</span>
              </a>
              <a href="#" className="app-btn" title="Download on the App Store" onClick={noop}>
                <span className="app-btn-placeholder">App Store</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <div className="footer-bottom-links">
            <a href="#" onClick={noop}>Terms and Conditions</a>
            <a href="#" onClick={noop}>Privacy Policy</a>
            <a href="#" onClick={noop}>Disclaimer</a>
            <a href="#" onClick={noop}>Sitemap</a>
          </div>
          <p className="copyright">Copyright © 2026 NDL India. All Rights Reserved.</p>
          <a href="#" className="back-to-top" aria-label="Back to top" onClick={noop}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6"/></svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
