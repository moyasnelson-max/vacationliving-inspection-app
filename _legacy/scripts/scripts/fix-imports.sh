#!/bin/bash
echo "=== Reparando imports según jsconfig.json ==="

# 1) Arreglar imports rotos a lib
find ./app -type f -name "*.jsx" -o -name "*.js" | while read file; do
  sed -i 's#@"\/lib/#"@\/lib\/#g' "$file"
done

# 2) Arreglar imports a components
find ./app -type f -name "*.jsx" -o -name "*.js" | while read file; do
  sed -i 's#@"\/components/#"@\/components\/#g' "$file"
done

# 3) Arreglar imports a styles
find ./app -type f -name "*.jsx" -o -name "*.js" | while read file; do
  sed -i 's#@"\/styles/#"@\/styles\/#g' "$file"
done

echo "✅ Imports corregidos correctamente."