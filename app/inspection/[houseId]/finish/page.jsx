"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase-client"
import { useRouter, useParams } from "next/navigation";

export default function FinishInspectionPage() {
  const router = useRouter();
  const { houseId } = useParams();

  const [loading, setLoading] = useState(true);
  const [openIssues, setOpenIssues] = useState([]);
  const [closedIssues, setClosedIssues] = useState([]);
  const [finalNote, setFinalNote] = useState("");
  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // ─────────────────────────────────────────────
  // 1. LOAD ALL ISSUES FOR THIS HOUSE
  // ─────────────────────────────────────────────
  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const { data, error } = await supabase
        .from("inspection_items")
        .select("*")
        .eq("house_id", houseId);

      if (error) {
        console.error("Error loading items:", error);
        setLoading(false);
        return;
      }

      setOpenIssues(data.filter((i) => i.status === "open"));
      setClosedIssues(data.filter((i) => i.status === "closed"));

      setLoading(false);
    }

    loadData();
  }, [houseId]);

  // ─────────────────────────────────────────────
  // 2. SEND REPORT → PDF + EMAILS (Edge Function)
  // ─────────────────────────────────────────────
  async function finishInspection() {
    if (sending) return;
    setSending(true);

    try {
      const { data: session } = await supabase.auth.getSession();
      const user = session?.session?.user;

      if (!user) {
        alert("Session expired, log in again.");
        router.push("/login");
        return;
      }

      const payload = {
        house_id: houseId,
        inspector_id: user.id,
        final_note: finalNote,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.session.access_token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        console.error("Send-report error:", text);
        alert("Error generating report. Check logs.");
        setSending(false);
        return;
      }

      setShowSuccess(true);
    } catch (err) {
      console.error("Finish Inspection error:", err);
      alert("Error sending report.");
    }

    setSending(false);
  }

  // ─────────────────────────────────────────────
  // LOADING STATE
  // ─────────────────────────────────────────────
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <p style={styles.loadingText}>Loading inspection summary...</p>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // SUCCESS SCREEN
  // ─────────────────────────────────────────────
  if (showSuccess) {
    return (
      <div style={styles.successContainer}>
        <div style={styles.successCard}>
          <h2 style={styles.successTitle}>Inspection Completed</h2>
          <p style={styles.successText}>
            Your report has been generated and sent to the team.
          </p>

          <button
            style={styles.returnButton}
            onClick={() => router.push("/inspection")}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // MAIN PAGE
  // ─────────────────────────────────────────────
  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>Finish Inspection</h1>

      {/* OPEN ISSUES */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Open Issues</h2>
        {openIssues.length === 0 ? (
          <p style={styles.empty}>No open issues 🎉</p>
        ) : (
          openIssues.map((item) => (
            <div key={item.id} style={styles.issueCardOpen}>
              <p style={styles.issueTitle}>{item.category_name}</p>
              <p style={styles.issueNote}>{item.note}</p>
            </div>
          ))
        )}
      </section>

      {/* CLOSED ISSUES */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Closed Issues</h2>
        {closedIssues.length === 0 ? (
          <p style={styles.empty}>None closed yet</p>
        ) : (
          closedIssues.map((item) => (
            <div key={item.id} style={styles.issueCardClosed}>
              <p style={styles.issueTitle}>{item.category_name}</p>
              <p style={styles.issueNote}>{item.note}</p>
            </div>
          ))
        )}
      </section>

      {/* FINAL NOTE */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Final Note (Optional)</h2>
        <textarea
          style={styles.textarea}
          placeholder="Write any final notes for this inspection..."
          value={finalNote}
          onChange={(e) => setFinalNote(e.target.value)}
        ></textarea>
      </section>

      {/* FINISH BUTTON */}
      <button
        style={styles.finishButton}
        disabled={sending}
        onClick={finishInspection}
      >
        {sending ? "Sending Report..." : "Finish Inspection & Send Report"}
      </button>
    </div>
  );
}

//
// ─────────────────────────────────────────────
// STYLES — Marriott Beige Gold Luxury
// ─────────────────────────────────────────────
//
const styles = {
  wrapper: {
    padding: "24px",
    maxWidth: "650px",
    margin: "0 auto",
    fontFamily: "Inter, sans-serif",
  },
  title: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#1A1A1A",
  },
  section: {
    marginBottom: "32px",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#C2A878",
  },
  empty: {
    color: "#777",
    fontStyle: "italic",
  },

  issueCardOpen: {
    background: "#FFF2E5",
    border: "1px solid #EBC8A3",
    padding: "14px",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  issueCardClosed: {
    background: "#E9FFE7",
    border: "1px solid #A6D8A8",
    padding: "14px",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  issueTitle: {
    fontSize: "16px",
    fontWeight: "600",
  },
  issueNote: {
    color: "#444",
    marginTop: "4px",
  },

  textarea: {
    width: "100%",
    height: "110px",
    padding: "12px",
    fontSize: "15px",
    borderRadius: "10px",
    border: "1px solid #D5D5D5",
    resize: "none",
  },

  finishButton: {
    width: "100%",
    padding: "16px",
    background: "#C2A878",
    borderRadius: "10px",
    border: "none",
    color: "white",
    fontSize: "17px",
    fontWeight: "600",
    cursor: "pointer",
  },

  loadingContainer: {
    padding: "40px",
    textAlign: "center",
  },
  loadingText: {
    color: "#999",
    fontSize: "16px",
  },

  successContainer: {
    padding: "40px",
    textAlign: "center",
  },
  successCard: {
    background: "white",
    padding: "32px",
    borderRadius: "14px",
    border: "1px solid #E5DCC5",
  },
  successTitle: {
    fontSize: "26px",
    color: "#C2A878",
    marginBottom: "10px",
  },
  successText: {
    color: "#555",
    marginBottom: "25px",
  },
  returnButton: {
    background: "#C2A878",
    padding: "14px 22px",
    color: "white",
    borderRadius: "10px",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
  },
};
