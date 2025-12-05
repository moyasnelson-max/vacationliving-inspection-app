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

  // Intentos y bloqueo anti-bruteforce
  const [attempts, setAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState(null);

  // Loader luxury inicial
  useEffect(() => {
    const t = setTimeout(() => setScreenLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  // Limpieza automática de errores
  useEffect(() => {
    if (errorMsg) {
      const t = setTimeout(() => setErrorMsg(""), 3500);
      return () => clearTimeout(t);
    }
  }, [errorMsg]);

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    // Bloqueo por demasiados intentos
    if (lockUntil && lockUntil > Date.now()) {
      const seconds = Math.ceil((lockUntil - Date.now()) / 1000);
      setErrorMsg(`Demasiados intentos. Intenta nuevamente en ${seconds}s.`);
      setLoading(false);
      return;
    }

    // Validaciones premium (Marriott-level)
    if (!email || !pass) {
      setErrorMsg("Por favor completa todos los campos.");
      setLoading(false);
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setErrorMsg("Ingresa un email válido.");
      setLoading(false);
      return;
    }

    // Limpieza silenciosa
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Login real
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPass,
    });

    // Error de credenciales
    if (error) {
      setAttempts((prev) => prev + 1);

      // Activa bloqueo de 15s después de 5 intentos
      if (attempts >= 4) {
        setLockUntil(Date.now() + 15000);
        setAttempts(0);
        setErrorMsg("Demasiados intentos. Intenta nuevamente en 15s.");
      } else {
        setErrorMsg("Credenciales incorrectas.");
      }

      setLoading(false);
      return;
    }

    // Éxito → redirección al dashboard de casas
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

            <span
              className="show-pass"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "Ocultar" : "Mostrar"}
            </span>
          </div>

          {/* ERROR */}
          {errorMsg && <p className="login-error">{errorMsg}</p>}

          {/* BOTÓN LOGIN */}
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>

          {/* RESET PASSWORD */}
          <div className="login-links">
            <a href="/auth/reset">¿Olvidaste tu contraseña?</a>
          </div>

          {/* SOCIAL LOGINS (placeholder premium) */}
          <button type="button" className="social-btn apple-btn">
             Sign in with Apple
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