// -----------------------------------------------------------------------------
// validation.js — Validaciones Profesionales Nivel Marriott
// -----------------------------------------------------------------------------
//
// Propósito:
//   Validar datos mínimos antes de crear o guardar una inspección.
//   Proveer estructura clara, mensajes detallados y consistentes.
//
// Características Marriott:
//   ✓ Validaciones robustas y extensibles
//   ✓ Mensajes claros para UI y debugging
//   ✓ Seguridad ante undefined, null o estructuras incompletas
//   ✓ Código limpio, elegante y fácil de mantener
//   ✓ Devuelve un objeto estándar: { isValid, errors }
//
// NOTA:
//   Este archivo NO interfiere con tu flujo actual.
//   Solamente agrega claridad y estándar de calidad.
//
// -----------------------------------------------------------------------------

/**
 * Valida la data general de una inspección antes de guardarla.
 *
 * @param {Object} data - Información de la inspección.
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateInspectionData(data = {}) {
  const errors = [];

  // ---------------- VALIDACIONES DE CAMPOS REQUERIDOS ----------------
  if (!data.houseId) {
    errors.push("House ID is required.");
  }

  if (!data.inspectorId) {
    errors.push("Inspector ID is required.");
  }

  // ---------------- VALIDACIÓN DE CATEGORÍAS ----------------
  const categories = Array.isArray(data.categories) ? data.categories : [];

  if (categories.length === 0) {
    errors.push("At least one category must be inspected.");
  }

  // ---------------- RESULTADO FINAL ----------------
  return {
    isValid: errors.length === 0,
    errors,
  };
}

export default validateInspectionData;
