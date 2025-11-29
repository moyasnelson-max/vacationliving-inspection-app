#!/bin/bash
echo "🔄 Reparando rutas dinámicas..."

find app/inspection -type d -name "[id]" -exec bash -c '
  mv "$1" "${1%/*}/[categoryId]" 2>/dev/null || true
' bash {} \;

find app/inspection -type d -name "[subcategoryId]" -exec bash -c '
  mv "$1" "${1%/*}/[issueId]" 2>/dev/null || true
' bash {} \;

echo "✅ Rutas dinámicas reparadas."
