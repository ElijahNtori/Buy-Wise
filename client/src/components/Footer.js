import { Link } from "react-router-dom";
import { Zap, Globe, Send, Mail } from "lucide-react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <div className="footer__logo">
            <Zap size={32} className="footer__logo-icon" fill="currentColor" color="currentColor" />
            <span>Buy-Wise</span>
          </div>
          <p className="footer__tagline">
            The ultimate product comparison engine for the modern shopper. 
            Search across multiple marketplaces in real-time.
          </p>
          <div className="footer__socials">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="Github">
              <Globe size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Send size={20} />
            </a>
            <a href="mailto:info@buywise.com" aria-label="Email">
              <Mail size={20} />
            </a>
          </div>
        </div>

        <div className="footer__group">
          <h4>Marketplaces</h4>
          <ul>
            <li><Link to="/search?m=aliexpress">AliExpress</Link></li>
            <li><Link to="/search?m=ebay">eBay</Link></li>
            <li><Link to="/search?m=amazon">Amazon</Link></li>
            <li><Link to="/search?m=alibaba">Alibaba</Link></li>
          </ul>
        </div>

        <div className="footer__group">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer__bottom container">
        <p>&copy; {new Date().getFullYear()} Buy-Wise. All rights reserved.</p>
        <p>Built by Group 18A</p>
      </div>
    </footer>
  );
}
