"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

import "@/styles/luxury-inspection.css";

import { supabaseBrowser } from "@/lib/supabase-browser";
const supabase = supabaseBrowser();

export default function EditIssuePage() {
  const router = useRouter();
  const { houseId, id } = useParams(); // id = issueId

  // STATES DEL ISSUE
  const [issue, setIssue] = useState(null);
  const [description, setDescription] = useState("");
  const [mediaUrls, setMediaUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // ————————————————
  // CARGAR ISSUE
  // ————————————————
  useEffect(() => {
    async function loadIssue() {
      const { data, error } = await supabase
        .from("issues_v3")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError("Error cargando el issue");
        return;
      }

      setIssue(data);
      setDescription(data.description || "");
      setMediaUrls(data.media_urls || []);
      setLoading(false);
    }

    loadIssue();
  }, [id]);

  // ————————————————
  // SUBIR FOTO (hasta 3)
  // ————————————————
  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (mediaUrls.length >= 3) {
      setError("Máximo 3 fotos");
      return;
    }

    setUploading(true);

    const filePath = `issues/${id}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("issue-media")
      .upload(filePath, file);

    if (uploadError) {
      setError("Error subiendo foto");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("issue-media")
      .getPublicUrl(filePath);

    setMediaUrls(prev => [...prev, urlData.publicUrl]);

    setUploading(false);
  }

  // ————————————————
  // ELIMINAR FOTO
  // ————————————————
  function removePhoto(url) {
    setMediaUrls(prev => prev.filter(u => u !== url));
  }

  // ————————————————
  // GUARDAR CAMBIOS
  // ————————————————
  async function saveIssue() {
    setSaving(true);
    setError("");

    const { error } = await supabase
      .from("issues_v3")
      .update({
        description,
        media_urls: mediaUrls
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      setError("Error guardando cambios");
      return;
    }

    router.push(`/inspection/${houseId}/finish`);
  }

  // ————————————————
  // ELIMINAR ISSUE COMPLETO
  // ————————————————
  async function deleteIssue() {
    const confirmDelete = confirm("¿Seguro que deseas eliminar este issue?");
    if (!confirmDelete) return;

    setDeleting(true);

    const { error } = await supabase
      .from("issues_v3")
      .delete()
      .eq("id", id);

    setDeleting(false);

    if (error) {
      setError("Error eliminando issue");
      return;
    }

    router.push(`/inspection/${houseId}/finish`);
  }

  if (loading) {
    return (
      <div className="luxury-wrapper">
        <div className="luxury-loader">Cargando issue...</div>
      </div>
    );
  }

  return (
    <div className="luxury-wrapper">
      <div className="luxury-box">

        <h1 className="luxury-title">Editar Issue</h1>

        {error && <p className="luxury-error">{error}</p>}

        {/* DESCRIPCIÓN */}
        <label className="luxury-label">Descripción</label>
        <textarea
          className="luxury-textarea"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Describe el problema encontrado..."
        />

        {/* FOTOS */}
        <label className="luxury-label">Fotos (máx 3)</label>

        <div className="luxury-photos">
          {mediaUrls.map(url => (
            <div key={url} className="luxury-photo-box">
              <Image src={url} width={160} height={160} alt="issue" className="luxury-photo" />
              <button className="luxury-photo-remove" onClick={() => removePhoto(url)}>
                ✕
              </button>
            </div>
          ))}

          {mediaUrls.length < 3 && (
            <label className="luxury-photo-upload">
              + Añadir foto
              <input type="file" accept="image/*" onChange={handleUpload} />
            </label>
          )}
        </div>

        {/* BOTONES */}
        <div className="luxury-actions">

          <button
            className="luxury-btn"
            onClick={saveIssue}
            disabled={saving || uploading}
          >
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>

          <button
            className="luxury-btn-secondary"
            onClick={() => router.push(`/inspection/${houseId}/finish`)}
          >
            Volver a Finalizar
          </button>

          <button
            className="luxury-btn-danger"
            onClick={deleteIssue}
            disabled={deleting}
          >
            {deleting ? "Eliminando..." : "Eliminar Issue"}
          </button>

        </div>

      </div>
    </div>
  );
}