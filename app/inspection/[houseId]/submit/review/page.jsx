"use client";

import "@/styles/luxury-inspection.css";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ReviewPage({ params }) {
  const houseId = params.houseId;

  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [repairNote, setRepairNote] = useState("");
  const [repairPhotos, setRepairPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  // ======================================================
  // Load open issues of that house
  // ======================================================
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

  // ======================================================
  // Upload repair photos to Supabase Storage
  // ======================================================
  const uploadRepairPhotos = async (issueId) => {
    const uploaded = [];

    for (let i = 0; i < repairPhotos.length; i++) {
      const file = repairPhotos[i];
      const ext = file.name.split(".").pop();
      const fileName = `repair_${issueId}_${Date.now()}_${i}.${ext}`;

      const { error } = await supabase.storage
        .from("issue-media")
        .upload(fileName, file);

      if (!error) uploaded.push(fileName);
    }

    return uploaded;
  };

  // ======================================================
  // Close issue
  // ======================================================
  const closeIssue = async () => {
    if (!selectedIssue) return;

    if (repairNote.trim().length < 3) {
      alert("Please write a repair note before closing this issue.");
      return;
    }

    if (repairPhotos.length < 1) {
      alert("Please attach at least one repair photo before closing this issue.");
      return;
    }

    if (!confirm("Are you sure you want to close this issue?")) return;

    setLoading(true);

    // 1. Upload photos
    const uploadedFiles = await uploadRepairPhotos(selectedIssue.id);

    // 2. Update issue
    const { error } = await supabase
      .from("issues")
      .update({
        status: "closed",
        repair_note: repairNote,
        repair_photos: uploadedFiles,
      })
      .eq("id", selectedIssue.id);

    setLoading(false);

    if (!error) {
      alert("Issue closed successfully.");
      window.location.reload();
    } else {
      alert("Error closing the issue.");
    }
  };

  // ======================================================
  // UI
  // ======================================================
  return (
    <div className="review-wrapper">
      <h1 className="review-title">Review & Close Issue</h1>

      {/* Issue selector */}
      <div className="review-section">
        <h2>Select an Issue</h2>
        <select
          value={selectedIssue?.id || ""}
          onChange={(e) => {
            const issue = issues.find((i) => i.id === Number(e.target.value));
            setSelectedIssue(issue);
          }}
        >
          <option value="">Select...</option>
          {issues.map((issue) => (
            <option key={issue.id} value={issue.id}>
              {issue.title}
            </option>
          ))}
        </select>
      </div>

      {/* Repair note */}
      <div className="review-section">
        <h2>Repair Note</h2>
        <textarea
          className="repair-note-box"
          value={repairNote}
          onChange={(e) => setRepairNote(e.target.value)}
          placeholder="Describe the repair done..."
        />
      </div>

      {/* Repair photos */}
      <div className="review-section">
        <h2>Repair Photos</h2>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setRepairPhotos(Array.from(e.target.files))}
        />
      </div>

      <button
        onClick={closeIssue}
        disabled={loading}
        className="submit-button"
      >
        {loading ? "Closing..." : "Close Issue"}
      </button>
    </div>
  );
}