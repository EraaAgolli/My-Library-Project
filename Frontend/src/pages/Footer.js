import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from "react-icons/fa";
import "./../components/Footer.css";

const DARK_ENDING_ROUTES = ["/contact", "/book-shop", "/dashboard", "/cart", "/wishlist", "/"];

function Footer() {
  const { pathname } = useLocation();
  const isDarkPage = DARK_ENDING_ROUTES.some(r => pathname === r || pathname.startsWith("/books/"));
  const variant = isDarkPage ? "ft-light" : "ft-dark";

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) { setSubscribed(true); setEmail(""); }
  };

  return (
    <footer className={`ft-root ${variant}`}>

      {/* ══ MAIN GRID ══ */}
      <div className="ft-main">
        <div className="ft-main-inner">

          {/* ── Col 1: Brand + tagline + socials ── */}
          <div className="ft-col ft-col-brand">
            <span className="ft-logo">⬡ Epoch <em>of Books</em></span>
            <p className="ft-tagline">
              A curated bookstore for curious minds. We believe every great story
              deserves to find its reader.
            </p>
            <div className="ft-socials">
              <a href="#" className="ft-social" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#" className="ft-social" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" className="ft-social" aria-label="LinkedIn"><FaLinkedinIn /></a>
              <a href="#" className="ft-social" aria-label="GitHub"><FaGithub /></a>
            </div>
          </div>

          {/* ── Col 2: Explore ── */}
          <div className="ft-col">
            <div className="ft-col-heading">Explore</div>
            <ul className="ft-links">
              <li><Link to="/book-shop">Book Shop</Link></li>
              <li><Link to="/libraryservice">Services</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* ── Col 3: Account ── */}
          <div className="ft-col">
            <div className="ft-col-heading">Account</div>
            <ul className="ft-links">
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/register">Create Account</Link></li>
              <li><Link to="/dashboard">My Dashboard</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/wishlist">Wishlist</Link></li>
            </ul>
          </div>

          {/* ── Col 4: Contact + Hours ── */}
          <div className="ft-col">
            <div className="ft-col-heading">Find Us</div>
            <ul className="ft-contact-list">
              <li>
                <span className="ft-ci"><FaMapMarkerAlt /></span>
                <span>123 Book Street, Literary Lane<br />Reading City RC 12345</span>
              </li>
              <li>
                <span className="ft-ci"><FaPhoneAlt /></span>
                <span>+1 (565) 123-4567</span>
              </li>
              <li>
                <span className="ft-ci"><FaEnvelope /></span>
                <span>hello@epochofbooks.com</span>
              </li>
              <li>
                <span className="ft-ci"><FaClock /></span>
                <span>
                  Mon – Fri: 9 AM – 8 PM<br />
                  Sat – Sun: 10 AM – 6 PM
                </span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* ══ NEWSLETTER STRIP ══ */}
      <div className="ft-newsletter-strip">
        <div className="ft-newsletter-inner">
          <div className="ft-newsletter-text">
            <div className="ft-nl-eyebrow">Stay in the loop</div>
            <p className="ft-nl-title">
              New arrivals & reading picks, <em>straight to your inbox.</em>
            </p>
          </div>
          {subscribed ? (
            <div className="ft-nl-success">✓ You're on the list — welcome aboard.</div>
          ) : (
            <form className="ft-nl-form" onSubmit={handleSubscribe}>
              <input
                className="ft-nl-input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button className="ft-nl-btn" type="submit">Subscribe →</button>
            </form>
          )}
        </div>
      </div>

      {/* ══ BOTTOM BAR ══ */}
      <div className="ft-bottom">
        <div className="ft-bottom-inner">
          <span className="ft-copy">© {new Date().getFullYear()} Epoch of Books. All rights reserved.</span>
          <div className="ft-bottom-links">
            <a href="#">Privacy Policy</a>
            <span className="ft-dot" />
            <a href="#">Terms of Service</a>
            <span className="ft-dot" />
            <a href="#">Cookie Settings</a>
          </div>
        </div>
      </div>

    </footer>
  );
}

export default Footer;