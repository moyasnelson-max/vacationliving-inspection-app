#!/bin/bash
echo "========================================"
echo "     AUTO-HEALER v5.0 — FULL GREEN MODE  "
echo "========================================"

# 1. Normalizar comillas invisibles
echo "→ Eliminando comillas invisibles…"
find ./app ./lib ./components -type f -name "*.js" -o -name "*.jsx" | while read file; do
  sed -i 's/“/"/g' "$file"
  sed -i 's/”/"/g' "$file"
  sed -i "s/’/'/g" "$file"
done

# 2. Arreglar imports rotos hacia supabaseClient
echo "→ Reparando imports hacia supabaseClient.js…"
find ./app ./lib ./components -type f \( -name "*.js" -o -name "*.jsx" \) | while read file; do
  sed -i 's|@lib/supabaseClient.mjs|@lib/supabaseClient|g' "$file"
  sed -i 's|@lib/supabaseClient.js|@lib/supabaseClient|g' "$file"
  sed -i 's|../../lib/supabaseClient|@lib/supabaseClient|g' "$file"
  sed -i 's|../lib/supabaseClient|@lib/supabaseClient|g' "$file"
  sed -i 's|/lib/supabaseClient|@lib/supabaseClient|g' "$file"
done

# 3. Forzar sintaxis correcta para el import
echo "→ Normalizando import createClient…"
find ./app ./lib ./components -type f \( -name "*.js" -o -name "*.jsx" \) | while read file; do
  sed -i 's|from "supabase/supabase-js"|from "@supabase/supabase-js"|g' "$file"
done

# 4. Eliminar imports duplicados
echo "→ Eliminando duplicados…"
find ./app ./lib ./components -type f -name "*.js" -o -name "*.jsx" | while read file; do
  awk '!seen[$0]++' "$file" > tmpfile && mv tmpfile "$file"
done

# 5. Validar que supabaseClient exista
if [ ! -f "./lib/supabaseClient.js" ]; then
  echo "❌ ERROR: No existe /lib/supabaseClient.js"
  exit 1
fi

# 6. Reconstruir
echo "→ Reconstruyendo proyecto…"
npm run build

# 7. Resultado
if [ $? -eq 0 ]; then
  echo "========================================"
  echo "        🟢 TODO VERDE — PROYECTO OK      "
  echo "========================================"
else
  echo "========================================"
  echo "        🔴 AÚN HAY ARCHIVOS ROTOS        "
  echo "  Envía aquí nuevamente la salida final  "
  echo "========================================"
fi
