#!/bin/bash
echo "🛠 Reconstruyendo aliases v7.0..."

cat > jsconfig.json << 'EOF'
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@styles/*": ["app/styles/*"],
      "@lib/*": ["app/lib/*"],
      "@components/*": ["app/inspection/components/*"]
    }
  }
}
EOF

echo "✅ Aliases reconstruidos."
