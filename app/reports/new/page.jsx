"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../lib/supabase-client";
import "../../styles/glass.css";

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
    } else {
      router.push(`/reports/${data.id}`);
    }

    setLoading(false);
  };

  return (
    <div className="glass-card">
      <h2 className="glass-card-title">Create New Report</h2>

      {error && <p className="glass-error">{error}</p>}

      <button className="glass-button" onClick={createReport} disabled={loading}>
        {loading ? "Creating..." : "Create Report"}
      </button>
    </div>
  );
}
