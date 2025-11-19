"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../lib/supabaseClient";
import GlassFloatingButton from "../components/GlassFloatingButton";

export default function ReportsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        router.push("/login");
        return;
      }
      setUser(session.session.user);
    }

    loadUser();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ fontSize: 28, fontWeight: 600 }}>Inspection Reports</h1>
      <p>Welcome to the Inspection System</p>

      <button
        onClick={() => router.push("/reports/new")}
        style={{
          marginTop: 20,
          padding: "12px 18px",
          borderRadius: 12,
          border: "1px solid #C8A36D",
          background: "#fff",
          fontWeight: 600,
        }}
      >
        New Report
      </button>

      <button
        onClick={() => router.push("/logout")}
        style={{
          marginLeft: 10,
          marginTop: 20,
          padding: "12px 18px",
          borderRadius: 12,
          border: "1px solid #ddd",
          background: "#fafafa",
        }}
      >
        Logout
      </button>

      {/* --- GLASS BUTTON --- */}
      <GlassFloatingButton
        icon="+"
        onClick={() => router.push("/reports/new")}
      />
    </div>
  );
}
