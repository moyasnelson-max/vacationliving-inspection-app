"use client";

import { useEffect } from "react";
import supabase from "@lib/supabaseClient";
import { useRouter } from "next/navigation";
import "@theme/logout.css";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function executeLogout() {
      // Cerrar sesión Supabase
      await supabase.auth.signOut();

      // Pequeño delay elegante para animación
      setTimeout(() => {
        router.push("/auth/login");
      }, 900);
    }

    executeLogout();
  }, [router]);

  return (
    <div className="logout-wrapper">
      <div className="logout-card fade-up">
        <div className="spinner"></div>
        <p className="logout-text">Cerrando sesión…</p>
      </div>
    </div>
  );
}
