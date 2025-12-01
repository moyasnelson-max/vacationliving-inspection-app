import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export default async (req, res) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  );

  const body = await req.json();
  const { reportId, email_to } = body;

  const { data: report } = await supabase
    .from("reports")
    .select("*")
    .eq("id", reportId)
    .single();

  if (!report) {
    return res.status(404).json({ error: "Report not found" });
  }

  await fetch(Deno.env.get("SENDGRID_API"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("SENDGRID_KEY")}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: email_to }] }],
      from: { email: Deno.env.get("EMAIL_FROM") },
      subject: `Inspection Report ${reportId}`,
      content: [{ type: "text/html", value: "Report sent successfully." }]
    })
  });

  return res.json({ success: true });
};
