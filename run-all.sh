#!/bin/bash
echo "=========================================="
echo " VACATION LIVING — AUTO REPAIR SUITE v4.0"
echo "=========================================="

echo "🔧 Ejecutando fix-imports.sh..."
bash fix-imports.sh

echo "🔧 Ejecutando fix-exports.sh..."
bash fix-exports.sh

echo "🔧 Ejecutando fix-structure.sh..."
bash fix-structure.sh

echo "🔧 Ejecutando fix-missing-styles.sh..."
bash fix-missing-styles.sh

echo "=========================================="
echo " ✨ SISTEMA REPARADO COMPLETAMENTE ✨"
echo "=========================================="
