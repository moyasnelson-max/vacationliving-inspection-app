"use client";
"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase-browser.js";
import { useRouter } from "next/navigation";

export default function InspectionCategories({ params }) {
  const { houseId } = params;
  const router = useRouter();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("categories").select("*");
      setCategories(data || []);
    }
    load();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h3>Categories</h3>

      <div style={{ display: "grid", gap: 12 }}>
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() =>
              router.push(
                `/inspection/${houseId}/categories/${cat.id}`
              )
            }
            style={{
              padding: 14,
              borderRadius: 10,
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            {cat.name}
          </div>
        ))}
      </div>
    </div>
  );
}
