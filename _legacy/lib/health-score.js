// ============================================================================
// health-score.js
// ----------------------------------------------------------------------------
// Calcula el "Health Score" general de una propiedad basándose en los ítems
// inspeccionados y su severidad.
//
// Deducciones estándar por severidad:
//   - low      → -2 puntos
//   - medium   → -5 puntos
//   - high     → -12 puntos
//   - critical → -25 puntos
//
// Parámetros:
//   - items[] (required)
//        Lista de ítems con severidad asignada
//
// Ejemplo:
//   const score = calculateHealthScore(items);
//
// Retorna:
//   - Número entre 0 y 100
//   - 100 si no existen ítems (score perfecto)
// ============================================================================

import { severityLevels } from "./severity-config";

/**
 * Devuelve la deducción equivalente según el nivel de severidad.
 */
function getDeductionBySeverity(severity) {
  const level = severityLevels.find((lvl) => lvl.id === severity);
  return level?.deduction ?? 0; // fallback en caso de severidad desconocida
}

/**
 * Calcula el “Health Score” de una inspección completa.
 */
export function calculateHealthScore(items) {
  if (!items || items.length === 0) {
    return 100; // Score perfecto cuando no hay issues
  }

  let deductions = 0;

  items.forEach((item) => {
    const deduction = getDeductionBySeverity(item.severity);
    deductions += deduction;
  });

  // El score nunca debe bajar de 0
  return Math.max(0, 100 - deductions);
}

export default calculateHealthScore;
