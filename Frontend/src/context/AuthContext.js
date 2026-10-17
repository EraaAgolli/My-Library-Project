// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Login ──────────────────────────────────────────────
  // Backend: POST /auth/login → { token, user: { id, name, email, role } }
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("accessToken", res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  // ── Register ───────────────────────────────────────────
  // Backend: POST /auth/register → { token, user: { id, name, email, role } }
  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    return res.data;
  };

  // ── Logout ─────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  // ── Restore session on mount ───────────────────────────
  // Backend: GET /auth/me → { id, name, email, role }
  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) { setLoading(false); return; }
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};