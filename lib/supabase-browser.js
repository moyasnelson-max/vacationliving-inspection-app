// -----------------------------------------------------------------------------
// supabase-browser.js — Cliente Supabase optimizado para ejecución en navegador
// -----------------------------------------------------------------------------
//
// Propósito:
//   Proveer una instancia única, segura y consistente del cliente de Supabase
//   exclusivamente para entornos client-side. Evita duplicación de clientes,
//   reduce errores silenciosos y garantiza arquitectura estable.
//
// Notas técnicas:
//   • No se deben crear clientes dentro de componentes o hooks.
//   • Esta capa desacopla el frontend del archivo base supabaseClient.js
//     y mantiene un único punto de verdad.
//
// Features Marriott Level:
//   ✓ Documentación enterprise — clara, elegante, precisa
//   ✓ Instancia única y estable (no recreate / no race conditions)
//   ✓ Pensado para auditoría, debug y mantenibilidad
//   ✓ Compatible con todo tu ecosistema (reports, issues, inspector flow)
// -----------------------------------------------------------------------------

"use client";

import supabaseClient from "./supabaseClient";

// Alias estándar en TODA la aplicación (evita nombres alternativos)
export const supabase = supabaseClient;

// Export default para permitir importación flexible según el contexto
export default supabase;
