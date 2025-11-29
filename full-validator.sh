#!/bin/bash
echo "=============================================="
echo " VACATION LIVING — FULL VALIDATOR v2.0"
echo "=============================================="

REPORT="final-report.txt"
rm -f "$REPORT"

echo "=== Validación de CSS ===" >> "$REPORT"
missing_css=$(grep -Rl "@/styles/" app)
if [ -n "$missing_css" ]; then
  echo "⚠ Falta CSS en:" >> "$REPORT"
  echo "$missing_css" >> "$REPORT"
else
  echo "✔ CSS OK" >> "$REPORT"
fi

echo "=== Validación de EXPORT DEFAULT ===" >> "$REPORT"
for f in $(find app -type f -name "page.jsx"); do
  if ! grep -q "export default" "$f"; then
    echo "⚠ Falta export default en $f" >> "$REPORT"
  fi
done

echo "=== Validación FINAL COMPLETA ===" >> "$REPORT"
echo "Revisa final-report.txt"
