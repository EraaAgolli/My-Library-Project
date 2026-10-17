// src/pages/BookDetailsPage.js
import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaBook, FaArrowLeft, FaStar, FaClock, FaTrash } from "react-icons/fa";
import api from "../api/axios";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { AuthContext } from "../context/AuthContext";
import "./../components/BookDetails.css";

function BookDetailsPage() {
  const { id }                           = useParams();
  const navigate                         = useNavigate();
  const { user }                         = useContext(AuthContext);
  const { addToCart }                    = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  const [book, setBook]                 = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [toast, setToast]               = useState(null);
  const [reviews, setReviews]           = useState([]);
  const [mode, setMode]                 = useState("buy");
  const [reviewText, setReviewText]     = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating]   = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        const [bookRes, reviewsRes] = await Promise.allSettled([
          api.get(`/books/${id}`),
          api.get(`/reviews/book/${id}`),
        ]);
        if (bookRes.status === "fulfilled") {
          const data = bookRes.value.data;
          setBook(data);
        } else {
          setError("Book not found");
        }
        if (reviewsRes.status === "fulfilled") setReviews(reviewsRes.value.data ?? []);
      } catch {
        setError("Failed to load book.");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const canBorrow = (b) =>
    b != null &&
    (b.availableForBorrow === true || b.isAvailableForBorrow === true) &&
    b.borrowPrice != null &&
    Number(b.borrowPrice) > 0;

  const handleAddToCart = async () => {
    if (!user) { navigate("/login"); return; }
    if (user.role === "ADMIN") { showToast("You're an admin — admins can't buy books.", "error"); return; }
    const isBorrow = mode === "borrow";
    const ok = await addToCart(book.id, 1, isBorrow);
    if (ok) {
      const message = isBorrow
        ? `"${book.title}" added for borrowing!`
        : `"${book.title}" added to cart!`;
      showToast(message);
      setTimeout(() => navigate("/cart"), 1500);
    }
  };

  const handleWishlist = async () => {
    if (!user) { navigate("/login"); return; }
    if (user.role === "ADMIN") { showToast("You're an admin — admins can't use the wishlist.", "error"); return; }
    await toggleWishlist(book.id);
    showToast(isInWishlist(book.id) ? "Removed from wishlist!" : "Added to wishlist!");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate("/login"); return; }
    if (!reviewText.trim()) return;
    setSubmittingReview(true);
    try {
      await api.post(`/reviews/add?bookId=${id}&rating=${reviewRating}&comment=${encodeURIComponent(reviewText)}`);
      setReviewText(""); setReviewRating(5);
      const res = await api.get(`/reviews/book/${id}`);
      setReviews(res.data ?? []);
      showToast("Review submitted successfully!");
    } catch {
      showToast("Failed to submit review.", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      const res = await api.get(`/reviews/book/${id}`);
      setReviews(res.data ?? []);
      showToast("Review deleted.");
    } catch {
      showToast("Failed to delete review.", "error");
    }
  };

  if (loading) return <div className="book-details-loading"><div className="spinner" /><p>Loading book details...</p></div>;
  if (error)   return <div className="book-details-error"><p>{error}</p><Link to="/book-shop">← Back to Shop</Link></div>;

  const borrowable   = canBorrow(book);
  const inWishlist   = isInWishlist(book.id);
  const isBorrowMode = borrowable && mode === "borrow";

  return (
    <div className="book-details-page">
      {toast && <div className={`detail-toast ${toast.type}`}>{toast.message}</div>}

      <Link to="/book-shop" className="back-link">
        <FaArrowLeft /> Back to Shop
      </Link>

      <div className="book-details">
        <div className="book-image">
          {book.imageUrl
            ? <img src={book.imageUrl} alt={book.title} className="book-cover-large" />
            : <div className="cover-placeholder">📖</div>
          }
          {borrowable && (
            <div className="borrow-available-pill">
              <FaClock /> Available to Borrow
            </div>
          )}
        </div>

        <div className="book-info">
          {book.category && <span className="detail-category">{book.category}</span>}
          <h2 className="detail-title">{book.title}</h2>
          <p className="detail-author">by {book.author}</p>

          <div className="detail-rating">
            {[1,2,3,4,5].map(s => (
              <FaStar key={s} style={{ color: s <= Math.round(book.rating || 0) ? "#c27803" : "#ddd" }} />
            ))}
            <span>{book.rating?.toFixed(1)} ({book.reviewsCount || 0} reviews)</span>
          </div>

          {borrowable ? (
            <>
              <div className="mode-selector">
                <button type="button"
                  className={`mode-btn ${mode === "buy" ? "active-buy" : ""}`}
                  onClick={() => setMode("buy")}>
                  <FaShoppingCart className="mode-icon" />
                  <span className="mode-btn-label">Buy</span>
                  <span className="mode-btn-price">${book.price?.toFixed(2)}</span>
                  <span className="mode-btn-sub">Permanent copy</span>
                </button>

                <button type="button"
                  className={`mode-btn ${mode === "borrow" ? "active-borrow" : ""}`}
                  onClick={() => setMode("borrow")}>
                  <FaBook className="mode-icon" />
                  <span className="mode-btn-label">Borrow</span>
                  <span className="mode-btn-price">${Number(book.borrowPrice).toFixed(2)}</span>
                  <span className="mode-btn-sub">14-day rental</span>
                </button>
              </div>

              {isBorrowMode && (
                <div className="borrow-info-banner">
                  <FaClock />
                  <div>
                    <strong>14-day rental</strong> — pay ${Number(book.borrowPrice).toFixed(2)} now.
                    Your due date is set at checkout. Track it in{" "}
                    <Link to="/dashboard">Dashboard → Borrowed Books</Link>.
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="detail-prices">
              <div className="price-buy">
                <span className="price-label">Buy</span>
                <strong>${book.price?.toFixed(2)}</strong>
              </div>
            </div>
          )}

          <div className="detail-actions">
            <button type="button"
              className={`btn-add-main ${isBorrowMode ? "borrow-mode" : "buy-mode"}`}
              onClick={handleAddToCart}>
              {isBorrowMode ? <FaBook /> : <FaShoppingCart />}
              {isBorrowMode
                ? `Borrow for $${Number(book.borrowPrice).toFixed(2)}`
                : `Add to Cart — $${book.price?.toFixed(2)}`}
            </button>

            <button type="button"
              className={`btn-wishlist ${inWishlist ? "active" : ""}`}
              onClick={handleWishlist}>
              <FaHeart /> {inWishlist ? "Wishlisted" : "Wishlist"}
            </button>
          </div>

          <div className="detail-meta">
            {book.publisher     && <div><span className="meta-label">Publisher</span><span>{book.publisher}</span></div>}
            {book.publishedDate && <div><span className="meta-label">Published</span><span>{String(book.publishedDate)}</span></div>}
            {book.pages         && <div><span className="meta-label">Pages</span><span>{book.pages}</span></div>}
            {book.isbn          && <div><span className="meta-label">ISBN</span><span>{book.isbn}</span></div>}
            {book.language      && <div><span className="meta-label">Language</span><span>{book.language}</span></div>}
            {book.audience      && <div><span className="meta-label">Audience</span><span>{book.audience}</span></div>}
            {book.stock != null && <div><span className="meta-label">In Stock</span><span>{book.stock > 0 ? `${book.stock} copies` : "Out of stock"}</span></div>}
          </div>

          {book.description && (
            <div className="detail-description">
              <h4>About this book</h4>
              <p>{book.description}</p>
            </div>
          )}
        </div>
      </div>

      <div className="reviews-section">
        <h3>Reader Reviews ({reviews.length})</h3>

        {user ? (
          <form className="review-form" onSubmit={handleReviewSubmit}>
            <h4>Write a Review</h4>
            <div className="review-stars-input">
              {[1,2,3,4,5].map(s => (
                <button type="button" key={s}
                  onClick={() => setReviewRating(s)}
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}>
                  <FaStar style={{
                    color: s <= (hoverRating || reviewRating) ? "#c27803" : "#ddd",
                    fontSize: "1.4rem", display: "block",
                    transform: s <= (hoverRating || reviewRating) ? "scale(1.15)" : "scale(1)",
                    transition: "color 0.15s, transform 0.15s"
                  }} />
                </button>
              ))}
            </div>
            <textarea value={reviewText} onChange={e => setReviewText(e.target.value)}
              placeholder="Share your thoughts about this book..." rows={4} required />
            <button type="submit" disabled={submittingReview}>
              {submittingReview ? "Submitting…" : "Submit Review"}
            </button>
          </form>
        ) : (
          <p className="review-login-prompt">
            <Link to="/login">Sign in</Link> to leave a review.
          </p>
        )}

        {reviews.length > 0 ? (
          <div className="review-list">
            {reviews.map((r, i) => {
              const canDelete = user && (user.id === r.userId || user.role === "ADMIN");
              return (
                <div key={r.id || i} className="review-card">
                  <div className="review-header">
                    <div className="review-avatar">{(r.userName || "U")[0].toUpperCase()}</div>
                    <div style={{ flex: 1 }}>
                      <strong>{r.userName || "Reader"}</strong>
                      <div>{[1,2,3,4,5].map(s => <FaStar key={s} style={{ color: s <= r.rating ? "#c27803" : "#ddd", fontSize: "0.8rem" }} />)}</div>
                    </div>
                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => handleDeleteReview(r.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#e53e3e",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "0.85rem",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "#fff5f5"}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}
                      >
                        <FaTrash /> Delete
                      </button>
                    )}
                  </div>
                  <p className="review-comment">"{r.comment}"</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ color: "#888", fontStyle: "italic" }}>No reviews yet. Be the first to review this book!</p>
        )}
      </div>
    </div>
  );
}

export default BookDetailsPage;