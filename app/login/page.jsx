"use client";

import { useState } from "react";
import supabase from "../lib/supabase-client";
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
    <div className="glass-card">
      <h2 className="glass-card-title">Login</h2>

      <form onSubmit={handleLogin}>
        <input
          className="glass-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="glass-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="glass-error">{error}</p>}

        <button className="glass-button" type="submit" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}
