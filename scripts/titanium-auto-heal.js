FILE="scripts/titanium-auto-heal.js"
DIR=$(dirname "$FILE")

mkdir -p "$DIR"

if [ ! -f "$FILE" ]; then
  cat << 'EOF' > $FILE
#!/usr/bin/env node
/**
 * VACATION LIVING — TITANIUM AUTO-HEAL v5.0
 * Reconstrucción total + regeneración de imports + rutas
 */

import fs from "fs";
import path from "path";

console.log("\n==============================");
console.log(" VACATION LIVING — AUTO-HEAL v5.0");
console.log("==============================\n");

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log("[+] Carpeta restaurada:", dir);
  }
};

const ensureFile = (file, content = "") => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, content);
    console.log("[+] Archivo restaurado:", file);
  }
};

const folders = [
  "app/lib",
  "app/api",
  "app/inspection",
  "app/components",
  "styles"
];

folders.forEach(ensureDir);

const supabaseClientPath = "app/lib/supabase-client.js";

const supabaseTemplate = `
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
`;

ensureFile(supabaseClientPath, supabaseTemplate);

const luxuryCssPath = "styles/luxury-inspection.css";
ensureFile(luxuryCssPath, `/* Luxury CSS restored */`);

function fixImports(dir) {
  if (!fs.existsSync(dir)) return;

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const full = path.join(dir, item);

    if (fs.statSync(full).isDirectory()) {
      fixImports(full);
    } else if (item.endsWith(".js") || item.endsWith(".jsx")) {
      let content = fs.readFileSync(full, "utf8");

      content = content
        .replace(/(\.\.\/)+lib\/supabase-client/g, "@lib/supabase-client")
        .replace(/(\.\.\/)+styles\/luxury-inspection\.css/g, "@styles/luxury-inspection.css");

      fs.writeFileSync(full, content);
    }
  }
}

fixImports("app");

console.log("\nAUTO-HEAL COMPLETADO ✔\n");
EOF
  echo "✔ Archivo creado: $FILE"
else
  echo "✔ Archivo ya existe: $FILE"
fi

nano $FILE
