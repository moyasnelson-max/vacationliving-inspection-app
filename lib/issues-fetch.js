"use client";

import { supabaseBrowser } from "@lib/supabase-browser";

export async function getIssuesByTempGroup(tempGroup) {
  const supabase = supabaseBrowser();

  const { data, error } = await supabase
    .from("issues_v3")
    .select("*")
    .eq("temp_report_group", tempGroup)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("❌ Error obteniendo issues por temp_group:", error);
    throw new Error("No se pudieron obtener los issues");
  }

  return data;
}

export async function getIssuesByHouse(houseId) {
  const supabase = supabaseBrowser();

  const { data, error } = await supabase
    .from("issues_v3")
    .select("*")
    .eq("house_id", houseId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Error obteniendo issues por casa:", error);
    throw new Error("No se pudieron obtener los issues");
  }

  return data;
}

export async function getIssuesByInspector(inspectorId) {
  const supabase = supabaseBrowser();

  const { data, error } = await supabase
    .from("issues_v3")
    .select("*")
    .eq("inspector_id", inspectorId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Error obteniendo issues por inspector:", error);
    throw new Error("No se pudieron obtener los issues");
  }

  return data;
}
