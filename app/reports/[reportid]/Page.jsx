"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase-browser.js";

export default function ReportViewPage({ params }) {
  const { reportId } = params;
  const [report, setReport] = useState(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("reports")
        .select("*")
        .eq("id", reportId)
        .single();

      setReport(data || null);
    }
    load();
  }, [reportId]);

  if (!report) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Report #{reportId}</h2>
      <p>Status: {report.status}</p>
    </div>
  );
}
