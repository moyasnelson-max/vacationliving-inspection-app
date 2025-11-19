"use client";

import { useEffect } from "react";
import supabase from "../lib/supabase-client";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.signOut();
    router.push("/login");
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Signing out...</h2>
    </div>
  );
}
