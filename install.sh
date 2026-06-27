#!/usr/bin/env bash
# ATELIER — standalone install.
# Symlinks each skill in ./skills into ~/.claude/skills so they work without the
# plugin marketplace. Re-run any time; it refreshes the links.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$HERE/skills"
DEST="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"

mkdir -p "$DEST"

echo "ATELIER → linking skills into $DEST"
for skill in "$SRC"/*/; do
  [ -d "$skill" ] || continue
  name="$(basename "$skill")"
  ln -sfn "$skill" "$DEST/$name"
  echo "  ✓ $name"
done

echo "Done. Restart Claude Code (or reload skills) to pick them up."
echo "Marketplace install instead:  /plugin marketplace add $HERE  then  /plugin install atelier"
