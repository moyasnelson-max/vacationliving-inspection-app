import { checkOpenIssuesThreshold } from "@/lib/alerts";

export async function GET() {
  await checkOpenIssuesThreshold();
  return Response.json({ ok: true });
}
