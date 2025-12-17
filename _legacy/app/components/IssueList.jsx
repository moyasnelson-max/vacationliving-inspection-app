"use client";

import IssueCard from "./IssueCard";
import "@theme/issue-list.css";

export default function IssueList({ issues = [] }) {
  return (
    <div className="vl-issue-list fade-in">
      {issues.length === 0 && <p className="vl-no-issues">No issues found.</p>}

      {issues.map((issue) => (
        <div key={issue.id} className="vl-issue-list-item">
          <IssueCard issue={issue} />
        </div>
      ))}
    </div>
  );
}
