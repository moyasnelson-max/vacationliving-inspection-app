#!/bin/bash
echo "============================================="
echo "  🔧 AUTO-FIX SUPABASE CLIENT v3.0"
echo "============================================="

TARGET="@lib/supabaseClient

echo ""
echo "➤ 1. Corrigiendo imports rotos..."
patterns=(
  "@/lib/supabaseClient"
  "@/lib/supabaseClient.js"
  "@/lib/supabaseClient.mjs"
  "@lib/supabaseClient
  "lib/supabaseClient"
  "lib/supabaseClient.js"
  "lib/supabaseClient.mjs"
)

for p in "${patterns[@]}"; do
  echo "  → Reemplazando: $p  →  $TARGET"
  grep -Rl "$p" app lib | xargs sed -i "s|$p|$TARGET|g" 2>/dev/null
done

echo ""
echo "➤ 2. Eliminando duplicados y extensiones incorrectas..."
grep -Rl "supabaseClient.mjs.mjs" app lib | xargs sed -i "s|.mjs.mjs|.mjs|g" 2>/dev/null

echo ""
echo "➤ 3. Validando imports restantes..."
REMAIN=$(grep -R "@/lib/supabaseClient" app lib)

if [ -z "$REMAIN" ]; then
  echo "  ✔ No quedan imports rotos hacia '@/lib/supabaseClient'"
else
  echo "  ⚠ SIGUEN ROTOS:"
  echo "$REMAIN"
fi

echo ""
echo "➤ 4. Reconstruyendo proyecto..."
npm run build

echo ""
echo "============================================="
echo "   ✔ AUTO-FIX COMPLETO"
echo "   Si no aparece webpack errors → YA ESTÁ LISTO"
echo "   Ejecuta:"
echo "   npm run dev"
echo "============================================="