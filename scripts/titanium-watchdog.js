import fs from "fs";
import path from "path";

// ARCHIVOS QUE TIENE QUE PROTEGER ESTE WATCHDOG
const REQUIRED_FILES = [
  "app/lib/supabase-client.js",
  "styles/luxury-inspection.css"
];

// RUTAS PERMITIDAS
const REQUIRED_FOLDERS = [
  "app/inspection",
  "app/api",
  "app/lib",
  "styles"
];

function fileExists(file) {
  return fs.existsSync(path.join(process.cwd(), file));
}

function folderExists(folder) {
  return fs.existsSync(path.join(process.cwd(), folder));
}

function scanPaths() {
  console.clear();
  console.log("🔥 Titanium Watchdog v3.0 — Online\n");

  let ok = true;

  console.log("📁 Verificando carpetas...");
  for (const folder of REQUIRED_FOLDERS) {
    if (!folderExists(folder)) {
      console.log(`❌ Falta carpeta: ${folder}`);
      ok = false;
    } else {
      console.log(`✅ ${folder}`);
    }
  }

  console.log("\n📄 Verificando archivos críticos...");
  for (const file of REQUIRED_FILES) {
    if (!fileExists(file)) {
      console.log(`❌ Falta archivo crítico: ${file}`);
      ok = false;
    } else {
      console.log(`✅ ${file}`);
    }
  }

  console.log("\n-------------------------------------");

  if (ok) {
    console.log("🟢 Sistema 100% protegido. Watchdog activo.\n");
  } else {
    console.log("🔴 ADVERTENCIA: Problemas detectados.\n");
  }
}

// Escanea cada 2 segundos
setInterval(scanPaths, 2000);
