#!/bin/bash
echo "=========================================="
echo " REPARANDO IMPORTS — VACATION LIVING"
echo "=========================================="

FILES=$(find app -type f -name "*.jsx")

for f in $FILES; do
  sed -i \
    -e 's#@/styles#../../../../styles#g' \
    -e 's#@/lib/supabase-client#../../../../lib/supabase-client#g' \
    -e 's#@/components#../../../../components#g' \
    "$f"
done

echo "✔ Imports reparados"
