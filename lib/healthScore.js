// lib/healthScore.js

export function calculateHealthScore(items) {
  if (!items || items.length === 0) return 100;

  let deductions = 0;

  items.forEach(item => {
    switch (item.severity) {
      case 'low': deductions += 2; break;
      case 'medium': deductions += 5; break;
      case 'high': deductions += 12; break;
      case 'critical': deductions += 25; break;
    }
  });

  const score = Math.max(0, 100 - deductions);
  return score;
}
