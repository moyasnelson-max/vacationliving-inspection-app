import * as N from "@/lib/notifications/triggers";
export async function POST(req) {
  const body = await req.json();
  await N.notifyInspectionCompleted?.(body)
    || await N.notifyIssueClosed?.(body)
    || await N.notifyWeeklySummary?.(body);
  return Response.json({ ok: true });
}
