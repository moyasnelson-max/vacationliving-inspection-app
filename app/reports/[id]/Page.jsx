"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import supabase from "../../../lib/supabaseClient";

import GlassPage from "../../components/GlassPage";
import GlassHeader from "../../components/GlassHeader";
import GlassCard from "../../components/GlassCard";

export default function ReportView() {
  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const [report, setReport] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  // --------------------------------------------------------------
  // LOAD REPORT + ITEMS
  // --------------------------------------------------------------
  const load = async () => {
    setLoading(true);

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
      .order("id", { ascending: false });

    setReport(reportData);
    setItems(itemData || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // --------------------------------------------------------------
  // UI — GLASS PREMIUM VIEW
  // --------------------------------------------------------------

  return (
    <GlassPage>
      <GlassHeader title="Inspection Report" back />

      {/* LOADING */}
      {loading && (
        <p style={{ padding: 20, opacity: 0.7 }}>Loading...</p>
      )}

      {/* MAIN REPORT INFO */}
      {!loading && (
        <GlassCard style={{ marginBottom: 20 }}>
          <h2
            style={{
              fontSize: 22,
              margin: 0,
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            Report #{id}
          </h2>

          <p style={{ margin: 0, color: "#6A6A6A" }}>
            Status:{" "}
            <strong style={{ color: "#C8A36D" }}>
              {report?.status || "open"}
            </strong>
          </p>

          {report?.notes && (
            <p
              style={{
                marginTop: 14,
                color: "#333",
                lineHeight: "1.45",
              }}
            >
              {report.notes}
            </p>
          )}

          {report?.image_url && (
            <img
              src={report.image_url}
              alt="report"
              style={{
                marginTop: 14,
                width: "100%",
                borderRadius: 12,
                objectFit: "cover",
              }}
            />
          )}
        </GlassCard>
      )}

      {/* ITEMS */}
      {items.map((item) => (
        <GlassCard key={item.id} style={{ marginBottom: 14 }}>
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            {item.categories?.name} → {item.subcategories?.name}
          </h3>

          <p style={{ marginTop: 4, marginBottom: 6 }}>
            Severity:{" "}
            <strong
              style={{
                color:
                  item.severity === "critical"
                    ? "#B00020"
                    : "#C8A36D",
              }}
            >
              {item.severity}
            </strong>
          </p>

          {item.notes && (
            <p
              style={{
                marginTop: 6,
                color: "#444",
                lineHeight: "1.45",
              }}
            >
              {item.notes}
            </p>
          )}

          {item.image_url && (
            <img
              src={item.image_url}
              alt="item"
              style={{
                marginTop: 10,
                width: "100%",
                borderRadius: 12,
                objectFit: "cover",
              }}
            />
          )}
        </GlassCard>
      ))}

      {/* FLOATING BUTTON */}
      <button
        onClick={() => setOpenModal(true)}
        style={floatingButton}
      >
        +
      </button>

      {/* MODAL */}
      {/* ESTE MODAL LO TERMINAMOS EN EL PASO SIGUIENTE */}
    </GlassPage>
  );
}

// --------------------------------------------------------------
// FLOATING BUTTON STYLE
// --------------------------------------------------------------
const floatingButton = {
  position: "fixed",
  bottom: 24,
  right: 24,
  width: 60,
  height: 60,
  borderRadius: "50%",
  background: "linear-gradient(135deg,#C8A36D,#b48a54)",
  color: "#fff",
  fontSize: 34,
  border: "none",
  boxShadow: "0 8px 20px rgba(0,0,0,0.20)",
  cursor: "pointer",
};
