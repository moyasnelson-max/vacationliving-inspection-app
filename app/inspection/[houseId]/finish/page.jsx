"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Image from "next/image";
import { supabaseBrowser } from "@lib/supabase-browser";
import "@styles/luxury-inspection.css";

export default function FinishInspectionPage() {
  const router = useRouter();
  const search = useSearchParams();
  const { houseId } = useParams();

  const supabase = supabaseBrowser();

  const tempGroup = search.get("tg"); // 🔥 Lectura correcta del grupo real

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // Cargar issues del grupo actual
  // -----------------------------
  useEffect(() => {
    async function loadIssues() {
      if (!tempGroup) {
        setLoading(false);
        return;
      }

      const {
        data: issuesData,
        error: issuesError
      } = await supabase
        .from("issues_v3")
        .select("*")
        .eq("temp_report_group", tempGroup)
        .order("created_at", { ascending: false });

      if (!issuesError) {
        setIssues(issuesData || []);
      }

      setLoading(false);
    }

    loadIssues();
  }, [tempGroup]);

  // -----------------------------
  // Navegar a agregar otro issue
  // -----------------------------
  function handleAddIssue() {
    router.push(`/inspection/${houseId}/categories?tg=${tempGroup}`);
  }

  // -----------------------------
  // Navegar al submit
  // -----------------------------
  function handleFinish() {
    router.push(`/inspection/${houseId}/submit?tg=${tempGroup}`);
  }

  // -----------------------------
  // EDITAR issue
  // -----------------------------
  function handleEdit(issueId) {
    router.push(
      `/inspection/${houseId}/items/${issueId}?tg=${tempGroup}`
    );
  }

  // -----------------------------
  // LOADING SCREEN
  // -----------------------------
  if (loading) {
    return (
      <div className="luxury-loading">
        <p>Cargando reporte...</p>
      </div>
    );
  }

  return (
    <div className="luxury-finish-container fade-in">

      <div className="luxury-finish-box">

        <h1 className="luxury-title">Resumen de la Inspección</h1>
        <p className="luxury-subtitle">
          Verifica los issues antes de enviar el reporte final.
        </p>

        {/* LISTA DE ISSUES */}
        <div className="luxury-issue-list">
          {issues.length === 0 && (
            <p className="luxury-subtitle">Aún no has creado issues.</p>
          )}

          {issues.map((issue) => (
            <div key={issue.id} className="luxury-issue-card">
              <div className="luxury-card-header">
                <h3 style={{ color: "white" }}>{issue.category_name}</h3>

                <button
                  className="luxury-edit-btn"
                  onClick={() => handleEdit(issue.id)}
                >
                  Editar
                </button>
              </div>

              <p className="luxury-description">{issue.description}</p>

              {/* FOTOS */}
              <div className="luxury-photos">
                {issue.photos?.map((url, idx) => (
                  <Image
                    key={idx}
                    src={url}
                    width={120}
                    height={120}
                    className="luxury-photo"
                    alt="Foto issue"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* BOTONES PRINCIPALES */}
        <button className="luxury-btn-main" onClick={handleAddIssue}>
          ➕ Añadir otro Issue
        </button>

        <button
          className="luxury-btn-main"
          style={{ marginTop: "18px", background: "linear-gradient(135deg,#b68d23,#d4af37)" }}
          onClick={handleFinish}
        >
          ✔ Finalizar Inspección
        </button>
      </div>
    </div>
  );
}