// lib/fetch-reports.js
import { supabase } from "./supabase-browser";

export async function fetchReports(houseId) {
  if (!houseId) {
    console.error("❌ Missing houseId in fetchReports()");
    return { error: "Missing houseId" };
  }

  const { data, error } = await supabase.functions.invoke("list-reports", {
    body: { houseId },
  });

  if (error) {
    console.error("❌ Error fetching reports:", error);
    return { error };
  }

  return { data };
}
