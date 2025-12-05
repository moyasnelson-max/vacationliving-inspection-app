"use client";

import { useRouter, useParams } from "next/navigation";
import "@styles/luxury-inspection.css";

export default function IssueCreated() {
  const router = useRouter();
  const { houseId } = useParams();

  return (
    <div className="luxury-wrapper">
      <div className="issue-created-box">
        <h1 className="success-title">✔ Issue Creado</h1>

        <button
          className="luxury-btn"
          onClick={() => router.push(`/inspection/${houseId}/categories`)}
        >
          Añadir otro Issue
        </button>

        <button
          className="luxury-btn-secondary"
          onClick={() => router.push(`/inspection/${houseId}/finish`)}
        >
          Finalizar Inspección
        </button>
      </div>
    </div>
  );
}
