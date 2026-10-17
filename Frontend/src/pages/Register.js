// src/pages/Register.js
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import "./../components/Register.css";

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate     = useNavigate();

  const [name,            setName]            = useState("");
  const [email,           setEmail]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error,           setError]           = useState("");
  const [loading,         setLoading]         = useState(false);
  const [success,         setSuccess]         = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      await register(name, email, password);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError("Registration failed. Try again with different credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <Link to="/" className="register-logo">
          Epoch <em>of Books</em>
        </Link>

        {success ? (
          <div className="register-success">
            <FaCheckCircle className="register-success-icon" />
            <h3 className="register-success-title">Account created!</h3>
            <p className="register-success-msg">
              Welcome, <strong>{name}</strong>! Your account is ready. Redirecting you to sign in…
            </p>
          </div>
        ) : (
          <>
            <div className="register-eyebrow"><span className="register-eyebrow-line" /> Join us today</div>
            <h2 className="register-heading">Create your account</h2>
            <p className="register-sub">Free forever. Start your reading journey today.</p>

            <form onSubmit={handleSubmit} className="register-form">
              {error && <p className="register-error">{error}</p>}

              <div className="register-field">
                <label className="register-label">Full name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  autoComplete="name"
                />
              </div>

              <div className="register-field">
                <label className="register-label">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="register-row">
                <div className="register-field">
                  <label className="register-label">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                  />
                </div>
                <div className="register-field">
                  <label className="register-label">Confirm password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>

            <p className="register-footer">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </>
        )}

      </div>
    </div>
  );
};

export default Register;