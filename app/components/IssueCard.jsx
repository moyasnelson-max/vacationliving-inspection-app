export default function IssueCard({ issue }) {
  return (
    <div className="issue-card">
      <h4>{issue.title}</h4>
      <p>Status: {issue.status}</p>
    </div>
  );
}