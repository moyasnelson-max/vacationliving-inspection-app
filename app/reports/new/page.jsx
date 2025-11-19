"use client";

import { useState } from "react";
import supabase from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function NewReport() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  const createReport = async () => {
    const { data, error } = await supabase
      .from("reports")
      .insert([{ status: "open", category, subcategory, notes }])
      .select()
      .single();

    if (error) throw error;
    return data.id;
  };

  const uploadImage = async (file, id) => {
    if (!file) return null;

    const filename = `${id}_${Date.now()}.jpg`;
    const { error } = await supabase
      .storage
      .from("reports")
      .upload(filename, file);

    if (error) throw error;

    const { data } = supabase
      .storage
      .from("reports")
      .getPublicUrl(filename);

    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const id = await createReport();
      const imageUrl = await uploadImage(image, id);

      await supabase
        .from("reports")
        .update({ image_url: imageUrl })
        .eq("id", id);

      router.push(`/reports/${id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="glass-nav">
        <button onClick={() => router.back()}>←</button>
        New Report
      </div>

      <div className="glass-page">

        {error && (
          <div className="glass-card" style={{ color: "red" }}>
            {error}
          </div>
        )}

        <div className="glass-card">

          <form onSubmit={handleSubmit}>

            <label>Category</label>
            <select
              className="glass-input"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "14px",
                border: "1px solid #ddd"
              }}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="Interior">Interior</option>
              <option value="Exterior">Exterior</option>
              <option value="Safety">Safety</option>
              <option value="Cleaning">Cleaning</option>
            </select>

            <label style={{ marginTop: 12 }}>Subcategory</label>
            <input
              type="text"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "14px",
                border: "1px solid #ddd"
              }}
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              required
            />

            <label style={{ marginTop: 12 }}>Notes</label>
            <textarea
              rows={4}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "14px",
                border: "1px solid #ddd"
              }}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <label style={{ marginTop: 12 }}>Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "14px",
                marginTop: "20px",
                background: "linear-gradient(135deg,#c8a36d,#b48a54)",
                border: "none",
                color: "#fff",
                fontSize: "17px",
                fontWeight: "600"
              }}
            >
              Save Report
            </button>

          </form>
        </div>

      </div>
    </>
  );
}
