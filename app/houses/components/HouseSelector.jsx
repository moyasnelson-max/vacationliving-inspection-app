"use client";
"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser.js";
import { useRouter } from "next/navigation";

export default function HouseSelector() {
  const [houses, setHouses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("houses").select("*");
      setHouses(data || []);
    }
    load();
  }, []);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {houses.map((h) => (
        <div
          key={h.id}
          onClick={() => router.push(`/inspection/${h.id}`)}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 14,
            cursor: "pointer",
            background: "#fff",
          }}
        >
          <strong>{h.name}</strong>
          <p style={{ margin: 0, color: "#666" }}>{h.address}</p>
        </div>
      ))}
    </div>
  );
}
