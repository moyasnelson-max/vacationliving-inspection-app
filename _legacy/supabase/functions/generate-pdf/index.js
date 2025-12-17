import { PDFDocument } from "https://cdn.skypack.dev/pdf-lib@1.17.1";

export default async (req, res) => {
  const { html } = await req.json();

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([600, 800]);

  page.drawText("Inspection PDF Generated", { x: 40, y: 760 });

  const pdfBytes = await pdf.save();

  res.setHeader("Content-Type", "application/pdf");
  return res.send(pdfBytes);
};
