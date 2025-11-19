"use client";

import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ReportsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    async function loadSession() {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return router.push("/login");
      setUser(session.session.user);
    }

    async function loadReports() {
      const { data } = await supabase
        .from("reports")
        .select("*")
        .order("id", { ascending: false });

      if (data) setReports(data);
    }

    loadSession();
    loadReports();
  }, []);

  return (
    <>
      <div className="glass-nav">
        Inspection Reports
      </div>

      <div className="glass-page">

        {reports.map((r) => (
          <div
            key={r.id}
            className="glass-card"
            onClick={() => router.push(`/reports/${r.id}`)}
            style={{ cursor: "pointer" }}
          >
            <h3>Report #{r.id}</h3>
            <p>Status: <b>{r.status}</b></p>
            <p style={{ opacity: 0.7 }}>
              {r.notes ? r.notes.slice(0, 60) : "No notes"}...
            </p>
          </div>
        ))}

      </div>

      <div
        className="glass-fab"
        onClick={() => router.push("/reports/new")}
      >
        +
      </div>
    </>
  );
}
