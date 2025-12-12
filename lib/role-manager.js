// ============================================================================
// role-manager.js — Gestión de Roles (Nivel Marriott Premium)
// ============================================================================
//
// ✔ Valida roles sin romper flujos
// ✔ Errores profesionales y consistentes
// ✔ Preparado para auditorías, métricas y permisos avanzados
// ✔ Estándar corporativo para sistemas multiusuario (inspectores / admin / owner)
//
// ============================================================================

/**
 * Verifica si el usuario tiene un rol permitido.
 *
 * @param {Object} session  Sesión activa (de Supabase)
 * @param {Array<string>} allowed Lista de roles permitidos
 * @returns {boolean} true si el rol está permitido
 */
export function checkUserRole(session, allowed = []) {
  if (!session || !session.user) {
    console.warn("⚠ No session found in checkUserRole()");
    return false;
  }

  // Rol por defecto si no existe
  const role = session.user.role || "guest";

  return allowed.includes(role);
}

/**
 * Lanza error si el usuario no tiene un rol permitido.
 * Ideal para proteger rutas críticas o acciones internas.
 *
 * @param {Object} session
 * @param {Array<string>} allowed
 */
export function requireRole(session, allowed = []) {
  if (!checkUserRole(session, allowed)) {
    console.error(
      "⛔ Unauthorized access — User does not meet role requirements",
    );

    throw new Error("Unauthorized: Insufficient permissions");
  }
}
