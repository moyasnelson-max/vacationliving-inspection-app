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
      if (!session.session) {
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
      >
        New Report
      </button>

      <button
        onClick={() => router.push("/logout")}
        style={{ marginLeft: 10 }}
      >
        Logout
      </button>
    </div>
  );
}
