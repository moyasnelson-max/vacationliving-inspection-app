"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase-client"
import { useRouter } from "next/navigation";
import "../../../../styles/inspection-review.css";

export default function ReviewPage({ params }) {
  const { houseId } = params;
  const router = useRouter();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState("es");

  const fetchIssues = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("issues_v2")
      .select("id, note, status, subcategory_id, created_at")
      .eq("house_id", houseId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setIssues(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const goToIssueClose = (issueId) => {
    router.push(`/inspection/${houseId}/close/${issueId}`);
  };

  const goBackToHouse = () => {
    router.push(`/inspection/${houseId}`);
  };

  return (
    <div className="lux-container">
      <h1 className="lux-title">Revisión de Issues</h1>

      <button className="lux-button-back" onClick={goBackToHouse}>
        ← Volver a categorías
      </button>

      {loading ? (
        <p className="lux-loading">Cargando...</p>
      ) : issues.length === 0 ? (
        <p className="lux-empty">No hay issues abiertos.</p>
      ) : (
        <div className="lux-list">
          {issues.map((issue) => (
            <div key={issue.id} className="lux-item" onClick={() => goToIssueClose(issue.id)}>
              <div className="lux-item-left">
                <h3 className="lux-item-title">Issue #{issue.id}</h3>
                <p className="lux-item-note">{issue.note}</p>
                <p className="lux-item-status">
                  Estado:{" "}
                  <span className={issue.status === "open" ? "open" : "closed"}>
                    {issue.status === "open" ? "Abierto" : "Cerrado"}
                  </span>
                </p>
              </div>
              <div className="lux-item-arrow">›</div>
            </div>
          ))}
        </div>
      )}

      <button
        className="lux-button-finish"
        onClick={() => router.push(`/inspection/${houseId}/complete`)}
      >
        Finalizar Inspección
      </button>
    </div>
  );
}
