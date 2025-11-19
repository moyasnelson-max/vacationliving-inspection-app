"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      // 🔥 BASE URL FIJA PARA PRODUCCIÓN Y DESARROLLO
      const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        (typeof window !== "undefined" && window.location.origin);

      if (!baseUrl) {
        console.error("❌ ERROR: baseUrl is undefined");
        return;
      }

      // 🔥 Fetch seguro (nunca undefined/api/reports)
      const res = await fetch(`${baseUrl}/api/reports`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch report list");
      }

      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div style={{ padding: "25px" }}>
      <h1 style={{ marginBottom: "20px" }}>Inspection Reports</h1>

      <Link href="/reports/new">
        <button
          style={{
            marginBottom: "20px",
            padding: "12px 20px",
            borderRadius: "10px",
            background: "#000",
            color: "#fff",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          + New Report
        </button>
      </Link>

      {loading ? (
        <p>Loading...</p>
      ) : reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {reports.map((r) => (
            <li
              key={r.id}
              style={{
                padding: "14px 18px",
                marginBottom: "12px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <Link href={`/reports/${r.id}`}>
                <strong>Report #{r.id}</strong>
              </Link>
              <p>Status: {r.status}</p>
              <p>Created: {new Date(r.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
