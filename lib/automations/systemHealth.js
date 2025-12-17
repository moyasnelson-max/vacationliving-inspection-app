import { logEvent } from "@/lib/logs";
import { EVENTS } from "@/lib/logs/events";

export async function runSystemHealth() {
  await logEvent({
    event: EVENTS.SYSTEM_HEALTH_CHECK,
    entityType: "system",
    entityId: crypto.randomUUID(),
    metadata: {
      status: "ok",
      timestamp: new Date().toISOString(),
    },
  });

  return { status: "ok" };
}
