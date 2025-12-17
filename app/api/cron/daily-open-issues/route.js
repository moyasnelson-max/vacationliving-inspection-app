import { runDailyOpenIssues } from "@/lib/automations";

export async function GET() {
  const result = await runDailyOpenIssues();
  return Response.json(result);
}
