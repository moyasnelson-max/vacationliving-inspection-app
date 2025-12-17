"use client";

export default function HealthScoreCard({ score = 0 }) {
  // Normalizamos el score (0–100)
  const safeScore = Math.min(Math.max(score, 0), 100);

  return (
    <div
      className="healthscore-card"
      style={{
        padding: "22px",
        borderRadius: "18px",
        background: "rgba(255, 255, 255, 0.22)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: "1px solid rgba(255, 255, 255, 0.35)",
        boxShadow:
          "0 4px 18px rgba(0, 0, 0, 0.08), inset 0 0 22px rgba(255, 215, 160, 0.15)",
        color: "#1e1e1e",
        textAlign: "center",
        width: "100%",
        maxWidth: "260px",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: "20px",
          fontWeight: 600,
          letterSpacing: "0.4px",
          color: "#B08F5C", // oro elegante Marriott
        }}
      >
        Health Score
      </h2>

      <p
        style={{
          marginTop: "12px",
          fontSize: "46px",
          fontWeight: 700,
          background:
            "linear-gradient(90deg, #F1D8A7 0%, #C9A669 50%, #F1D8A7 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {safeScore}%
      </p>

      <p
        style={{
          marginTop: "4px",
          fontSize: "12px",
          opacity: 0.6,
        }}
      >
        Nivel general de condición
      </p>
    </div>
  );
}
