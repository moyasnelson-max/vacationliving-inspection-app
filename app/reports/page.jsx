"use client";

import { useEffect, useState } from "react";
import supabase from "../../lib/supabaseClient";

import GlassPage from "../components/GlassPage";
import GlassCard from "../components/GlassCard";
import GlassHeader from "../components/GlassHeader";
import FloatingButton from "../components/FloatingButton";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);

  const loadReports = async () => {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("id", { ascending: false });

    if (!error) setReports(data);
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <GlassPage>
      <GlassHeader title="Inspection Reports" />

      {reports.length === 0 && (
        <p
          style={{
            marginTop: "28px",
            fontSize: "16px",
            opacity: 0.55,
            textAlign: "center",
          }}
        >
          No reports yet.
        </p>
      )}

      {reports.map((r) => (
        <GlassCard key={r.id}>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
            Report #{r.id}
          </h3>

          <p style={{ marginTop: 6, marginBottom: 6, opacity: 0.7 }}>
            Status: <strong>{r.status}</strong>
          </p>

          <a
            href={`/reports/${r.id}`}
            style={{
              display: "inline-block",
              marginTop: "8px",
              color: "#C8A36D",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            View →
          </a>
        </GlassCard>
      ))}

      <FloatingButton onClick={() => (window.location.href = "/reports/new")} />
    </GlassPage>
  );
}
