#!/usr/bin/env bash
# Launch Meme Generator on http://localhost:3848
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT/meme-generator"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required. Install from https://nodejs.org"
  exit 1
fi

echo "Starting Meme Generator..."
node server.js
