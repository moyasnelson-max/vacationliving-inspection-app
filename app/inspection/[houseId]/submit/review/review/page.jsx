import "../../../../styles/luxury-inspection.css";
"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default function ReviewPage({ params }) {
  const houseId = params.houseId;
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [repairNote, setRepairNote] = useState("");
  const [repairPhotos, setRepairPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  // ============================================================
  // Load all open issues of that house
  // ============================================================
  useEffect(() => {
    const loadIssues = async () => {
      const { data, error } = await supabase
        .from("issues")
        .select("*")
        .eq("house_id", houseId)
        .eq("status", "open")
        .order("created_at", { ascending: false });

      if (!error) setIssues(data);
    };
    loadIssues();
  }, [houseId]);

  // ============================================================
  // Upload repair photos
  // ============================================================
  const uploadRepairPhotos = async (issueId) => {
    const uploaded = [];

    for (let i = 0; i < repairPhotos.length; i++) {
      const file = repairPhotos[i];
      const ext = file.name.split(".").pop();
      const fileName = `${issueId}/repair_${Date.now()}_${i}.${ext}`;

      const { data, error } = await supabase.storage
        .from("issue-media")
        .upload(fileName, file);

      if (!error) {
        uploaded.push(fileName);
      }
    }
    return uploaded;
  };

  // ============================================================
  // Close issue
  // ============================================================
  const closeIssue = async () => {
    if (!selectedIssue) return;

    if (repairNote.trim().length < 3) {
      alert("Please write a repair note before closing this issue.");
      return;
    }

    if (repairPhotos.length < 1) {
      alert(
        "Please attach at least one repair photo before closing this issue.",
      );
      return;
    }

    if (!confirm("Are you sure you want to close this issue?")) return;

    setLoading(true);

    // 1. Upload repair photos
    const uploadedFiles = await uploadRepairPhotos(selectedIssue.id);

    // 2. Update issue
    await supabase
      .from("issues")
      .update({
        status: "closed",
        repair_note: repairNote,
        repair_photos: uploadedFiles,
        repair_date: new Date().toISOString(),
      })
      .eq("id", selectedIssue.id);

    // 3. Reset states
    setSelectedIssue(null);
    setRepairNote("");
    setRepairPhotos([]);

    // 4. Reload issues
    const { data } = await supabase
      .from("issues")
      .select("*")
      .eq("house_id", houseId)
      .eq("status", "open")
      .order("created_at", { ascending: false });

    setIssues(data);
    setLoading(false);

    alert("Issue closed successfully.");
  };

  // ============================================================
  // UI
  // ============================================================
  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Review & Close Issues</h1>

      {/* LIST OF ISSUES */}
      {!selectedIssue && (
        <div>
          <h2 style={styles.subtitle}>Open Issues</h2>

          {issues.length === 0 && (
            <p style={styles.empty}>No open issues for this property.</p>
          )}

          {issues.map((issue) => (
            <div
              key={issue.id}
              style={styles.issueCard}
              onClick={() => setSelectedIssue(issue)}
            >
              <div style={styles.cardTitle}>Issue #{issue.id}</div>
              <div style={styles.cardSub}>{issue.note}</div>
            </div>
          ))}
        </div>
      )}

      {/* SELECTED ISSUE DETAIL */}
      {selectedIssue && (
        <div style={styles.detailBox}>
          <button style={styles.backBtn} onClick={() => setSelectedIssue(null)}>
            ← Back to Issues
          </button>

          <h2 style={styles.subtitle}>Issue #{selectedIssue.id}</h2>

          <p style={styles.label}>Original Note:</p>
          <p style={styles.box}>{selectedIssue.note}</p>

          {/* ORIGINAL PHOTOS */}
          <p style={styles.label}>Original Photos:</p>
          <div style={styles.photoGrid}>
            {selectedIssue.photos?.map((p, i) => (
              <img
                key={i}
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/issue-media/${p}`}
                style={styles.photo}
              />
            ))}
          </div>

          {/* REPAIR NOTE */}
          <p style={styles.label}>Repair Note:</p>
          <textarea
            style={styles.textarea}
            placeholder="Explain what was fixed..."
            value={repairNote}
            onChange={(e) => setRepairNote(e.target.value)}
          />

          {/* REPAIR PHOTOS */}
          <p style={styles.label}>Repair Photos (1–3):</p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              if (e.target.files.length > 3) {
                alert("Maximum 3 photos.");
                return;
              }
              setRepairPhotos([...e.target.files]);
            }}
          />

          <button
            style={styles.closeBtn}
            onClick={closeIssue}
            disabled={loading}
          >
            {loading ? "Closing..." : "Close Issue"}
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// STYLES – Marriott Premium Beige Gold
// ============================================================
const styles = {
  page: {
    background: "#f4efe6",
    minHeight: "100vh",
    padding: "30px",
    fontFamily: "Inter, sans-serif",
  },
  title: {
    fontSize: "30px",
    fontWeight: "700",
    color: "#3d3325",
    marginBottom: "20px",
  },
  subtitle: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#4a3e2b",
    marginTop: "20px",
    marginBottom: "10px",
  },
  empty: { padding: 20, fontSize: 16, opacity: 0.6 },
  issueCard: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    marginBottom: "10px",
    cursor: "pointer",
  },
  cardTitle: { fontSize: "18px", fontWeight: "600" },
  cardSub: { opacity: 0.7, marginTop: 4 },
  detailBox: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 5px 16px rgba(0,0,0,0.1)",
  },
  label: { fontWeight: 600, marginTop: 20 },
  box: {
    background: "#f7f3ec",
    padding: "12px",
    borderRadius: "8px",
    lineHeight: 1.5,
  },
  textarea: {
    width: "100%",
    height: "100px",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    background: "#fdfbf7",
  },
  photoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
  },
  photo: {
    width: "100%",
    borderRadius: 8,
    objectFit: "cover",
  },
  closeBtn: {
    marginTop: 25,
    width: "100%",
    padding: "14px",
    background: "#b89b67",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "18px",
    fontWeight: 700,
    cursor: "pointer",
  },
  backBtn: {
    background: "transparent",
    border: "none",
    color: "#6b5a43",
    fontSize: "16px",
    marginBottom: 20,
    cursor: "pointer",
  },
};
