// lib/email.js
import { supabase } from "./supabase-browser";

export async function sendInspectionEmail(reportId) {
  if (!reportId) {
    console.error("❌ Missing reportId in sendInspectionEmail()");
    return { error: "Missing reportId" };
  }

  const { data, error } = await supabase.functions.invoke("send-report", {
    body: { reportId }
  });

  if (error) {
    console.error("❌ Error sending report email:", error);
    return { error };
  }

  return { success: true, data };
}