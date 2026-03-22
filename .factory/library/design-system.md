# Design System Direction

Authoritative visual direction for the BETTER redesign follow-up.

**What belongs here:** visual thesis, hierarchy rules, token direction, motion language, approved references, and anti-patterns.
**What does NOT belong here:** raw screenshots, long implementation diffs, or validator reports.

---

## Visual Thesis

BETTER should feel like a premium terminal-native market weapon: darker, sharper, more cinematic, and more singular than a generic roadmap or SaaS explainer.

## Approved Reference Anchors

- `tradebetter.app` — primary landing-page composition, brand presence, terminal voice, and urgency
- `radiant-shaders.com` — supporting shader language and premium full-canvas effect strategy
- `https://github.com/NousResearch/hermes-agent/tree/main/skills/creative/ascii-video` — atmospheric ASCII/video system concepts and production-safe pipeline ideas
- OpenAI delightful frontends guidance — one-composition hero, brand first, fewer cards, one job per section, 2-3 intentional motions

## Hard Source Requirement

- The redesign is not acceptable unless the shipped implementation uses concrete resources adapted from **both** Radiant and the Hermes ASCII-video skill.
- Workers must cite the exact URLs/files they adapted in their handoff.
- “Inspired by” is not enough; the delivered site must contain identifiable implementation material from both sources.
- The approved next-pass implementation is specific: use a **vendored real Radiant background asset** and a **real-time ASCII canvas renderer** derived from Hermes pipeline concepts. Do not ship another custom shader + synthetic DOM grid approximation.

## First-Viewport Rules

- BETTER branding must be unmistakable in the first screen.
- The hero must read as one composition, not a dashboard.
- No hero cards unless the card itself is the primary interaction.
- Keep the text payload tight: brand, one dominant promise, one short supporting sentence, one CTA group, one dominant visual plane.
- Use real atmosphere and proof; decorative gradients alone are not enough.

## Section Strategy

Recommended section jobs:
1. Hero / identity / promise
2. Proof / product edge / credibility
3. Workflow or product-depth section
4. Roadmap / future-system explanation
5. Whale-first token power and value flow
6. Final conversion / next action

## Motion Language

- Use 2-3 intentional motions only
- Prefer entrance, scroll-linked depth, and tactile hover/reveal over constant ambient noise
- All motion must remain usable on mobile and degrade cleanly under reduced motion

## Token Direction

- Primary accent: BETTER blue
- Backgrounds: near-black with stronger tonal layering than the current build
- Typography: terminal/mono identity with one restrained supporting sans at most
- Surfaces: reduce bordered-card repetition; favor layout, spacing, dividers, and large modules

## Tooling Direction

- Core implementation candidates: `motion`, `lenis`, `ogl`, `class-variance-authority`, `tailwind-merge`
- Visual verification: `agent-browser` plus Playwright screenshots when useful for reference comparison
- Optional workflow additions if needed: Storybook, design-token tooling, Figma/MCP-based review
- External source inputs that must be concretely represented in the shipped visual system:
  - `https://radiant-shaders.com`
  - `https://github.com/NousResearch/hermes-agent/tree/main/skills/creative/ascii-video`

## Approved Motion Background Path

- Radiant: vendor a real Radiant shader asset/file into the hero/background stack
- Hermes: implement moving ASCII with a canvas renderer rooted in multi-grid composition, glyph mapping, tonemap, feedback, and visible temporal motion
- The enhanced state must look materially stronger than the static fallback state in headed browser testing

## Anti-Patterns

- Generic SaaS card mosaics
- Dense explanatory copy in the hero
- Barely visible shader/ascii treatments that do not materially change the feel of the page
- Multiple competing accent colors
- Decorative motion that reduces readability or trust
- Copying reference sites literally instead of translating their principles into BETTER-specific execution
