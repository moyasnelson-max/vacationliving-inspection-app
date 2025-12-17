"use client";

export default function SubmitSuccessPage() {
  return (
    <div
      style={{
        padding: 30,
        textAlign: "center",
        borderRadius: 12,
        background: "#ffffff",
        border: "1px solid #ddd",
        marginTop: 40,
      }}
    >
      <h2
        style={{
          fontSize: 28,
          marginBottom: 10,
          color: "#C8A36D",
          fontWeight: 600,
        }}
      >
        Inspection Submitted
      </h2>

      <p style={{ color: "#555", fontSize: 16 }}>
        Your inspection has been successfully submitted.
      </p>

      <a
        href="/dashboard"
        style={{
          display: "inline-block",
          marginTop: 25,
          padding: "12px 28px",
          background: "#C8A36D",
          color: "#fff",
          borderRadius: 8,
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: 16,
        }}
      >
        Return to Dashboard
      </a>
    </div>
  );
}
