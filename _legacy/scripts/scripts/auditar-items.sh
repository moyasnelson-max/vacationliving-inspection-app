#!/bin/bash

echo "=== AUDITORÍA ITEMS ==="

if [ -f "app/inspection/[houseId]/items/page.jsx" ]; then
  echo "✔ Existe page.jsx"
else
  echo "❌ FALTA: app/inspection/[houseId]/items/page.jsx"
fi

echo ""
echo "=== Buscando imports rotos en ITEMS ==="
grep -R "from .*items" -n app || echo "✔ Sin imports incorrectos detectados"

echo ""
echo "=== Validación final ==="
echo "Estructura correcta excepto si falta el archivo."
