"use client";

import { useEffect, useState } from "react";
import supabase from "@lib/supabase-browser.js";
import { useRouter } from "next/navigation";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("reports").select("*");
      setReports(data || []);
    }
    load();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Reports</h2>

      <div style={{ display: "grid", gap: 12 }}>
        {reports.map((r) => (
          <div
            key={r.id}
            onClick={() => router.push(`/reports/${r.id}`)}
            style={{
              padding: 14,
              border: "1px solid #ddd",
              borderRadius: 6,
              cursor: "pointer",
              background: "#fff",
            }}
          >
            Report #{r.id}
          </div>
        ))}
      </div>
    </div>
  );
}
