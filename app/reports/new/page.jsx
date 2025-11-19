"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../lib/supabase-client";
import "../../../styles/glass.css";

export default function NewReport() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createReport = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("reports")
      .insert([{ status: "open" }])
      .select()
      .single();

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(`/reports/${data.id}`);
  };

  return (
    <div className="glass-page">
      <h1 className="glass-title">Create New Report</h1>

      {error && <p className="glass-error">{error}</p>}

      <button className="glass-button" onClick={createReport} disabled={loading}>
        {loading ? "Creating..." : "Create Report"}
      </button>
    </div>
  );
}
