#!/bin/bash

echo ""
echo "=========================================="
echo " VACATION LIVING — AUTO FIX PAGES v1.0"
echo "=========================================="
echo ""

REPORT="pages-fix-report.txt"
echo "AUTO FIX PAGES REPORT" > $REPORT
echo "------------------------" >> $REPORT
echo "" >> $REPORT

log() {
  echo "$1"
  echo "$1" >> $REPORT
}

log "→ Buscando pages.jsx sin export default…"
echo "" >> $REPORT

FILES=$(find app -type f -name "page.jsx")

FIXED=0

for file in $FILES; do
  if ! grep -q "export default" "$file"; then
    log "⚠ No tiene export default: $file"

    # insertar export default al final
    echo "" >> "$file"
    echo "export default function Page() { return null; }" >> "$file"

    log "   ✓ FIX aplicado"
    FIXED=$((FIXED+1))
  fi
done

echo "" >> $REPORT
log "=========================================="
log " AUTO FIX COMPLETADO"
log " Total archivos corregidos: $FIXED"
log " Reporte: pages-fix-report.txt"
log "=========================================="
