# Architecture

Intended application architecture and implementation patterns for this mission.

**What belongs here:** App structure, rendering strategy, shared state patterns, visual-system guidance.
**What does NOT belong here:** Environment credentials, port commands, or raw research dumps.

---

- Build a Next.js + TypeScript app with a DOM-first narrative shell and client-only immersive visual layers.
- Prefer App Router patterns unless the scaffold proves a different structure is materially better.
- Keep roadmap branches, token tiers, scenario assumptions, cost bands, and evidence cues in typed local data/content modules.
- Use one shared maturity taxonomy across the site: `Live`, `In progress`, `Planned`, `Speculative`.
- The roadmap surface should combine scroll storytelling with an explorable graph or mindmap interface.
- The scenario engine should separate canonical current BETTER facts from future scenario assumptions and illustrative outputs.
- Heavy visuals must support reduced-motion mode and runtime fallback states without blocking content.
