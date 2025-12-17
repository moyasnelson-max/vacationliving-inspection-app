"use client";

import { useEffect, useState } from "react";
import supabase from "@lib/supabaseClient";

export default function ReportViewPage({ params }) {
  const { reportId } = params;
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from("reports")
          .select("*")
          .eq("id", reportId)
          .single();

        if (error) throw error;
        setReport(data);
      } catch (err) {
        console.error("❌ Error loading report:", err);
        setError("Unable to load this report.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [reportId]);

  // LOADING STATE -------------------------------------------------------
  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <p style={{ fontSize: 18 }}>Loading inspection report...</p>
      </div>
    );
  }

  // ERROR STATE ---------------------------------------------------------
  if (error || !report) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Report Not Found</h2>
        <p style={{ opacity: 0.7 }}>{error || "This report does not exist."}</p>
      </div>
    );
  }

  // PREMIUM VIEW --------------------------------------------------------
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>Inspection Report #{report.id}</h1>

      <p style={{ fontSize: 15, opacity: 0.8 }}>
        Created: {new Date(report.created_at).toLocaleString()}
      </p>

      <div
        style={{
          marginTop: 20,
          background: "white",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        }}
      >
        <h3 style={{ marginBottom: 12, color: "#C8A36D" }}>
          📌 Report Details
        </h3>

        <p>
          <strong>Property:</strong> {report.property_name}
        </p>

        <p>
          <strong>Inspector:</strong> {report.inspector || "N/A"}
        </p>

        <p>
          <strong>Status:</strong> {report.status || "Pending"}
        </p>

        <p style={{ marginTop: 12 }}>
          <strong>Notes:</strong>
        </p>
        <p style={{ whiteSpace: "pre-wrap" }}>
          {report.notes || "No notes provided."}
        </p>
      </div>
    </div>
  );
}
