"use client";

import "@theme/issue-card.css";

export default function IssueCard({ issue }) {
  const STATUS_COLORS = {
    pending: "var(--gold)",
    in_progress: "var(--accent)",
    resolved: "var(--success)",
  };

  const statusColor = STATUS_COLORS[issue?.status] || "var(--text-light)";

  return (
    <div className="vl-issue-card fade-in">
      <div className="vl-issue-header">
        <h3 className="vl-issue-title">{issue?.title || "Untitled Issue"}</h3>
      </div>

      <div className="vl-issue-footer">
        <span className="vl-issue-status-label">Status</span>
        <span className="vl-issue-status-value" style={{ color: statusColor }}>
          {issue?.status?.replace("_", " ") || "Unknown"}
        </span>
      </div>
    </div>
  );
}
