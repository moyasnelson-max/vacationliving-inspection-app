"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabaseBrowser } from "@lib/supabase-browser";
import "@styles/login.css";

import GoldenParticles from "@components/GoldenParticles.jsx";
import HotelLoader from "@components/HotelLoader.jsx";

export default function LoginPage() {
  const router = useRouter();
  const supabase = supabaseBrowser();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [screenLoading, setScreenLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setScreenLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) {
      setErrorMsg("Credenciales incorrectas");
      setLoading(false);
      return;
    }

        router.push("/houses");
  }

  return (
    <div className="login-page">
      {screenLoading && <HotelLoader />}

      <GoldenParticles />

      <div className="vapor-layer"></div>

      <div className="login-background" />

      <div className="login-container fade-in">

        {/* LOGO */}
        <div className="logo-wrapper">
          <Image
            src="/logo.png"
            alt="Vacation Living Logo"
            width={340}
            height={140}
            className="login-logo"
            priority
          />
        </div>

        {/* CARD */}
        <form className="login-card" onSubmit={handleLogin}>
          <h2 className="login-title">Iniciar sesión</h2>

          {/* EMAIL */}
          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* PASSWORD */}
          <div className="password-wrapper">
            <input
              className="login-input"
              type={showPass ? "text" : "password"}
              placeholder="Contraseña"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />
            <span className="show-pass" onClick={() => setShowPass(!showPass)}>
              {showPass ? "Ocultar" : "Mostrar"}
            </span>
          </div>

          {/* ERROR */}
          {errorMsg && <p className="login-error">{errorMsg}</p>}

          {/* BOTÓN */}
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>

          {/* RESET PASSWORD */}
          <div className="login-links">
            <a href="/auth/reset">¿Olvidaste tu contraseña?</a>
          </div>

          {/* SOCIALS */}
          <button type="button" className="social-btn apple-btn">
              Sign in with Apple
          </button>

          <button type="button" className="social-btn google-btn">
            <Image src="/icon.png" alt="icon" width={20} height={20} />
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
}