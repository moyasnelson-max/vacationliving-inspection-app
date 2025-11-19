"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import CreateItemModal from "@/Components/CreateItemModal";
import "/app/styles/glass.css";

export default function ReportView() {
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const [report, setReport] = useState(null);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  // LOAD DATA
  const load = async () => {
    const { data: reportData } = await supabase
      .from("reports")
      .select("*")
      .eq("id", id)
      .single();

    const { data: itemData } = await supabase
      .from("report_items")
      .select(`
        *,
        categories(name),
        subcategories(name)
      `)
      .eq("report_id", id)
      .order("created_at", { ascending: false });

    setReport(reportData);
    setItems(itemData || []);
  };

  useEffect(() => {
    load();
  }, []);

  // DELETE REPORT
  const deleteReport = async () => {
    const ok = confirm("Are you sure you want to DELETE this report?");
    if (!ok) return;

    // delete items first
    await supabase.from("report_items").delete().eq("report_id", id);
    // delete report
    await supabase.from("reports").delete().eq("id", id);

    router.push("/reports");
  };

  if (!report) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  return (
    <div style={{ padding: 24, fontFamily: "Inter, sans-serif" }}>
      
      <h1 className="glass-title">Inspection Report</h1>

      {/* DELETE BUTTON */}
      <button
        className="btn-delete"
        onClick={deleteReport}
      >
        Delete Report
      </button>

      {/* ADD ITEM BUTTON */}
      <button
        className="btn-gold"
        onClick={() => setOpen(true)}
        style={{ marginTop: 18 }}
      >
        + Add Item
      </button>

      {/* ALL ITEMS */}
      {items.map((item) => (
        <div key={item.id} className="glass-card">
          <h3 style={{ marginBottom: 6 }}>
            {item.categories?.name} → {item.subcategories?.name}
          </h3>

          <p style={{ marginBottom: 6 }}>
            <strong>Status:</strong> {item.severity}
          </p>

          <p>{item.notes}</p>

          {item.image_url && (
            <img src={item.image_url} className="glass-img" alt="photo" />
          )}

          {/* EDIT BUTTON */}
          <button
            className="btn-outline-gold"
            onClick={() =>
              router.push(`/reports/${id}/items/${item.id}/edit`)
            }
          >
            Edit Item
          </button>
        </div>
      ))}

      {/* MODAL */}
      <CreateItemModal
        open={open}
        onClose={() => {
          setOpen(false);
          load();
        }}
        reportId={id}
      />
    </div>
  );
}
