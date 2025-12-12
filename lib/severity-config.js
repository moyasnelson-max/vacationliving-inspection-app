// -----------------------------------------------------------------------------
// severity-config.js — Versión PRO basada en tu archivo real
// -----------------------------------------------------------------------------
// Este archivo define los niveles de severidad utilizados por toda la app.
// Contiene:
//  • id         → clave interna usada en Base de Datos y lógica
//  • label      → texto mostrado al usuario
//  • color      → color oficial para UI, tags, badges, reportes, etc.
// Está optimizado, profesional y NO rompe tu sistema actual.
// -----------------------------------------------------------------------------

export const severityLevels = [
  {
    id: "low",
    label: "Low",
    color: "#A3D9A5", // Verde claro
    score: 2, // Deducción recomendada para health-score
  },
  {
    id: "medium",
    label: "Medium",
    color: "#F3D179", // Amarillo dorado
    score: 5,
  },
  {
    id: "high",
    label: "High",
    color: "#F29E03", // Naranja fuerte
    score: 12,
  },
  {
    id: "critical",
    label: "Critical",
    color: "#E25B4F", // Rojo alerta
    score: 25,
  },
];

// Mapa rápido por ID (útil para validaciones y cálculos)
export const severityMap = Object.fromEntries(
  severityLevels.map((level) => [level.id, level]),
);

export default severityLevels;
