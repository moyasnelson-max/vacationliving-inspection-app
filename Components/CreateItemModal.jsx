"use client";

import { useState, useEffect } from "react";
import supabase from "../app/lib/supabaseClient";

// =========================
// 🔥 GLASS UI STYLES
// =========================
const glass = {
  overlay: {
    position: "fixed",
    inset: 0,
    backdropFilter: "blur(14px)",
    background: "rgba(255,255,255,0.12)",
    zIndex: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  modal: {
    width: "100%",
    maxWidth: "420px",
    background: "rgba(255,255,255,0.25)",
    backdropFilter: "blur(18px)",
    borderRadius: "20px",
    padding: "28px",
    border: "1px solid rgba(255,255,255,0.35)",
    boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
    animation: "fadeIn 0.25s ease-out",
  },
  title: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#1A1A1A",
    fontFamily: "Inter, sans-serif",
  },
  label: {
    display: "block",
    marginTop: "14px",
    marginBottom: "6px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#333",
  },
  select: {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #DDD",
    background: "rgba(255,255,255,0.6)",
    fontSize: "15px",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #DDD",
    background: "rgba(255,255,255,0.6)",
    fontSize: "15px",
    resize: "none",
  },
  file: {
    marginTop: "8px",
  },
  buttonPrimary: {
    marginTop: "24px",
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg,#C8A36D,#AD8A56)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
  },
  close: {
    marginTop: "12px",
    width: "100%",
    padding: "12px",
    background: "rgba(255,255,255,0.5)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    border: "1px solid #DDD",
    cursor: "pointer",
    fontWeight: "500",
  },
  error: {
    marginTop: "10px",
    color: "#B00020",
    fontSize: "13px",
    textAlign: "center",
  },
};

// ======================
// COMPONENT
// ======================

export default function CreateItemModal({ open, onClose, reportId }) {
  if (!open) return null;

  const [categoryList, setCategoryList] = useState([]);
  const [subcategoryList, setSubcategoryList] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [notes, setNotes] = useState("");
  const [severity, setSeverity] = useState("ok");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  // LOAD CATEGORIES
  useEffect(() => {
    if (open) loadCategories();
  }, [open]);

  const loadCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*");
    if (!error) setCategoryList(data);
  };

  const loadSubcategories = async (id) => {
    const { data, error } = await supabase
      .from("subcategories")
      .select("*")
      .eq("category_id", id);

    if (!error) setSubcategoryList(data);
  };

  const uploadImage = async () => {
    if (!image) return null;

    const filename = `${reportId}_${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from("reports")
      .upload(filename, image);

    if (uploadError) return null;

    const { data } = supabase.storage
      .from("reports")
      .getPublicUrl(filename);

    return data.publicUrl;
  };

  const save = async () => {
    setError("");

    if (!categoryId || !subcategoryId) {
      setError("Select category and subcategory.");
      return;
    }

    const imageUrl = await uploadImage();

    const { error } = await supabase.from("report_items").insert([
      {
        report_id: reportId,
        category_id: categoryId,
        subcategory_id: subcategoryId,
        severity,
        notes,
        image_url: imageUrl,
      },
    ]);

    if (error) {
      setError(error.message);
      return;
    }

    onClose();
  };

  return (
    <div style={glass.overlay}>
      <div style={glass.modal}>
        <h2 style={glass.title}>Add Item</h2>

        {error && <p style={glass.error}>{error}</p>}

        {/* CATEGORY */}
        <label style={glass.label}>Category</label>
        <select
          style={glass.select}
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            loadSubcategories(e.target.value);
          }}
        >
          <option value="">Select...</option>
          {categoryList.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* SUBCATEGORY */}
        <label style={glass.label}>Subcategory</label>
        <select
          style={glass.select}
          value={subcategoryId}
          onChange={(e) => setSubcategoryId(e.target.value)}
        >
          <option value="">Select...</option>
          {subcategoryList.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        {/* SEVERITY */}
        <label style={glass.label}>Status</label>
        <select
          style={glass.select}
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
        >
          <option value="ok">OK</option>
          <option value="attention">Needs Attention</option>
          <option value="urgent">Urgent</option>
        </select>

        {/* NOTES */}
        <label style={glass.label}>Notes</label>
        <textarea
          rows="4"
          style={glass.textarea}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        ></textarea>

        {/* IMAGE UPLOAD */}
        <label style={glass.label}>Photo</label>
        <input
          type="file"
          accept="image/*"
          style={glass.file}
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button style={glass.buttonPrimary} onClick={save}>
          Save Item
        </button>

        <button style={glass.close} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
