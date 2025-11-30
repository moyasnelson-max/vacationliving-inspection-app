#!/bin/bash

echo "================================================"
echo "     VACATION LIVING — PATHS REBUILDER V1.0"
echo "================================================"

# 1) Reparando imports rotos
echo "1) Corrigiendo imports rotos..."
find app -type f -name "*.jsx" -o -name "*.js" | while read file; do
  sed -i '' 's/\.js\.js/.js/g' "$file"
  sed -i '' 's/a\.\/app/\.\/app/g' "$file"
  sed -i '' 's/\.\.\/\.\//\.\//g' "$file"
done
echo "Imports corregidos"

# 2) Normalizando rutas relativas
echo "2) Normalizando rutas relativas..."
find app -type f -name "*.jsx" -o -name "*.js" | while read file; do
  sed -i '' 's/\.\.\/\.\.\/\.\.\/\.\.\/app/@\/app/g' "$file"
  sed -i '' 's/\.\.\/\.\.\/\.\.\/app/@\/app/g' "$file"
  sed -i '' 's/\.\.\/\.\.\/app/@\/app/g' "$file"
  sed -i '' 's/\.\.\/app/@\/app/g' "$file"
done
echo "Rutas normalizadas"

# 3) Verificando archivo supabase-client.js
echo "3) Verificando archivo app/lib/supabase-client.js..."
if [ -f "app/lib/supabase-client.js" ]; then
  echo "supabase-client.js encontrado"
else
  echo "❗ NO EXISTE → creando supabase-client.js básico"
  cat << 'CLT' > app/lib/supabase-client.js
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
CLT
fi

# 4) Fijando import de luxury-inspection.css
echo "4) Fijando import de luxury-inspection.css..."
find app/inspection -type f -name "page.jsx" | while read file; do
  if ! grep -q "luxury-inspection.css" "$file"; then
    sed -i '' '1s;^;import "@/styles/luxury-inspection.css";\n;' "$file"
    echo "CSS añadido en: $file"
  fi
done

echo "================================================"
echo "PATHS REBUILDER V1.0 COMPLETADO"
echo "Ya puedes correr AUTO-FIX MASTER v8.5 o v8.6"
echo "================================================"
