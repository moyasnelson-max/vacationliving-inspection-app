"use client";

import { useState } from "react";
import supabase from "../../lib/supabase-client";
import "../styles/marriott-login.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Invalid login credentials");
    } else {
      window.location.href = "/reports";
    }

    setLoading(false);
  };

  return (
    <div className="lux-container">
      <div className="lux-overlay"></div>

      <div className="lux-card">
        <img
          src="/logo.png"
          alt="Vacation Living"
          className="lux-logo"
        />

        <h2 className="lux-title">Welcome Back</h2>
        <p className="lux-subtitle">Sign in to continue</p>

        <form onSubmit={handleLogin} className="lux-form">
          <input
            className="lux-input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <input
            className="lux-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {error && <p className="lux-error">{error}</p>}

          <button className="lux-button" disabled={loading}>
            {loading ? "Processing..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
