"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase-client.js";

export default function HistoryPage({ params }) {
  const { houseId } = params;
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("reports")
        .select("*")
        .eq("house_id", houseId);

      setHistory(data || []);
    }
    load();
  }, [houseId]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Inspection History</h2>

      <div style={{ display: "grid", gap: 12 }}>
        {history.map((r) => (
          <div
            key={r.id}
            style={{
              padding: 14,
              border: "1px solid #ddd",
              borderRadius: 6,
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
