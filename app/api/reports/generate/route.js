import { generateInspectionPDF } from "@/lib/pdf/generateInspectionPDF";
import { sendEmail } from "@/lib/notifications/email";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export async function POST(req) {
  const body = await req.json();
  const pdf = await generateInspectionPDF(body);
  const name = \`inspection-\${body.id}.pdf\`;

  await supabase.storage
    .from(process.env.NEXT_PUBLIC_REPORTS_BUCKET)
    .upload(name, pdf, { contentType:"application/pdf" });

  await sendEmail({
    to: body.email,
    subject: "Inspection Report",
    html: "<p>Your inspection report is attached.</p>",
    attachments:[{
      content: pdf.toString("base64"),
      filename: name,
      type: "application/pdf",
      disposition: "attachment"
    }]
  });

  return Response.json({ ok:true });
}
