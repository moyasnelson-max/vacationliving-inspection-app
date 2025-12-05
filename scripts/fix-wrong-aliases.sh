#!/bin/bash

echo "🔧 Reparando alias incorrectos '@/lib' y '@/styles' → '@lib' y '@styles' ..."

# Corrige '@/lib/' → '@lib/'
grep -rl "@/lib/" app | xargs sed -i 's/@\/lib\//@lib\//g'

# Corrige '@/styles/' → '@styles/'
grep -rl "@/styles/" app | xargs sed -i 's/@\/styles\//@styles\//g'

echo "✅ Alias reparados correctamente."
