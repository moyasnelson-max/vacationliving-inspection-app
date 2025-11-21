"use client";

import { useState } from "react";
import ReportHTML from "./components/ReportHTML.jsx";
import GeneratePDF from "./components/GeneratePDF.jsx";
import { uploadPDF } from "./components/UploadPDF.js";
import { submitFinalReport } from "./components/SubmitReport.js";

export default function InspectionPage() {
  const [step, setStep] = useState("form"); // form → preview → sending → done
  const [report, setReport] = useState(null);

  // Form fields
  const [propertyName, setPropertyName] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [inspectorEmail, setInspectorEmail] = useState("");
  const [categories, setCategories] = useState([]);
  const [issues, setIssues] = useState([]);
  const [photos, setPhotos] = useState([]);

  // Handle submit
  async function handleSubmit() {
    if (!propertyId || !inspectorEmail) {
      alert("Missing required fields.");
      return;
    }

    const now = new Date().toLocaleString();

    const reportObject = {
      propertyName,
      propertyId,
      inspectorEmail,
      reportDate: now,
      categories,
      issues,
      photos,
    };

    setReport(reportObject);
    setStep("preview");
  }

  // Generate PDF + Upload + Send Report
  async function finishReport() {
    try {
      setStep("sending");

      // 1) Generate PDF
      const pdfBlob = await GeneratePDF();

      // 2) Upload PDF
      const pdfUrl = await uploadPDF(pdfBlob, report.propertyId);

      // 3) Submit to backend (send-report)
      const res = await submitFinalReport({
        ...report,
        pdf_url: pdfUrl,
      });

      console.log("Send-report response:", res);

      setStep("done");
    } catch (e) {
      console.error(e);
      alert("There was an error sending the report.");
      setStep("preview");
    }
  }

  // UI Screens
  if (step === "form") {
    return (
      <div style={{ padding: 20, fontFamily: "Inter, sans-serif" }}>
        <h1 style={{ color: "#C8A36D" }}>Inspection Form</h1>

        <label>Property Name:</label>
        <input
          style={{ display: "block", padding: 8, marginBottom: 12 }}
          value={propertyName}
          onChange={(e) => setPropertyName(e.target.value)}
        />

        <label>Property ID:</label>
        <input
          style={{ display: "block", padding: 8, marginBottom: 12 }}
          value={propertyId}
          onChange={(e) => setPropertyId(e.target.value)}
        />

        <label>Inspector Email:</label>
        <input
          style={{ display: "block", padding: 8, marginBottom: 12 }}
          value={inspectorEmail}
          onChange={(e) => setInspectorEmail(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          style={{
            padding: "12px 20px",
            background: "#C8A36D",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Continue
        </button>
      </div>
    );
  }

  if (step === "preview") {
    return (
      <div style={{ padding: 20 }}>
        <h2 style={{ color: "#C8A36D" }}>Preview Report</h2>

        <ReportHTML report={report} />

        <button
          onClick={finishReport}
          style={{
            marginTop: 20,
            padding: "12px 20px",
            background: "#9C7C4D",
            color: "white",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
          }}
        >
          Send Final Report
        </button>
      </div>
    );
  }

  if (step === "sending") {
    return (
      <div style={{ padding: 20 }}>
        <h2 style={{ color: "#C8A36D" }}>Sending report...</h2>
        <p>Do not close this page.</p>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h2 style={{ color: "#4CAF50" }}>Report Sent Successfully!</h2>
        <p>A PDF has been delivered and issues were created.</p>
      </div>
    );
  }
}
