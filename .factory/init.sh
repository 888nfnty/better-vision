#!/usr/bin/env bash
set -euo pipefail

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required for this mission." >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required for this mission." >&2
  exit 1
fi

if [ -f package.json ]; then
  npm install
fi

# Initialize shadcn (idempotent)
npx shadcn@latest init --defaults --force 2>/dev/null || true

# Add shadcn components (idempotent) — exclude button to preserve custom BETTER Button.tsx
npx shadcn@latest add card dialog sheet badge separator --overwrite 2>/dev/null || true
