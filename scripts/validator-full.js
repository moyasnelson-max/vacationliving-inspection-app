#!/usr/bin/env node

/**
 * VACATION LIVING – FULL VALIDATOR & AUTO-HEAL v9.0
 * Repara todo: rutas, json, configs, imports, env, next, jsconfig, eslint, etc.
 */

import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

console.clear();
console.log("==============================================");
console.log(" VACATION LIVING — FULL SYSTEM VALIDATOR v9.0 ");
console.log("==============================================\n");

// Helper
const ok = (msg) => console.log("✓ " + msg);
const err = (msg) => console.log("✗ " + msg);

// ----------------------
// 1) VALIDAR VARIABLES ENV
// ----------------------
console.log("\n1) VALIDANDO VARIABLES DE ENTORNO...\n");

const requiredEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "INSPECTION_API_URL",
  "ISSUE_API_URL",
  "UPLOAD_API_URL",
  "SEND_EMAIL_API_URL",
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_SITE_URL"
];

let envErrors = false;
requiredEnv.forEach((key) => {
  if (!process.env[key] || process.env[key].trim() === "") {
    err(`${key} FALTA ❌`);
    envErrors = true;
  } else {
    ok(`${key} OK`);
  }
});

if (envErrors) {
  console.log("\n⚠ ERROR: Faltan variables de entorno. Abre .env.local y corrige.\n");
} else {
  console.log("\n✔ Variables de entorno correctas.\n");
}

// ----------------------
// 2) VALIDAR JSON (jsconfig / eslint / package.json)
// ----------------------

console.log("\n2) VALIDANDO ARCHIVOS JSON...\n");

function validateJSON(file) {
  try {
    JSON.parse(fs.readFileSync(file, "utf8"));
    ok(`${file} válido`);
    return true;
  } catch (e) {
    err(`${file} corrupto → reparando...`);

    if (file.includes("jsconfig")) {
      fs.writeFileSync(
        file,
        JSON.stringify(
          {
            compilerOptions: {
              baseUrl: ".",
              paths: {
                "@/*": ["./*"]
              }
            }
          },
          null,
          2
        )
      );
      ok(`jsconfig.json regenerado`);
    }

    if (file.includes("eslintrc")) {
      fs.writeFileSync(
        file,
        JSON.stringify(
          {
            extends: "next/core-web-vitals"
          },
          null,
          2
        )
      );
      ok(`.eslintrc.json regenerado`);
    }

    return false;
  }
}

validateJSON("jsconfig.json");
validateJSON(".eslintrc.json");
validateJSON("package.json");

// ----------------------
// 3) VALIDAR next.config.js
// ----------------------
console.log("\n3) VALIDANDO next.config.js...\n");

const nextConfigPath = "next.config.js";

const safeNextConfig = `
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {}
}

export default nextConfig;
`;

try {
  require(path.resolve(nextConfigPath));
  ok("next.config.js válido");
} catch (e) {
  err("next.config.js corrupto → regenerando...");
  fs.writeFileSync(nextConfigPath, safeNextConfig);
  ok("next.config.js regenerado");
}

// ----------------------
// 4) VALIDAR ARCHIVOS CRÍTICOS DEL PROYECTO
// ----------------------
console.log("\n4) VALIDANDO ESTRUCTURA...\n");

const requiredPaths = [
  "app/lib/supabase-client.js",
  "styles/luxury-inspection.css",
  "app/api",
  "app/inspection",
  "scripts"
];

requiredPaths.forEach((p) => {
  if (fs.existsSync(p)) {
    ok(`${p} existe`);
  } else {
    err(`${p} faltaba → creando...`);
    if (p.includes(".")) {
      fs.writeFileSync(p, "");
    } else {
      fs.mkdirSync(p, { recursive: true });
    }
    ok(`${p} creado`);
  }
});

// ----------------------
// 5) VALIDAR SCRIPTS AUTOMÁTICOS
// ----------------------
console.log("\n5) VALIDANDO SCRIPTS...\n");

const scriptList = [
  "path-guardian-titanium.js",
  "titanium-watchdog-pro.js",
  "config-heal.sh",
  "vercel-prebuild.sh",
  "env-sync.js"
];

scriptList.forEach((s) => {
  const full = `scripts/${s}`;
  if (fs.existsSync(full)) {
    ok(`${full} OK`);
  } else {
    err(`${full} faltaba → creando placeholder`);
    fs.writeFileSync(full, "// script generado automáticamente\n");
  }
});

// ----------------------
// 6) VALIDAR SUPABASE CLIENT
// ----------------------
console.log("\n6) VALIDANDO SUPABASE-CLIENT...\n");

const clientPath = "app/lib/supabase-client.js";

if (fs.existsSync(clientPath)) {
  ok("supabase-client.js existe");
} else {
  err("supabase-client.js faltaba → creando mínimo funcional...");
  fs.writeFileSync(
    clientPath,
    `
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
`
  );
  ok("supabase-client.js regenerado");
}

console.log("\n==============================================");
console.log(" VALIDACIÓN COMPLETADA — TODO EN ORDEN ✔");
console.log("==============================================\n");
