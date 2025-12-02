"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase-client.js";
import { useRouter } from "next/navigation";

export default function EditReportItem({ params }) {
  const { reportId, itemId } = params;
  const router = useRouter();
  const [name, setName] = useState("");

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("report_items")
        .select("*")
        .eq("id", itemId)
        .single();

      if (data) setName(data.name);
    }
    load();
  }, [itemId]);

  const save = async () => {
    await supabase
      .from("report_items")
      .update({ name })
      .eq("id", itemId);

    router.back();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Edit Item</h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ padding: 10, width: "100%", marginTop: 10 }}
      />

      <button
        onClick={save}
        style={{
          marginTop: 20,
          padding: 12,
          background: "#C8A36D",
          color: "#fff",
          borderRadius: 6,
        }}
      >
        Save
      </button>
    </div>
  );
}
