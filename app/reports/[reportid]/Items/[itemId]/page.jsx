"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase-client.js";
import { useRouter } from "next/navigation";

export default function ReportItemPage({ params }) {
  const { reportId, itemId } = params;
  const router = useRouter();
  const [item, setItem] = useState(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("report_items")
        .select("*")
        .eq("id", itemId)
        .single();

      setItem(data || null);
    }
    load();
  }, [itemId]);

  if (!item) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{item.name}</h2>

      <button
        onClick={() =>
          router.push(`/reports/${reportId}/Items/${itemId}/edit`)
        }
        style={{
          marginTop: 20,
          padding: 12,
          background: "#C8A36D",
          color: "#fff",
          borderRadius: 6,
        }}
      >
        Edit
      </button>
    </div>
  );
}
