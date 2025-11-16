"use client";
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ReportsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        router.push("/login");
        return;
      }
      setUser(session.session.user);
    }
    loadUser();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Inspection Reports</h1>
      <p>Welcome to the Inspection System</p>

      <button
        onClick={() => router.push("/reports/new")}
        style={{
          marginTop: 20,
          padding: "12px 20px",
          fontSize: 16,
          borderRadius: 8,
          backgroundColor: "black",
          color: "white",
        }}
      >
        Create New Report
      </button>
    </div>
  );
}
