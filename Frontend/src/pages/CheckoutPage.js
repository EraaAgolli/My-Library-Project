// src/pages/CheckoutPage.js
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLock, FaCheckCircle, FaArrowLeft, FaBook, FaShoppingBag, FaExclamationTriangle } from "react-icons/fa";
import api from "../api/axios";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useContext(CartContext);
  const { user }                        = useContext(AuthContext);
  const navigate                        = useNavigate();

  const [placing, setPlacing]       = useState(false);
  const [order,   setOrder]         = useState(null);
  const [error,   setError]         = useState(null);
  const [confirm, setConfirm]       = useState(false);

  if (!user) {
    return (
      <div style={styles.centeredPage}>
        <FaLock size={48} style={{ color: "#c6973f", opacity: 0.4, marginBottom: "8px" }} />
        <h2 style={styles.stateTitle}>Sign in to checkout</h2>
        <p style={styles.stateSub}>You need an account to place an order.</p>
        <Link to="/login" style={styles.primaryBtn}>Sign In</Link>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div style={styles.centeredPage}>
        <FaShoppingBag size={48} style={{ color: "#c6973f", opacity: 0.4, marginBottom: "8px" }} />
        <h2 style={styles.stateTitle}>Your cart is empty</h2>
        <p style={styles.stateSub}>Add some books before checking out.</p>
        <Link to="/book-shop" style={styles.primaryBtn}>Browse Books</Link>
      </div>
    );
  }

  if (order) {
    return (
      <div style={styles.centeredPage}>
        <FaCheckCircle size={64} style={{ color: "#276749", marginBottom: "1rem" }} />
        <h2 style={{ ...styles.stateTitle, color: "#276749" }}>Order Confirmed!</h2>
        <p style={styles.stateSub}>
          Thank you, <strong>{user.name}</strong>! Your books are on their way.
        </p>
        <div style={styles.orderCard}>
          <p style={styles.orderRow}><span style={styles.orderLabel}>Order ID</span><strong>{order.sessionId || order.id}</strong></p>
          <p style={styles.orderRow}><span style={styles.orderLabel}>Status</span><strong style={{ color: "#276749" }}>{order.status || "CONFIRMED"}</strong></p>
          <p style={{ ...styles.orderRow, borderBottom: "none" }}><span style={styles.orderLabel}>Total</span><strong>${order.totalPrice?.toFixed(2) ?? cartTotal.toFixed(2)}</strong></p>
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <button style={styles.primaryBtn} onClick={() => navigate("/dashboard")}>View My Orders</button>
          <button style={styles.secondaryBtn} onClick={() => navigate("/book-shop")}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setError(null);
    try {
      const res = await api.post("/checkout");
      setOrder(res.data);
      await clearCart();
      setConfirm(false);
      setTimeout(() => navigate("/dashboard"), 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order. Please try again.");
      setConfirm(false);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div style={styles.page}>

      {/* ── Confirmation Modal ── */}
      {confirm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <FaExclamationTriangle size={32} style={{ color: "#c6973f", marginBottom: "12px" }} />
            <h3 style={styles.modalTitle}>Confirm your order</h3>
            <p style={styles.modalSub}>
              You're about to place an order for <strong>${cartTotal.toFixed(2)}</strong>.
              Are you sure you want to proceed?
            </p>
            <div style={styles.modalActions}>
              <button
                style={{ ...styles.primaryBtn, padding: "12px 32px" }}
                onClick={handlePlaceOrder}
                disabled={placing}
              >
                <FaLock />
                {placing ? "Placing…" : "Yes, Place Order"}
              </button>
              <button
                style={{ ...styles.secondaryBtn, padding: "12px 32px" }}
                onClick={() => setConfirm(false)}
                disabled={placing}
              >
                No, Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <button style={styles.backLink} onClick={() => navigate("/cart")}>
            <FaArrowLeft /> Back to Cart
          </button>
          <div style={styles.eyebrow}>
            <span style={styles.eyebrowLine} />
            <FaLock style={{ fontSize: "0.65rem" }} /> Secure Checkout
          </div>
          <h1 style={styles.pageTitle}>Review your order</h1>
        </div>
      </div>

      <div style={styles.inner}>
        <div style={styles.twoCol}>

          <div style={styles.itemsCol}>
            <div style={styles.sectionLabel}>Order Items</div>
            <div style={styles.itemsList}>
              {cart.map((item) => {
                const isBorrow = item.isBorrow === true || item.borrow === true;
                const price    = isBorrow ? (item.borrowPrice || 0) : (item.price || 0);
                return (
                  <div key={`${item.bookId}-${isBorrow}`} style={styles.checkoutItem}>
                    {item.imageUrl
                      ? <img src={item.imageUrl} alt={item.title} style={styles.itemCover} />
                      : <div style={styles.coverPlaceholder}>📖</div>
                    }
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={styles.itemTitle}>{item.title}</p>
                      <p style={styles.itemAuthor}>by {item.author}</p>
                      <span style={isBorrow ? styles.badgeBorrow : styles.badgeBuy}>
                        {isBorrow ? <><FaBook /> Borrow</> : <><FaShoppingBag /> Buy</>}
                      </span>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={styles.unitPrice}>${price.toFixed(2)} × {item.quantity}</p>
                      <strong style={styles.lineTotal}>${(price * item.quantity).toFixed(2)}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={styles.summaryCol}>
            <div style={styles.sectionLabel}>Order Summary</div>

            <div style={styles.summaryBox}>
              <div style={styles.summaryRow}>
                <span>Subtotal ({cart.length} {cart.length === 1 ? "item" : "items"})</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Shipping</span>
                <span style={{ color: "#276749", fontWeight: 600 }}>Free</span>
              </div>
              <div style={styles.summaryDivider} />
              <div style={{ ...styles.summaryRow, fontSize: "1.15rem", fontWeight: 700 }}>
                <span style={{ fontFamily: "'Fraunces', serif" }}>Total</span>
                <span style={{ fontFamily: "'Fraunces', serif", color: "#0d1f35", letterSpacing: "-0.02em" }}>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <div style={styles.customerInfo}>
              <p style={styles.customerLabel}>Ordering as</p>
              <p style={styles.customerName}>{user.name}</p>
              <p style={styles.customerEmail}>{user.email}</p>
            </div>

            {error && <div style={styles.errorBox}>{error}</div>}

            <button
              style={{ ...styles.primaryBtn, width: "100%", fontSize: "0.94rem", padding: "15px", justifyContent: "center" }}
              onClick={() => setConfirm(true)}
              disabled={placing}
            >
              <FaLock />
              {`Place Order — $${cartTotal.toFixed(2)}`}
            </button>

            <p style={styles.secureNote}>
              <FaLock style={{ marginRight: "5px" }} />
              Secure checkout. Your data is safe.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

const FONT_BODY  = "'Outfit', sans-serif";
const FONT_SERIF = "'Fraunces', serif";
const NAVY       = "#0d1f35";
const GOLD       = "#c6973f";
const CREAM      = "#f5f0e8";
const PAPER      = "#faf7f2";
const INK        = "#1a1a2e";
const DIM        = "#5a6a7a";
const MUTE       = "#a0aec0";
const BORDER     = "rgba(26,26,46,0.10)";
const GREEN      = "#276749";
const RED        = "#c53030";

const styles = {
  page: {
    background: CREAM,
    fontFamily: FONT_BODY,
    color: INK,
    minHeight: "90vh",
    paddingTop: "10px",
  },
  hero: {
    background: NAVY,
    padding: "30px 60px 30px",
    position: "relative",
    overflow: "hidden",
    backgroundImage: "radial-gradient(circle, rgba(198,151,63,0.08) 1px, transparent 1px)",
    backgroundSize: "32px 32px",
  },
  heroInner: {
    maxWidth: "1100px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  inner: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "48px 80px 100px",
  },
  backLink: {
    background: "none",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "4px",
    cursor: "pointer",
    color: "rgba(255,255,255,0.5)",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.84rem",
    fontFamily: FONT_BODY,
    fontWeight: 500,
    marginBottom: "28px",
    padding: "8px 18px",
    transition: "color 0.18s",
  },
  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.63rem",
    fontWeight: 600,
    letterSpacing: "0.26em",
    textTransform: "uppercase",
    color: GOLD,
    marginBottom: "12px",
  },
  eyebrowLine: {
    display: "inline-block",
    width: "20px",
    height: "1.5px",
    background: GOLD,
  },
  pageTitle: {
    fontFamily: FONT_SERIF,
    fontSize: "clamp(2rem, 4vw, 3.2rem)",
    fontWeight: 900,
    color: "#fff",
    margin: 0,
    letterSpacing: "-0.04em",
    lineHeight: 1.0,
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 340px",
    gap: "48px",
    alignItems: "start",
  },
  itemsCol: {
    background: PAPER,
    border: `1px solid ${BORDER}`,
    borderRadius: "4px",
    padding: "28px",
  },
  sectionLabel: {
    fontSize: "0.63rem",
    fontWeight: 700,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: GOLD,
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    paddingBottom: "16px",
    borderBottom: `1px solid ${BORDER}`,
  },
  itemsList: {
    display: "flex",
    flexDirection: "column",
  },
  checkoutItem: {
    display: "flex",
    gap: "20px",
    alignItems: "flex-start",
    padding: "24px 0",
    borderBottom: `1px solid ${BORDER}`,
  },
  itemCover: {
    width: "72px",
    aspectRatio: "2/3",
    objectFit: "cover",
    borderRadius: "3px",
    border: `1px solid ${BORDER}`,
    flexShrink: 0,
    display: "block",
  },
  coverPlaceholder: {
    width: "72px",
    aspectRatio: "2/3",
    background: CREAM,
    border: `1px solid ${BORDER}`,
    borderRadius: "3px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.8rem",
    flexShrink: 0,
  },
  itemTitle: {
    fontFamily: FONT_SERIF,
    fontSize: "1.0rem",
    fontWeight: 700,
    color: INK,
    margin: "0 0 4px",
    lineHeight: 1.3,
  },
  itemAuthor: {
    fontSize: "0.78rem",
    color: MUTE,
    margin: "0 0 10px",
  },
  badgeBuy: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "0.65rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    padding: "3px 9px",
    borderRadius: "2px",
    background: "rgba(198,151,63,0.10)",
    color: GOLD,
    border: "1px solid rgba(198,151,63,0.2)",
  },
  badgeBorrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "0.65rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    padding: "3px 9px",
    borderRadius: "2px",
    background: "rgba(39,103,73,0.08)",
    color: GREEN,
    border: "1px solid rgba(39,103,73,0.18)",
  },
  unitPrice: {
    fontSize: "0.76rem",
    color: MUTE,
    margin: "0 0 3px",
  },
  lineTotal: {
    fontFamily: FONT_SERIF,
    fontSize: "1.1rem",
    fontWeight: 700,
    color: NAVY,
  },
  summaryCol: {
    background: PAPER,
    border: `1px solid ${BORDER}`,
    borderRadius: "4px",
    padding: "28px",
    position: "sticky",
    top: "88px",
  },
  summaryBox: {
    background: CREAM,
    border: `1px solid ${BORDER}`,
    borderRadius: "4px",
    padding: "16px",
    marginBottom: "20px",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    fontSize: "0.88rem",
    color: DIM,
    fontFamily: FONT_BODY,
  },
  summaryDivider: {
    height: "1px",
    background: BORDER,
    margin: "12px 0",
  },
  customerInfo: {
    background: "rgba(198,151,63,0.06)",
    border: "1px solid rgba(198,151,63,0.15)",
    borderRadius: "4px",
    padding: "14px 16px",
    marginBottom: "20px",
  },
  customerLabel: {
    fontSize: "0.63rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    color: GOLD,
    margin: "0 0 6px",
  },
  customerName: {
    fontSize: "0.92rem",
    fontWeight: 600,
    color: INK,
    margin: "0 0 2px",
  },
  customerEmail: {
    fontSize: "0.8rem",
    color: MUTE,
    margin: 0,
  },
  primaryBtn: {
    background: NAVY,
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "13px 28px",
    fontFamily: FONT_BODY,
    fontWeight: 700,
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.92rem",
    boxShadow: "0 4px 16px rgba(13,31,53,0.15)",
    transition: "background 0.18s",
  },
  secondaryBtn: {
    background: "transparent",
    color: INK,
    border: `1.5px solid ${BORDER}`,
    borderRadius: "4px",
    padding: "12px 26px",
    fontFamily: FONT_BODY,
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.92rem",
  },
  secureNote: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.72rem",
    color: MUTE,
    margin: "10px 0 0",
  },
  errorBox: {
    background: "rgba(197,48,48,0.06)",
    border: "1px solid rgba(197,48,48,0.2)",
    borderRadius: "4px",
    padding: "12px 14px",
    fontSize: "0.86rem",
    color: RED,
    marginBottom: "14px",
    lineHeight: 1.5,
  },
  centeredPage: {
    minHeight: "100vh",
    paddingTop: "64px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "14px",
    padding: "100px 40px",
    background: CREAM,
    fontFamily: FONT_BODY,
  },
  stateTitle: {
    fontFamily: FONT_SERIF,
    fontSize: "1.8rem",
    fontWeight: 700,
    color: INK,
    margin: 0,
    letterSpacing: "-0.02em",
  },
  stateSub: {
    fontSize: "0.95rem",
    color: DIM,
    maxWidth: "320px",
    textAlign: "center",
    lineHeight: 1.7,
    margin: 0,
  },
  orderCard: {
    background: PAPER,
    border: `1px solid ${BORDER}`,
    borderRadius: "4px",
    padding: "20px 28px",
    margin: "8px 0 16px",
    minWidth: "280px",
    width: "100%",
    maxWidth: "400px",
  },
  orderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    padding: "8px 0",
    borderBottom: `1px solid ${BORDER}`,
    fontSize: "0.88rem",
    margin: 0,
    color: DIM,
  },
  orderLabel: {
    fontWeight: 500,
  },

  /* ── Confirmation modal ── */
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(13,31,53,0.55)",
    backdropFilter: "blur(3px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalBox: {
    background: PAPER,
    border: `1px solid ${BORDER}`,
    borderRadius: "6px",
    padding: "40px 48px",
    maxWidth: "420px",
    width: "90%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    boxShadow: "0 20px 60px rgba(13,31,53,0.25)",
    fontFamily: FONT_BODY,
  },
  modalTitle: {
    fontFamily: FONT_SERIF,
    fontSize: "1.5rem",
    fontWeight: 800,
    color: INK,
    margin: 0,
    letterSpacing: "-0.02em",
  },
  modalSub: {
    fontSize: "0.9rem",
    color: DIM,
    textAlign: "center",
    lineHeight: 1.6,
    margin: "4px 0 12px",
  },
  modalActions: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "100%",
  },
};

export default CheckoutPage;