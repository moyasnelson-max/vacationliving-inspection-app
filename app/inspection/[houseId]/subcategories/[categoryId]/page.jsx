"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../@lib/supabase-client";
import "./styles.css";

export default function SubcategoriesPage({ params }) {
  const router = useRouter();
  const { houseId, categoryId } = params;

  const [lang, setLang] = useState("en");
  const [categoryName, setCategoryName] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSub, setSelectedSub] = useState(null);
  const [note, setNote] = useState("");
  const [photos, setPhotos] = useState([]);

  const MAX_PHOTOS = 3;

  // ==========================
  // LOAD CATEGORY + SUBCATEGORIES
  // ==========================
  useEffect(() => {
    const fetchData = async () => {
      const { data: cat } = await supabase
        .from("categories_v2")
        .select("*")
        .eq("id", categoryId)
        .single();

      if (cat) {
        setCategoryName(lang === "es" ? cat.name_es : cat.name_en);
      }

      const { data: subs } = await supabase
        .from("subcategories_v2")
        .select("*")
        .eq("category_id", categoryId);

      setSubcategories(subs || []);
    };

    fetchData();
  }, [categoryId, lang]);

  // ==========================
  // HANDLE PHOTO UPLOAD
  // ==========================
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (photos.length >= MAX_PHOTOS) {
      alert("Max 3 photos allowed.");
      return;
    }

    const filePath = `issue-media/${houseId}/${categoryId}/${selectedSub}/${crypto.randomUUID()}.jpg`;

    const { error, data } = await supabase.storage
      .from("issue-media")
      .upload(filePath, file);

    if (error) {
      console.log(error);
      alert("Error uploading photo.");
      return;
    }

    setPhotos([...photos, filePath]);
  };

  // ==========================
  // CREATE ISSUE REPORT
  // ==========================
  const createReport = async () => {
    if (!selectedSub) return alert("Select a subcategory.");
    if (!note.trim()) return alert("Write a note.");
    if (photos.length === 0) return alert("Upload at least 1 photo.");

    const { error } = await supabase.from("issues_v3").insert({
      house_id: houseId,
      category_id: categoryId,
      subcategory_id: selectedSub,
      note,
      photos,
      status: "open",
      created_at: new Date(),
    });

    if (error) {
      console.log(error);
      alert("Error creating report.");
      return;
    }

    alert("Report created successfully.");
    router.push(`/inspection/${houseId}/categories`);
  };

  return (
    <div className="lux-wrapper">

      {/* Header */}
      <div className="lux-header">
        <h2 className="lux-title">
          {lang === "es" ? "Subcategorías" : "Subcategories"} — {categoryName}
        </h2>

        <button
          className="lang-toggle"
          onClick={() => setLang(lang === "es" ? "en" : "es")}
        >
          {lang === "es" ? "EN" : "ES"}
        </button>
      </div>

      {/* LIST OF SUBCATEGORIES */}
      {!selectedSub ? (
        <div className="lux-list">
          {subcategories.map((s) => (
            <div
              key={s.id}
              className="lux-item"
              onClick={() => setSelectedSub(s.id)}
            >
              <span>{lang === "es" ? s.name_es : s.name_en}</span>
              <i className="lux-arrow"></i>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="lux-section">
            <label className="lux-label">
              {lang === "es" ? "Nota del inspector" : "Inspector note"}
            </label>

            <textarea
              className="lux-textarea"
              placeholder={
                lang === "es"
                  ? "Describe el problema…"
                  : "Describe the issue…"
              }
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>

          {/* PHOTO UPLOAD */}
          <div className="lux-section">
            <label className="lux-label">
              {lang === "es" ? "Sube fotos (máx 3)" : "Upload photos (max 3)"}
            </label>

            <input type="file" onChange={handlePhotoUpload} />

            <div className="lux-photos-preview">
              {photos.map((p) => (
                <div key={p} className="lux-photo-box">
                  <span>{p.split("/").pop()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CREATE REPORT BUTTON */}
          <button className="lux-button" onClick={createReport}>
            {lang === "es" ? "Crear Reporte" : "Create Report"}
          </button>

          {/* BACK BUTTON */}
          <button
            className="lux-button-secondary"
            onClick={() => setSelectedSub(null)}
          >
            {lang === "es" ? "Volver" : "Back"}
          </button>
        </>
      )}
    </div>
  );
}
