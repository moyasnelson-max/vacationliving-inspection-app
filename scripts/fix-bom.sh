#!/bin/bash

echo "🔧 Limpiando BOM y caracteres invisibles en todos los archivos .js y .jsx..."

find app lib -type f \( -name "*.js" -o -name "*.jsx" \) | while read f; do
  # Limpia BOM y caracteres invisibles ANSI al inicio
  sed -i '1s/^\xEF\xBB\xBF//; 1s/^[\x00-\x1F]*//' "$f"
  echo "✔ Limpio: $f"
done

echo "🎉 Limpieza completada."
