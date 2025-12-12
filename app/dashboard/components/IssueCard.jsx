"use client";

import "@theme/issue-card.css";

export default function IssueCard({ data }) {
  const formattedDate = new Date(data.created_at).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`vl-issue-card fade-in status-${data.status}`}>
      <h3 className="vl-issue-title">{data.title}</h3>

      <p className="vl-issue-date">{formattedDate}</p>

      <p className="vl-issue-status">
        <span className="label">Status:</span>
        <span className="value">{data.status}</span>
      </p>
    </div>
  );
}
