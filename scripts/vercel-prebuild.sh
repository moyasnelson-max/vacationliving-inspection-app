#!/usr/bin/env bash

echo "==========================================="
echo " VACATION LIVING — VERCEL AUTO-FIX v3.0"
echo "==========================================="

# 1) Regenerar jsconfig.json
cat << 'JSCONFIG' > jsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
JSCONFIG

echo "✔ jsconfig.json regenerado"

# 2) Regenerar .eslintrc.json
cat << 'ESLINT' > .eslintrc.json
{
  "extends": "next/core-web-vitals"
}
ESLINT

echo "✔ .eslintrc.json regenerado"

# 3) Regenerar next.config.js (versión segura)
cat << 'NEXTCONFIG' > next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    return config;
  }
};
export default nextConfig;
NEXTCONFIG

echo "✔ next.config.js regenerado"

# 4) Regenerar .gitignore premium
cat << 'GITIGNORE' > .gitignore
node_modules/
.next/
dist/
.env
.env.local
.vercel
.DS_Store
.vscode/
scripts/*.log
GITIGNORE

echo "✔ .gitignore regenerado"

# 5) Verificar supabase-client
if [ ! -f app/lib/supabase-client.js ]; then
  echo "⚠ Restaurando supabase-client.js…"
  cat << 'SUPA' > app/lib/supabase-client.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
SUPA
  echo "✔ supabase-client restaurado"
else
  echo "✔ supabase-client.js OK"
fi

# 6) Revisar variables de entorno obligatorias
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
  echo "❌ ERROR: Faltan variables de entorno en Vercel"
  exit 1
else
  echo "✔ Variables de entorno OK"
fi

echo "==========================================="
echo " AUTO-FIX COMPLETADO — LISTO PARA BUILD"
echo "==========================================="
