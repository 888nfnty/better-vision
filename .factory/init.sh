#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "${script_dir}/.." && pwd)"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required for this mission." >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required for this mission." >&2
  exit 1
fi

cd "${repo_root}"

if [ -f package.json ]; then
  npm install
fi

if [ ! -f components.json ]; then
  npx shadcn@latest init --defaults --force 2>/dev/null || true
fi

missing_components=()

if [ ! -f src/components/ui/card.tsx ]; then
  missing_components+=("card")
fi

if [ ! -f src/components/ui/dialog.tsx ]; then
  missing_components+=("dialog")
fi

if [ ! -f src/components/ui/sheet.tsx ]; then
  missing_components+=("sheet")
fi

if [ ! -f src/components/ui/badge.tsx ]; then
  missing_components+=("badge")
fi

if [ ! -f src/components/ui/separator.tsx ]; then
  missing_components+=("separator")
fi

if [ "${#missing_components[@]}" -gt 0 ]; then
  npx shadcn@latest add "${missing_components[@]}" 2>/dev/null || true
fi
