#!/usr/bin/env bash
# Create a git worktree for parallel Cursor agent sessions.
# Usage: ./scripts/new-worktree.sh <name> [branch]
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 <worktree-name> [branch-name]"
  echo ""
  echo "Examples:"
  echo "  $0 meme-draggable-text"
  echo "  $0 studio-links feat/studio-links"
  exit 1
fi

NAME="$1"
BRANCH="${2:-feat/$NAME}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORKTREE_BASE="${CURSOR_WORKTREE_BASE:-$HOME/.cursor/worktrees/ClaudeProject-With-AIDLC}"
PATH_DIR="$WORKTREE_BASE/$NAME"

if [ -d "$PATH_DIR" ]; then
  echo "Worktree already exists: $PATH_DIR"
  exit 1
fi

cd "$REPO_ROOT"
mkdir -p "$WORKTREE_BASE"

if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  git worktree add "$PATH_DIR" "$BRANCH"
else
  git worktree add -b "$BRANCH" "$PATH_DIR" master
fi

cat <<EOF

Worktree ready for a separate Cursor agent session:

  Path:   $PATH_DIR
  Branch: $BRANCH

Open in Cursor:
  cursor "$PATH_DIR"

Or from terminal:
  cd "$PATH_DIR"

List all worktrees:
  git -C "$REPO_ROOT" worktree list

Remove when done:
  git -C "$REPO_ROOT" worktree remove "$PATH_DIR"
EOF
