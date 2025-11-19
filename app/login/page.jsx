"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import supabase from "../lib/supabase-client";

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
    <div className="glass-page">
      <div className="glass-card login-card">
        <h1 className="glass-title">Vacation Living</h1>
        <p className="glass-subtitle">Inspector Login</p>

        <form onSubmit={handleLogin} className="glass-form">
          <input
            type="email"
            placeholder="Email"
            className="glass-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="glass-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="glass-error">{error}</p>}

          <button type="submit" className="glass-button" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
