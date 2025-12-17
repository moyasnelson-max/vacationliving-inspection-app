// ============================================================================
// issues-fetch.js — VERSIÓN PRO DEFINITIVA
// Mantiene TODO tu sistema actual sin romper nada.
// Funciones:
//   - getIssuesByTempGroup(tempGroup)
//   - getIssuesByHouse(houseId)
//   - getIssuesByInspector(inspectorId)
//
// Todas usan issues_v3 y orden profesional Marriott.
// ============================================================================

"use client";

import supabase from "@/lib/supabaseClient";

// ============================================================================
// 1) Obtener issues por temp_report_group  (flujo interno de inspección)
// ============================================================================
export async function getIssuesByTempGroup(tempGroup) {
  if (!tempGroup) {
    console.error("❌ Missing tempGroup en getIssuesByTempGroup()");
    return { error: "Missing tempGroup" };
  }

  const { data, error } = await supabase
    .from("issues_v3")
    .select("*")
    .eq("temp_report_group", tempGroup)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("❌ Error obteniendo issues por temp_group:", error);
    return { error };
  }

  return data;
}

// ============================================================================
// 2) Obtener issues por propiedad (houseId)
// Ideal para dashboards y reportes por casa
// ============================================================================
export async function getIssuesByHouse(houseId) {
  if (!houseId) {
    console.error("❌ Missing houseId en getIssuesByHouse()");
    return { error: "Missing houseId" };
  }

  const { data, error } = await supabase
    .from("issues_v3")
    .select("*")
    .eq("house_id", houseId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Error obteniendo issues por casa:", error);
    return { error };
  }

  return data;
}

// ============================================================================
// 3) Obtener issues por inspector (inspectorId)
// Ideal para auditorías, métricas y desempeño del equipo
// ============================================================================
export async function getIssuesByInspector(inspectorId) {
  if (!inspectorId) {
    console.error("❌ Missing inspectorId en getIssuesByInspector()");
    return { error: "Missing inspectorId" };
  }

  const { data, error } = await supabase
    .from("issues_v3")
    .select("*")
    .eq("inspector_id", inspectorId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Error obteniendo issues por inspector:", error);
    return { error };
  }

  return data;
}

export default {
  getIssuesByTempGroup,
  getIssuesByHouse,
  getIssuesByInspector,
};
