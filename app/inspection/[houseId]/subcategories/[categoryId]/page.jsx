"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase-client.js.js";
import { useRouter } from "next/navigation";

export default function SubcategoryPage({ params }) {
  const { houseId, subcategoryId } = params;
  const router = useRouter();
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("items")
        .select("*")
        .eq("subcategory_id", subcategoryId);

      setItems(data || []);
    }
    load();
  }, [subcategoryId]);

  return (
    <div style={{ padding: 20 }}>
      <h3>Items</h3>

      <div style={{ display: "grid", gap: 12 }}>
        {items.map((i) => (
          <div
            key={i.id}
            onClick={() =>
              router.push(
                `/inspection/${houseId}/items/${i.id}`
              )
            }
            style={{
              padding: 12,
              borderRadius: 6,
              background: "#fff",
              border: "1px solid #ddd",
              cursor: "pointer",
            }}
          >
            {i.name}
          </div>
        ))}
      </div>
    </div>
  );
}
