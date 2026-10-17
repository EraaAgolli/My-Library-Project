import React, { useEffect, useState, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaHeart, FaShoppingCart, FaStar, FaArrowRight, FaQuoteLeft } from "react-icons/fa";
import api from "../api/axios";
import { AuthContext }     from "../context/AuthContext";
import { CartContext }     from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import "./../components/home.css";

const FALLBACK_TRENDING = [
  { id:1, title:"The Great Gatsby",    author:"F. Scott Fitzgerald", price:12.99, rating:4.8, category:"Classic",  imageUrl:"https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80" },
  { id:2, title:"Dune",                author:"Frank Herbert",       price:15.99, rating:4.9, category:"Sci-Fi",   imageUrl:"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80" },
  { id:3, title:"Beloved",             author:"Toni Morrison",       price:13.99, rating:4.7, category:"Fiction",  imageUrl:"https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80" },
  { id:4, title:"1984",                author:"George Orwell",       price:10.99, rating:4.8, category:"Classic",  imageUrl:"https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&q=80" },
  { id:5, title:"Middlemarch",         author:"George Eliot",        price:14.99, rating:4.6, category:"Classic",  imageUrl:"https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&q=80" },
  { id:6, title:"Crime & Punishment",  author:"Fyodor Dostoevsky",   price:11.99, rating:4.7, category:"Classic",  imageUrl:"https://images.unsplash.com/photo-1518373714866-3f1478910cc0?w=400&q=80" },
];

