// src/context/CartContext.js
import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart]       = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCart = useCallback(async () => {
    if (!user) { setCart([]); return; }
    setLoading(true);
    try {
      const res = await api.get("/cart");
      setCart(res.data.items ?? res.data ?? []);
    } catch (err) {
      console.error("Error loading cart:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadCart(); }, [loadCart]);

  const addToCart = async (bookId, quantity = 1, isBorrow = false) => {
    if (!user) return false;
    try {
      await api.post("/cart/add", null, { params: { bookId, quantity, isBorrow } });
      await loadCart();
      return true;
    } catch (err) {
      console.error("Error adding to cart:", err);
      return false;
    }
  };

  // FIX: now accepts isBorrow so DELETE /cart/remove/{bookId}?isBorrow=X
  // removes only the buy OR borrow line, not both entries for the same book
  const removeFromCart = async (bookId, isBorrow) => {
    // Optimistic: remove the matching line immediately
    setCart(prev =>
      prev.filter(i => !(i.bookId === bookId && (i.isBorrow === isBorrow || i.borrow === isBorrow)))
    );
    try {
      await api.delete(`/cart/remove/${bookId}`, { params: { isBorrow } });
      // no loadCart() — optimistic filter is correct
    } catch (err) {
      console.error("Error removing from cart:", err);
      await loadCart(); // rollback only on failure
    }
  };

  // FIX: quantity change uses PUT /cart/update — single atomic call, no race condition.
  // Optimistic update patches ONLY the quantity field on the matching item,
  // leaving other items (including the same book with a different isBorrow) untouched.
  const updateQuantity = async (bookId, quantity, isBorrow = false) => {
    const qty = parseInt(quantity, 10);
    if (qty < 1) { await removeFromCart(bookId, isBorrow); return; }

    // Optimistic: patch ONLY the quantity field on the matching row.
    // No loadCart() after success — that would replace the whole array
    // and cause React to re-mount every CartRow, resetting their local state.
    setCart(prev =>
      prev.map(i =>
        i.bookId === bookId && (i.isBorrow === isBorrow || i.borrow === isBorrow)
          ? { ...i, quantity: qty }
          : i
      )
    );
    try {
      await api.put(`/cart/update/${bookId}`, null, { params: { quantity: qty, isBorrow } });
      // intentionally no loadCart() here — optimistic state is correct
    } catch (err) {
      console.error("Error updating quantity:", err);
      // Only reload on failure to rollback
      await loadCart();
    }
  };

  const clearCart = async () => {
    const snapshot = [...cart];
    setCart([]);
    try {
      await Promise.all(
        snapshot.map(item =>
          api.delete(`/cart/remove/${item.bookId}`, {
            params: { isBorrow: item.isBorrow ?? item.borrow ?? false }
          })
        )
      );
    } catch (err) {
      console.error("Error clearing cart:", err);
      await loadCart();
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const cartTotal = cart.reduce((sum, item) => {
    const isBorrow = item.isBorrow ?? item.borrow ?? false;
    const price    = isBorrow ? (item.borrowPrice || 0) : (item.price || 0);
    return sum + price * (item.quantity || 1);
  }, 0);

  return (
    <CartContext.Provider value={{
      cart, loading,
      addToCart, removeFromCart, updateQuantity, clearCart,
      cartCount, cartTotal, loadCart
    }}>
      {children}
    </CartContext.Provider>
  );
};