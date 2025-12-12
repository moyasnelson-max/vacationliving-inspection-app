"use client";

import { useState } from "react";
import supabase from "@lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AddItemPage({ params }) {
  const { reportId } = params;
  const router = useRouter();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addItem = async () => {
    setError("");

    if (!name.trim()) {
      setError("Item name is required");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.from("report_items").insert({
        report_id: reportId,
        name,
      });

      if (error) throw error;

      router.back();
    } catch (err) {
      console.error("❌ Error adding item:", err);
      setError("Could not add the item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 12 }}>Add Item</h2>

      <input
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          padding: 12,
          width: "100%",
          border: "1px solid #ccc",
          borderRadius: 6,
          marginBottom: 12,
          fontSize: 15,
        }}
      />

      {error && (
        <p style={{ color: "#d33", marginBottom: 12, fontSize: 14 }}>{error}</p>
      )}

      <button
        onClick={addItem}
        disabled={loading}
        style={{
          marginTop: 10,
          padding: "12px 20px",
          borderRadius: 8,
          border: "none",
          background: "#C8A36D",
          color: "white",
          fontSize: 16,
          cursor: "pointer",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Saving…" : "Add Item"}
      </button>
    </div>
  );
}
