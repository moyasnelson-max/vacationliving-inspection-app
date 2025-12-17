"use client";

// -----------------------------------------------------------------------------
// page.jsx — Home Page (Marriott Level)
// -----------------------------------------------------------------------------
// Página inicial limpia, moderna y funcional para el sistema de inspecciones.
// Incluye:
//   ✓ Diseño minimalista premium
//   ✓ Link claro al login de inspectores
//   ✓ Tipografía elegante
//   ✓ Total compatibilidad con tu arquitectura Next.js App Router
// -----------------------------------------------------------------------------

import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        background: "#f7f7f7",
        padding: "40px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "32px", fontWeight: "600", color: "#222" }}>
        Vacation Living — Inspection System
      </h1>

      <p style={{ fontSize: "17px", color: "#555", maxWidth: "400px" }}>
        Plataforma interna para gestión de inspecciones, reportes y
        automatización.
      </p>

      <Link
        href="/auth/login"
        style={{
          padding: "12px 22px",
          background: "#111",
          color: "white",
          borderRadius: "8px",
          fontSize: "16px",
          textDecoration: "none",
          transition: "0.2s ease",
        }}
      >
        Login Inspectors
      </Link>
    </main>
  );
}
