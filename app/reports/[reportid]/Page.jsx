"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import supabase from "../../lib/supabaseClient";
import "../../glass.css";

export default function ReportView() {
  const router = useRouter();
  const pathname = usePathname();
  const reportId = pathname.split("/").pop();

  const [report, setReport] = useState(null);
  const [items, setItems] = useState([]);

  const load = async () => {
    const { data: rep } = await supabase
      .from("reports")
      .select("*")
      .eq("id", reportId)
      .single();

    const { data: its } = await supabase
      .from("report_items")
      .select("*")
      .eq("report_id", reportId);

    setReport(rep);
    setItems(its || []);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="glass-page">
      <h1 className="glass-title">Report #{reportId}</h1>

      <button
        className="glass-button"
        onClick={() => router.push(`/reports/${reportId}/items/add`)}
      >
        + Add Item
      </button>

      {items.map((item) => (
        <div key={item.id} className="glass-card">
          <h3>{item.category} → {item.subcategory}</h3>
          <p>{item.notes}</p>

          {item.image_url && (
            <img src={item.image_url} className="glass-img" />
          )}

          <button
            className="glass-small-button"
            onClick={() =>
              router.push(`/reports/${reportId}/items/${item.id}/edit`)
            }
          >
            Edit
          </button>
        </div>
      ))}
    </div>
  );
}
