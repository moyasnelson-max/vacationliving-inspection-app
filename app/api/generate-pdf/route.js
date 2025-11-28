import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function POST(req) {
  try {
    const { propertyName, inspectorName, timestamp, sections } = await req.json();

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let y = 760;

    page.drawText(`Inspection Report`, { x: 50, y, size: 22, font });
    y -= 30;
    page.drawText(`Property: ${propertyName}`, { x: 50, y, size: 14, font });
    y -= 20;
    page.drawText(`Inspector: ${inspectorName}`, { x: 50, y, size: 14, font });
    y -= 20;
    page.drawText(`Date: ${timestamp}`, { x: 50, y, size: 14, font });

    y -= 30;
    page.drawText(`Sections:`, { x: 50, y, size: 16, font });
    y -= 20;

    sections.forEach((section) => {
      page.drawText(`• ${section.title}: ${section.status}`, { x: 60, y, size: 12, font });
      y -= 15;
    });

    const pdfBytes = await pdfDoc.save();

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="inspection.pdf"',
      },
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
