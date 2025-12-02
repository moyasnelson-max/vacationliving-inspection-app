// lib/fetch-issues.js
import { supabase } from "./supabase-browser";

export async function fetchIssues({ houseId, inspectionId }) {
  if (!houseId && !inspectionId) {
    console.error("❌ Missing params in fetchIssues()");
    return { error: "houseId or inspectionId required" };
  }

  const { data, error } = await supabase.functions.invoke("list-issues", {
    body: { houseId, inspectionId },
  });

  if (error) {
    console.error("❌ Error fetching issues:", error);
    return { error };
  }

  return { data };
}
