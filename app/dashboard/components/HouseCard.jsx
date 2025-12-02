"use client";
"use client";

import { useRouter } from "next/navigation";

export default function HouseCard({ data }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/inspection/${data.id}`)}
      style={{
        border: "1px solid #ddd",
        borderRadius: 10,
        padding: 16,
        cursor: "pointer",
        background: "#fff",
        transition: "0.2s",
      }}
    >
      <h3 style={{ margin: 0 }}>{data.name}</h3>
      <p style={{ marginTop: 8, color: "#555" }}>{data.address}</p>
    </div>
  );
}
