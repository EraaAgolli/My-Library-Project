// src/pages/Login.js
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./../components/Login.css";

const Login = () => {
  const { login }   = useContext(AuthContext);
  const navigate    = useNavigate();
  const location    = useLocation();
  const from        = location.state?.from?.pathname || "/";

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* Centered card */}
      <div className="login-card">

        <Link to="/" className="login-logo">
          Epoch <em>of Books</em>
        </Link>

        <div className="login-eyebrow"><span className="login-eyebrow-line" /> Welcome back</div>
        <h2 className="login-heading">Sign in</h2>
        <p className="login-sub">Good to see you again. Your next read is waiting.</p>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <p className="form-error">{error}</p>}

          <div className="login-field">
            <label className="login-label">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="login-field">
            <label className="login-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="form-footer">
          Don't have an account? <Link to="/register">Create one free</Link>
        </p>

      </div>
    </div>
  );
};

export default Login;