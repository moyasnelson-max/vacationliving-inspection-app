"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import supabase from "../../../lib/supabaseClient";

export default function ReportView() {
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const [report, setReport] = useState(null);

  const load = async () => {
    const { data } = await supabase
      .from("reports")
      .select("*")
      .eq("id", id)
      .single();

    setReport(data);
  };

  useEffect(() => {
    load();
  }, []);

  if (!report)
    return <div className="glass-page">Loading...</div>;

  return (
    <>
      <div className="glass-nav">
        <button onClick={() => router.back()}>←</button>
        Report #{id}
      </div>

      <div className="glass-page">

        <div className="glass-card">
          <h3>Category: {report.category}</h3>
          <p>Subcategory: {report.subcategory}</p>
          <p>Status: <b>{report.status}</b></p>
          <p>{report.notes}</p>

          {report.image_url && (
            <img
              src={report.image_url}
              style={{
                width: "100%",
                borderRadius: 14,
                marginTop: 16
              }}
            />
          )}
        </div>

      </div>

      <div
        className="glass-fab"
        onClick={() => router.push(`/reports/new`)}
      >
        +
      </div>
    </>
  );
}
