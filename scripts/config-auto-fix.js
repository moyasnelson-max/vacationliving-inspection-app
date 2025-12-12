#!/usr/bin/env node

import fs from "fs";

console.log("🔧 AUTO-FIX CONFIG SHIELD v1.0");

function fixFile(path, content) {
  try {
    fs.writeFileSync(path, content);
    console.log(`✔ Reparado: ${path}`);
  } catch (err) {
    console.error(`❌ Error reparando ${path}`, err);
  }
}

console.log("Reparando archivos de configuración...");

// === next.config.js ===
fixFile(
  "next.config.js",
  `
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {},
};

export default nextConfig;
`,
);

// === jsconfig.json ===
fixFile(
  "jsconfig.json",
  `
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
`,
);

// === .eslintrc.json ===
fixFile(
  ".eslintrc.json",
  `
{
  "extends": "next",
  "rules": {
    "react/no-unescaped-entities": 0
  }
}
`,
);

// === .gitignore ===
fixFile(
  ".gitignore",
  `
node_modules
.next
.env
.env.local
.env.production
.vscode
.vercel
.DS_Store
`,
);

console.log("✨ AUTO-FIX COMPLETADO ✔");
