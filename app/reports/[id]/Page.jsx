"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ReportDetail({ params }) {
  const router = useRouter();
  const { id } = params;

  const [report, setReport] = useState(null);

  useEffect(() => {
    async function fetchReport() {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("❌ Error cargando el reporte");
        return;
      }

      setReport(data);
    }
    fetchReport();
  }, [id]);

  if (!report) return <p>Cargando...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{report.title}</h1>
      <p>{report.description}</p>

      <button onClick={() => router.push(`/reports/${id}/edit`)}>
        Editar Reporte
      </button>
    </div>
  );
}
