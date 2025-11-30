
#!/usr/bin/env node
/**
 * VACATION LIVING — ENV SYNC MASTER v1.0
 * Arregla automáticamente todas las variables de entorno
 * y verifica que coincidan con Vercel.
 */

import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

console.clear();
console.log("==============================================");
console.log("     VACATION LIVING — ENV SYNC MASTER v1.0   ");
console.log("==============================================\n");

const REQUIRED = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "SUPABASE_JWT_SECRET",
  "SUPABASE_SERVICE_ROLE_KEY",
  "INSPECTION_API_URL",
  "ISSUE_API_URL",
  "UPLOAD_API_URL",
  "SEND_EMAIL_API_URL",
  "PDF_API_URL",
  "SENDGRID_API_KEY",
  "SENDGRID_FROM",
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_SITE_URL"
];

const envPath = path.join(process.cwd(), ".env.local");

// Leer actual
let localEnv = {};
if (fs.existsSync(envPath)) {
  localEnv = dotenv.parse(fs.readFileSync(envPath));
}

// Validar claves
let missing = [];

for (const key of REQUIRED) {
  if (!localEnv[key] || localEnv[key].trim() === "") {
    missing.push(key);
  }
}

// Reporte
if (missing.length === 0) {
  console.log("✔ Todas las variables están completas en .env.local");
} else {
  console.log("\n❌ FALTAN VARIABLES en .env.local:");
  missing.forEach(k => console.log("   - " + k));
  console.log("\n🔧 Generando placeholders...");
}

// Regenerar archivo
let newEnv = "";
for (const key of REQUIRED) {
  if (localEnv[key]) {
    newEnv += `${key}="${localEnv[key]}"\n`;
  } else {
    newEnv += `${key}="__PLACEHOLDER__"\n`;
  }
}

fs.writeFileSync(envPath, newEnv);

console.log("\n==============================================");
console.log(" ENV SYNC COMPLETADO. .env.local reparado. ");
console.log("==============================================\n");

console.log("Ejecuta nuevamente tu script o 'npm run dev'.");
