#!/bin/bash
echo "======================================"
echo " VALIDANDO ESTRUCTURA NEXT 14"
echo "======================================"

REQUIRED_DIRS=(
  "app/lib"
  "app/styles"
  "app/components"
  "app/inspection"
)

for d in "${REQUIRED_DIRS[@]}"; do
  if [ ! -d "$d" ]; then
    mkdir -p "$d"
    echo "✔ Creado: $d"
  fi
done

# Detecta duplicados
DUPS=$(find app -type f -name "page.jsx" | sed 's/\/page.jsx//' | sort | uniq -d)

if [ ! -z "$DUPS" ]; then
  echo "❌ Detectados directorios duplicados:"
  echo "$DUPS"
fi

echo "✔ Estructura validada"
