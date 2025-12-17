"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ItemPage({ params }) {
  const router = useRouter();
  const { houseId, itemId } = params;

  // Estado del status del ítem
  const [status, setStatus] = useState("ok");

  // Estado del modal Marriott-Level
  const [showModal, setShowModal] = useState(false);

  // Guardar estado del ítem en inspection_items
  const save = async () => {
    await supabase.from("inspection_items").insert({
      house_id: houseId,
      item_id: itemId,
      status,
    });

    // Después de guardar, abrir modal elegante
    setShowModal(true);
  };

  // Acción del botón "Sí"
  const handleYes = () => {
    router.push(`/inspection/${houseId}/issue?item=${itemId}`);
  };

  // Acción del botón "No"
  const handleNo = () => {
    router.push(`/inspection/${houseId}/categories`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Ítem {itemId}</h3>

      {/* SELECT DEL ESTADO */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        style={{
          padding: 10,
          marginTop: 10,
          borderRadius: 8,
        }}
      >
        <option value="ok">OK</option>
        <option value="issue">Issue</option>
      </select>

      {/* BOTÓN GUARDAR */}
      <button
        onClick={save}
        style={{
          marginTop: 20,
          padding: "12px 20px",
          borderRadius: 8,
          background: "#C8A36D",
          color: "#fff",
          fontWeight: "bold",
          border: "none",
        }}
      >
        Guardar
      </button>

      {/* MODAL ELEGANTE MARRIOTT LEVEL */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backdropFilter: "blur(6px)",
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: "85%",
              maxWidth: 380,
              background: "#ffffff",
              borderRadius: 16,
              padding: 24,
              boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
              textAlign: "center",
              animation: "fadeIn 0.25s ease",
            }}
          >
            <h2 style={{ marginBottom: 10, color: "#333", fontWeight: "600" }}>
              ¿Deseas reportar un issue en este ítem?
            </h2>

            <p style={{ color: "#666", marginBottom: 25 }}>
              Confirma si deseas crear un reporte para este ítem.
            </p>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={handleYes}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  background: "#C8A36D",
                  color: "white",
                  fontWeight: "600",
                  borderRadius: 10,
                  border: "none",
                }}
              >
                Sí
              </button>

              <button
                onClick={handleNo}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  background: "#e5e5e5",
                  color: "#333",
                  fontWeight: "600",
                  borderRadius: 10,
                  border: "none",
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}