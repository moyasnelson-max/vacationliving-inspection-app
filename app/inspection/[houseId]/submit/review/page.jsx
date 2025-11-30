import "../../../../styles/luxury-inspection.css";
"use client";
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
      alert("Please attach at least one repair photo before closing this issue.");
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
  })
  .eq("id", selectedIssue.id);}
