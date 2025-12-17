#!/bin/bash

# 🔥 1. Matar cualquier proceso zombie de Next
pkill -f "next" >/dev/null 2>&1
pkill -f "node .*next" >/dev/null 2>&1

echo "Limpiando procesos viejos..."

sleep 1

# 🔥 2. Buscar el primer puerto REALMENTE libre
port=3000

while true; do
  # Verifica si el puerto responde
  nc -z localhost $port >/dev/null 2>&1

  if [ $? -eq 0 ]; then
    # Está ocupado, pasar al siguiente
    echo "Puerto $port ocupado → buscando otro..."
    port=$((port+1))
  else
    # Puerto libre real
    break
  fi
done

echo "✔️ Puerto disponible: $port"
echo "Iniciando Next.js en el puerto $port..."

# 🔥 3. Ejecutar Next con ese puerto
exec npx next dev -p $port
