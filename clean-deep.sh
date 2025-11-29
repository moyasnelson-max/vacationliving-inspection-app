#!/bin/bash
echo "======================================"
echo "   LIMPIEZA PROFUNDA DEL PROYECTO"
echo "======================================"

rm -rf node_modules
rm -rf .next
rm -rf .vercel
rm -rf .cache
find . -name ".DS_Store" -delete
find . -name "*.swp" -delete
find . -name "*.save" -delete

echo "✔ Instalando dependencias limpias..."
npm install

echo "✔ Proyecto limpio y reinstalado"
