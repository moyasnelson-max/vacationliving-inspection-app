export default function HealthScoreCard({ score = 0 }) {
  return (
    <div className="healthscore-card">
      <h2>Health Score</h2>
      <p className="score-value">{score}%</p>
    </div>
  );
}