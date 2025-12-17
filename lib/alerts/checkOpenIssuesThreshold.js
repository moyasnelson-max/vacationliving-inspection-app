import { supabaseServer } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/notifications/email";
import { logEvent } from "@/lib/logs";
import { EVENTS } from "@/lib/logs/events";

const ISSUE_THRESHOLD = 5;

export async function checkOpenIssuesThreshold() {
  const supabase = supabaseServer();

  const { data: issues } = await supabase
    .from("issues")
    .select("house_id")
    .eq("status", "open");

  const grouped = issues.reduce((acc, i) => {
    acc[i.house_id] = (acc[i.house_id] || 0) + 1;
    return acc;
  }, {});

  const alerts = Object.entries(grouped)
    .filter(([, count]) => count >= ISSUE_THRESHOLD)
    .map(([house_id, count]) => ({ house_id, count }));

  if (alerts.length === 0) return;

  await sendEmail({
    template: "open_issues_threshold",
    toRole: ["admin", "director", "owner"],
    data: { alerts },
  });

  await logEvent({
    event: EVENTS.ISSUE_THRESHOLD_ALERT_SENT,
    entityType: "system",
    entityId: crypto.randomUUID(),
    metadata: alerts,
  });
}
