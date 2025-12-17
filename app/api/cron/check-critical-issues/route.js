import { checkCriticalIssues } from "@/lib/alerts";

export async function GET() {
  await checkCriticalIssues();
  return Response.json({ ok: true });
}
