import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const inspector_email = body.inspector_email;
    const property_id = body.property_id;
    const data = body.data;

    if (!inspector_email || !property_id || !data) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1) Generate PDF first
    const pdfResp = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate_pdf`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          inspector_email,
          property_id,
          data,
        }),
      }
    );

    const pdfResult = await pdfResp.json();

    if (!pdfResp.ok || !pdfResult.pdf_path) {
      return NextResponse.json(
        { error: pdfResult.error || "PDF generation failed" },
        { status: 500 }
      );
    }

    const pdf_path = pdfResult.pdf_path;

    // 2) Send final email with edge function
    const emailResp = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send_report_email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          property_id,
          inspector_email,
          pdf_path,
          // OPTIONAL: in the future can support guests
          report_data: data,
        }),
      }
    );

    const emailResult = await emailResp.json();

    if (!emailResp.ok) {
      return NextResponse.json(
        { error: emailResult.error || "Email send failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, pdf_path });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
