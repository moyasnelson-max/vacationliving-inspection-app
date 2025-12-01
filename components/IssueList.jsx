export default function IssueList({ issues = [] }) {
  if (!issues.length) return <p>No issues found.</p>;

  return (
    <div className="issue-list">
      {issues.map((issue) => (
        <div key={issue.id} className="issue-item">
          <p className="issue-title">{issue.title}</p>
          <p className="issue-status">{issue.status}</p>
        </div>
      ))}
    </div>
  );
}
