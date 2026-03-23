/**
 * Token purge: blue accent UI, green fills, and body text fix.
 *
 * (a) #455eff must ONLY appear in atmospheric background gradients, never as
 *     a general UI accent on buttons/links/badges. UI accent uses should be
 *     replaced with white (#ffffff).
 *
 * (b) #00ff00 must ONLY appear as status dots, never as filled CTA/badge
 *     backgrounds. The Button "live" variant must not use a green fill.
 *
 * (c) Global body text defaults to #ffffff (--text-primary) — all text is
 *     white per VAL-VISUAL-034.
 */
import * as fs from "fs";
import * as path from "path";

const GLOBALS_CSS = fs.readFileSync(
  path.join(process.cwd(), "src/app/globals.css"),
  "utf-8"
);

describe("Token purge: design-token discipline", () => {
  /* -----------------------------------------------------------------------
   * (a) #455eff electric blue: atmospheric gradients ONLY
   * The CSS custom-property definitions and radial-gradient atmospheric
   * usages are allowed. But the Tailwind mapping --color-accent must NOT
   * resolve to blue — it should be white or gray so that classes like
   * text-accent, bg-accent, border-accent no longer carry #455eff into UI.
   * ----------------------------------------------------------------------- */

  it("--accent-primary still defines #455eff for shader/gradient use", () => {
    expect(GLOBALS_CSS).toContain("--accent-primary: #455eff");
  });

  it("--color-accent does NOT map to --accent-primary (blue) for UI usage", () => {
    // The Tailwind @theme --color-accent must NOT resolve to the blue accent.
    // It should map to white or muted gray instead.
    expect(GLOBALS_CSS).not.toMatch(/--color-accent:\s*var\(--accent-primary\)/);
  });

  it("--color-accent maps to white for UI text/border highlights", () => {
    expect(GLOBALS_CSS).toMatch(/--color-accent:\s*#ffffff/);
  });

  /* -----------------------------------------------------------------------
   * (b) #00ff00 neon green: status dots ONLY, never filled CTA backgrounds
   * ----------------------------------------------------------------------- */

  it("--accent-green still defines #00ff00 for status dots", () => {
    expect(GLOBALS_CSS).toContain("--accent-green: #00ff00");
  });

  /* -----------------------------------------------------------------------
   * (c) Body text defaults to #ffffff via --text-primary (VAL-VISUAL-034: all text white)
   * ----------------------------------------------------------------------- */

  it("body color defaults to --text-primary (#ffffff) — all text is white", () => {
    const bodyRule = GLOBALS_CSS.match(/body\s*\{[^}]*\}/);
    expect(bodyRule).toBeTruthy();
    const bodyContent = bodyRule![0];
    // Must reference --text-primary for body color (white)
    expect(bodyContent).toMatch(/color:\s*var\(--text-primary\)/);
  });

  it("--color-foreground maps to --text-primary (#ffffff) for default body text", () => {
    expect(GLOBALS_CSS).toMatch(/--color-foreground:\s*var\(--text-primary\)/);
  });
});

describe("Token purge: Button live variant uses white/monochrome, not green fill", () => {
  it("Button live variant does not use bg-accent-green", () => {
    const buttonSrc = fs.readFileSync(
      path.join(process.cwd(), "src/components/ui/Button.tsx"),
      "utf-8"
    );
    // The live variant should NOT have a green background fill
    expect(buttonSrc).not.toContain("bg-accent-green");
    // It should use white background like the primary variant
    expect(buttonSrc).toContain("live:");
  });
});

describe("Token purge: LiquidMetalCard ring colors use white/gray, not blue", () => {
  it("active and focused variants do not use rgba(69,94,255,...) rings", () => {
    const cardSrc = fs.readFileSync(
      path.join(process.cwd(), "src/components/LiquidMetalCard.tsx"),
      "utf-8"
    );
    // Active/focused ring should NOT use 69,94,255 (blue) for UI rings
    expect(cardSrc).not.toMatch(/ring-\[rgba\(69,\s*94,\s*255/);
    // Border should not use 69,94,255 for UI borders on focus
    expect(cardSrc).not.toMatch(/border-\[rgba\(69,\s*94,\s*255/);
  });
});
