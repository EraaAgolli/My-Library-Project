import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../components/service.css";

const services = [
  { icon: "🛒", title: "Buy Books",        tagline: "Own it forever",          text: "Purchase from our curated collection of over 10,000 titles across every genre. Find your next favourite with confidence.", perks: ["Free shipping over $25", "Gift wrapping available", "Quality guaranteed"] },
  { icon: "📖", title: "Borrow Books",     tagline: "Read, return, repeat",    text: "Rent any title at a fraction of the cost. Perfect for the voracious reader who always needs something new.", perks: ["14-day rental period", "Extend anytime online", "Easy prepaid returns"] },
  { icon: "🎁", title: "Gift Cards",       tagline: "Give the joy of reading", text: "Let someone choose their own adventure. Our gift cards are flexible, never expire, and make the perfect present.", perks: ["Any dollar amount", "Never expires", "Digital & physical"] },
  { icon: "⚡", title: "Express Delivery", tagline: "Books at your door",       text: "Need it fast? Our express option delivers next day. Track your order in real time from warehouse to doorstep.", perks: ["Next-day delivery", "Real-time tracking", "Signature confirmation"] },
  { icon: "🔄", title: "Book Exchange",    tagline: "Trade what you've read",  text: "Finished a book? Send it back for store credit. Good for your shelf, good for your wallet, good for the planet.", perks: ["Fair valuations", "Instant credit", "Eco-friendly program"] },
  { icon: "💬", title: "Support",          tagline: "Always by your side",     text: "Our team of passionate book lovers is here to help any hour of the day — whether it's an order or a recommendation.", perks: ["24/7 availability", "Expert book advisors", "< 1h response time"] },
];

const memberPerks = [
  "Unlimited borrowing",
  "Early access to new releases",
  "20% off all purchases",
  "Free express shipping",
  "Personalised recommendations",
  "Members-only reading events",
];

function Services() {
  const [joined, setJoined] = useState(false);
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("sv-visible"); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".sv-animate").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const handleJoin = async () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await new Promise(res => setTimeout(res, 1000));
      setJoined(true);
      setShowModal(false);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sv-root">

      {/* ══ HERO ══ */}
      <section className="sv-hero">
        <div className="sv-hero-topbar">
          <span className="sv-hero-eyebrow"><i />What We Offer</span>
          <span className="sv-hero-count">{services.length} services</span>
        </div>
        <div className="sv-hero-title-wrap">
          <h1 className="sv-hero-title">
            Your reading life,<em>fully covered.</em>
          </h1>
        </div>
        <div className="sv-hero-bottom">
          <p className="sv-hero-sub">
            From buying and borrowing to gifting and exchanging —
            every service built around getting great books into your hands.
          </p>
          <div className="sv-hero-pills">
            {services.map((s, i) => (
              <span key={s.title} className="sv-pill" style={{"--i": i}}>
                {s.icon} {s.title}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SERVICES — alternating rows ══ */}
      <section className="sv-rows-section sv-animate">
        <div className="sv-rows-inner">
          {services.map((s, i) => (
            <div
              className={`sv-row ${i % 2 === 1 ? "sv-row-flip" : ""}`}
              key={s.title}
              style={{ "--i": i }}
            >
              <div className="sv-row-visual">
                <div className="sv-row-num">0{i + 1}</div>
                <div className="sv-row-icon-wrap">
                  <span className="sv-row-icon">{s.icon}</span>
                </div>
              </div>
              <div className="sv-row-text">
                <div className="sv-row-tagline">{s.tagline}</div>
                <h3 className="sv-row-title">{s.title}</h3>
                <p className="sv-row-body">{s.text}</p>
                <ul className="sv-row-perks">
                  {s.perks.map(p => (
                    <li key={p}><span className="sv-check">✓</span>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ MEMBERSHIP ══ */}
      <section className="sv-membership sv-animate">
        <div className="sv-membership-left">
          <div className="sv-mem-glow" />
          <div className="sv-membership-inner">
            <span className="sv-label sv-label-inv">Coming Soon</span>
            <h2 className="sv-membership-title">
              Epoch<br /><em>Membership</em>
            </h2>
            <p className="sv-membership-sub">
              One subscription. Unlimited reading. Join the waitlist and be the
              first to unlock exclusive benefits designed for passionate readers.
            </p>
            {joined ? (
              <div className="sv-waitlist-success">
                <span className="sv-waitlist-check">✓</span>
                <div>
                  <p className="sv-waitlist-success-title">You're on the list!</p>
                  <p className="sv-waitlist-success-sub">We'll be in touch when Epoch Membership launches.</p>
                </div>
              </div>
            ) : (
              <button className="sv-waitlist-btn" onClick={() => setShowModal(true)}>
                Join the Waitlist →
              </button>
            )}
          </div>
        </div>
        <div className="sv-membership-right">
          <p className="sv-mem-perks-label">Member benefits</p>
          <ul className="sv-membership-perks">
            {memberPerks.map((p, i) => (
              <li key={p} style={{ "--i": i }}>
                <span className="sv-mem-num">0{i + 1}</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ WAITLIST MODAL ══ */}
      {showModal && (
        <div className="sv-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="sv-modal" onClick={e => e.stopPropagation()}>
            <button className="sv-modal-close" onClick={() => setShowModal(false)}>✕</button>
            <div className="sv-modal-icon">📬</div>
            <h3 className="sv-modal-title">Join the Waitlist</h3>
            <p className="sv-modal-sub">Enter your email and we'll notify you the moment Epoch Membership goes live.</p>
            <input
              type="email"
              className="sv-modal-input"
              placeholder="your@email.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleJoin()}
            />
            {error && <p className="sv-modal-error">{error}</p>}
            <button className="sv-modal-btn" onClick={handleJoin} disabled={loading}>
              {loading ? "Submitting…" : "Notify Me →"}
            </button>
            <p className="sv-modal-note">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      )}

    </div>
  );
}

export default Services;