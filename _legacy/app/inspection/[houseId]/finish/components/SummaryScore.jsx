export default function SummaryScore({ score = 100 }) {
  // --- Validación premium ---
  const cleanScore = typeof score === "number" && !isNaN(score) ? score : 0;

  // --- Selección de color al estilo Marriott ---
  const scoreColor =
    cleanScore >= 80
      ? "#2ECC71" // verde premium
      : cleanScore >= 60
        ? "#F1C40F" // amarillo dorado
        : "#E74C3C"; // rojo elegante

  return (
    <div
      style={{
        padding: 20,
        marginTop: 20,
        borderRadius: 10,
        border: "1px solid #ddd",
        background: "#fff",
        textAlign: "center",
      }}
    >
      <h3>Inspection Score</h3>

      <div
        style={{
          fontSize: 48,
          fontWeight: "700",
          marginTop: 10,
          color: scoreColor,
        }}
      >
        {cleanScore}
      </div>

      <p style={{ marginTop: 6, color: "#666", fontSize: 14 }}>
        {cleanScore >= 80
          ? "Excellent condition"
          : cleanScore >= 60
            ? "Needs attention soon"
            : "Requires urgent maintenance"}
      </p>
    </div>
  );
}
