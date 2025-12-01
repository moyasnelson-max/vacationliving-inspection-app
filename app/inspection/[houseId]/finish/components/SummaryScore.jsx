export default function SummaryScore({ score = 100 }) {
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
          fontSize: 42,
          fontWeight: "bold",
          color: score > 80 ? "green" : score > 60 ? "orange" : "red",
        }}
      >
        {score}
      </div>
    </div>
  );
}
