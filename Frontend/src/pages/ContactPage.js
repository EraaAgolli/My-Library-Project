import React, { useState, useEffect } from "react";
import "./../components/Contact.css";

const contactInfo = [
  { icon: "📍", label: "Visit Us",       lines: ["123 Book Street", "Literary Lane, Reading City RC 12345"], iconBg: "rgba(43,108,176,0.1)",  iconColor: "#2b6cb0" },
  { icon: "📞", label: "Call Us",        lines: ["+1 (565) 123-4567", "+1 (565) 987-6543"],                  iconBg: "rgba(14,165,201,0.1)",  iconColor: "#0ea5c9" },
  { icon: "✉️", label: "Email Us",       lines: ["hello@epochofbooks.com", "support@epochofbooks.com"],      iconBg: "rgba(99,102,241,0.1)",  iconColor: "#6366f1" },
  { icon: "🕐", label: "Business Hours", lines: ["Mon – Fri: 9 AM – 8 PM", "Sat – Sun: 10 AM – 6 PM"],      iconBg: "rgba(43,108,176,0.1)",  iconColor: "#2b6cb0" },
];

const fallbackFaqs = [
  { question: "How long does delivery take?",       answer: "Standard delivery takes 3–5 business days. Express next-day delivery is available at checkout." },
  { question: "Can I return a book I purchased?",   answer: "Yes — unopened books can be returned within 30 days for a full refund." },
  { question: "How does the borrow program work?",  answer: "Choose any borrowable title, add it to your cart, and enjoy it for 14 days. Extend or return anytime." },
  { question: "Do gift cards expire?",              answer: "Never. Our gift cards have no expiry date and can be used for any purchase." },
  { question: "Is there a membership program?",     answer: "Our Epoch Membership is coming soon! Join the waitlist on our Services page to be first in line." },
  { question: "How do I track my order?",           answer: "You'll receive a tracking link by email as soon as your order ships." },
];

function Contact() {
  const [faqs,     setFaqs]     = useState([]);
  const [openFaq,  setOpenFaq]  = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status,   setStatus]   = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/contact/faqs")
      .then(r => r.json())
      .then(d => setFaqs(d?.length ? d : fallbackFaqs))
      .catch(() => setFaqs(fallbackFaqs));
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("ct-visible"); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".ct-animate").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [faqs]);

  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    setStatus("sending");
    fetch("http://localhost:8080/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(r => r.json())
      .then(() => { setStatus("ok"); setFormData({ name: "", email: "", subject: "", message: "" }); })
      .catch(() => setStatus("err"));
  };

  return (
    <div className="ct-root">

      {/* ══ CONTACT FORM + INFO ══ */}
      <section className="ct-contact-section ct-animate">
        <div className="ct-contact-inner">

          <div className="ct-info-col">
            <span className="ct-label">All Channels</span>
            <h2 className="ct-info-title">Four ways<br />to reach us</h2>
            <div className="ct-info-cards">
              {contactInfo.map((c, i) => (
                <div className="ct-info-card" key={c.label}
                  style={{ "--i": i, "--icon-bg": c.iconBg, "--icon-color": c.iconColor }}>
                  <div className="ct-info-icon-wrap"><span>{c.icon}</span></div>
                  <div>
                    <div className="ct-info-label">{c.label}</div>
                    {c.lines.map(l => <div className="ct-info-line" key={l}>{l}</div>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="ct-form-col">
            <span className="ct-label">Write to Us</span>
            <h2 className="ct-form-title">Send a message</h2>
            <p className="ct-form-subtitle">We typically reply within one business hour.</p>
            <form className="ct-form" onSubmit={handleSubmit}>
              <div className="ct-form-row">
                <div className="ct-field">
                  <label>Your Name</label>
                  <input name="name" placeholder="Jane Smith" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="ct-field">
                  <label>Email Address</label>
                  <input type="email" name="email" placeholder="jane@email.com" value={formData.email} onChange={handleChange} required />
                </div>
              </div>
              <div className="ct-field">
                <label>Subject</label>
                <input name="subject" placeholder="What's this about?" value={formData.subject} onChange={handleChange} required />
              </div>
              <div className="ct-field">
                <label>Message</label>
                <textarea name="message" rows={5} placeholder="Tell us everything…" value={formData.message} onChange={handleChange} required />
              </div>
              <button type="submit" className="ct-submit-btn" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send Message →"}
              </button>
              {status === "ok"  && <div className="ct-status ct-status-ok">✓ Message sent! We'll reply soon.</div>}
              {status === "err" && <div className="ct-status ct-status-err">Something went wrong. Please try again.</div>}
            </form>
          </div>

        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section className="ct-faq-section ct-animate">
        <div className="ct-faq-inner">
          <div className="ct-faq-layout">
            <div className="ct-faq-head">
              <span className="ct-label ct-label-inv">FAQ</span>
              <h2 className="ct-faq-title">Frequently<br />asked<br />questions</h2>
              <p className="ct-faq-sub">Can't find what you're looking for? Send us a message above.</p>
            </div>
            <div className="ct-faq-grid">
              {faqs.map((faq, i) => (
                <div
                  className={`ct-faq-item ${openFaq === i ? "ct-faq-open" : ""}`}
                  key={i} style={{ "--i": i }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="ct-faq-q">
                    <span className="ct-faq-num">0{i + 1}</span>
                    <span className="ct-faq-question">{faq.question}</span>
                    <span className="ct-faq-arrow">{openFaq === i ? "×" : "+"}</span>
                  </div>
                  <div className="ct-faq-a">
                    <div className="ct-faq-a-inner">{faq.answer}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Contact;