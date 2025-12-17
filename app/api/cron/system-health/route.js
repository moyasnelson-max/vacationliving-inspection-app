import { runSystemHealth } from "@/lib/automations";

export async function GET() {
  await runSystemHealth();
  return Response.json({ status: "ok" });
}
