"use client";

import { useState } from "react";
import supabase from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import CreateItemModal from "../../../components/CreateItemModal";

export default function NewReportPage() {
  const router = useRouter();

  // Report fields
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  // Report ID once created
  const [reportId, setReportId] = useState(null);

  // Modal control
  const [openModal, setOpenModal] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      let image_url = null;

      // Upload file if exists
      if (image) {
        const path = `inspections/${Date.now()}-${image.name}`;
        const { error: uploadError } = await supabase.storage
          .from("reports")
          .upload(path, image);

        if (uploadError) {
          setError(uploadError.message);
          return;
        }

        image_url = path;
      }

      // 1️⃣ Create main report row
      const { data: reportData, error: reportError } = await supabase
        .from("reports")
        .insert([
          {
            property_id: "00000000-0000-0000-0000-000000000000", // TEMPORAL
            inspector_id: (await supabase.auth.getUser()).data.user.id,
            title,
            summary: details,
            image_url,
            status: "pending",
          },
        ])
        .select()
        .single();

      if (reportError) {
        setError(reportError.message);
        return;
      }

      setReportId(reportData.id);

      alert("Reporte creado. Usa el botón para agregar items.");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Create New Report</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginRight: 10 }}
        />

        <input
          type="text"
          placeholder="Details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          style={{ marginRight: 10 }}
        />

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          style={{ marginRight: 10 }}
        />

        <button type="submit">Create Report</button>
      </form>

      {reportId && (
        <button
          style={{ background: "#333", color: "#fff", padding: "8px 14px" }}
          onClick={() => setOpenModal(true)}
        >
          ➕ Add Item to Report
        </button>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* MODAL */}
      <CreateItemModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        reportId={reportId}
      />
    </div>
  );
}
