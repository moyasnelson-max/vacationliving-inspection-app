"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import supabase from "../../../lib/supabaseClient";

export default function ReportView() {
  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const [report, setReport] = useState(null);
  const [items, setItems] = useState([]);

  const load = async () => {
    const { data: reportData } = await supabase
      .from("reports")
      .select("*")
      .eq("id", id)
      .single();

    const { data: itemData } = await supabase
      .from("report_items")
      .select("*")
      .eq("report_id", id);

    setReport(reportData);
    setItems(itemData || []);
  };

  useEffect(() => {
    load();
  }, []);

  if (!report) return <p className="glass-loading">Loading...</p>;

  return (
    <div className="glass-page">
      <h1 className="glass-title">Report #{id}</h1>

      <div className="glass-details-card">
        <p><strong>Category:</strong> {report.category}</p>
        <p><strong>Subcategory:</strong> {report.subcategory}</p>
        <p><strong>Status:</strong> {report.status}</p>
        <p><strong>Notes:</strong> {report.notes}</p>

        {report.image_url && (
          <img src={report.image_url} className="glass-img" />
        )}
      </div>

      <h2 className="glass-subtitle">Items</h2>

      {items.map((item) => (
        <div key={item.id} className="glass-card">
          <h3>{item.category} → {item.subcategory}</h3>
          <p>Status: {item.severity}</p>
          <p>{item.notes}</p>

          {item.image_url && (
            <img src={item.image_url} className="glass-img" />
          )}
        </div>
      ))}
    </div>
  );
}
