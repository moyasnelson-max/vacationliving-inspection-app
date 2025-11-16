"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../../lib/supabaseClient";
import CreateItemModal from "../../../components/CreateItemModal";

// ---------- Luxury Styles ----------
const styles = {
  container: {
    maxWidth: "540px",
    margin: "0 auto",
    padding: "32px",
    fontFamily: "Inter, sans-serif",
    color: "#1A1A1A",
  },
  card: {
    background: "#FFFFFF",
    padding: "24px",
    borderRadius: "14px",
    boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
    border: "1px solid #F2EFE8",
  },
  title: {
    fontSize: "26px",
    fontWeight: "600",
    marginBottom: "20px",
    letterSpacing: "-0.5px",
    fontFamily: "Playfair Display, serif",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "6px",
    marginTop: "18px",
    color: "#444",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #D8D5CC",
    background: "#FAF9F7",
    outline: "none",
    fontSize: "15px",
    transition: "0.2s",
  },
  textarea: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #D8D5CC",
    background: "#FAF9F7",
    outline: "none",
    resize: "none",
    fontSize: "15px",
    transition: "0.2s",
  },
  buttonGold: {
    width: "100%",
    marginTop: "26px",
    padding: "14px 0",
    background: "linear-gradient(135deg, #C8A36D, #b48a54)",
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    transition: "0.2s",
  },
  addItemButton: {
    width: "100%",
    padding: "12px 0",
    borderRadius: "12px",
    marginTop: "14px",
    background: "#FFFFFF",
    border: "1px solid #C8A36D",
    color: "#C8A36D",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
  },
  error: {
    color: "#B00020",
    marginBottom: "12px",
    fontWeight: "500",
  },
};

export default function NewReportPage() {
  const router = useRouter();

  // MAIN REPORT STATES
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState(null);
  const [reportId, setReportId] = useState(null);

  // MODAL STATE
  const [openModal, setOpenModal] = useState(false);

  // ERROR + LOADING
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  //-------------------------------
  // CREATE MAIN REPORT
  //-------------------------------

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

  //-------------------------------
  // IMAGE UPLOAD
  //-------------------------------

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

  //-------------------------------
  // FINAL SUBMIT
  //-------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const id = await createMainReportIfNeeded();
      const imageUrl = await uploadImage(image, id);

      const { error: updateError } = await supabase
        .from("reports")
        .update({
          category,
          subcategory,
          notes,
          image_url: imageUrl,
        })
        .eq("id", id);

      if (updateError) throw updateError;

      router.push("/reports");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Create New Report</h1>

      <div style={styles.card}>
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* CATEGORY */}
          <label style={styles.label}>Category</label>
          <select
            style={styles.input}
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
          <label style={styles.label}>Subcategory</label>
          <input
            type="text"
            placeholder="Describe subcategory"
            style={styles.input}
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            required
          />

          {/* NOTES */}
          <label style={styles.label}>Notes</label>
          <textarea
            placeholder="Add detailed notes..."
            style={styles.textarea}
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          {/* IMAGE */}
          <label style={styles.label}>Image</label>
          <input
            style={styles.input}
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          {/* ADD ITEM BUTTON */}
          <button
            type="button"
            style={styles.addItemButton}
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
            style={styles.buttonGold}
          >
            {loading ? "Saving..." : "Save Report"}
          </button>
        </form>
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
