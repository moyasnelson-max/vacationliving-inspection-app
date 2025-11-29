// supabase/functions/generate-pdf/index.js
// -------------------------------------------------------------
// Vacation Living — Generate PDF v4.0 PRO
// Produce un PDF Marriott Beige-Gold con:
// - Propiedad
// - Inspector
// - Fecha
// - Issues abiertos/cerrados
// - Notas
// - Fotos (hasta 3 por issue)
// Guardado en Supabase Storage
// -------------------------------------------------------------

export const config = { runtime: "edge" };

import { PDFDocument, StandardFonts, rgb } from "npm:pdf-lib";

export default async (req) => {
  try {
    const data = await req.json();
    const {
      inspection,
      property,
      inspector,
      openReports,
      closedReports,
      media,
    } = data;

    if (!inspection || !property) {
      return new Response(JSON.stringify({ error: "Missing required data" }), {
        status: 400,
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const headers = {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    };

    // -------------------------------------------------------------
    // 1 — Crear PDF
    // -------------------------------------------------------------
    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const gold = rgb(0.78, 0.65, 0.4);
    const black = rgb(0.12, 0.12, 0.12);

    const page = pdf.addPage([595, 842]); // A4 vertical
    const { width } = page.getSize();

    // -------------------------------------------------------------
    // HEADER
    // -------------------------------------------------------------
    page.drawText("VACATION LIVING", {
      x: 40,
      y: 800,
      size: 22,
      font,
      color: black,
    });

    page.drawText("Inspection Report", {
      x: 40,
      y: 775,
      size: 16,
      font,
      color: gold,
    });

    page.drawLine({
      start: { x: 40, y: 760 },
      end: { x, y: 760 },
      thickness: 1,
      color: gold,
    });

    // -------------------------------------------------------------
    // INFO PRINCIPAL
    // -------------------------------------------------------------
    page.drawText(`Property: ${property.name}`, {
      x: 40,
      y: 730,
      size: 14,
      font,
    });

    page.drawText(`Address: ${property.address || "N/A"}`, {
      x: 40,
      y: 710,
      size: 12,
      font,
    });

    page.drawText(`Inspector: ${inspector?.name || "Unknown"}`, {
      x: 40,
      y: 690,
      size: 12,
      font,
    });

    page.drawText(`Inspection Date: ${inspection.date}`, {
      x: 40,
      y: 670,
      size: 12,
      font,
    });

    // -------------------------------------------------------------
    // ISSUES ABIERTOS
    // -------------------------------------------------------------
    let cursor = 630;
    page.drawText("Open Issues", {
      x: 40,
      y: cursor,
      size: 15,
      color: gold,
    });
    cursor -= 25;

    for (const r of openReports) {
      page.drawText(`• ${r.title}`, {
        x: 50,
        y: cursor,
        size: 12,
      });
      cursor -= 18;
    }

    // -------------------------------------------------------------
    // ISSUES CERRADOS
    // -------------------------------------------------------------
    cursor -= 15;
    page.drawText("Closed Issues", {
      x: 40,
      y: cursor,
      size: 15,
      color: gold,
    });
    cursor -= 25;

    for (const r of closedReports) {
      page.drawText(`• ${r.title}`, {
        x: 50,
        y: cursor,
        size: 12,
      });
      cursor -= 18;
    }

    // -------------------------------------------------------------
    // FOTOS (solo primeras 3 por issue)
    // -------------------------------------------------------------
    cursor -= 30;
    page.drawText("Photos", {
      x: 40,
      y: cursor,
      size: 15,
      color: gold,
    });
    cursor -= 25;

    const grouped = {};
    media.forEach((m) => {
      if (!grouped[m.report_id]) grouped[m.report_id] = [];
      if (grouped[m.report_id].length < 3) grouped[m.report_id].push(m);
    });

    for (const reportId in grouped) {
      page.drawText(`Issue ${reportId}:`, {
        x: 40,
        y: cursor,
        size: 12,
      });
      cursor -= 20;

      for (const img of grouped[reportId]) {
        const resImg = await fetch(
          `${supabaseUrl}/storage/v1/object/public/${img.path}`,
        );
        const bytes = await resImg.arrayBuffer();
        const emb = await pdf.embedJpg(bytes);

        page.drawImage(emb, {
          x: 40,
          y: cursor - 100,
          width: 160,
          height: 100,
        });

        cursor -= 120;
      }
    }

    // -------------------------------------------------------------
    // 3 — Guardar PDF en Supabase Storage
    // -------------------------------------------------------------
    const pdfBytes = await pdf.save();

    const path = `reports/${property.id}/${inspection.id}/report-${Date.now()}.pdf`;

    await fetch(`${supabaseUrl}/storage/v1/object/reports/${path}`, {
      method: "PUT",
      headers: {
        ...headers,
        "Content-Type": "application/pdf",
      },
      body: pdfBytes,
    });

    // -------------------------------------------------------------
    // 4 — Respuesta final
    // -------------------------------------------------------------
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/reports/${path}`;

    return new Response(
      JSON.stringify({
        ok: true,
        url: publicUrl,
        path,
      }),
      { status: 200 },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
