#!/bin/bash
echo "=============================================="
echo " VACATION LIVING — AUTO REPAIR SYSTEM v2.0"
echo "=============================================="

# Limpiar basura
find . -type f -name "*.swp" -delete
find . -type f -name "*.save" -delete
find . -type f -name ".DS_Store" -delete

bash fix-css.sh
bash fix-imports.sh
bash fix-syntax.sh
bash full-validator.sh

git add .
git commit -m "Full Auto-Repair System v2.0 applied"
git push origin main

echo ""
echo "=============================================="
echo "✔ SISTEMA COMPLETO REPARADO"
echo "✔ LISTO PARA DEPLOY EN VERCEL"
echo "=============================================="
