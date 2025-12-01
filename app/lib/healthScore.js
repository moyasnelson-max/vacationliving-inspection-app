export function calculateHealthScore(itemsCompleted, issuesCount) {
  if (!itemsCompleted || itemsCompleted === 0) return 0;

  const penalty = issuesCount * 5;
  let score = 100 - penalty;

  if (score < 0) score = 0;
  if (score > 100) score = 100;

  return score;
}

export function getScoreLabel(score) {
  if (score >= 95) return "Excellent";
  if (score >= 85) return "Very Good";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs Attention";
  return "Critical";
}

export function getScoreColor(score) {
  if (score >= 95) return "#16a34a";
  if (score >= 85) return "#4ade80";
  if (score >= 70) return "#facc15";
  if (score >= 50) return "#f97316";
  return "#dc2626";
}
