#!/bin/bash

echo ""
echo "=========================================="
echo " VACATION LIVING — STRUCTURE BUILDER v6.1"
echo "=========================================="
echo ""

REQUIRED_DIRS=(
  "app/inspection"
  "app/inspection/[houseId]"
  "app/inspection/[houseId]/categories"
  "app/inspection/[houseId]/categories/[id]"
  "app/inspection/[houseId]/close"
  "app/inspection/[houseId]/issues"
  "app/inspection/[houseId]/media"
  "app/inspection/[houseId]/items"
  "app/lib"
  "styles"
)

echo "1) Validando carpetas requeridas…"

for dir in "${REQUIRED_DIRS[@]}"; do
  if [ ! -d "$dir" ]; then
    echo "→ Creando $dir"
    mkdir -p "$dir"
  else
    echo "✓ Existe: $dir"
  fi
done

echo ""
echo "=========================================="
echo "STRUCTURE BUILDER v6.1 — COMPLETADO"
echo "=========================================="
