/**
 * VACATION LIVING – PATH GUARDIAN v1.0
 * Protección permanente de imports, rutas relativas, alias y archivos críticos.
 * Este script se ejecuta antes del build o manualmente.
 */

import fs from "fs";
import path from "path";

console.log("===============================================");
console.log("   VACATION LIVING — PATH GUARDIAN v1.0");
console.log("===============================================");

/* ============================================================================
   UTILIDADES
============================================================================ */

function fixFile(file) {
  let content = fs.readFileSync(file, "utf8");

  // 1. Reparar errores típicos de imports rotos
  content = content.replace(/\.js\.js/g, ".js");
  content = content.replace(/supabase-client\.js\.js/g, "supabase-client.js");
  content = content.replace(/a\.\/app/g, "./app");

  // 2. Normalizar rutas excesivas "../../../../../"
  content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\/app/g, "@/app");
  content = content.replace(/\.\.\/\.\.\/\.\.\/app/g, "@/app");
  content = content.replace(/\.\.\/\.\.\/app/g, "@/app");
  content = content.replace(/\.\.\/app/g, "@/app");

  // 3. Forzar el import correcto del supabase-client
  content = content.replace(/from ["'].*supabase-client["']/g, `from "@/lib/supabase-client.js"`);

  // 4. Insertar CSS faltante de luxury-inspection
  if (
    file.includes("app/inspection/") &&
    file.endsWith("page.jsx") &&
    !content.includes("luxury-inspection.css")
  ) {
    content =
      `import "@/styles/luxury-inspection.css";\n` +
      content;
  }

  fs.writeFileSync(file, content, "utf8");
}

/* ============================================================================
   RECOLECTAR ARCHIVOS .jsx / .js
============================================================================ */

function getAllFiles(dir, arr = []) {
  const files = fs.readdirSync(dir);

  files.forEach(f => {
    const fullPath = path.join(dir, f);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      return getAllFiles(fullPath, arr);
    }
    if (fullPath.endsWith(".jsx") || fullPath.endsWith(".js")) {
      arr.push(fullPath);
    }
  });

  return arr;
}

/* ============================================================================
   1. Verificar archivo supabase-client.js
============================================================================ */

const SUPABASE_CLIENT = "app/lib/supabase-client.js";

if (!fs.existsSync(SUPABASE_CLIENT)) {
  console.log("❗ supabase-client.js NO EXISTE – creando archivo...");

  fs.mkdirSync("app/lib", { recursive: true });

  fs.writeFileSync(
    SUPABASE_CLIENT,
    `import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
`
  );
} else {
  console.log("✔ supabase-client.js verificado");
}

/* ============================================================================
   2. Escanear todos los archivos y repararlos
============================================================================ */

console.log("Escaneando archivos...");

const projectFiles = getAllFiles("app");

projectFiles.forEach(file => {
  fixFile(file);
});

console.log("===============================================");
console.log(" PATH GUARDIAN v1.0 — COMPLETADO EXITOSAMENTE ");
console.log("===============================================");
