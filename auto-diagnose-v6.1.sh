#!/bin/bash

echo ""
echo "=========================================="
echo " VACATION LIVING — AUTO DIAGNOSE v6.1"
echo "=========================================="
echo ""

REPORT="diagnose-report-v6.1.txt"
echo "VACATION LIVING — AUTO DIAGNOSE v6.1" > $REPORT
echo "=====================================" >> $REPORT
echo "" >> $REPORT

#####################################
# 1. VALIDAR ESTRUCTURA
#####################################

echo "1) Validando estructura Next 14..."
echo "[STRUCTURE]" >> $REPORT

find app -type d | sort | sed 's/^/ - /' >> $REPORT

echo "" >> $REPORT
echo "✓ Estructura indexada" 


#####################################
# 2. DETECTAR IMPORTS ROTOS
#####################################

echo "2) Escaneando imports rotos..."
echo "[IMPORT-ISSUES]" >> $REPORT

find app -type f -name "*.jsx" | while read file; do
  if grep -q "@lib/supabase-client" "$file"; then
     echo "Import incorrecto en $file" >> $REPORT
  fi
  if grep -q "../@lib" "$file"; then
     echo "Import relativo roto en $file" >> $REPORT
  fi
  if grep -q "@styles/" "$file" && ! grep -q "@/styles/" "$file"; then
     echo "Alias incorrecto en $file" >> $REPORT
  fi
done

echo "✓ Escaneo de imports finalizado"
echo ""


#####################################
# 3. DETECTAR CSS FALTANTES
#####################################

echo "3) Verificando CSS faltantes..."
echo "[CSS]" >> $REPORT

CSS_FILES=(
  "inspection-categories.css"
  "inspection-subcategories.css"
  "inspection-close.css"
)

for css in "${CSS_FILES[@]}"; do
  if [ ! -f "styles/$css" ]; then
     echo "Falta styles/$css" >> $REPORT
  fi
done

echo "✓ CSS diagnosticado"
echo ""


#####################################
# 4. VERIFICAR SUPABASE CLIENT
#####################################

echo "4) Revisando supabaseClient..."
echo "[SUPABASE]" >> $REPORT

if [ ! -f "app/lib/supabaseClient.js" ]; then
  echo "❌ Falta app/lib/supabaseClient.js" >> $REPORT
else
  echo "✓ Supabase client encontrado" >> $REPORT
fi

echo ""


#####################################
# 5. VERIFICAR SINTAXIS (Errores comunes)
#####################################

echo "5) Escaneando sintaxis…"
echo "[SYNTAX]" >> $REPORT

find app -type f -name "*.jsx" | while read file; do
  if grep -q "repair_note: repairNote, repairNote" "$file"; then
     echo "Doble propiedad repair_note en $file" >> $REPORT
  fi
done

echo "✓ Sintaxis analizada"
echo ""

echo "=========================================="
echo "   AUTO DIAGNOSE COMPLETADO — v6.1"
echo "=========================================="

echo "Reporte generado: $REPORT"
