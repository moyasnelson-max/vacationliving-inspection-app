"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabaseBrowser } from "@lib/supabase-browser";
import "@/styles/finish.css";   // asegúrate de que este archivo existe
import Image from "next/image";

export default function SubmitReportPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = supabaseBrowser();

  const houseId = params.houseId;

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  /* ============================
     CARGA DE ISSUES LOCALES
     ============================ */
  useEffect(() => {
    const saved = localStorage.getItem("pending_issues");

    if (saved) {
      setIssues(JSON.parse(saved));
    }

    setLoading(false);
  }, []);

  /* ============================
     ENVIAR REPORTE A SUPABASE
     ============================ */
  async function submitReport() {
    try {
      setSending(true);

      const payload = {
        houseId,
        issues,
      };

      const { data, error } = await supabase.functions.invoke("send-report", {
        body: payload,
      });

      if (error) {
        console.error("Error sending report:", error);
        alert("Hubo un problema enviando el reporte.");
        setSending(false);
        return;
      }

      // Limpiar issues locales
      localStorage.removeItem("pending_issues");

      // Ir a pantalla final premium
      router.push(`/inspection/${houseId}/finish`);
    } catch (err) {
      console.error(err);
      alert("Error inesperado.");
      setSending(false);
    }
  }

  /* ============================
     CARGANDO
     ============================ */
  if (loading) {
    return (
      <div className="luxury-loader">
        <p>Cargando reporte...</p>
      </div>
    );
  }

  /* ============================
     UI MARROTT DE VERIFICACIÓN
     ============================ */
  return (
    <div className="submit-wrapper">

      <h1 className="submit-title">Revisión del Reporte</h1>
      <p className="submit-subtitle">
        Verifica que todo esté correcto antes de enviar el reporte final.
      </p>

      <div className="submit-issues-list">
        {issues.map((issue, index) => (
          <div key={index} className="submit-issue-card">
            
            <div className="submit-issue-header">
              <h3>{issue.categoryName} → {issue.subcategoryName}</h3>

              <button
                className="submit-edit-btn"
                onClick={() =>
                  router.push(`/inspection/${houseId}/edit/${index}`)
                }
              >
                Editar
              </button>
            </div>

            <p className="submit-description">{issue.description}</p>

            {/* Fotos */}
            <div className="submit-photo-row">
              {issue.photos?.map((url, i) => (
                <Image
                  key={i}
                  src={url}
                  width={120}
                  height={120}
                  className="submit-photo"
                  alt="Issue photo"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* BOTÓN ENVIAR REPORTE */}
      <button
        onClick={submitReport}
        disabled={sending}
        className="submit-btn"
      >
        {sending ? "Enviando Reporte..." : "Enviar Reporte Final"}
      </button>

    </div>
  );
}