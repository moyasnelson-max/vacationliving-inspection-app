#!/bin/bash
echo "=========================================="
echo " VALIDANDO Y REPARANDO ESTRUCTURA"
echo "=========================================="

mkdir -p app/styles
mkdir -p app/lib
mkdir -p app/components
mkdir -p app/inspection

echo "✔ Carpetas principales OK"

# Crea carpetas dinámicas para inspection
find app/inspection -type d | while read d; do
  mkdir -p "$d"
done

echo "✔ Estructura corregida"
