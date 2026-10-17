// src/pages/WishlistPage.js
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaTrash, FaShoppingCart, FaBook } from "react-icons/fa";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import "../components/wishlist.css";

function WishlistPage() {
  const { user }                               = useContext(AuthContext);
  const { wishlist, removeFromWishlist, loading } = useContext(WishlistContext);
  const { addToCart }                          = useContext(CartContext);
  const navigate                               = useNavigate();
  const [toast, setToast]                      = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  if (!user) {
    return (
      <div className="wishlist-container">
        <div className="wishlist-empty">
          <FaHeart size={60} style={{ color: "#ccc" }} />
          <h2>Sign in to view your wishlist</h2>
          <p>Save books you love and come back to them anytime.</p>
          <Link to="/login" className="wishlist-cta-btn">Sign In</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="wishlist-container">
        <div className="spinner" style={{ margin: "80px auto" }} />
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-container">
        <div className="wishlist-empty">
          <FaHeart size={60} style={{ color: "#ccc" }} />
          <h2>Your wishlist is empty</h2>
          <p>Browse books and click the ❤ to save them here.</p>
          <Link to="/book-shop" className="wishlist-cta-btn">Browse Books</Link>
        </div>
      </div>
    );
  }

  const handleMoveToCart = async (bookId, title) => {
    if (user.role === "ADMIN") { showToast("You're an admin — admins can't buy books.", "error"); return; }
    const ok = await addToCart(bookId, 1, false);
    if (ok) {
      await removeFromWishlist(bookId);
      showToast(`"${title}" added to cart!`);
      setTimeout(() => navigate("/cart"), 1500);
    }
  };

  const handleBorrow = async (bookId, title) => {
    if (user.role === "ADMIN") { showToast("You're an admin — admins can't buy books.", "error"); return; }
    const ok = await addToCart(bookId, 1, true);
    if (ok) {
      await removeFromWishlist(bookId);
      showToast(`"${title}" added for borrowing!`);
      setTimeout(() => navigate("/cart"), 1500);
    }
  };

  return (
    <div className="wishlist-container">
      {toast && <div className={`detail-toast ${toast.type}`}>{toast.message}</div>}

      <div className="wishlist-page-header">
        <h1 className="wishlist-title">
          <FaHeart style={{ color: "#e74c3c", marginRight: "10px" }} />
          My Wishlist
          <span className="wishlist-count">({wishlist.length} {wishlist.length === 1 ? "book" : "books"})</span>
        </h1>
        <Link to="/book-shop" className="wishlist-back-link">← Keep Browsing</Link>
      </div>

      <div className="wishlist-grid">
        {wishlist.map((item) => {
          const bookId      = item.bookId ?? item.book?.id;
          const title       = item.title  ?? item.book?.title;
          const author      = item.author ?? item.book?.author;
          const imageUrl    = item.imageUrl ?? item.book?.imageUrl;
          const price       = item.price   ?? item.book?.price;
          const canBorrow   = item.availableForBorrow ?? item.book?.availableForBorrow ?? false;
          const borrowPrice = item.borrowPrice ?? item.book?.borrowPrice;

          return (
            <div key={item.id} className="wishlist-card">
              <Link to={`/books/${bookId}`} className="wishlist-cover-link">
                <div className="wishlist-cover-box">
                  {imageUrl ? (
                    <img src={imageUrl} alt={title} />
                  ) : (
                    <div className="wishlist-cover-placeholder">📖</div>
                  )}
                  <div className="wishlist-overlay">
                    <span>View Details</span>
                  </div>
                </div>
              </Link>

              <div className="wishlist-info">
                <Link to={`/books/${bookId}`} className="wishlist-book-title">{title}</Link>
                <p className="wishlist-book-author">{author}</p>
                <div className="wishlist-prices">
                  <strong className="wishlist-price">${price?.toFixed(2)}</strong>
                  {canBorrow && (
                    <span className="wishlist-borrow-price">Borrow ${borrowPrice?.toFixed(2)}</span>
                  )}
                </div>
              </div>

              <div className="wishlist-card-actions">
                <button
                  className="wishlist-action add"
                  onClick={() => handleMoveToCart(bookId, title)}
                  title="Move to cart"
                >
                  <FaShoppingCart /> Add to Cart
                </button>
                {canBorrow && (
                  <button
                    className="wishlist-action borrow"
                    onClick={() => handleBorrow(bookId, title)}
                    title="Borrow"
                  >
                    <FaBook /> Borrow
                  </button>
                )}
                <button
                  className="wishlist-action remove"
                  onClick={() => removeFromWishlist(bookId)}
                  title="Remove from wishlist"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WishlistPage;