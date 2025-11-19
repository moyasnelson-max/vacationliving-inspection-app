"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../lib/supabaseClient";

const glass = {
  page: {
    minHeight: "100vh",
    padding: "28px",
    background: "linear-gradient(145deg, #F7F3EC, #EFE8DD)",
    fontFamily: "Inter, sans-serif",
  },
  header: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "10px",
    fontFamily: "Playfair Display, serif",
    color: "#2A2A2A",
  },
  subtitle: {
    fontSize: "15px",
    color: "#5F5F5F",
    marginBottom: "28px",
  },
  card: {
    background: "rgba(255,255,255,0.55)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    border: "1px solid rgba(255,255,255,0.4)",
    borderRadius: "18px",
    padding: "20px",
    marginBottom: "16px",
    boxShadow: "0 10px 28px rgba(0,0,0,0.06)",
    cursor: "pointer",
    transition: "0.2s",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: 600,
    marginBottom: "4px",
  },
  cardText: {
    fontSize: "14px",
    color: "#555",
  },
  floatBtn: {
    position: "fixed",
    bottom: "22px",
    right: "22px",
    width: "60px",
    height: "60px",
    background: "rgba(255,255,255,0.55)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: "600",
    color: "#C8A36D",
    boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
    cursor: "pointer",
    zIndex: 999,
    transition: "0.2s",
  },
};

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    const { data } = await supabase
      .from("reports")
      .select("*")
      .order("id", { ascending: false });

    setReports(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div style={glass.page}>
      <h1 style={glass.header}>Inspection Reports</h1>
      <p style={glass.subtitle}>Your latest inspections appear below.</p>

      {/* LISTA */}
      {loading && <p>Loading...</p>}

      {!loading && reports.length === 0 && (
        <p style={{ color: "#777" }}>No reports yet. Create your first one.</p>
      )}

      {reports.map((rep) => (
        <div
          key={rep.id}
          style={glass.card}
          onClick={() => router.push(`/reports/${rep.id}`)}
        >
          <div style={glass.cardTitle}>Report #{rep.id}</div>
          <div style={glass.cardText}>
            Status: <strong>{rep.status}</strong>
          </div>
          {rep.category && (
            <div style={glass.cardText}>Category: {rep.category}</div>
          )}
        </div>
      ))}

      {/* BOTÓN FLOTANTE ADD */}
      <div
        style={glass.floatBtn}
        onClick={() => router.push("/reports/new")}
      >
        +
      </div>
    </div>
  );
}
