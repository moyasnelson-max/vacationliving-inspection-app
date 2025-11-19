"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../lib/supabaseClient";
import "../globals.css";
import "../glass.css";

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("reports")
        .select("*")
        .order("id", { ascending: false });

      setReports(data || []);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return <p style={{ padding: 20 }}>Loading...</p>;
  }

  return (
    <div className="glass-page">
      <h1 className="glass-title">Inspection Reports</h1>

      <button
        className="glass-button"
        onClick={() => router.push("/reports/new")}
      >
        + New Report
      </button>

      {reports.map((r) => (
        <div
          key={r.id}
          className="glass-card"
          onClick={() => router.push(`/reports/${r.id}`)}
          style={{ cursor: "pointer" }}
        >
          <h3>Report #{r.id}</h3>
          <p>Status: {r.status}</p>
        </div>
      ))}
    </div>
  );
}
