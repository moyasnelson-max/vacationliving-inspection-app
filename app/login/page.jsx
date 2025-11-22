"use client";

import { useState } from "react";
import supabase from "../../lib/supabase-client";
import "../styles/glass.css";

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
    <div className="login-container">

      <div className="login-overlay" />

      <div className="login-card">

        <img src="/logo.png" alt="Vacation Living" className="login-logo" />

        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Sign in to continue</p>

        <form onSubmit={handleLogin} className="login-form">

          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="login-error">{error}</p>}

          <button className="login-btn" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
}
