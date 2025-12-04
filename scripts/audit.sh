#!/bin/bash

echo "======================================="
echo " VACATION LIVING - AUTO AUDIT v1"
echo "======================================="

echo ""
echo "🔍 1) Revisando imports rotos..."
grep -R "from '@" -n app | grep -v ".next"

echo ""
echo "🔍 2) Revisando rutas que no existen..."
grep -R "@/components" -n app
grep -R "@/lib" -n app

echo ""
echo "🔍 3) Verificando existencia de archivos reales..."
ls app/components
ls app/lib

echo ""
echo "🔍 4) Verificando variables de entorno..."
grep -R "NEXT_PUBLIC_SUPABASE" -n .

echo ""
echo "🔍 5) Verificando estructura pública (public/)..."
ls public

echo ""
echo "🔍 6) Validando imports de imágenes..."
grep -R "Image" -n app | grep "/"

echo ""
echo "🔍 7) Validando que no existan imports duplicados..."
grep -R "supabase" -n app

echo ""
echo "🔍 8) Simulando build para detectar errores..."
npm run build --silent

echo ""
echo "=================================================="
echo " AUTO AUDIT FINALIZADA "
echo "=================================================="