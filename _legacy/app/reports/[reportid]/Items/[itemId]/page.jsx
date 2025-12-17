"use client";

import { useEffect, useState } from "react";
import supabase from "@lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ReportItemPage({ params }) {
  const { reportId, itemId } = params;
  const router = useRouter();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from("report_items")
          .select("*")
          .eq("id", itemId)
          .single();

        if (error) throw error;
        setItem(data);
      } catch (err) {
        console.error("❌ Error loading item:", err);
        setError("Unable to load this item.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [itemId]);

  if (loading) return <p style={{ padding: 20 }}>Loading…</p>;
  if (error)
    return (
      <p style={{ padding: 20, color: "#d33", fontWeight: 500 }}>{error}</p>
    );
  if (!item)
    return (
      <p style={{ padding: 20, color: "#d33", fontWeight: 500 }}>
        Item not found.
      </p>
    );

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 8 }}>{item.name}</h2>

      <p
        style={{
          marginBottom: 20,
          color: "#777",
          fontSize: 14,
        }}
      >
        Item ID: {itemId}
      </p>

      <button
        onClick={() => router.push(`/reports/${reportId}/items/${itemId}/edit`)}
        style={{
          padding: "12px 20px",
          borderRadius: 8,
          border: "none",
          background: "#C8A36D", // Marriott Gold
          color: "white",
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        Edit Item
      </button>
    </div>
  );
}
