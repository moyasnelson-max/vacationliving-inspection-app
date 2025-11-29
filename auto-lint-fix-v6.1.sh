#!/bin/bash

echo ""
echo "=========================================="
echo " VACATION LIVING — AUTO LINT FIX v6.1"
echo "=========================================="
echo ""

###########################################
# 1. AÑADIR "use client" DONDE FALTA
###########################################

echo "1) Insertando use client donde falta..."

find app -type f -name "*.jsx" | while read file; do
  if grep -q "use client" "$file"; then
    continue
  fi
  # Detectamos componentes interactivos
  if grep -q "useState\|onClick\|onChange\|supabase" "$file"; then
     sed -i '' '1s/^/\"use client\";\n/' "$file"
     echo "→ Añadido use client en: $file"
  fi
done

echo ""


###########################################
# 2. FORMATO DE IMPORTS
###########################################

echo "2) Normalizando alias en imports..."

find app -type f -name "*.jsx" | while read file; do
  sed -i '' 's|@styles/|@/styles/|g' "$file"
  sed -i '' 's|@components/|@/components/|g' "$file"
  sed -i '' 's|@lib/|@/lib/|g' "$file"
done

echo "✓ Imports normalizados"
echo ""


###########################################
# 3. CORREGIR COMILLAS Y ; (automático)
###########################################

echo "3) Limpiando comillas y puntos y coma..."

find app -type f -name "*.jsx" | while read file; do
  sed -i '' 's|;;|;|g' "$file"
done

echo ""


###########################################
# 4. LIMPIEZA FINAL
###########################################

echo "4) Eliminando basura…"

find . -type f -name "*.swp" -delete
find . -type f -name "*.save" -delete
find . -type f -name ".DS_Store" -delete

echo "✓ Limpieza completa"


echo ""
echo "=========================================="
echo " AUTO LINT FIX COMPLETADO — v6.1"
echo "=========================================="
