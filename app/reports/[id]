"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import supabase from "../../../lib/supabaseClient";

export default function ReportDetailPage() {
  const router = useRouter();
  const params = useParams();
  const reportId = params.id;

  const [report, setReport] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------- LOAD DATA ----------
  useEffect(() => {
    async function load() {
      if (!reportId) return;

      const { data: reportData } = await supabase
        .from("reports")
        .select("*")
        .eq("id", reportId)
        .single();

      const { data: itemData } = await supabase
        .from("report_items")
        .select("*")
        .eq("report_id", reportId)
        .order("created_at", { ascending: true });

      setReport(reportData);
      setItems(itemData || []);
      setLoading(false);
    }

    load();
  }, [reportId]);

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  if (!report) return <p style={{ padding: 20 }}>Report not found</p>;

  return (
    <div style={{ padding: 20, fontFamily: "Inter" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 10 }}>
        Report #{report.id}
      </h1>

      {/* MAIN REPORT INFO */}
      <div
        style={{
          background: "white",
          padding: 16,
          borderRadius: 12,
          boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
          marginBottom: 20,
        }}
      >
        <p><strong>Category:</strong> {report.category}</p>
        <p><strong>Subcategory:</strong> {report.subcategory}</p>
        <p><strong>Notes:</strong> {report.notes || "—"}</p>
        {report.image_url && (
          <img
            src={report.image_url}
            style={{
              width: "100%",
              marginTop: 12,
              borderRadius: 10,
              border: "1px solid #eee",
            }}
          />
        )}
      </div>

      {/* ITEMS LIST */}
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>
        Items
      </h2>

      {items.length === 0 && (
        <p style={{ color: "#777" }}>No items yet.</p>
      )}

      {items.map((item) => (
        <div
          key={item.id}
          style={{
            background: "white",
            padding: 14,
            borderRadius: 12,
            boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
            marginBottom: 16,
          }}
        >
          <p>
            <strong>{item.item_name}</strong>
          </p>
          <p style={{ marginTop: 4 }}>{item.item_notes}</p>

          {item.image_url && (
            <img
              src={item.image_url}
              style={{
                width: "100%",
                marginTop: 10,
                borderRadius: 10,
                border: "1px solid #eee",
              }}
            />
          )}
        </div>
      ))}

      <button
        onClick={() => router.push(`/reports/${reportId}/add-item`)}
        style={{
          width: "100%",
          padding: "12px 0",
          marginTop: 20,
          background: "#C8A36D",
          color: "white",
          border: "none",
          borderRadius: 12,
          fontSize: 16,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        + Add Item
      </button>
    </div>
  );
}
