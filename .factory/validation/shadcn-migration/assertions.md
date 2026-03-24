# shadcn Migration — Validation Contract Assertions

---

### VAL-SHADCN-001: shadcn/ui packages installed and configured
shadcn/ui Card, Dialog, and Sheet components are installed in the project. `package.json` includes required shadcn dependencies (e.g. `@radix-ui/react-dialog`, `@radix-ui/react-slot` or equivalent). The project already has `class-variance-authority`, `clsx`, and `tailwind-merge` — these must remain and be used by the new components. A `components.json` (shadcn config) exists at the project root with the correct `style`, `tailwindcss`, and `aliases` configuration.
Evidence: `cat package.json | grep radix`; confirm `components.json` exists; confirm `src/components/ui/card.tsx`, `src/components/ui/dialog.tsx`, `src/components/ui/sheet.tsx` exist.

### VAL-SHADCN-002: Dark theme tokens configured for shadcn
The shadcn theme is configured for dark mode. CSS variables in `globals.css` (or equivalent) define a dark palette: `--background` is near-black, `--foreground` is white, `--card` background uses `rgba(255, 255, 255, 0.04)` or equivalent 4% white opacity, `--card-foreground` is white. The `<html>` or `<body>` element applies the `dark` class or `data-theme="dark"`.
Evidence: Inspect CSS custom properties in `globals.css`; verify `dark` class on root element in layout; confirm no light-mode fallback overrides card styling.

