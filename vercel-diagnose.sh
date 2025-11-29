#!/bin/bash
echo "======================================"
echo "   VERCEL AUTO DIAGNOSE v5.0"
echo "======================================"

LOG=".vercel/output.log"

if [ ! -f "$LOG" ]; then
  echo "❌ No se encontró .vercel/output.log"
  echo "Asegúrate de haber hecho un deploy."
  exit 1
fi

echo "✔ Analizando log de Vercel..."
ERROR=$(grep -i "Module not found" "$LOG")
SLUG=$(grep -i "slug" "$LOG")
EOFERR=$(grep -i "Unexpected eof" "$LOG")

if [ ! -z "$ERROR" ]; then
  echo "------------------------------------"
  echo "❌ ERROR: Module not found detectado:"
  echo "$ERROR"
  echo "------------------------------------"
  echo "Intentando corregir imports..."
  bash fix-imports.sh
fi

if [ ! -z "$SLUG" ]; then
  echo "------------------------------------"
  echo "❌ ERROR: Conflicto de slugs detectado:"
  echo "$SLUG"
  echo "------------------------------------"
  echo "Arreglando rutas dinámicas..."
  bash fix-structure.sh
fi

if [ ! -z "$EOFERR" ]; then
  echo "------------------------------------"
  echo "❌ ERROR: Unexpected EOF encontrado:"
  echo "$EOFERR"
  echo "------------------------------------"
  echo "Arreglando con fix-exports..."
  bash fix-exports.sh
fi

echo "======================================"
echo "✔ Diagnóstico completado"
