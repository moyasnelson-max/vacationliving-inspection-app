// -----------------------------------------------------------------------------
// temp-report.js — Gestión del temp_report_group para issues temporales
// -----------------------------------------------------------------------------
//
// Propósito:
//   Mantener un identificador temporal (temp_report_group) mientras el
//   inspector crea issues antes de finalizar el reporte.
//
// Características Marriott Ultra Edition:
//   ✓ Seguro en entornos cliente (previene SSR errors)
//   ✓ Reutiliza el grupo existente si está en localStorage
//   ✓ Genera un UUID real desde Supabase (via RPC)
//   ✓ Documentación profesional
//   ✓ Errores claros y fáciles de depurar
//   ✓ Totalmente compatible con tu arquitectura actual
//
// -----------------------------------------------------------------------------

"use client";

import supabase from "@/lib/supabaseClient";

const STORAGE_KEY = "temp_report_group";

// -----------------------------------------------------------------------------
// getOrCreateTempReportGroup()
// -----------------------------------------------------------------------------
// Retorna un temp_report_group existente o genera uno nuevo usando Supabase.
// Se almacena en localStorage para mantener consistencia mientras se crean issues.
// -----------------------------------------------------------------------------
export async function getOrCreateTempReportGroup() {
  // 1) Validar entorno navegador
  if (typeof window === "undefined") {
    console.warn("⚠ temp-report: window undefined (SSR). Retornando null.");
    return null;
  }

  // 2) Verificar si ya existe en localStorage
  let existing = localStorage.getItem(STORAGE_KEY);
  if (existing) {
    return existing;
  }

  // 3) Generar nuevo UUID desde Supabase
  try {
    const { data, error } = await supabase.rpc("gen_random_uuid");

    if (error) {
      console.error("❌ Error generating temp_report_group via RPC:", error);
      throw new Error("No se pudo generar un temp_report_group");
    }

    const uuid = data;

    // Guardar en localStorage
    localStorage.setItem(STORAGE_KEY, uuid);

    return uuid;
  } catch (err) {
    console.error("❌ temp-report Internal Error:", err);
    return null;
  }
}

// -----------------------------------------------------------------------------
// clearTempReportGroup()
// -----------------------------------------------------------------------------
// Limpia el identificador temporal al finalizar un reporte.
// -----------------------------------------------------------------------------
export function clearTempReportGroup() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
