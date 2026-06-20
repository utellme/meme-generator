#!/usr/bin/env bash
# Optional: install the VibeCoding CLI globally via npm
set -euo pipefail

echo "Installing VibeCoding CLI (vibecoding-installer)..."
npm install -g vibecoding-installer

echo ""
echo "Done! Next steps:"
echo "  1. Set your API key:  export DEEPSEEK_API_KEY=sk-your-key"
echo "  2. Run the CLI:       vibecoding"
echo "  3. Modes: plan (read-only), agent (default), yolo (full access)"
echo ""
echo "Docs: https://github.com/startvibecoding/vibecoding"
