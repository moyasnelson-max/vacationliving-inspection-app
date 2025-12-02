"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase-browser.js";
import { useRouter } from "next/navigation";

export default function CategoryPage({ params }) {
  const { houseId, categoryId } = params;
  const router = useRouter();
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("subcategories")
        .select("*")
        .eq("category_id", categoryId);

      setSubcategories(data || []);
    }
    load();
  }, [categoryId]);

  return (
    <div style={{ padding: 20 }}>
      <h3>Subcategories</h3>

      <div style={{ display: "grid", gap: 12 }}>
        {subcategories.map((s) => (
          <div
            key={s.id}
            onClick={() =>
              router.push(
                `/inspection/${houseId}/subcategories/${s.id}`
              )
            }
            style={{
              padding: 14,
              border: "1px solid #ddd",
              background: "#fff",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            {s.name}
          </div>
        ))}
      </div>
    </div>
  );
}
