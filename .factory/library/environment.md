# Environment

Environment variables, external dependencies, and setup notes.

**What belongs here:** Required tooling, deployment constraints, external account/setup facts.
**What does NOT belong here:** Service ports/commands (use `.factory/services.yaml`).

---

- Repo root: `/Users/test/vision`
- Runtime: `node v24.14.0`, `npm 11.9.0`
- `pnpm` is not available and should not be introduced
- Reserved mission ports: `3100-3104` with `3100` as the primary app port
- No databases, queues, or containerized services are part of this mission
- `gh` is authenticated and may be used for repository creation/push
- Global `vercel` CLI is not installed; use `npx vercel` if deployment requires it
- Playwright CLI is available via `npx playwright` and has already been used to capture redesign reference screenshots
- BETTER reference sources are read-only:
  - `/Users/test/tradebetter-docs`
  - `/Users/test/better`
- Public redesign references already captured to `/Users/test/vision/.factory/research/screenshots/`:
  - `vision-current-hero.png`
  - `tradebetter-hero.png`
  - `radiant-hero.png`
- User-provided favicon source asset (read-only, import into repo as needed):
  - `/Users/test/Downloads/Better_Design/Logo/Better_Isotype_Light.svg`