### VAL-SHADCN-003: All LiquidMetalCard imports removed from production components
Zero production component files (non-test, non-storybook) import `LiquidMetalCard`. The 29 production files that currently import it (CaveatFrame, GraphShell, NarrativeCard, MaturityLegend, ProofModule, all tokenomics/*, architecture/*, roadmap/*, and graph/surfaces/*) must exclusively use shadcn `Card`/`CardContent`/`CardHeader` instead. `grep -r "import.*LiquidMetalCard" src/components/ --include="*.tsx" | grep -v __tests__` returns zero results.
Evidence: Run `rg "LiquidMetalCard" src/components/ --glob "*.tsx" -l` excluding `__tests__/` and `LiquidMetalCard.tsx` itself; result must be empty.

### VAL-SHADCN-004: LiquidMetalCard source file removed or deprecated
The file `src/components/LiquidMetalCard.tsx` is either deleted entirely or clearly marked as deprecated with no remaining production imports. If retained for reference, it must not be imported by any component rendered in the app.
Evidence: Check file existence; if present, verify zero non-test imports via grep.

### VAL-SHADCN-005: Card background is near-transparent glass at 4% white opacity
Every shadcn Card surface renders with `background: rgba(255, 255, 255, 0.04)` (or CSS variable equivalent at ~4% opacity). No card has a solid, opaque, or significantly tinted background. This is verified both in CSS custom properties and in computed styles at runtime.
Evidence: Inspect Card component's base styles; check `--card` CSS variable resolves to 4% white; visually confirm cards are near-transparent on all pages.

### VAL-SHADCN-006: Shader background visible through all cards
The WebGL/CSS shader background is clearly visible through every card surface. No `backdrop-filter: blur()` is applied to cards. No opaque intermediary layers exist between the shader canvas and card content. Cards appear as translucent overlays on the animated background.
Evidence: Navigate to each major route (graph, tokenomics, roadmap, architecture); confirm shader animation is visible behind card text; inspect computed styles for absence of `backdrop-filter`.

### VAL-SHADCN-007: Card borders are visible but subtle
All shadcn Card components render with a `1px solid rgba(255, 255, 255, 0.12)` border (or equivalent ~12% white opacity). Borders are perceptible on close inspection but do not dominate the visual hierarchy. No thick, bright, or colored borders appear on any card.
Evidence: Inspect border styles on Card components; visually confirm subtle edge definition across all surfaces.

### VAL-SHADCN-008: Card corner radius is consistent at rounded-lg (8px)
All Card components use `border-radius: 8px` (Tailwind `rounded-lg`). No square corners, excessive rounding, or mixed radii across the site.
Evidence: Inspect `border-radius` on all Card instances; confirm uniform 8px across tokenomics, architecture, roadmap, and graph surfaces.

### VAL-SHADCN-009: Cursor-tracking metallic sheen on card hover
Every shadcn Card surface displays a cursor-tracking radial-gradient metallic sheen when hovered. The sheen center (at cursor position) reaches approximately `rgba(255, 255, 255, 0.38)` intensity with a secondary ring at `rgba(200, 210, 255, 0.12)`. The effect follows `--metal-x` / `--metal-y` CSS custom properties updated via `onMouseMove`. The sheen is clearly visible against the 4% base background.
Evidence: Hover over cards on each major surface; confirm radial highlight follows cursor; inspect inline styles for `radial-gradient` on hover; verify `--metal-x`/`--metal-y` properties update on mouse move.

### VAL-SHADCN-010: Hover state elevates card background to 8% white opacity
On mouse enter, card background transitions from `rgba(255, 255, 255, 0.04)` to `rgba(255, 255, 255, 0.08)`. This subtle brightening is perceptible and combines with the metallic sheen gradient.
Evidence: Hover a card, inspect computed background; confirm 0.08 alpha on hover vs 0.04 at rest.

### VAL-SHADCN-011: Subtle inner glow on hover
Hovered cards display `box-shadow: inset 0 0 30px rgba(255, 255, 255, 0.03)` (or equivalent). The glow adds perceived depth without overwhelming transparency. No outer drop shadows are present.
Evidence: Inspect `box-shadow` on hovered Card; confirm inset glow value; verify no outer shadows.

### VAL-SHADCN-012: All visible text is white — no grey text anywhere
Every text element across all pages renders in white (`#ffffff`, `rgb(255,255,255)`, `text-white`, or `text-foreground` mapped to white). No grey text (`text-gray-*`, `text-zinc-*`, `text-neutral-*`, `text-slate-*`, `text-white/50`, `text-white/60`, `text-white/70`, or any `rgba` with alpha below 1.0 on text) appears in any production component. Secondary text uses smaller font size or lighter font weight — never reduced opacity or grey color.
Evidence: Run `rg "text-(gray|grey|zinc|neutral|slate)-" src/ --glob "*.tsx" -l` excluding test files; result must be empty. Run `rg "text-white/[0-9]" src/ --glob "*.tsx" -l` excluding test files; result must be empty. Visually inspect all surfaces for any non-white text.

### VAL-SHADCN-013: Typography hierarchy uses size and weight, not opacity
Heading text uses `text-lg` or larger with `font-semibold` or `font-bold`. Body text uses `text-sm` or `text-base`. Caption/label text uses `text-xs`. All levels are pure white. Hierarchy is communicated through size and weight differences, never through color opacity reduction.
Evidence: Inspect representative headings, body, and caption elements across graph, tokenomics, and roadmap surfaces; confirm all are `#ffffff` with varying size/weight.

### VAL-SHADCN-014: Proper padding inside cards
All Card components have internal padding of at least `p-4` (16px) for primary content cards and `px-3 py-2` (12px/8px) for compact/nested cards. No card renders text flush against its border. Padding is consistent within each card category.
Evidence: Inspect padding on Card components across all surfaces; verify minimum 8px padding on any card; confirm consistent padding within card tiers (primary vs. nested).

### VAL-SHADCN-015: Consistent spacing between cards
Adjacent cards maintain consistent vertical spacing: `mb-4` (16px) or `mb-6` (24px) between primary section cards, `mb-3` (12px) or `gap-3` between nested cards. Grid layouts use `gap-4` or `gap-6`. No cards overlap or touch edges with zero margin.
Evidence: Inspect margins and gap values between cards in tokenomics (6+ cards per page), roadmap, and architecture views; confirm uniform spacing within each layout context.

### VAL-SHADCN-016: Smooth hover transitions with no jank
Card hover states (background change, sheen appearance, inner glow) transition smoothly with `transition: background 0.2s ease, box-shadow 0.2s ease` or equivalent CSS transition. No visible flickering, jumping, or layout shifts occur on hover enter/leave. The metallic sheen tracks the cursor at ≥30fps without stutter.
Evidence: Rapidly hover on/off cards; confirm smooth fade-in/fade-out of hover effects; move cursor across cards and verify sheen follows without lag; test on at least one low-powered device or throttled CPU.

### VAL-SHADCN-017: No layout shift during card interactions
Hovering, clicking, or interacting with cards does not cause surrounding elements to shift position. Card dimensions remain stable during all interaction states (rest, hover, active, focused).
Evidence: Hover over cards in dense layouts (tokenomics ScenarioSwitcher, VaultCapacityModel); confirm no text reflow or adjacent element movement.

### VAL-SHADCN-018: shadcn Dialog component functional
If Dialog is implemented, it opens/closes smoothly with proper overlay backdrop. Dialog content uses the same near-transparent glass styling. Focus is trapped inside the dialog. Escape key and overlay click dismiss the dialog. Accessible `role="dialog"` and `aria-modal="true"` attributes present.
Evidence: Trigger any dialog; verify overlay, focus trap, keyboard dismiss, and ARIA attributes; inspect dialog card for glass styling.

### VAL-SHADCN-019: shadcn Sheet component functional
If Sheet is implemented, it slides in from the configured edge with smooth animation. Sheet content uses glass styling consistent with cards. Focus trap and dismiss behaviors match Dialog. Proper `role` and ARIA attributes present.
Evidence: Trigger any sheet; verify slide animation, focus management, and dismiss behavior; inspect for glass styling and ARIA compliance.

### VAL-SHADCN-020: All existing tests pass after migration
The full test suite (`npm test` / `jest`) passes with zero failures. This includes existing tests for LiquidMetalCard behavior (adapted to test the new shadcn Card wrapper), liquid-metal-everywhere coverage tests (updated to verify shadcn Card usage), and all surface/component tests.
Evidence: Run `npm test -- --ci`; confirm 0 failures, 0 errors. If LiquidMetalCard-specific tests exist, they must be migrated to validate equivalent behavior on the shadcn Card wrapper.

### VAL-SHADCN-021: liquid-metal-everywhere test updated for shadcn
The test file `src/components/__tests__/liquid-metal-everywhere.test.tsx` is updated to verify that all card surfaces import and use the shadcn Card component (or a wrapper around it) instead of `LiquidMetalCard`. The test still enforces that every card-like surface goes through the centralized card primitive.
Evidence: Read `liquid-metal-everywhere.test.tsx`; confirm it checks for shadcn Card imports (not LiquidMetalCard); run the test and confirm it passes.

### VAL-SHADCN-022: TypeScript build succeeds with no type errors
`npm run typecheck` (or `tsc --noEmit`) completes with zero errors. All shadcn component prop types are correctly applied. No `any` type escapes or `@ts-ignore` comments added during migration.
Evidence: Run `npm run typecheck`; confirm exit code 0 and zero error output. Run `rg "@ts-ignore|@ts-expect-error" src/ --glob "*.tsx" -l` and confirm no new suppressions added during this milestone.

### VAL-SHADCN-023: Production build succeeds
`npm run build` (Next.js build) completes successfully with exit code 0. No build warnings related to missing imports, unused variables from the migration, or shadcn configuration issues. Bundle size does not regress by more than 10% compared to pre-migration baseline.
Evidence: Run `npm run build`; confirm successful completion; compare `.next` output size or build log bundle stats to pre-migration baseline.

### VAL-SHADCN-024: ESLint passes with no new violations
`npm run lint` completes with zero errors. No new lint suppressions (`eslint-disable`) added during migration. Import ordering and unused import rules pass.
Evidence: Run `npm run lint`; confirm zero errors; diff lint config and source for new `eslint-disable` comments.

### VAL-SHADCN-025: Card variant system preserved
The three card variants (`default`, `active`, `focused`) from LiquidMetalCard are preserved in the shadcn Card wrapper. `active` variant applies `ring-1 ring-[rgba(255,255,255,0.12)]`. `focused` variant applies `ring-1 ring-[rgba(255,255,255,0.40)]` with brighter border. Variant prop is typed and enforced.
Evidence: Render cards with each variant; inspect ring and border styles; verify TypeScript enforces valid variant values.

### VAL-SHADCN-026: No hardcoded color values outside design tokens
All card-related colors (background, border, text, sheen) reference CSS custom properties or Tailwind utility classes mapped to the design system. No raw hex codes or `rgba()` values scattered across 29+ component files — they are centralized in the Card component or CSS variables.
Evidence: Grep production components (excluding the Card primitive itself) for raw `rgba(255` patterns; result should be minimal/zero, with values centralized in the Card wrapper or `globals.css`.

### VAL-SHADCN-027: Nested card styling is consistent
Cards nested inside other cards (e.g., compact `px-3 py-2` stat cards inside larger `p-4` section cards) maintain consistent glass styling at both levels. Inner cards have the same transparency, border, and hover behavior as outer cards. No visual conflicts from layered semi-transparent backgrounds.
Evidence: Inspect nested card patterns in TokenUtilitySurface, ValuationCorridors, FirstVaultPolicy; confirm both card levels show glass styling and cursor-tracking sheen independently.

### VAL-SHADCN-028: Card `as` polymorphic prop preserved or equivalent
LiquidMetalCard's `as` prop (allowing render as `button`, `details`, etc.) is preserved in the shadcn migration via `asChild` pattern, Slot, or equivalent. Components like `RoadmapAtlas` that use `<LiquidMetalCard as="details">` continue to render the correct semantic element.
Evidence: Check `RoadmapAtlas.tsx` for `<details>` rendering; verify other polymorphic usages still produce correct HTML elements; inspect DOM for semantic accuracy.

### VAL-SHADCN-029: data-testid attributes preserved on all cards
All existing `data-testid` attributes on LiquidMetalCard instances are preserved on the migrated shadcn Card components. Test selectors continue to work without modification. Default `data-testid="liquid-metal-card"` may be updated to a new default, but explicit test IDs (e.g., `data-testid="vault-modeled-allocation"`, `data-testid="evidence-explainer"`) must be unchanged.
Evidence: Run `rg "data-testid" src/components/ --glob "*.tsx"` and compare count/values pre- and post-migration; confirm all explicit test IDs are present in the migrated code.

### VAL-SHADCN-030: globals.css updated to remove LiquidMetalCard references
Comments and CSS rules in `src/app/globals.css` referencing `LiquidMetalCard` are updated to reflect the shadcn Card migration. No stale documentation references remain that could mislead future developers.
Evidence: Read `globals.css` and search for "LiquidMetalCard"; confirm zero references or that references are updated to describe the shadcn Card system.

### VAL-SHADCN-031: No grey or muted text in card content
Within card bodies specifically, all text elements — including labels, values, descriptions, and captions — render as pure white. No `text-muted-foreground`, `text-muted`, `opacity-70`, or similar muting patterns appear inside cards. Content hierarchy within cards uses font size and weight only.
Evidence: Inspect text inside cards on every major surface; confirm computed `color` is `rgb(255, 255, 255)` for all text nodes; grep for `text-muted` in production components.

### VAL-SHADCN-032: ui/index.ts barrel export updated
The barrel export file `src/components/ui/index.ts` is updated to export the new Card, Dialog, and Sheet components alongside existing Button, Section, and Heading exports.
Evidence: Read `src/components/ui/index.ts`; confirm `Card`, `CardContent`, `CardHeader`, `CardFooter`, `Dialog`, `Sheet` (and sub-components) are exported.
