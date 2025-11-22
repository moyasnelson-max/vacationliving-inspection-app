"use client";

import { useState } from "react";
import supabase from "../../lib/supabase-client";
import "../styles/marriott-login.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotModal, setForgotModal] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Invalid email or password");
    } else {
      window.location.href = "/reports";
    }

    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Enter your email first");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://vacationlivingvirtualtour.com/reset",
    });

    if (error) {
      setError("Error sending reset email");
    } else {
      setResetEmailSent(true);
    }
  };

  return (
    <div className="lux-container">
      <div className="lux-overlay"></div>

      <div className="lux-card">

        {/* LOGO */}
        <img src="/logo.png" alt="Vacation Living" className="lux-logo" />

        <h1 className="lux-title">Welcome Back</h1>
        <p className="lux-subtitle">Vacation Living Inspection System</p>

        {/* FORM */}
        <form className="lux-form" onSubmit={handleLogin}>
          <input
            type="email"
            className="lux-input"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              className="lux-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              className="show-pass"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {error && <p className="lux-error">{error}</p>}

          <button className="lux-button" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        {/* FORGOT PASSWORD */}
        <p
          className="lux-forgot"
          onClick={() => setForgotModal(true)}
        >
          Forgot password?
        </p>
      </div>

      {/* MODAL FORGOT PASSWORD */}
      {forgotModal && (
        <div className="lux-modal">
          <div className="lux-modal-card">
            <h2 className="lux-title">Reset Password</h2>

            <input
              type="email"
              className="lux-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {resetEmailSent && (
              <p className="lux-success">
                Reset email sent! Check your inbox.
              </p>
            )}

            {error && <p className="lux-error">{error}</p>}

            <button className="lux-button" onClick={handleForgotPassword}>
              Send Reset Email
            </button>

            <button
              className="lux-close"
              onClick={() => setForgotModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
