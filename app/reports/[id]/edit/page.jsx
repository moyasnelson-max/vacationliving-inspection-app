"use client";

import { useEffect, useState } from "react";
import supabase from "../../../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function EditReportPage({ params }) {
  const router = useRouter();
  const { id } = params;

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("open");

  async function loadReport() {
    const { data } = await supabase
      .from("reports")
      .select("*")
      .eq("id", id)
      .single();

    setReport(data);
    setNotes(data.notes || "");
    setStatus(data.status);
    setLoading(false);
  }

  useEffect(() => {
    loadReport();
  }, []);

  async function save() {
    setSaving(true);

    const { error } = await supabase
      .from("reports")
      .update({ notes, status })
      .eq("id", id);

    setSaving(false);

    if (!error) router.push(`/reports/${id}`);
  }

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div
      style={{
        padding: 24,
        fontFamily: "Inter",
      }}
    >
      <h1
        style={{
          fontSize: 28,
          fontWeight: 600,
          marginBottom: 14,
        }}
      >
        Edit Report
      </h1>

      <div
        style={{
          background: "rgba(255,255,255,0.50)",
          backdropFilter: "blur(18px)",
          padding: 22,
          borderRadius: 16,
          border: "1px solid #E8E2D6",
        }}
      >
        <label>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 12,
            border: "1px solid #D8D5CC",
            background: "#FAF9F7",
            marginBottom: 14,
          }}
        >
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>

        <label>Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={5}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 12,
            border: "1px solid #D8D5CC",
            background: "#FAF9F7",
          }}
        />

        <button
          onClick={save}
          disabled={saving}
          style={{
            width: "100%",
            padding: 14,
            marginTop: 22,
            borderRadius: 12,
            background: "linear-gradient(135deg,#C8A36D,#B48A54)",
            color: "#fff",
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
