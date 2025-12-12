"use client";

import { useRouter } from "next/navigation";
import "@theme/report-card.css";

export default function ReportCard({ data }) {
  const router = useRouter();

  return (
    <div
      className="vl-report-card fade-in"
      onClick={() => router.push(`/reports/${data.id}`)}
    >
      <h3 className="vl-report-title">Report #{data.id}</h3>

      <p className="vl-report-date">
        {new Date(data.created_at).toLocaleString()}
      </p>

      <p className="vl-report-status">
        Status: <span>{data.status}</span>
      </p>
    </div>
  );
}
