"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import supabase from "../../lib/supabaseClient";
import CreateItemModal from "../../components/CreateItemModal";
import GlassFloatingButton from "../../components/GlassFloatingButton";

const box = {
  page: { padding: 24, fontFamily: "Inter, sans-serif" },
  title: { fontSize: "26px", fontWeight: "600", marginBottom: 20 },
  card: {
    background: "rgba(255,255,255,0.55)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    padding: 20,
    borderRadius: 14,
    marginBottom: 14,
    border: "1px solid #EEE",
  },
  img: {
    width: "100%",
    borderRadius: 12,
    marginTop: 10,
    objectFit: "cover",
  },
  button: {
    padding: "12px 18px",
    borderRadius: 12,
    background: "linear-gradient(135deg,#C8A36D,#AD8A56)",
    color: "#fff",
    border: "none",
    marginTop: 20,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default function ReportView() {
  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const [report, setReport] = useState(null);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

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
      .eq("report_id", id);

    setReport(reportData);
    setItems(itemData || []);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={box.page}>
      <h1 style={box.title}>Inspection Report</h1>

      <button style={box.button} onClick={() => setOpen(true)}>
        + Add Item
      </button>

      {items.map((item) => (
        <div key={item.id} style={box.card}>
          <h3>
            {item.categories?.name} → {item.subcategories?.name}
          </h3>
          <p>
            Status: <strong>{item.severity}</strong>
          </p>
          <p>{item.notes}</p>

          {item.image_url && (
            <img
              src={item.image_url}
              style={box.img}
              alt="inspection"
              height="200"
            />
          )}
        </div>
      ))}

      {/* --- FLOATING GLASS BUTTON --- */}
      <GlassFloatingButton icon="🛠" onClick={() => setOpen(true)} />

      {/* --- MODAL --- */}
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
