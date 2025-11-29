#!/bin/bash
echo "=============================================="
echo " VACATION LIVING — FIX SYNTAX v2.0"
echo "=============================================="

TARGET="app/inspection/[houseId]/submit/review/page.jsx"

if grep -q "repair_note:" "$TARGET"; then
  echo "Corrigiendo error de sintaxis en $TARGET ..."
  sed -i 's/repair_note:/repair_note: repairNote,/g' "$TARGET"
fi

# Cerrar llaves faltantes
sed -i 's/const closeIssue = async () => {/const closeIssue = async () => {/' "$TARGET"

# Validar EOF
if ! tail -1 "$TARGET" | grep -q "}"; then
  echo "Agregando } faltante al final de $TARGET"
  echo "}" >> "$TARGET"
fi

echo "✔ Sintaxis reparada"
