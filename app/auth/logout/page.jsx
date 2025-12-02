"use client";

import { supabase } from "@/lib/supabase-client.js";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function doLogout() {
      await supabase.auth.signOut();
      router.push("/auth/login");
    }
    doLogout();
  }, []);

  return <p style={{ padding: 20 }}>Logging out...</p>;
}
