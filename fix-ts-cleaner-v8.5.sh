#!/bin/bash

echo "============================================"
echo "      VACATION LIVING — TS CLEANER v8.5"
echo "============================================"
echo ""

echo "1) Eliminando tsconfig.json creado por error..."
rm -f tsconfig.json 2>/dev/null

echo "2) Eliminando dependencias innecesarias de TypeScript..."
npm uninstall typescript @types/node @types/react @types/react-dom --silent 2>/dev/null

echo "3) Eliminando archivos .ts o .d.ts accidentales..."
find . -type f -name "*.ts" -delete 2>/dev/null
find . -type f -name "*.d.ts" -delete 2>/dev/null

echo "4) Restaurando configuración ESLint estándar..."
rm -f .eslintrc.json 2>/dev/null

cat << 'EOF' > .eslintrc.json
{
  "extends": "next/core-web-vitals"
}
EOF


echo "5) Limpiando node_modules para evitar errores..."
rm -rf node_modules package-lock.json .next
npm install --legacy-peer-deps --silent

echo ""
echo "============================================"
echo " TS CLEANER COMPLETADO (v8.5)"
echo " Proyecto limpio, sin TypeScript."
echo " Listo para correr AUTO-FIX MASTER v8.5 otra vez."
echo "============================================"