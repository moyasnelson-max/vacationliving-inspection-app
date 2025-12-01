"use client";

export default function LuxHeader({ title = "Vacation Living" }) {
  return (
    <header
      style={{
        padding: 20,
        background: "#1F2328",
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
      }}
    >
      {title}
    </header>
  );
}
