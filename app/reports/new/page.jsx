"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../../lib/supabaseClient";
import CreateItemModal from "@/Components/CreateItemModal.jsx";

// ---------- GLASS + LUXURY STYLE ----------
const ui = {
  page: {
    minHeight: "100vh",
    padding: "28px",
    background: "linear-gradient(145deg,#F7F3EC,#EFE8DD)",
    fontFamily: "Inter, sans-serif",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "8px",
    fontFamily: "Playfair Display, serif",
    color: "#2A2A2A",
  },
  subtitle: {
    fontSize: "15px",
    color: "#6D6D6D",
    marginBottom: "24px",
  },
  card: {
    background: "rgba(255,255,255,0.55)",
    padding: "24px",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.4)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    boxShadow: "0 8px 26px rgba(0,0,0,0.07)",
  },
  label: {
    fontSize: "14px",
    fontWeight: 600,
    marginTop: "18px",
    marginBottom: "6px",
    color: "#444",
  },
  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #D8D5CC",
    background: "#FAF9F7",
    fontSize: "15px",
    outline: "none",
    transition: "0.2s",
  },
  textarea: {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #D8D5CC",
    background: "#FAF9F7",
    fontSize: "15px",
    resize: "none",
    outline: "none",
  },
  submitBtn: {
    width: "100%",
    padding: "16px 0",
    marginTop: "26px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg,#C8A36D,#b48a54)",
    boxShadow: "0 8px 26px rgba(0,0,0,0.08)",
    color: "#fff",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
  },
  addBtn: {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    marginTop: "14px",
    background: "rgba(255,255,255,0.55)",
    border: "1px solid #C8A36D",
    color: "#C8A36D",
    fontWeight: 600,
    cursor: "pointer",
  },
  error: {
    color: "#B00020",
    fontWeight: 600,
    marginBottom: "12px",
  },

  // FLOATING BUTTON
  float: {
    position: "fixed",
    bottom: "22px",
    right: "22px",
    width: "60px",
    height: "60px",
    background: "rgba(255,255,255,0.55)",
    borderRadius: "18px",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "30px",
    fontWeight: 700,
    color: "#C8A36D",
    cursor: "pointer",
    boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
    zIndex: 999,
  },
};

export default function NewReportPage() {
  const router = useRouter();

  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState(null);
  const [reportId, setReportId] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  // -----------------------------
  // CREATE REPORT (MAIN ENTRY)
  // -----------------------------
  const createMainReportIfNeeded = async () => {
    if (reportId) return reportId;

    const { data, error } = await supabase
      .from("reports")
      .insert([{ status: "open" }])
      .select()
      .single();

    if (error) {
      setError(error.message);
      throw new Error(error.message);
    }

    setReportId(data.id);
    return data.id;
  };

  // -----------------------------
  // UPLOAD IMAGE
  // -----------------------------
  const uploadImage = async (file, id) => {
    if (!file) return null;

    const filename = `${id}_${Date.now()}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("reports")
      .upload(filename, file);

    if (uploadError) {
      setError(uploadError.message);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("reports")
      .getPublicUrl(filename);

    return urlData.publicUrl;
  };

  // -----------------------------
  // SUBMIT FINAL REPORT
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const id = await createMainReportIfNeeded();
      const imgUrl = await uploadImage(image, id);

      const { error: updateError } = await supabase
        .from("reports")
        .update({
          category,
          subcategory,
          notes,
          image_url: imgUrl,
        })
        .eq("id", id);

      if (updateError) throw updateError;

      router.push("/reports");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div style={ui.page}>
      <h1 style={ui.title}>New Report</h1>
      <p style={ui.subtitle}>Create a new inspection report.</p>

      <div style={ui.card}>
        {error && <p style={ui.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* CATEGORY */}
          <label style={ui.label}>Category</label>
          <select
            style={ui.input}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select...</option>
            <option value="Interior">Interior</option>
            <option value="Exterior">Exterior</option>
            <option value="Safety">Safety</option>
            <option value="Cleaning">Cleaning</option>
          </select>

          {/* SUBCATEGORY */}
          <label style={ui.label}>Subcategory</label>
          <input
            type="text"
            placeholder="Describe subcategory"
            style={ui.input}
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            required
          />

          {/* NOTES */}
          <label style={ui.label}>Notes</label>
          <textarea
            placeholder="Add detailed notes..."
            style={ui.textarea}
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          {/* IMAGE */}
          <label style={ui.label}>Image</label>
          <input
            type="file"
            accept="image/*"
            style={ui.input}
            onChange={(e) => setImage(e.target.files[0])}
          />

          {/* ADD ITEM BUTTON */}
          <button
            type="button"
            style={ui.addBtn}
            onClick={async () => {
              const id = await createMainReportIfNeeded();
              setReportId(id);
              setOpenModal(true);
            }}
          >
            + Add Item
          </button>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            style={ui.submitBtn}
          >
            {loading ? "Saving..." : "Save Report"}
          </button>
        </form>
      </div>

      {/* FLOATING BUTTON */}
      <div style={ui.float} onClick={() => setOpenModal(true)}>
        +
      </div>

      {/* MODAL */}
      <CreateItemModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        reportId={reportId}
      />
    </div>
  );
}
