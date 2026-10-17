// src/context/WishlistContext.js
import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "./AuthContext";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading]   = useState(false);

  // ── LOAD ───────────────────────────────────────────────────────────
  // Backend: GET /wishlist  → List<WishlistItemDTO>
  // WishlistItemDTO has: id, bookId, title, author, imageUrl, price
  const loadWishlist = useCallback(async () => {
    if (!user) { setWishlist([]); return; }
    setLoading(true);
    try {
      const res = await api.get("/wishlist");
      setWishlist(res.data ?? []);
    } catch (err) {
      console.error("Error loading wishlist:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadWishlist(); }, [loadWishlist]);

  // ── ADD ────────────────────────────────────────────────────────────
  // Backend: POST /wishlist/add/{bookId}
  const addToWishlist = async (bookId) => {
    if (!user) return false;
    try {
      await api.post(`/wishlist/add/${bookId}`);
      await loadWishlist();
      return true;
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      return false;
    }
  };

  // ── REMOVE ────────────────────────────────────────────────────────
  // Optimistic: remove immediately, only reload on failure to rollback
  const removeFromWishlist = async (bookId) => {
    setWishlist(prev => prev.filter(i => (i.bookId ?? i.book?.id) !== bookId));
    try {
      await api.delete(`/wishlist/remove/${bookId}`);
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      await loadWishlist(); // rollback
    }
  };

  // ── TOGGLE ────────────────────────────────────────────────────────
  const toggleWishlist = async (bookId) => {
    if (isInWishlist(bookId)) {
      await removeFromWishlist(bookId);
    } else {
      await addToWishlist(bookId);
    }
  };

  // ── CHECK ─────────────────────────────────────────────────────────
  // WishlistItemDTO may have bookId directly or nested book.id
  const isInWishlist = (bookId) =>
    wishlist.some((item) => item.bookId === bookId || item.book?.id === bookId);

  return (
    <WishlistContext.Provider value={{ wishlist, loading, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, wishlistCount: wishlist.length, loadWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};