// src/pages/Cart.js
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaShoppingBag, FaArrowLeft, FaBook } from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import "../components/Cart.css";

// ── Isolated row component ──────────────────────────────────────────────────
// Keeps its own quantity state so +/- buttons never cause the parent list
// to re-render other rows. Only this row re-renders on quantity change.
function CartRow({ item, onRemove, onQuantityChange }) {
  const isBorrow = item.isBorrow === true || item.borrow === true;
  const price    = isBorrow ? (item.borrowPrice || 0) : (item.price || 0);

  // Local quantity state — initialised from server value.
  // Updates instantly on click; syncs to server in the background.
  const [qty, setQty] = useState(item.quantity || 1);

  const handleDecrease = () => {
    if (qty <= 1) return;
    const next = qty - 1;
    setQty(next);
    onQuantityChange(item.bookId, next, isBorrow);
  };

  const handleIncrease = () => {
    const next = qty + 1;
    setQty(next);
    onQuantityChange(item.bookId, next, isBorrow);
  };

  // Keep local qty in sync if the server pushes a different value (e.g. after reload)
  React.useEffect(() => { setQty(item.quantity || 1); }, [item.quantity]);

  return (
    <div className="cart-item">
      {/* Cover */}
      <div className="cart-cover-wrap">
        {item.imageUrl
          ? <img src={item.imageUrl} alt={item.title} className="cart-cover" />
          : <div className="cart-cover-placeholder">📖</div>
        }
      </div>

      {/* Details */}
      <div className="cart-item-info">
        <div className="cart-item-top">
          <div>
            <h3>{item.title}</h3>
            <p className="cart-item-author">by {item.author}</p>
            <span className={`item-type-badge ${isBorrow ? "borrow" : "buy"}`}>
              {isBorrow ? <><FaBook /> Borrow</> : <><FaShoppingBag /> Buy</>}
            </span>
            {isBorrow && <span className="borrow-duration-tag">14-day rental</span>}
          </div>

          <button
            className="cart-remove-btn"
            onClick={() => onRemove(item.bookId, isBorrow)}
            title="Remove item"
          >
            <FaTrash />
          </button>
        </div>

        <div className="cart-item-bottom">
          {/* Quantity — purely local state, no parent re-render */}
          <div className="quantity-control">
            <button onClick={handleDecrease} disabled={qty <= 1} aria-label="Decrease">−</button>
            <span>{qty}</span>
            <button onClick={handleIncrease} aria-label="Increase">+</button>
          </div>

          <div className="cart-item-price">
            <span className="unit-price">${price.toFixed(2)} × {qty}</span>
            <strong className="line-total">${(price * qty).toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Cart page ───────────────────────────────────────────────────────────────
function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, loading } = useContext(CartContext);
  const { user }   = useContext(AuthContext);
  const navigate   = useNavigate();

  if (!user) return (
    <div className="cart-empty-state">
      <FaShoppingBag size={60} style={{ color: "#ccc" }} />
      <h2>Your cart is empty</h2>
      <p>Please <Link to="/login">sign in</Link> to view your cart.</p>
    </div>
  );

  if (loading) return <div className="cart-container"><div className="spinner" /></div>;

  if (!cart || cart.length === 0) return (
    <div className="cart-empty-state">
      <FaShoppingBag size={60} style={{ color: "#ccc" }} />
      <h2>Your cart is empty</h2>
      <p>Browse our <Link to="/book-shop">book shop</Link> to find something great.</p>
    </div>
  );

  return (
    <div className="cart-container">
      <div className="cart-header">
        <button className="cart-back-btn" onClick={() => navigate("/book-shop")}>
          <FaArrowLeft /> Continue Shopping
        </button>
        <h2>
          Your Cart{" "}
          <span className="cart-count">
            ({cart.length} {cart.length === 1 ? "item" : "items"})
          </span>
        </h2>
      </div>

      <div className="cart-layout">
        {/* Item list */}
        <div className="cart-items">
          {cart.map((item) => {
            const isBorrow = item.isBorrow === true || item.borrow === true;
            // Use cartItemId (stable DB id) as key so React never re-mounts a
            // row just because quantity changed. Falls back to bookId+isBorrow.
            const rowKey = item.cartItemId ?? `${item.bookId}-${isBorrow}`;
            return (
              <CartRow
                key={rowKey}
                item={item}
                onRemove={removeFromCart}
                onQuantityChange={updateQuantity}
              />
            );
          })}
        </div>

        {/* Order summary */}
        <div className="cart-summary">
          <h3>Order Summary</h3>

          <div className="summary-lines">
            {cart.map((item) => {
              const isBorrow = item.isBorrow === true || item.borrow === true;
              const price    = isBorrow ? (item.borrowPrice || 0) : (item.price || 0);
              const rowKey   = item.cartItemId ?? `${item.bookId}-${isBorrow}`;
              return (
                <div key={rowKey} className="summary-line">
                  <span>{item.title}{isBorrow ? " (Borrow)" : ""} × {item.quantity}</span>
                  <span>${(price * item.quantity).toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          <div className="summary-divider" />

          <div className="summary-total">
            <span>Total</span>
            <strong>${cartTotal.toFixed(2)}</strong>
          </div>

          <button className="btn-checkout" onClick={() => navigate("/checkout")}>
            Proceed to Checkout →
          </button>

          <Link to="/book-shop" className="btn-continue-shopping">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CartPage;