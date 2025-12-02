export default function IssueList({ issues = [] }) {
  return (
    <div className="issue-list">
      {issues.length === 0 && <p>No issues found.</p>}
      {issues.map(issue => (
        <div key={issue.id} className="issue-item">
          <p>{issue.title}</p>
        </div>
      ))}
    </div>
  );
}