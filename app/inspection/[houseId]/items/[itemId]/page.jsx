"use client";
"use client";

import supabase from "@/lib/supabase-browser.js";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ItemPage({ params }) {
  const { houseId, itemId } = params;
  const router = useRouter();
  const [status, setStatus] = useState("ok");

  const save = async () => {
    await supabase.from("inspection_items").insert({
      house_id: houseId,
      item_id: itemId,
      status,
    });

    router.back();
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Item {itemId}</h3>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        style={{ padding: 10, marginTop: 10 }}
      >
        <option value="ok">OK</option>
        <option value="issue">Issue</option>
      </select>

      <button
        onClick={save}
        style={{
          marginTop: 20,
          padding: 12,
          borderRadius: 6,
          background: "#C8A36D",
          color: "#fff",
        }}
      >
        Save
      </button>
    </div>
  );
}
