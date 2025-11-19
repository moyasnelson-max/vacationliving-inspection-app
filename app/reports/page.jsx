"use client";

import React, { useEffect, useState } from "react";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadReports() {
      try {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

        if (!siteUrl) {
          throw new Error("❌ NEXT_PUBLIC_SITE_URL is NOT defined");
        }

        const url = `${siteUrl}api/reports`;

        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error("Error fetching reports");

        const data = await res.json();
        setReports(data);
      } catch (e) {
        setError(e.message);
      }
    }

    loadReports();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Reports</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <ul>
        {reports.map((r) => (
          <li key={r.id}>{r.id} — {r.status}</li>
        ))}
      </ul>
    </div>
  );
}
