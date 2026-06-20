#!/usr/bin/env bash
# Launch Vibe Coding Studio on http://localhost:3847
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT/vibecoding-studio"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required. Install from https://nodejs.org"
  exit 1
fi

echo "Starting Vibe Coding Studio..."
node server.js
