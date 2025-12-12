#!/bin/bash
echo "======================================================="
echo " 🔧 AUTO-HEAL SUPABASE CLIENT – Versión 4.0 "
echo "   Reparación TOTAL de imports y rutas dañadas"
echo "======================================================="

BASE="./"

echo ""
echo "1) Eliminando variantes corruptas de imports..."
declare -a BROKEN_IMPORTS=(
    "@lib/supabaseClient
    "@lib/supabaseClient
    "@lib/supabaseClient
    "@lib/supabaseClient
    "@lib/supabaseClient
    "@lib/supabaseClient
    "@lib/supabaseClient
    "@lib/supabaseClientx"
    "@lib/supabaseClient
)

for b in "${BROKEN_IMPORTS[@]}"; do
    echo "   → Corrigiendo variante: $b"
    grep -Rl "$b" $BASE | while read file; do
        sed -i "s|$b|@lib/supabaseClient|g" "$file"
        echo "     ✓ $file"
    done
done


echo ""
echo "2) Reparando imports rotos con dobles comillas o comillas simples..."
grep -Rl "@lib/supabaseClient\"" $BASE | xargs sed -i 's|@lib/supabaseClient|@lib/supabaseClient|'
grep -Rl "@lib/supabaseClient $BASE | xargs sed -i "s|'@lib/supabaseClient|@lib/supabaseClient|"


echo ""
echo "3) Verificando existencia del archivo REAL supabaseClient.mjs..."
if [ ! -f "lib/supabaseClient.mjs" ]; then
    echo "   ⚠ No existe lib/supabaseClient.mjs → RECREANDO ARCHIVO"
    cat > lib/supabaseClient.mjs << 'EOF'
"use client";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
export default supabase;
EOF
    echo "   ✓ Archivo recreado correctamente."
else
    echo "   ✓ Archivo existente y verificado."
fi


echo ""
echo "4) Invalidando cache de Next.js..."
rm -rf .next
echo "   ✓ Cache eliminada"


echo ""
echo "5) Construyendo proyecto para validar..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "======================================================="
    echo "   🎉 TODO LISTO: El proyecto construye correctamente"
    echo "   Ahora ejecuta:"
    echo "      npm run dev"
    echo "======================================================="
else
    echo ""
    echo "======================================================="
    echo "   ❌ AÚN QUEDAN ERRORES – Significa que existen TODAVÍA"
    echo "   archivos con imports corruptos que Next.js detectó."
    echo "   Envíame la salida del build y te digo exactamente"
    echo "   qué archivos siguen dañados."
    echo "======================================================="
fi
