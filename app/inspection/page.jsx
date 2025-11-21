"use client";

import { useState } from "react";
import generatePDF from "../pdf/generatePDF";
import { uploadPDF } from "../pdf/uploadToSupabase";
import { sendEmail } from "../pdf/sendEmail";
import { createIssue } from "../issues/createIssue";

export default function InspectionPage() {
  const [propertyId, setPropertyId] = useState("");
  const [inspectorEmail, setInspectorEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Handle camera / file picker
  const handlePhotos = (e) => {
    const files = Array.from(e.target.files);
    setPhotos((prev) => [...prev, ...files]);
  };

  // MAIN FLOW
  const submitInspection = async () => {
    try {
      setIsLoading(true);
      setResult(null);

      if (!propertyId || !inspectorEmail || photos.length === 0) {
        setResult({ error: "Please fill all fields and add photos." });
        setIsLoading(false);
        return;
      }

      // 1️⃣ Generate PDF
      const pdfBase64 = await generatePDF({
        propertyId,
        inspectorEmail,
        notes,
        photos,
      });

      // 2️⃣ Upload PDF to Supabase
      const { pdfUrl } = await uploadPDF({
        propertyId,
        pdfBase64,
      });

      // 3️⃣ Send Email to Owner
      await fetch("/api/send-report", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    inspector_email: session.user.email,
    property_id: selectedPropertyId,
    data: form,
  }),
});

      // 4️⃣ Create Issue Ticket if needed
      if (notes.length > 5) {
        await createIssue({
          propertyId,
          inspectorEmail,
          description: notes,
          photoCount: photos.length,
          pdfUrl,
        });
      }

      setResult({ ok: true, pdfUrl });
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setResult({ error: err.message });
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Inspection Form</h1>

      <div style={styles.group}>
        <label>Property ID</label>
        <input
          type="text"
          value={propertyId}
          onChange={(e) => setPropertyId(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.group}>
        <label>Inspector Email</label>
        <input
          type="email"
          value={inspectorEmail}
          onChange={(e) => setInspectorEmail(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.group}>
        <label>Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={styles.textarea}
        />
      </div>

      <div style={styles.group}>
        <label>Photos</label>
        <input
          type="file"
          accept="image/*"
          multiple
          capture="environment"
          onChange={handlePhotos}
        />
      </div>

      <button onClick={submitInspection} style={styles.button} disabled={isLoading}>
        {isLoading ? "Processing..." : "Submit Inspection"}
      </button>

      {result && (
        <div style={styles.resultBox}>
          {result.error && <p style={{ color: "red" }}>❌ {result.error}</p>}
          {result.ok && (
            <>
              <p style={{ color: "green" }}>✔ Inspection Completed!</p>
              <p>PDF: <a href={result.pdfUrl} target="_blank">{result.pdfUrl}</a></p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: "40px auto",
    padding: 20,
    fontFamily: "Inter, sans-serif",
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)"
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    color: "#0A2540",
  },
  group: { marginBottom: 20 },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc"
  },
  textarea: {
    width: "100%",
    padding: 10,
    height: 120,
    borderRadius: 8,
    border: "1px solid #ccc"
  },
  button: {
    width: "100%",
    padding: 14,
    background: "#0A2540",
    color: "#fff",
    fontSize: 18,
    borderRadius: 10,
    cursor: "pointer"
  },
  resultBox: {
    marginTop: 20,
    padding: 15,
    background: "#f9f9f9",
    borderRadius: 8,
    border: "1px solid #ddd"
  }
};
