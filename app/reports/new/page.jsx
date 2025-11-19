"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function NewReportPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  async function createReport() {
    const { data, error } = await supabase
      .from("reports")
      .insert({
        title: form.title,
        description: form.description,
        created_at: new Date(),
      })
      .select()
      .single();

    if (error) {
      alert("❌ Error creando reporte");
      return;
    }

    router.push(`/reports/${data.id}`);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Crear Reporte</h1>

      <input
        placeholder="Título"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        placeholder="Descripción"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <button onClick={createReport}>Guardar</button>
    </div>
  );
}
