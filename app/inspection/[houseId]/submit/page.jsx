import "../../../../styles/luxury-inspection.css";
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import "./submit.css";

export default function SubmitIssue() {
  const { houseId } = useParams();
  const router = useRouter();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  const [categories, setCategories] = useState([]);
  const [subcats, setSubcats] = useState([]);

  const [step, setStep] = useState("category");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcat, setSelectedSubcat] = useState(null);

  const [notes, setNotes] = useState("");
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [openIssues, setOpenIssues] = useState([]);

  /* ============================================================
     LOAD CATEGORIES & OPEN ISSUES
  ============================================================ */
  useEffect(() => {
    loadCategories();
    loadOpenIssues();
  }, []);

  async function loadCategories() {
    const { data, error } = await supabase.from("categories_v2").select("*");

    if (!error && data) {
      setCategories(data);
    }
  }

  async function loadSubcategories(catId) {
    const { data, error } = await supabase
      .from("subcategories_v2")
      .select("*")
      .eq("category_id", catId);

    if (!error && data) {
      setSubcats(data);
    }
  }

  async function loadOpenIssues() {
    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .eq("house_id", houseId)
      .eq("status", "open");

    if (!error && data) {
      setOpenIssues(data);
    }
  }

  /* ============================================================
     NAVIGATION
  ============================================================ */

  function chooseCategory(cat) {
    setSelectedCategory(cat);
    loadSubcategories(cat.id);
    setStep("subcategory");
  }

  function chooseSubcat(sub) {
    setSelectedSubcat(sub);
    setStep("details");
  }

  /* ============================================================
     IMAGE UPLOAD
  ============================================================ */

  function handleImageSelect(e) {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 3) {
      alert("Máximo 3 fotos");
      return;
    }
    setImages([...images, ...files]);
  }

  async function uploadImages(issueId) {
    const uploaded = [];

    for (const img of images) {
      const filename = `${houseId}/${issueId}/${Date.now()}-${img.name}`;
      const { error } = await supabase.storage
        .from("issue-media")
        .upload(filename, img);

      if (!error) {
        uploaded.push(filename);
      }
    }

    return uploaded;
  }

  /* ============================================================
     SAVE ISSUE
  ============================================================ */

  async function submitIssue() {
    if (!notes.trim()) {
      alert("La nota es obligatoria");
      return;
    }
    if (images.length === 0) {
      alert("Debe subir al menos una foto");
      return;
    }

    setUploading(true);

    // 1. Crear issue
    const { data: issue, error: issueError } = await supabase
      .from("issues")
      .insert({
        house_id: houseId,
        category_id: selectedCategory.id,
        subcategory_id: selectedSubcat.id,
        notes,
        status: "open",
      })
      .select()
      .single();

    if (issueError) {
      alert("Error guardando issue");
      setUploading(false);
      return;
    }

    // 2. Subir fotos
    const uploadedPaths = await uploadImages(issue.id);

    // 3. Guardar fotos en tabla media
    for (const p of uploadedPaths) {
      await supabase.from("media").insert({
        issue_id: issue.id,
        path: p,
      });
    }

    // 4. Reset
    setNotes("");
    setImages([]);
    setSelectedCategory(null);
    setSelectedSubcat(null);

    setStep("category");

    await loadOpenIssues();

    setUploading(false);

    alert("Issue creado correctamente");
  }

  /* ============================================================
     VIEW
  ============================================================ */

  return (
    <div className="submit-container fade-in">
      {/* STEP 1: CATEGORY */}
      {step === "category" && (
        <>
          <h2 className="section-title">Selecciona la categoría</h2>

          {categories.length === 0 && <p>No hay categorías configuradas.</p>}

          {categories.map((cat) => (
            <div
              key={cat.id}
              className="category-box"
              onClick={() => chooseCategory(cat)}
            >
              <div className="category-left">{cat.name_es || cat.name_en}</div>
              <div>➜</div>
            </div>
          ))}

          {/* OPEN ISSUES LIST */}
          {openIssues.length > 0 && (
            <div className="review-card">
              <div className="review-title">Issues abiertos</div>

              {openIssues.map((iss) => (
                <div key={iss.id} className="review-item">
                  • #{iss.id} – {iss.notes.slice(0, 40)}...
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* STEP 2: SUBCATEGORY */}
      {step === "subcategory" && (
        <>
          <h2 className="section-title">
            {selectedCategory.name_es || selectedCategory.name_en}
          </h2>

          {subcats.map((sub) => (
            <div
              key={sub.id}
              className="subcategory-box"
              onClick={() => chooseSubcat(sub)}
            >
              <div>{sub.name_es || sub.name_en}</div>
              <div>➜</div>
            </div>
          ))}
        </>
      )}

      {/* STEP 3: DETAILS */}
      {step === "details" && (
        <>
          <h2 className="section-title">Describe el problema</h2>

          <textarea
            className="textarea-notes"
            placeholder="Escribe una nota detallada..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          {/* Upload */}
          <div className="upload-box">
            <div className="upload-text">Subir fotos (máx 3)</div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
            />
          </div>

          {/* Preview */}
          <div className="preview-wrapper">
            {images.map((img, i) => (
              <img
                key={i}
                src={URL.createObjectURL(img)}
                className="preview-img"
              />
            ))}
          </div>

          {/* Submit */}
          <button
            className={`primary-btn ${uploading ? "disabled-btn" : ""}`}
            onClick={submitIssue}
            disabled={uploading}
          >
            {uploading ? "Guardando..." : "Crear Issue"}
          </button>
        </>
      )}
    </div>
  );
}
