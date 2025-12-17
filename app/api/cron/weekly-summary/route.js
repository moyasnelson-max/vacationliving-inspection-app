import { runWeeklySummary } from "@/lib/automations";

export async function GET() {
  await runWeeklySummary();
  return Response.json({ ok: true });
}
