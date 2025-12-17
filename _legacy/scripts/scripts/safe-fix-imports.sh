#!/bin/bash

echo "--------------------------------------"
echo " SAFE FIX IMPORTS v2 — MODO SEGURO "
echo "--------------------------------------"

echo ""
echo "1) Corrigiendo imports corruptos '@@lib/supabaseClient' ..."
FILES=$(grep -Rl "@@lib/supabaseClient" app lib)

if [ -z "$FILES" ]; then
  echo "✔ No se encontraron imports corruptos"
else
  echo "$FILES"
  for f in $FILES; do
    sed -i 's|@@lib/supabaseClient|@lib/supabaseClient|g' "$f"
  done
fi

echo ""
echo "2) Eliminando caracteres invisibles corruptos ..."
BADCHARS=$(grep -RIl $'\001' app lib)

if [ -z "$BADCHARS" ]; then
  echo "✔ No hay caracteres invisibles dañinos"
else
  echo "$BADCHARS"
  for f in $BADCHARS; do
    sed -i $'s|\001||g' "$f"
  done
fi

echo ""
echo "3) Verificando syntax de manera segura ..."
npm run build --silent > /tmp/buildlog.txt 2>&1

if grep -q "Unexpected token" /tmp/buildlog.txt || grep -q "Unterminated string" /tmp/buildlog.txt; then
  echo "❌ Aún existen archivos rotos"
  echo "Revisa: /tmp/buildlog.txt"
else
  echo "✔ No hay errores de sintaxis"
fi

echo ""
echo "--------------------------------------"
echo " SAFE FIX IMPORTS — COMPLETADO "
echo "--------------------------------------"
