import { supabaseServer } from "@/lib/supabase/server";
import { logEvent } from "@/lib/logs";
import { EVENTS } from "@/lib/logs/events";

export async function runDailyOpenIssues() {
  const supabase = supabaseServer();

  const { data: issues } = await supabase
    .from("issues")
    .select("id, house_id, severity")
    .eq("status", "open");

  for (const issue of issues || []) {
    await logEvent({
      event: EVENTS.OPEN_ISSUE_CHECK,
      entityType: "issue",
      entityId: issue.id,
      houseId: issue.house_id,
      metadata: { severity: issue.severity },
    });
  }

  return { openIssues: issues?.length || 0 };
}
