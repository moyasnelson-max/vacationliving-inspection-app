"use client";

import { useEffect, useState } from "react";
import supabase from "@lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from("reports").select("*");

      if (error) {
        console.error("❌ Error loading reports:", error);
      }

      setReports(data || []);
    }
    load();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 20 }}>
        Reports
      </h2>

      {/* GRID MARRIOTT */}
      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        }}
      >
        {reports.map((r) => (
          <div
            key={r.id}
            onClick={() => router.push(`/reports/${r.id}`)}
            style={{
              padding: 18,
              borderRadius: 12,
              background: "var(--card)",
              border: "1px solid var(--card-border)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.06)";
            }}
          >
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
              Report #{r.id}
            </h3>

            <p style={{ marginTop: 6, fontSize: 14, opacity: 0.75 }}>
              {r.created_at
                ? new Date(r.created_at).toLocaleString()
                : "No date"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
