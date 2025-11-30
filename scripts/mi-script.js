#!/usr/bin/env node
/**
 * =============================================
 *  VACATION LIVING — UNIVERSAL TEST SCRIPT v2.0
 * =============================================
 * Verifica:
 *  ✓ Rutas importantes
 *  ✓ Archivos claves
 *  ✓ Variables de entorno
 *  ✓ Import real de supabase-client
 *  ✓ Estructura base del proyecto
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import fs from "fs";
import path from "path";

console.clear();
console.log("============================================");
console.log(" VACATION LIVING — UNIVERSAL TEST SCRIPT");
console.log("============================================\n");

function exists(p) {
  const ok = fs.existsSync(p);
  console.log(ok ? `✔ Existe: ${p}` : `✘ No existe: ${p}`);
  return ok;
}

// ==============================
// 1) Verificar rutas principales
// ==============================
console.log("\n🔍 Verificando rutas importantes...\n");

exists("app/lib/supabase-client.js");
exists("styles/luxury-inspection.css");

// ==============================
// 2) Validar variables de entorno Supabase
// ==============================
console.log("\n🔍 Verificando variables de entorno...\n");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.log("✘ ERROR: Falta NEXT_PUBLIC_SUPABASE_URL");
} else {
  console.log("✔ NEXT_PUBLIC_SUPABASE_URL OK");
}

if (!supabaseKey) {
  console.log("✘ ERROR: Falta NEXT_PUBLIC_SUPABASE_ANON_KEY");
} else {
  console.log("✔ NEXT_PUBLIC_SUPABASE_ANON_KEY OK");
}

// Si faltan, terminar aquí
if (!supabaseUrl || !supabaseKey) {
  console.log("\n❌ No se pueden correr pruebas de Supabase sin estas variables.\n");
  process.exit(1);
}

// ==============================
// 3) Probar import REAL del cliente
// ==============================
console.log("\n🔍 Probando import real de supabase-client...\n");

try {
  const modulePath = path.resolve("app/lib/supabase-client.js");
  await import(`file://${modulePath}`);
  console.log("✔ Import de supabase-client.js funciona correctamente");
} catch (err) {
  console.log("❌ Error importando supabase-client.js");
  console.log(err.message);
  process.exit(1);
}

// ==============================
// 4) Verificar carpetas clave
// ==============================
console.log("\n🔍 Verificando carpetas principales del proyecto...\n");

["app", "app/lib", "app/inspection", "app/api", "styles", "scripts"].forEach(exists);

console.log("\n============================================");
console.log(" UNIVERSAL TEST SCRIPT COMPLETADO");
console.log("============================================\n");
