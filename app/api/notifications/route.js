import { sendEmail } from "@/lib/notifications/email";
import {
  issueCreatedTemplate,
  issueClosedTemplate,
} from "@/lib/notifications/templates";

export async function POST(req) {
  const body = await req.json();

  if (body.type === "issue_created") {
    await sendEmail({
      to: body.to,
      subject: "Issue received",
      html: issueCreatedTemplate(body.data),
    });
  }

  if (body.type === "issue_closed") {
    await sendEmail({
      to: body.to,
      subject: "Issue resolved",
      html: issueClosedTemplate(body.data),
    });
  }

  return Response.json({ ok: true });
}
