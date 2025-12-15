"use client";

export default function NewInspectionPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f3ee",
      }}
    >
      <div
        style={{
          padding: "40px 48px",
          borderRadius: "24px",
          background: "white",
          boxShadow: "0 20px 60px rgba(15, 23, 42, 0.16)",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            margin: "0 0 12px",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          TEST · New Inspection
        </h1>
        <p style={{ margin: 0, fontSize: "16px", color: "#4b5563" }}>
          Si ves este mensaje después de hacer clic en <strong>Inspect</strong>,
          el routing funciona y el problema era el código anterior de esta
          página.
        </p>
      </div>
    </main>
  );
}