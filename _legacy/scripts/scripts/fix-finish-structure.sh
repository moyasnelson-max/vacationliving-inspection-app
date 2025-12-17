#!/bin/bash
echo "=== Limpiando carpetas duplicadas de finish ==="

# borrar page.js incorrecto si existe
if [ -f "app/inspection/[houseId]/finish/page.js" ]; then
  rm app/inspection/[houseId]/finish/page.js
  echo "🗑️ Eliminado page.js duplicado"
fi

# si existe otra carpeta finish adentro, eliminarla
if [ -d "app/inspection/[houseId]/finish/finish" ]; then
  rm -rf app/inspection/[houseId]/finish/finish
  echo "🗑️ Eliminada carpeta finish/finish duplicada"
fi

echo "✅ Estructura finish corregida."
