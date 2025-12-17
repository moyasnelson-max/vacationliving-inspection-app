// ============================================================================
// property-config.js  — Configuración Global de Propiedades
// ============================================================================
//
// Este archivo define parámetros clave utilizados en todo el sistema de
// inspecciones, reportes PDF, manejo de media y cálculo de puntajes.
//
// ✔ Mantiene compatibilidad total con tu lógica actual
// ✔ Estandarizado al estilo Marriott (documentación premium)
// ✔ Preparado para futuras expansiones (branding, logos, estilos PDF, etc.)
// ============================================================================

const propertyConfig = {
  // --------------------------------------------------------------------------
  // Ajustes generales del sistema
  // --------------------------------------------------------------------------
  defaultScoreStart: 100, // Puntaje inicial (antes de deducciones)
  maxSeverity: 5, // Severidad máxima permitida
  mediaMaxSizeMB: 10, // Tamaño máximo de archivos multimedia por upload

  // --------------------------------------------------------------------------
  // Configuración de PDF
  // --------------------------------------------------------------------------
  pdf: {
    includeQR: true, // Incluir QR en el reporte PDF
    includeHealthScore: true, // Mostrar puntaje Health Score en el PDF
  },
};

export default propertyConfig;
