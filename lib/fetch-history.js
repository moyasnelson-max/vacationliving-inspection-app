// lib/fetch-history.js
import { supabase } from "./supabase-browser.js";

/**
 * fetchHistory
 * Obtener historial completo de inspecciones por casa.
 * Permite filtros opcionales.
 *
 * Opciones:
 *  - houseId (required)
 *  - fromDate (optional)
 *  - toDate (optional)
 *  - status (optional: "open" | "closed")
 *
 * Ejemplo:
 *  fetchHistory({ houseId: 12, status: "closed" })
 */

export async function fetchHistory({ houseId, fromDate, toDate, status }) {
  if (!houseId) {
    console.error("❌ Missing houseId in fetchHistory()");
    return { error: "Missing houseId" };
  }

  const body = {
    houseId,
    fromDate: fromDate || null,
    toDate: toDate || null,
    status: status || null,
  };

  const { data, error } = await supabase.functions.invoke("list-reports", {
    body,
  });

  if (error) {
    console.error("❌ Error fetching history:", error);
    return { error };
  }

  return { data };
}
