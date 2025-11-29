#!/bin/bash
echo "🔎 Deep Scan v7.0 – Buscando errores..."

echo "📌 Archivos con imports rotos:"
grep -R "Cannot resolve" -n .

echo "📌 Archivos con alias '@/' incorrecto:"
grep -R "@/lib" -n app

echo "📌 Archivos vacíos importantes:"
find app -type f -empty

echo "📌 Rutas dinámicas detectadas:"
find app/inspection -name "[*]"

echo "📌 Scaneo completo."
