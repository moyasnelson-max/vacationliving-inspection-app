#!/bin/bash

echo "=== CREANDO PANTALLAS PREMIUM DE INSPECCIÓN ==="

BASE="app/inspection/[houseId]"

# -------------------------------------------
# 1. issue-created/page.jsx
# -------------------------------------------
FILE1="$BASE/issue-created/page.jsx"

if [ ! -f "$FILE1" ]; then
  mkdir -p "$BASE/issue-created"
  cat > "$FILE1" << 'EOF'
"use client";

import Link from "next/link";
import "@/styles/luxury-inspection.css";

export default function IssueCreatedPage() {
  return (
    <div className="lux-wrapper">
      <div className="lux-card fade-in">
        <h1 className="lux-title">Issue creado correctamente</h1>
        <p className="lux-subtitle">
          Tu evidencia fue subida con éxito y está lista para enviarse.
        </p>

        <div className="lux-actions">
          <Link href="../issue" className="lux-btn gold">
            ➕ Crear otro Issue
          </Link>

          <Link href="../submit/review" className="lux-btn glass">
            📄 Ver Lista de Issues
          </Link>
        </div>
      </div>
    </div>
  );
}
EOF

  echo "✔ Creado: $FILE1"
else
  echo "✔ Ya existe: $FILE1"
fi


# -------------------------------------------
# 2. submit/review/page.jsx
# -------------------------------------------
FILE2="$BASE/submit/review/page.jsx"

if [ ! -f "$FILE2" ]; then
  mkdir -p "$BASE/submit/review"
  cat > "$FILE2" << 'EOF'
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import "@/styles/luxury-inspection.css";

export default function ReviewIssuesPage() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    async function loadIssues() {
      const { data } = await supabase
        .from("issues_temp")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setIssues(data);
    }

    loadIssues();
  }, []);

  return (
    <div className="lux-wrapper">
      <div className="lux-card fade-in">
        <h1 className="lux-title">Revisión del Reporte</h1>
        <p className="lux-subtitle">
          Estos son los issues que has creado para este reporte.
        </p>

        <div className="lux-list">
          {issues.length === 0 && (
            <p className="lux-empty">Aún no hay issues creados.</p>
          )}

          {issues.map((item) => (
            <Link
              key={item.id}
              href={`../issues/${item.id}`}
              className="lux-list-item"
            >
              <span>📌 {item.title}</span>
              <span className="lux-arrow">→</span>
            </Link>
          ))}
        </div>

        <div className="lux-actions">
          <Link href="../issue" className="lux-btn glass">
            ➕ Crear otro Issue
          </Link>

          <Link href="../finish" className="lux-btn gold">
            🚀 Enviar Reporte
          </Link>
        </div>
      </div>
    </div>
  );
}
EOF

  echo "✔ Creado: $FILE2"
else
  echo "✔ Ya existe: $FILE2"
fi

echo "=== COMPLETADO ==="
