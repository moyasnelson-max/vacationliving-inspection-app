"use client";

import { useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import "@styles/luxury-inspection.css";
import { createIssue } from "@lib/issues-create";

export default function IssuePage() {
  const router = useRouter();
  const { houseId } = useParams();
  const params = useSearchParams();

  const categoryId = params.get("category");
  const subcategoryId = params.get("subcategory");
  const itemId = params.get("item");

  const [description, setDescription] = useState("");
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    try {
      setLoading(true);

      const payload = {
        houseId,
        inspectorId: "", // TODO: Supabase session
        categoryId,
        subcategoryId,
        itemId,
        description,
        mediaUrls: media,
      };

      await createIssue(payload);

      router.push(`/inspection/${houseId}/issue-created`);
    } catch (err) {
      console.error("Error creando issue:", err);
      alert("No se pudo crear el issue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="luxury-wrapper">
      <h1>Crear Issue</h1>

      <textarea
        className="input-area"
        placeholder="Descripción del problema..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        className="luxury-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Guardando..." : "Guardar Issue"}
      </button>
    </div>
  );
}