const FALLBACK_NEW = [
  { id:7,  title:"Tomorrow & Tomorrow",  author:"Gabrielle Zevin",   price:16.99, rating:4.5, category:"Fiction",  imageUrl:"https://images.unsplash.com/photo-1600189261867-30e5ffe7b8da?w=400&q=80" },
  { id:8,  title:"The Covenant",         author:"Jodi Picoult",      price:14.99, rating:4.4, category:"Drama",    imageUrl:"https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&q=80" },
  { id:9,  title:"James",                author:"Percival Everett",  price:15.99, rating:4.6, category:"Fiction",  imageUrl:"https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&q=80" },
  { id:10, title:"Orbital",              author:"Samantha Harvey",   price:13.99, rating:4.5, category:"Literary", imageUrl:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { id:11, title:"The Women",            author:"Kristin Hannah",    price:17.99, rating:4.7, category:"Fiction",  imageUrl:"https://images.unsplash.com/photo-1512436991641-6745cae5bcd8?w=400&q=80" },
  { id:12, title:"All Fours",            author:"Miranda July",      price:15.99, rating:4.3, category:"Fiction",  imageUrl:"https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&q=80" },
  { id:13, title:"The God of the Woods", author:"Lauren Fox",        price:14.99, rating:4.4, category:"Thriller", imageUrl:"https://images.unsplash.com/photo-1518373714866-3f1478910cc0?w=400&q=80" },
  { id:14, title:"Intermezzo",           author:"Sally Rooney",      price:16.99, rating:4.5, category:"Fiction",  imageUrl:"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80" },
  { id:15, title:"The Life Impossible",  author:"Matt Haig",         price:13.99, rating:4.6, category:"Fiction",  imageUrl:"https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80" },
  { id:16, title:"Eruption",             author:"Michael Crichton",  price:18.99, rating:4.4, category:"Thriller", imageUrl:"https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&q=80" },
];

const FALLBACK_REVIEWS = [
  { id:1, userName:"Sofia M.", rating:5, comment:"I read this in one sitting. The prose is unlike anything I have encountered — rich, precise, and utterly transporting.", bookTitle:"The Name of the Wind", bookAuthor:"Patrick Rothfuss", bookImageUrl:"https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80" },
  { id:2, userName:"James K.", rating:5, comment:"This book rewired how I see history, humanity, and myself. Every page felt like a revelation.", bookTitle:"Sapiens", bookAuthor:"Yuval Noah Harari", bookImageUrl:"https://images.unsplash.com/photo-1509266272358-7701da638078?w=400&q=80" },
  { id:3, userName:"Amara D.", rating:5, comment:"Beautiful and devastating in equal measure. A book that reminds you what it means to live fully.", bookTitle:"When Breath Becomes Air", bookAuthor:"Paul Kalanithi", bookImageUrl:"https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80" },
];

const QUOTES = [
  { text:"A reader lives a thousand lives before he dies. The man who never reads lives only one.", author:"George R.R. Martin" },
  { text:"Not all those who wander are lost.", author:"J.R.R. Tolkien" },
  { text:"So we beat on, boats against the current, borne back ceaselessly into the past.", author:"F. Scott Fitzgerald" },
  { text:"There is no friend as loyal as a book.", author:"Ernest Hemingway" },
  { text:"One must always be careful of books, and what is inside them, for words have the power to change us.", author:"Cassandra Clare" },
  { text:"It is a truth universally acknowledged that a reader in want of a good book will always find one.", author:"Jane Austen" },
  { text:"Books are a uniquely portable magic.", author:"Stephen King" },
  { text:"The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author:"Dr. Seuss" },
  { text:"If you don't like to read, you haven't found the right book yet.", author:"J.K. Rowling" },
  { text:"A book is a dream that you hold in your hands.", author:"Neil Gaiman" },
  { text:"Reading is to the mind what exercise is to the body.", author:"Joseph Addison" },
  { text:"Until I feared I would lose it, I never loved to read. One does not love breathing.", author:"Harper Lee" },
  { text:"There is no substitute for books in the life of a child.", author:"May Ellen Chase" },
  { text:"We read to know we are not alone.", author:"C.S. Lewis" },
  { text:"A book must be the axe for the frozen sea within us.", author:"Franz Kafka" },
];

const CATEGORIES = [
  { name:"Fiction",   emoji:"📖", count:"2,400+" },
  { name:"Classic",   emoji:"🏛️", count:"820+"   },
  { name:"Sci-Fi",    emoji:"🚀", count:"1,100+" },
  { name:"History",   emoji:"📜", count:"960+"   },
  { name:"Self-Help", emoji:"✨", count:"740+"   },
  { name:"Fantasy",   emoji:"🧙", count:"1,300+" },
  { name:"Memoir",    emoji:"🖊️", count:"580+"   },
  { name:"Children",  emoji:"🌟", count:"670+"   },
];

const BENEFITS = [
  { icon:"📦", title:"Free Shipping",     body:"On all orders over $25. Delivered in 2–4 days." },
  { icon:"🔄", title:"Easy Returns",      body:"30-day hassle-free returns. No questions asked." },
  { icon:"📖", title:"Borrow Program",    body:"Borrow any title for a fraction of the cover price." },
  { icon:"🎁", title:"Gift Cards",        body:"Give the gift of reading. Never expire, any amount." },
  { icon:"⭐", title:"Member Rewards",    body:"Earn points on every purchase. Redeem for discounts." },
  { icon:"💬", title:"Reading Community", body:"Book clubs, author events and reading challenges." },
];

function useIntersect(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function BookCard({ book, index }) {
  const { user }                         = useContext(AuthContext);
  const { addToCart }                    = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const wishlisted = isInWishlist(book.id);
  const handleCart = async (e) => { e.preventDefault(); e.stopPropagation(); if (user) await addToCart(book.id, 1, false); };
  const handleWish = async (e) => { e.preventDefault(); e.stopPropagation(); if (user) await toggleWishlist(book.id); };
  return (
    <Link to={`/books/${book.id}`} className="hp-bcard" style={{ "--i": index }}>
      <div className="hp-bcard-cover">
        {book.imageUrl ? <img src={book.imageUrl} alt={book.title} loading="lazy" /> : <div className="hp-bcard-ph">📖</div>}
        {book.category && <span className="hp-bcard-cat">{book.category}</span>}
        <div className="hp-bcard-actions">
          <button className={`hp-bcard-action ${wishlisted ? "hp-bcard-wished" : ""}`} onClick={handleWish}><FaHeart /></button>
          <button className="hp-bcard-action" onClick={handleCart}><FaShoppingCart /></button>
        </div>
      </div>
      <div className="hp-bcard-info">
        <p className="hp-bcard-author">{book.author}</p>
        <h3 className="hp-bcard-title">{book.title}</h3>
        <div className="hp-bcard-foot">
          <strong className="hp-bcard-price">${book.price?.toFixed(2)}</strong>
          <span className="hp-bcard-rating"><FaStar />{book.rating?.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [trending, setTrending] = useState([]);
  const [newBooks, setNewBooks] = useState([]);
  const [reviews,  setReviews]  = useState([]);
  const [search,   setSearch]   = useState("");
  const [quoteIdx, setQuoteIdx] = useState(0);
  const navigate = useNavigate();

  const [heroRef,    heroVis]    = useIntersect(0.01);
  const [trendRef,   trendVis]   = useIntersect(0.1);
  const [quoteRef,   quoteVis]   = useIntersect(0.3);
  const [newRef,     newVis]     = useIntersect(0.1);
  const [catRef,     catVis]     = useIntersect(0.1);
  const [staffRef,   staffVis]   = useIntersect(0.1);
  const [benefitRef, benefitVis] = useIntersect(0.1);

  useEffect(() => {
    api.get("/books", { params:{ page:0, size:6, sort:"rating,desc" } })
      .then(r => setTrending(r.data?.content ?? r.data ?? FALLBACK_TRENDING))
      .catch(() => setTrending(FALLBACK_TRENDING));
    api.get("/books", { params:{ page:0, size:6, sort:"id,desc" } })
      .then(r => setNewBooks(r.data?.content ?? r.data ?? FALLBACK_NEW))
      .catch(() => setNewBooks(FALLBACK_NEW));
    api.get("/reviews", { params:{ page:0, size:3, sort:"id,desc" } })
      .then(r => setReviews(r.data?.content ?? r.data ?? FALLBACK_REVIEWS))
      .catch(() => setReviews(FALLBACK_REVIEWS));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setQuoteIdx(i => (i + 1) % QUOTES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/book-shop?search=${encodeURIComponent(search)}`);
  };

  return (
    <div className="hp-root">

      {/* ── HERO ── */}
      <section className="hp-hero" ref={heroRef}>
        <div className="hp-hero-texture" />
        <div className="hp-hero-inner">
          <div className={`hp-hero-copy ${heroVis ? "hp-vis" : ""}`}>
            <div className="hp-pill">☕ Your cozy reading corner</div>
            <h1 className="hp-hero-h1">The right book<br />finds <em>you.</em></h1>
            <p className="hp-hero-sub">Hand-picked titles, curated shelves, and a community that loves books as much as you do.</p>
            <form className="hp-search-bar" onSubmit={handleSearch}>
              <FaSearch className="hp-search-icon" />
              <input type="text" placeholder="Search by title, author, or genre…" value={search} onChange={e => setSearch(e.target.value)} className="hp-search-input" />
              <button type="submit" className="hp-search-btn">Search</button>
            </form>
            <div className="hp-hero-tags">
              {["Fiction","Sci-Fi","Memoir","Fantasy","History"].map(t => (
                <Link key={t} to={`/book-shop?category=${t}`} className="hp-hero-tag">{t}</Link>
              ))}
            </div>
          </div>
          <div className={`hp-hero-visual ${heroVis ? "hp-vis hp-vis-d2" : ""}`}>
            <div className="hp-hero-stack">
              {[
                { bg:"#7c3d3d", t:"#f5e6d3", label:"Anna Karenina",    w:60, h:340, r:-8 },
                { bg:"#2d5a27", t:"#c6e6c0", label:"Dune",             w:72, h:380, r: 3 },
                { bg:"#1a3a6b", t:"#c6973f", label:"The Great Gatsby", w:56, h:320, r:-3 },
                { bg:"#5c3d8f", t:"#e8d5f5", label:"Middlemarch",      w:64, h:360, r: 6 },
                { bg:"#8b5e3c", t:"#fff3e0", label:"Don Quixote",      w:52, h:300, r:-5 },
              ].map((b, i) => (
                <div key={b.label} className="hp-stack-book"
                  style={{ "--bw":b.w+"px","--bh":b.h+"px","--bc":b.bg,"--bt":b.t,"--br":b.r+"deg","--bi":i }}>
                  <span>{b.label}</span>
                </div>
              ))}
              <div className="hp-stack-shadow" />
            </div>
            <div className="hp-hero-badge">
              <span className="hp-badge-num">10K+</span>
              <span className="hp-badge-label">titles in our collection</span>
            </div>
          </div>
        </div>
        <div className="hp-hero-wave" />
      </section>

      {/* ── TRENDING ── */}
      <section className="hp-section" ref={trendRef}>
        <div className="hp-section-inner">
          <div className="hp-section-head">
            <div><div className="hp-eyebrow">🔥 This Week</div><h2 className="hp-section-title">Trending right now</h2></div>
            <Link to="/book-shop" className="hp-text-link">Browse all →</Link>
          </div>
          <div className={`hp-grid-6 ${trendVis ? "hp-grid-vis" : ""}`}>
            {(trending.length ? trending : FALLBACK_TRENDING).map((b, i) => <BookCard key={b.id} book={b} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── QUOTE ROTATOR ── */}
      <section className="hp-quote-section" ref={quoteRef}>
        <div className={`hp-quote-inner ${quoteVis ? "hp-vis" : ""}`}>
          <FaQuoteLeft className="hp-quote-mark" />
          <div className="hp-quote-body">
            <blockquote className="hp-quote-text" key={quoteIdx}>{QUOTES[quoteIdx].text}</blockquote>
            <cite className="hp-quote-author">— {QUOTES[quoteIdx].author}</cite>
          </div>
          <div className="hp-quote-controls">
            <button className="hp-quote-arrow" onClick={() => setQuoteIdx(i => (i - 1 + QUOTES.length) % QUOTES.length)} aria-label="Previous">&#8592;</button>
            <span className="hp-quote-counter">{quoteIdx + 1} / {QUOTES.length}</span>
            <button className="hp-quote-arrow" onClick={() => setQuoteIdx(i => (i + 1) % QUOTES.length)} aria-label="Next">&#8594;</button>
          </div>
          <div className="hp-quote-dots">
            {QUOTES.map((_, i) => (
              <button key={i} className={`hp-qdot ${i === quoteIdx ? "hp-qdot-on" : ""}`} onClick={() => setQuoteIdx(i)} aria-label={`Quote ${i+1}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      <section className="hp-na-section" ref={newRef}>
        <div className="hp-na-inner">
          <div className="hp-na-label">
            <div className="hp-eyebrow">✨ Just In</div>
            <h2 className="hp-na-heading">New<br/><em>arrivals</em></h2>
            <Link to="/book-shop?sort=id,desc" className="hp-na-all">See all new →</Link>
          </div>
          <div className={`hp-na-list ${newVis ? "hp-na-vis" : ""}`}>
            {(newBooks.length ? newBooks : FALLBACK_NEW).map((book, i) => (
              <Link to={`/books/${book.id}`} key={book.id} className="hp-na-row" style={{ "--i": i }}>
                <span className="hp-na-num">{String(i + 1).padStart(2, "0")}</span>
                <div className="hp-na-thumb">
                  {book.imageUrl
                    ? <img src={book.imageUrl} alt={book.title} loading="lazy" />
                    : <div className="hp-na-ph">📖</div>}
                </div>
                <div className="hp-na-body">
                  <div className="hp-na-meta">
                    {book.category && <span className="hp-na-cat">{book.category}</span>}
                    {book.rating   && <span className="hp-na-rating">⭐ {Number(book.rating).toFixed(1)}</span>}
                  </div>
                  <h3 className="hp-na-title">{book.title}</h3>
                  <p className="hp-na-author">{book.author}</p>
                </div>
                <div className="hp-na-right">
                  <strong className="hp-na-price">${book.price?.toFixed(2)}</strong>
                  <span className="hp-na-arrow"><FaArrowRight /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="hp-section" ref={catRef}>
        <div className="hp-section-inner">
          <div className="hp-section-head">
            <div><div className="hp-eyebrow">📚 Explore</div><h2 className="hp-section-title">Browse by genre</h2></div>
          </div>
          <div className={`hp-cat-grid ${catVis ? "hp-grid-vis" : ""}`}>
            {CATEGORIES.map((c, i) => (
              <Link key={c.name} to={`/book-shop?category=${c.name}`} className="hp-cat-card" style={{ "--i": i }}>
                <span className="hp-cat-emoji">{c.emoji}</span>
                <span className="hp-cat-name">{c.name}</span>
                <span className="hp-cat-count">{c.count} titles</span>
                <span className="hp-cat-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── READER FAVOURITES ── */}
      <section className="hp-section hp-section-paper" ref={staffRef}>
        <div className="hp-section-inner">
          <div className="hp-section-head">
            <div>
              <div className="hp-eyebrow">❤️ From our readers</div>
              <h2 className="hp-section-title">Reader favourites</h2>
            </div>
            <Link to="/book-shop" className="hp-text-link">Browse all books →</Link>
          </div>
          <div className={`hp-rv-grid ${staffVis ? "hp-grid-vis" : ""}`}>
            {(reviews.length ? reviews : FALLBACK_REVIEWS).slice(0, 3).map((r, i) => (
              <div key={r.id} className="hp-rv-card" style={{ "--i": i }}>
                <div className="hp-rv-stars">
                  {"★".repeat(Math.min(r.rating, 5))}{"☆".repeat(Math.max(0, 5 - r.rating))}
                </div>
                <blockquote className="hp-rv-quote">"{r.comment}"</blockquote>
                <div className="hp-rv-book">
                  {r.bookImageUrl
                    ? <img src={r.bookImageUrl} alt={r.bookTitle} className="hp-rv-cover" loading="lazy" />
                    : <div className="hp-rv-cover hp-rv-cover-ph">📖</div>
                  }
                  <div>
                    <p className="hp-rv-book-title">{r.bookTitle}</p>
                    <p className="hp-rv-book-author">{r.bookAuthor}</p>
                  </div>
                </div>
                <div className="hp-rv-reader">
                  <span className="hp-rv-initial">{r.userName?.[0]?.toUpperCase() || "R"}</span>
                  <div>
                    <p className="hp-rv-name">{r.userName}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="hp-section hp-section-paper" ref={benefitRef}>
        <div className="hp-section-inner">
          <div className="hp-section-head">
            <div><div className="hp-eyebrow">🌟 Why Epoch</div><h2 className="hp-section-title">Everything a reader needs</h2></div>
            <Link to="/register" className="hp-text-link">Join free →</Link>
          </div>
          <div className={`hp-benefit-grid ${benefitVis ? "hp-grid-vis" : ""}`}>
            {BENEFITS.map((b, i) => (
              <div key={b.title} className="hp-benefit-card" style={{ "--i": i }}>
                <span className="hp-benefit-icon">{b.icon}</span>
                <h4 className="hp-benefit-title">{b.title}</h4>
                <p className="hp-benefit-body">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="hp-cta">
        <div className="hp-cta-inner">
          <span className="hp-cta-icon">☕</span>
          <h2 className="hp-cta-title">Pull up a chair.<br /><em>Your next favourite book is waiting.</em></h2>
          <div className="hp-cta-btns">
            <Link to="/book-shop" className="hp-cta-primary">Start Browsing →</Link>
            <Link to="/register" className="hp-cta-ghost">Create Free Account</Link>
          </div>
        </div>
      </section>

    </div>
  );
}