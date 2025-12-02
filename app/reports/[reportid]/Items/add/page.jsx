"use client";

import { useState } from "react";
import supabase from "@/lib/supabase-client.js.js";
import { useRouter } from "next/navigation";

export default function AddItemPage({ params }) {
  const { reportId } = params;
  const router = useRouter();
  const [name, setName] = useState("");

  const addItem = async () => {
    if (!name.trim()) return;

    await supabase.from("report_items").insert({
      report_id: reportId,
      name,
    });

    router.back();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Add Item</h2>

      <input
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ padding: 10, width: "100%", marginTop: 10 }}
      />

      <button
        onClick={addItem}
        style={{
          marginTop: 20,
          padding: 12,
          borderRadius: 6,
          background: "#C8A36D",
          color: "#fff",
        }}
      >
        Add
      </button>
    </div>
  );
}
