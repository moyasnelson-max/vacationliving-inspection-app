#!/bin/bash
echo "🧹 Limpiando cache..."

rm -rf .next
rm -rf node_modules
npm install

echo "🧹 Purga lista."
