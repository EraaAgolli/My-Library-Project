// src/pages/AboutUsPage.js
import React from "react";
import "./../components/About.css";

function AboutUs() {
  return (
    <div className="ab-root">

      {/* ── HERO ── */}
      <section className="ab-hero">
        <div className="ab-hero-bg">
          <img
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&q=90"
            alt="Library"
          />
          <div className="ab-hero-overlay" />
        </div>
        <div className="ab-hero-content">
          <p className="ab-hero-eyebrow"><span />About Us</p>
          <h1 className="ab-hero-title">
            A bookshop built on<br /><em>the love of reading.</em>
          </h1>
          <p className="ab-hero-sub">
            Founded in Tirana in 2020. Every title we carry is
            hand-picked — no filler, just books worth your time.
          </p>
          <div className="ab-hero-stats">
            {[
              ["4+",    "Years active"],
              ["10k+",  "Books available"],
              ["50k+",  "Happy readers"],
              ["200+",  "Genres covered"],
            ].map(([n, l]) => (
              <div key={l} className="ab-hstat">
                <strong>{n}</strong>
                <span>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="ab-story">
        <div className="ab-story-inner">
          <div className="ab-story-label">
            <span className="ab-eyebrow"><i />Our Story</span>
          </div>
          <div className="ab-story-body">
            <h2 className="ab-story-title">
              We believe every book has the power to change a life.
            </h2>
            <p>
              What started as a small online bookstore has grown into a vibrant
              community of readers from around the world. We curate every title
              with intention — no filler, no noise, just great books.
            </p>
            <p>
              Our mission is simple: connect curious people with the books they
              didn't know they needed. From timeless classics to emerging voices,
              we celebrate the full spectrum of human storytelling.
            </p>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="ab-values">
        <div className="ab-values-inner">
          <div className="ab-values-head">
            <p className="ab-eyebrow"><i />What We Believe</p>
            <h2 className="ab-values-title">Our values</h2>
          </div>
          <div className="ab-values-grid">
            {[
              { icon: "📖", title: "Quality Selection",
                text: "Every book in our collection is carefully curated by our team of passionate readers." },
              { icon: "👥", title: "Community First",
                text: "We foster a community where readers connect, share, and discover together." },
              { icon: "🏅", title: "Excellence",
                text: "We strive for excellence in everything — from curation to delivery to support." },
              { icon: "🌍", title: "Accessibility",
                text: "Great literature should be accessible to every reader, regardless of where they are." },
            ].map((v, i) => (
              <div key={v.title} className="ab-vcard">
                <div className="ab-vcard-num">0{i + 1}</div>
                <div className="ab-vcard-icon">{v.icon}</div>
                <h3 className="ab-vcard-title">{v.title}</h3>
                <p className="ab-vcard-text">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="ab-cta">
        <div className="ab-cta-inner">
          <h2 className="ab-cta-title">
            Start your reading<br /><em>journey today.</em>
          </h2>
          <div className="ab-cta-btns">
            <a href="/book-shop" className="ab-btn-primary">Browse Our Collection →</a>
            <a href="/contact"   className="ab-btn-ghost">Get in Touch</a>
          </div>
        </div>
      </section>

    </div>
  );
}

export default AboutUs;