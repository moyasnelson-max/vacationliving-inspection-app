"use client";

import { useRouter } from "next/navigation";
import "@theme/house-card.css";

export default function HouseCard({ data }) {
  const router = useRouter();

  return (
    <div
      className="vl-house-card fade-in"
      onClick={() => router.push(`/inspection/${data.id}`)}
    >
      <h3 className="vl-house-title">{data.name}</h3>
      <p className="vl-house-address">{data.address}</p>
    </div>
  );
}
