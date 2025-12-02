"use client";

import { useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase-client";

export default function LogoutPage() {
  useEffect(() => {
    const supabase = supabaseBrowser();

    const runLogout = async () => {
      try {
        await supabase.auth.signOut();
        window.location.href = "/auth/login";
      } catch (err) {
        console.error("Logout error:", err);
      }
    };

    runLogout();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>Logging out...</h2>
    </div>
  );
}