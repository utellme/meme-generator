#!/usr/bin/env bash
# Launch the Vibe Coding landing page at http://localhost:3847
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT/vibecoding-studio"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required. Install from https://nodejs.org"
  exit 1
fi

echo ""
echo "  ✨ Vibe Coding landing page"
echo "  → http://localhost:${PORT:-3847}"
echo ""
echo "  Press Ctrl+C to stop"
echo ""

node server.js
