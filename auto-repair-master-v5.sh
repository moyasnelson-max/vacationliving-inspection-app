#!/bin/bash
echo "=========================================="
echo " VACATION LIVING AUTO-REPAIR MASTER v5.0"
echo "=========================================="

bash clean-deep.sh
bash verify-structure.sh
bash fix-imports.sh
bash fix-exports.sh
bash fix-missing-styles.sh
bash next-lint-fix.sh
bash vercel-diagnose.sh

echo "=========================================="
echo "    🚀 BUILD LISTO PARA VERCEL"
echo "=========================================="
