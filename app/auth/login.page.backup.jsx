"use client";

import { useState } from "react";
import Image from "next/image";
import supabase from "@lib/supabaseClient";
import { useRouter } from "next/navigation";
import "@theme/theme.css";
import "@theme/login.css";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !pass) {
      setErrorMsg("Por favor completa todos los campos.");
      return;
    }
    if (!email.includes("@")) {
      setErrorMsg("Ingresa un email válido.");
      return;
    }

    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPass,
      });

      if (error || !data.session) {
        setErrorMsg("Credenciales incorrectas.");
        setLoading(false);
        return;
      }

      router.push("/houses");
    } catch (err) {
      setErrorMsg("Ocurrió un error inesperado.");
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <div className="login-wrapper">
      {/* LOGO */}
      <div className="login-logo">
        <Image
          src="/logo.png"
          alt="Vacation Living Logo"
          width={280}
          height={120}
          priority
        />
      </div>

      {/* CARD */}
      <div className="login-card">
        <h2 className="login-title">Iniciar sesión</h2>

        <form onSubmit={handleLogin} className="login-form">
          <label className="login-label">Email</label>
          <input
            type="email"
            className="login-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="login-label">Contraseña</label>
          <div className="password-block">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Contraseña"
              className="login-input"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <span className="show-pass" onClick={() => setShowPass((p) => !p)}>
              {showPass ? "Ocultar" : "Mostrar"}
            </span>
          </div>

          {errorMsg && <p className="login-error">{errorMsg}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="login-links">
            <a href="/auth/reset">¿Olvidaste tu contraseña?</a>
          </div>
        </form>
      </div>
    </div>
  );
}
