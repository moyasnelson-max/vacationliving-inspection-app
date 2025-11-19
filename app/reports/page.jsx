"use client";

import { useEffect, useState } from "react";
import supabase from "../../lib/supabaseClient";
import Link from "next/link";

export default function ReportsListPage() {
  const [reports, setReports] = useState([]);

  const loadReports = async () => {
    const { data } = await supabase
      .from("reports")
      .select("*")
      .order("id", { ascending: false });

    setReports(data || []);
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div className="glass-page">
      <h1 className="glass-title">Inspection Reports</h1>

      <Link href="/reports/new">
        <button className="glass-button-primary">+ New Report</button>
      </Link>

      <div className="glass-list">
        {reports.map((r) => (
          <Link key={r.id} href={`/reports/${r.id}`} className="glass-card">
            <div className="glass-card-header">
              <h2>Report #{r.id}</h2>
              <span className="chip">{r.status}</span>
            </div>

            <p className="glass-subtext">
              {r.category ? `${r.category} → ${r.subcategory}` : "No category yet"}
            </p>

            <p className="glass-notes-preview">
              {r.notes?.slice(0, 80) || "No notes"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
