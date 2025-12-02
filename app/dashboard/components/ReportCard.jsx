"use client";
"use client";

import { useRouter } from "next/navigation";

export default function ReportCard({ data }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/reports/${data.id}`)}
      style={{
        border: "1px solid #ddd",
        borderRadius: 10,
        padding: 16,
        cursor: "pointer",
        background: "#fff",
      }}
    >
      <h3>Report #{data.id}</h3>
      <p style={{ color: "#777" }}>
        {new Date(data.created_at).toLocaleString()}
      </p>
      <p>Status: {data.status}</p>
    </div>
  );
}
