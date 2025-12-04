"use client";

import { supabaseBrowser } from "@/lib/supabase-browser";

const STORAGE_KEY = "vl_temp_report_group";

export async function getOrCreateTempReportGroup() {
  const supabase = supabaseBrowser();

  // 1) verificar si ya existe en localStorage
  let group = null;
  if (typeof window !== "undefined") {
    group = localStorage.getItem(STORAGE_KEY);
  }

  if (group) return group;

  // 2) generar UUID desde Supabase
  const { data, error } = await supabase.rpc("gen_random_uuid");

  if (error) {
    console.error("❌ Error generating temp_report_group:", error);
    throw new Error("No se pudo generar temp_report_group");
  }

  const newGroup = data;

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, newGroup);
  }

  return newGroup;
}

// limpia después de enviar reporte
export function clearTempReportGroup() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}
