"use client";
import { useState } from "react";
import { supabase } from "@/app/lib/supabase-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass
    });

    if (error) alert(error.message);
    setLoading(false);
  }

  return (
    <>
      <div className="login-bg"></div>
      <div className="login-overlay"></div>

      <div className="center-wrapper">
        <form onSubmit={handleLogin} className="login-card">
          
          <img src="/logo.png" className="login-logo" />
          <h1 className="login-title">Vacation Living</h1>
          <p className="login-subtitle">Inspector Access</p>

          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              onChange={(e) => setPass(e.target.value)}
              required
            />
            <span onClick={() => setShow(!show)} className="toggle-pass">
              {show ? "Hide" : "Show"}
            </span>
          </div>

          <button className="login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <a href="#" className="forgot-link">Forgot Password?</a>
        </form>
      </div>
    </>
  );
}
