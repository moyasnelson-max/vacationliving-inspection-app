"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../../lib/supabaseClient";

// --------------------------------------------------------------
//  ULTRA LUXURY GLASS STYLES (Four Seasons / Ritz-Carlton level)
// --------------------------------------------------------------
const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px 24px",
    background:
      "linear-gradient(135deg, rgba(245,240,230,0.7), rgba(255,255,255,0.4))",
    backdropFilter: "blur(14px)",
    fontFamily: "Inter, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "780px",
    margin: "0 auto",
    padding: "32px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.55)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(200,163,109,0.28)",
  },
  title: {
    fontFamily: "Playfair Display, serif",
    fontSize: "32px",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#1A1A1A",
    letterSpacing: "-0.5px",
  },
  sectionTitle: {
    marginTop: "30px",
    fontSize: "20px",
    fontWeight: "600",
    color: "#7A6A50",
    borderBottom: "1px solid #E8E2D8",
    paddingBottom: "6px",
  },
  statusTag: {
    display: "inline-block",
    padding: "6px 14px",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "14px",
    marginTop: "10px",
  },
  itemCard: {
    background: "rgba(255,255,255,0.65)",
    borderRadius: "14px",
    padding: "18px",
    border: "1px solid #EEE6D8",
    marginTop: "14px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
  },
  label: { fontWeight: "600", color: "#7A6A50", marginBottom: "4px" },
  value: { color: "#1A1A1A" },
  image: {
    width: "100%",
    marginTop: "12px",
    borderRadius: "14px",
    objectFit: "cover",
  },
  backButton: {
    width: "100%",
    marginTop: "24px",
    padding: "14px 0",
    background: "linear-gradient(135deg, #C8A36D, #b48a54)",
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default function ReportDetailPage({ params }) {
  const router = useRouter();

  const [report, setReport] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const id = params.id;

  // ------------------------------------------
  //  LOAD REPORT + ITEMS FROM SUPABASE
  // ------------------------------------------
  useEffect(() => {
    async function loadData() {
      // Load main report
      const { data: reportData } = await supabase
        .from("reports")
        .select("*")
        .eq("id", id)
        .single();

      // Load items from report_items table
      const { data: itemsData } = await supabase
        .from("report_items")
        .select(
          `*, 
           categories(name),
           subcategories(name)`
        )
        .eq("report_id", id);

      setReport(reportData);
      setItems(itemsData || []);
      setLoading(false);
    }

    loadData();
  }, [id]);

  if (loading)
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>Loading report...</h1>
        </div>
      </div>
    );

  if (!report)
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>Report not found</h1>
        </div>
      </div>
    );

  // ------------------------------------------
  // STATUS COLOR
  // ------------------------------------------
  const statusColors = {
    open: "#D4A017",
    closed: "green",
    pending: "#B75C00",
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Inspection Report</h1>

        {/* STATUS */}
        <div
          style={{
            ...styles.statusTag,
            background: `${statusColors[report.status] || "#CCC"}22`,
            color: statusColors[report.status] || "#444",
            border: `1px solid ${statusColors[report.status] || "#CCC"}`,
          }}
        >
          {report.status.toUpperCase()}
        </div>

        {/* MAIN REPORT INFO */}
        <h2 style={styles.sectionTitle}>Main Information</h2>

        <p><strong>ID:</strong> {report.id}</p>
        <p><strong>Created:</strong> {new Date(report.created_at).toLocaleString()}</p>

        {report.notes && (
          <p style={{ marginTop: "10px" }}>
            <span style={styles.label}>Notes:</span> <br />
            <span style={styles.value}>{report.notes}</span>
          </p>
        )}

        {report.image_url && (
          <img src={report.image_url} alt="report" style={styles.image} />
        )}

        {/* ITEMS */}
        <h2 style={styles.sectionTitle}>Items</h2>

        {items.length === 0 && <p>No items added to this report.</p>}

        {items.map((item) => (
          <div key={item.id} style={styles.itemCard}>
            <p>
              <span style={styles.label}>Category:</span> {item.categories?.name}
            </p>
            <p>
              <span style={styles.label}>Subcategory:</span> {item.subcategories?.name}
            </p>

            {item.notes && (
              <p>
                <span style={styles.label}>Notes:</span> {item.notes}
              </p>
            )}

            {item.image_url && (
              <img src={item.image_url} style={styles.image} alt="item" />
            )}
          </div>
        ))}

        <button style={styles.backButton} onClick={() => router.push("/reports")}>
          Back to Reports
        </button>
      </div>
    </div>
  );
}
