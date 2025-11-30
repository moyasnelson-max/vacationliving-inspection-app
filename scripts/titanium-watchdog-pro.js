import fs from "fs";
import path from "path";

console.clear();
console.log("🔥 Titanium Watchdog PRO v4.0 — Activado\n");

// =============================
// CONFIGURACIÓN
// =============================

// Archivos críticos que NO pueden faltar
const CRITICAL_FILES = {
  "app/lib/supabase-client.js": `
import { createClient } from "@supabase/supabase-js";
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
  `,
  "styles/luxury-inspection.css": `
/* Luxury Inspection CSS — Restaurado automáticamente */
body {
  background: #f5f5f5;
}
  `
};

// Carpetas que deben existir
const REQUIRED_FOLDERS = [
  "app/inspection",
  "app/api",
  "app/lib",
  "styles"
];

// =============================
// FUNCIONES BASE
// =============================

// Crear archivo si no existe
function ensureFile(file, content) {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Archivo perdido detectado: ${file}`);
    console.log("   ➜ Restaurando...");
    fs.writeFileSync(filePath, content.trim());
    console.log(`   ✔ ${file} restaurado\n`);
  } else {
    console.log(`   ✔ ${file}`);
  }
}

// Verifica carpetas
function ensureFolders() {
  console.log("📁 Verificando carpetas importantes...");
  for (const folder of REQUIRED_FOLDERS) {
    const folderPath = path.join(process.cwd(), folder);
    if (!fs.existsSync(folderPath)) {
      console.log(`❌ FALTA carpeta: ${folder}`);
      console.log(`   ➜ Creando carpeta: ${folder}`);
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`   ✔ Carpeta restaurada\n`);
    } else {
      console.log(`   ✔ ${folder}`);
    }
  }
  console.log("\n");
}

// Escanea imports rotos en todo /app
function detectBrokenImports() {
  console.log("🔎 Escaneando imports rotos...");

  const files = getAllFiles("app");
  const broken = [];

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");

    // Detectar imports rotos de supabase-client
    if (content.includes("supabase-client") && !content.includes("../lib/supabase-client.js")) {
      broken.push(file);
    }
  }

  if (broken.length === 0) {
    console.log("   ✔ No hay imports rotos\n");
    return;
  }

  console.log(`⚠️ Imports rotos detectados en ${broken.length} archivo(s):`);
  broken.forEach(f => console.log("   - " + f));

  console.log("\n   ➜ Reparando...");

  for (const file of broken) {
    let content = fs.readFileSync(file, "utf8");
    content = content.replace(/supabase-client[^'"]+/g, "../lib/supabase-client.js");
    fs.writeFileSync(file, content);
  }

  console.log("   ✔ Imports reparados\n");
}

// Obtener lista recursiva de archivos
function getAllFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(file));
    } else {
      results.push(file);
    }
  });

  return results;
}

// =============================
// LOOP PRINCIPAL DEL WATCHDOG
// =============================

function watchdogLoop() {
  console.clear();
  console.log("🔥 Titanium Watchdog PRO v4.0 — ONLINE\n");

  ensureFolders();

  console.log("📄 Verificando archivos críticos...");
  for (const file in CRITICAL_FILES) {
    ensureFile(file, CRITICAL_FILES[file]);
  }

  console.log("\n🧠 Escaneo de integridad...");
  detectBrokenImports();

  console.log("\n🟢 Sistema estable. Watchdog activo.\n");
}

setInterval(watchdogLoop, 3000); // cada 3 segundos
