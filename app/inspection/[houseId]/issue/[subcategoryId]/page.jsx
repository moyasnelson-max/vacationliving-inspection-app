"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase-client";
import "@/styles/inspection-issue.css";

export default function IssuePage({ params }) {
  const router = useRouter();
  const { houseId, subcategoryId } = params;

  const [note, setNote] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("es");

  const maxImages = 3;

  // ---------- SUBIR IMÁGENES ----------
  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (images.length + files.length > maxImages) {
      alert("Máximo 3 fotos.");
      return;
    }

    setImages((prev) => [...prev, ...files]);
  };

  // ---------- GUARDAR ISSUE ----------
  const saveIssue = async () => {
    if (!note.trim()) {
      alert("Escribe una nota antes de continuar.");
      return;
    }

    if (images.length === 0) {
      alert("Sube al menos una foto.");
      return;
    }

    setLoading(true);

    // 1. Crear el issue en la tabla
    const { data: issue, error: issueErr } = await supabase
      .from("issues_v2")
      .insert({
        house_id: houseId,
        subcategory_id: subcategoryId,
        note,
        status: "open",
        created_at: new Date(),
      })
      .select()
      .single();

    if (issueErr) {
      console.error(issueErr);
      alert("Error guardando issue.");
      setLoading(false);
      return;
    }

    // 2. Subir media (hasta 3)
    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const fileExt = file.name.split(".").pop();
      const fileName = `${issue.id}-${i + 1}.${fileExt}`;
      const filePath = `issue-media/${houseId}/${subcategoryId}/${issue.id}/${fileName}`;

      const { error: uploadErr } = await supabase.storage
        .from("media")
        .upload(filePath, file);

      if (uploadErr) console.error(uploadErr);
    }

    // 3. Redirigir al review de categoría
    router.push(`/inspection/${houseId}/review`);
  };

  return (
    <div className="lux-container">
      <h1 className="lux-title">Nuevo Issue</h1>

      {/* Nota */}
      <div className="lux-card">
        <label className="lux-label">Nota del problema</label>
        <textarea
          className="lux-textarea"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Describe el problema..."
          rows={5}
        />
      </div>

      {/* Fotos */}
      <div className="lux-card">
        <label className="lux-label">Fotos (mínimo 1, máximo 3)</label>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
        />

        <div className="lux-preview-box">
          {images.map((img, i) => (
            <div key={i} className="lux-preview">
              <img src={URL.createObjectURL(img)} alt="preview" />
            </div>
          ))}
        </div>
      </div>

      {/* Enviar */}
      <button
        className="lux-button"
        onClick={saveIssue}
        disabled={loading}
      >
        {loading ? "Guardando..." : "Guardar Issue"}
      </button>
    </div>
  );
}
