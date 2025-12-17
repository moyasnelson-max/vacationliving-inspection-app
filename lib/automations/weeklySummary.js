import { supabaseServer } from "@/lib/supabase/server";
import { logEvent } from "@/lib/logs";
import { EVENTS } from "@/lib/logs/events";

export async function runWeeklySummary() {
  const supabase = supabaseServer();

  const { data: inspections } = await supabase
    .from("inspections")
    .select("id, house_id, completed_at")
    .gte("completed_at", new Date(Date.now() - 7 * 86400000).toISOString());

  for (const inspection of inspections || []) {
    await logEvent({
      event: EVENTS.WEEKLY_SUMMARY_GENERATED,
      entityType: "inspection",
      entityId: inspection.id,
      houseId: inspection.house_id,
      metadata: { period: "last_7_days" },
    });
  }

  return { success: true };
}
