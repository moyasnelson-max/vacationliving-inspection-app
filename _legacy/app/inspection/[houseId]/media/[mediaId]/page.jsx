"use client";

export default function MediaPage({ params }) {
  const { mediaId } = params;

  return (
    <div style={{ padding: 20 }}>
      <h3 style={{ marginBottom: 8 }}>Media ID: {mediaId}</h3>
      <p style={{ color: "#555" }}>Media preview coming soon.</p>
    </div>
  );
}
