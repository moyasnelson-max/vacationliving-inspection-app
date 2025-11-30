#!/bin/bash
echo "==============================================="
echo "      VACATION LIVING — TS CLEANER v8.6"
echo "==============================================="

echo "1) Eliminando tsconfig.json basura..."
rm -f tsconfig.json 2>/dev/null

echo "2) Eliminando dependencias innecesarias de TypeScript..."
npm uninstall typescript @types/node @types/react @types/react-dom 2>/dev/null

echo "3) Eliminando archivos .ts y .tsx accidentales..."
find app -type f \( -name "*.ts" -o -name "*.tsx" \) -delete

echo "4) Restaurando configuracion ESLint estándar..."
rm -f .eslintrc.json 2>/dev/null
cat << 'EOC' > .eslintrc.json
{
  "extends": "next/core-web-vitals"
}
EOC

echo "5) Limpiando node_modules y reinstalando..."
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

echo "==============================================="
echo "   TS CLEANER COMPLETADO (v8.6)"
echo "   Proyecto limpio — sin TypeScript"
echo "==============================================="
