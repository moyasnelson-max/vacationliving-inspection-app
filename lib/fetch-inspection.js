// lib/fetch-inspection.js
import { supabase } from "./supabase-browser";

export async function fetchInspection(houseId) {
  if (!houseId) {
    console.error("❌ Missing houseId in fetchInspection()");
    return { error: "Missing houseId" };
  }

  const { data, error } = await supabase.functions.invoke("get-inspection", {
    body: { houseId },
  });

  if (error) {
    console.error("❌ Error fetching inspection:", error);
    return { error };
  }

  return { data };
}
