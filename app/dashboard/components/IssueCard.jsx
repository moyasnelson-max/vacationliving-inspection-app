"use client";

export default function IssueCard({ data }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 10,
        padding: 16,
        background: "#fff",
      }}
    >
      <h3 style={{ margin: 0 }}>{data.title}</h3>
      <p style={{ marginTop: 8, color: "#555" }}>
        {new Date(data.created_at).toLocaleString()}
      </p>
      <p style={{ marginTop: 4 }}>Status: {data.status}</p>
    </div>
  );
}
