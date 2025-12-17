import { sendEmail } from "./email";
import * as T from "./templates";

export async function notifyInspectionCompleted({ inspector, ops, data }) {
  await sendEmail({ to: inspector, subject: "Inspection Completed", html: T.inspectionCompletedTemplate(data) });
  await sendEmail({ to: ops, subject: "Inspection Completed (Ops)", html: T.inspectionCompletedTemplate(data) });
}

export async function notifyIssueClosed({ inspector, ops, guest, data }) {
  await sendEmail({ to: inspector, subject: "Issue Closed", html: T.issueClosedTemplate(data) });
  await sendEmail({ to: ops, subject: "Issue Closed (Ops)", html: T.issueClosedTemplate(data) });
  if (guest) await sendEmail({ to: guest, subject: "Issue Resolved", html: T.issueClosedTemplate(data) });
}

export async function notifyWeeklySummary({ owner, ops, summary }) {
  await sendEmail({ to: owner, subject: "Weekly Summary", html: T.weeklySummaryTemplate({ summary }) });
  await sendEmail({ to: ops, subject: "Weekly Ops Summary", html: T.weeklySummaryTemplate({ summary }) });
}
