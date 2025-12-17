import { supabaseServer } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/notifications/email";
import { logEvent } from "@/lib/logs";
import { EVENTS } from "@/lib/logs/events";

const HOURS_LIMIT = 6;

export async function checkCriticalIssues() {
  const supabase = supabaseServer();

  const since = new Date(Date.now() - HOURS_LIMIT * 3600000).toISOString();

  const { data: issues } = await supabase
    .from("issues")
    .select("id, house_id, title, created_at")
    .eq("severity", "critical")
    .eq("status", "open")
    .lt("created_at", since);

  if (!issues || issues.length === 0) return;

  await sendEmail({
    template: "critical_issue_alert",
    toRole: ["admin", "director"],
    data: { issues },
  });

  await logEvent({
    event: EVENTS.CRITICAL_ISSUE_ALERT_SENT,
    entityType: "system",
    entityId: crypto.randomUUID(),
    metadata: { count: issues.length },
  });
}
