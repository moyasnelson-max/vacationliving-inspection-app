#!/bin/bash

echo "🔄 Syncing Codespaces → GitHub..."

git add .
git commit -m "sync: auto-update from codespaces"
git push origin main

echo "✅ Sync complete!"
