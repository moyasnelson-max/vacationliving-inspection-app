"use client";

import { useState, useEffect } from "react";
import supabase from "@/lib/supabase-client"
import { useRouter } from "next/navigation";
import "../../../../styles/inspection-close.css";

export default function CloseIssuePage({ params }) {
  const { houseId, issueId } = params;
  const router = useRouter();

  const [issue, setIssue] = useState(null);
  const [subcategory, setSubcategory] = useState(null);
  const [note, setNote] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 1 — Cargar Issue original
  const fetchIssue = async () => {
    const { data: issueData } = await supabase
      .from("issues_v2")
      .select("id, note, subcategory_id, status")
      .eq("id", issueId)
      .single();

    if (!issueData) return;

    setIssue(issueData);

    // cargar subcategoría
    const { data: subcat } = await supabase
      .from("subcategories")
      .select("*")
      .eq("id", issueData.subcategory_id)
      .single();

    setSubcategory(subcat);
    setLoading(false);
  };

  useEffect(() => {
    fetchIssue();
  }, []);

  // 2 — Manejar fotos
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 3) {
      alert("Máximo 3 fotos.");
      return;
    }
    setPhotos([...photos, ...files]);
  };

  // 3 — Subir fotos al storage
  const uploadPhotos = async () => {
    const uploadedPaths = [];

    for (let i = 0; i < photos.length; i++) {
      const file = photos[i];

      const path = `issue-media/${houseId}/${subcategory.id}/${issueId}/fixed/${Date.now()}_${file.name}`;

      const { data, error } = await supabase.storage
        .from("issue-media")
        .upload(path, file);

      if (error) {
        console.error(error);
        throw new Error("Error subiendo fotos.");
      }

      uploadedPaths.push(path);
    }

    return uploadedPaths;
  };

  // 4 — Guardar todo y cerrar issue
  const closeIssue = async () => {
    if (!note.trim()) {
      alert("Debes escribir una nota.");
      return;
    }
    if (photos.length === 0) {
      alert("Debes subir al menos una foto.");
      return;
    }

    const confirmClose = confirm("¿Seguro que deseas cerrar este Issue?");
    if (!confirmClose) return;

    setSubmitting(true);

    try {
      const photoPaths = await uploadPhotos();

      // Guardar reparación en tabla issue_updates
      await supabase.from("issue_updates").insert({
        issue_id: issueId,
        repair_note: note,
        photo_urls: photoPaths,
        repaired_at: new Date(),
      });

      // Marcar issue como cerrado
      await supabase
        .from("issues_v2")
        .update({ status: "closed", closed_at: new Date() })
        .eq("id", issueId);

      router.push(`/inspection/${houseId}/review`);
    } catch (err) {
      console.error(err);
      alert("Error cerrando el issue.");
    }

    setSubmitting(false);
  };

  if (loading) return <p className="lux-loading">Cargando…</p>;

  return (
    <div className="lux-container">
      <h1 className="lux-title">Cerrar Issue #{issueId}</h1>

      <div className="lux-card">
        <p className="lux-label">Categoría:</p>
        <p className="lux-value">{subcategory?.name_es}</p>

        <p className="lux-label">Descripción original:</p>
        <p className="lux-note">{issue.note}</p>
      </div>

      <div className="lux-section">
        <label className="lux-label">Nota de reparación</label>
        <textarea
          className="lux-textarea"
          placeholder="Describe la reparación…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>
      </div>

      <div className="lux-section">
        <label className="lux-label">Fotos de reparación (mínimo 1 / máximo 3)</label>

        <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} />

        <div className="lux-photo-preview">
          {photos.map((file, idx) => (
            <img key={idx} src={URL.createObjectURL(file)} className="lux-photo" />
          ))}
        </div>
      </div>

      <button
        disabled={submitting}
        className="lux-button-close"
        onClick={closeIssue}
      >
        {submitting ? "Guardando…" : "Cerrar Issue"}
      </button>
    </div>
  );
}
