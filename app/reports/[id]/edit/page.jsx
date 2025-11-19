"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function EditReportPage({ params }) {
  const router = useRouter();
  const { id } = params;

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("reports")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setForm({
          title: data.title,
          description: data.description,
        });
      }
    }
    load();
  }, [id]);

  async function saveReport() {
    const { error } = await supabase
      .from("reports")
      .update({
        title: form.title,
        description: form.description,
      })
      .eq("id", id);

    if (error) {
      alert("❌ Error actualizando");
      return;
    }

    router.push(`/reports/${id}`);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Editar Reporte</h1>

      <input
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <button onClick={saveReport}>Guardar Cambios</button>
    </div>
  );
}
