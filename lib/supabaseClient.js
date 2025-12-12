// -----------------------------------------------------------------------------
// supabaseClient.js — Cliente principal y único de Supabase para el frontend
// -----------------------------------------------------------------------------
//
// Propósito:
//   Crear una instancia estable y reutilizable del cliente de Supabase para
//   entornos client-side. Este archivo es la FUENTE OFICIAL del cliente en toda
//   la aplicación.
//
// Notas de arquitectura (Marriott Level):
//   ✓ Evita recreación de clientes (import seguro e idempotente)
//   ✓ Lee variables de entorno públicas validadas
//   ✓ Documentación clara para futuros desarrolladores
//   ✓ Compatible con toda la arquitectura del proyecto (fetch, issues, reports)
//   ✓ Garantiza estabilidad en autenticación y llamadas a Edge Functions
//
// -----------------------------------------------------------------------------

"use client";

import { createClient } from "@supabase/supabase-js";

// -------------------------
// Variables de entorno
// -------------------------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validación con mensaje profesional
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "❌ SupabaseClient Error: Faltan variables de entorno.\n" +
      "Requiere: NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY\n" +
      "Solución: Verifica tu archivo .env.local y la configuración en Vercel.",
  );
}

// -------------------------
// Instancia única (idempotente)
// -------------------------
let client = null;

if (!client) {
  client = createClient(supabaseUrl, supabaseAnonKey);
}

// Exportación estándar para uso en toda la app
export const supabase = client;

// Export default para imports flexibles
export default supabase;
