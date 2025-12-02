"use client";

import { supabaseBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const executeLogout = async () => {
      const supabase = supabaseBrowser();
      await supabase.auth.signOut();
      router.push("/auth/login");
    };

    executeLogout();
  }, [router]);

  return (
    <div style={{
      padding: "40px",
      textAlign: "center",
      fontSize: "18px",
      color: "#555",
    }}>
      Cerrando sesión…
    </div>
  );
}
