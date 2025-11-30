#!/usr/bin/env bash
echo "==========================================="
echo " VACATION LIVING — ALIAS-HEALER v1.0"
echo " Reparando jsconfig.json y next.config.js…"
echo "==========================================="

# 1) Regenerar jsconfig.json
cat <<'EOF' > jsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["app/*"],
      "@lib/*": ["app/lib/*"]
    }
  }
}
EOF

echo "✓ jsconfig.json regenerado correctamente."


# 2) Regenerar next.config.js con alias correctos
cat <<'EOF' > next.config.js
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname, "app"),
      "@lib": path.resolve(__dirname, "app/lib")
    };
    return config;
  },
};

export default nextConfig;
EOF

echo "✓ next.config.js regenerado correctamente."


# 3) Verificar archivo supabase-client.js
if [ -f "./app/lib/supabase-client.js" ]; then
  echo "✓ Archivo encontrado: app/lib/supabase-client.js"
else
  echo "✗ ERROR: No se encontró app/lib/supabase-client.js"
  echo "Creándolo…"
  mkdir -p app/lib
  cat <<'EOF' > app/lib/supabase-client.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnon);
export default supabase;
EOF
  echo "✓ Archivo supabase-client.js creado."
fi


# 4) Limpiar caché de Next.js
echo "Limpiando caché local (.next)…"
rm -rf .next
echo "✓ Caché limpiado."


# 5) Validación final
echo "==========================================="
echo " VALIDANDO ALIAS…"
echo "==========================================="

node - <<'EOF'
import path from "path";
import fs from "fs";

function check(p) {
  if (fs.existsSync(p)) {
    console.log("✓ Existe:", p);
  } else {
    console.log("✗ NO existe:", p);
  }
}

check("./app/lib/supabase-client.js");
check("./app/page.jsx");
EOF

echo "==========================================="
echo " ALIAS-HEALER v1.0 COMPLETADO"
echo " Ejecuta ahora:  npm run dev"
echo "==========================================="
