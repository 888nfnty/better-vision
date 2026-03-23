/**
 * Design-token enforcement tests: forbidden CSS utilities.
 *
 * These tests enforce the rule that:
 * - #455eff is atmospheric-gradient-only (never in border/glow utilities)
 * - #00ff00 is status-dot-only (never in glow utilities)
 *
 * Forbidden utilities that must NOT exist in globals.css:
 * - --border-accent (blue border token)
 * - --color-border-accent (Tailwind theme mapping to blue border)
 * - .glow-accent (blue glow class)
 * - --glow-green (green glow token)
 * - .glow-green (green glow class)
 *
 * These tests prevent reintroduction of forbidden patterns.
 */
import * as fs from "fs";
import * as path from "path";

const GLOBALS_CSS = fs.readFileSync(
  path.join(process.cwd(), "src/app/globals.css"),
  "utf-8",
);

describe("Forbidden CSS utilities enforcement", () => {
  describe("Blue accent tokens must not leak into border/glow utilities", () => {
    it("--border-accent must not exist (blue border violates atmospheric-gradient-only rule)", () => {
      // --border-accent was rgba(69, 94, 255, 0.25) — #455eff in borders
      // is forbidden because #455eff is atmospheric-gradient-only
      expect(GLOBALS_CSS).not.toMatch(/--border-accent\s*:/);
    });

    it("--color-border-accent must not exist (Tailwind mapping to blue border)", () => {
      // --color-border-accent mapped to var(--border-accent) which was blue
      // This made Tailwind's border-accent class resolve to blue
      expect(GLOBALS_CSS).not.toMatch(/--color-border-accent\s*:/);
    });

    it(".glow-accent class must not exist (blue glow violates atmospheric-gradient-only rule)", () => {
      // .glow-accent was a text-shadow glow using rgba(69, 94, 255, ...)
      expect(GLOBALS_CSS).not.toMatch(/\.glow-accent\s*\{/);
    });
  });

  describe("Green accent tokens must not leak into glow utilities", () => {
    it("--glow-green must not exist (green glow violates status-dot-only rule)", () => {
      // --glow-green was 0px 0px 12px 0px rgba(0, 255, 0, 0.5) — #00ff00
      // used as a glow effect, but #00ff00 is status-dot-only
      expect(GLOBALS_CSS).not.toMatch(/--glow-green\s*:/);
    });

    it(".glow-green class must not exist (green glow violates status-dot-only rule)", () => {
      // .glow-green was a text-shadow glow using rgba(0, 255, 0, ...)
      expect(GLOBALS_CSS).not.toMatch(/\.glow-green\s*\{/);
    });
  });

  describe("Permitted atmospheric gradient usage of #455eff", () => {
    it("--accent-primary still defines #455eff for shader/gradient use", () => {
      // #455eff is allowed in atmospheric gradients — just not UI utilities
      expect(GLOBALS_CSS).toContain("--accent-primary: #455eff");
    });

    it("#455eff does not appear in border, glow, text-shadow, or box-shadow definitions", () => {
      // Check that no CSS property using #455eff / rgba(69,94,255) exists
      // outside of atmospheric gradient contexts and variable definitions.
      // Forbidden patterns: --border-*, --glow-*, text-shadow, box-shadow
      // with blue color values.
      const lines = GLOBALS_CSS.split("\n");
      const forbiddenBlueLines = lines.filter((line) => {
        const trimmed = line.trim();
        // Skip comments
        if (
          trimmed.startsWith("*") ||
          trimmed.startsWith("/*") ||
          trimmed.startsWith("//")
        ) {
          return false;
        }
        // Must contain blue reference
        if (!trimmed.includes("455eff") && !trimmed.includes("69, 94, 255")) {
          return false;
        }
        // Check if it's a forbidden context
        const isForbidden =
          trimmed.includes("--border-accent") ||
          trimmed.includes("--color-border-accent") ||
          trimmed.includes("--glow-") ||
          trimmed.includes("text-shadow") ||
          trimmed.includes("box-shadow");
        return isForbidden;
      });
      expect(forbiddenBlueLines).toHaveLength(0);
    });
  });

  describe("Permitted status-dot-only usage of #00ff00", () => {
    it("--accent-green still defines #00ff00 for status dots", () => {
      // #00ff00 is allowed for status dots — just not glow utilities
      expect(GLOBALS_CSS).toContain("--accent-green: #00ff00");
    });

    it("#00ff00 does not appear in glow or text-shadow utilities", () => {
      // Verify no text-shadow or box-shadow using 0, 255, 0 remains
      const lines = GLOBALS_CSS.split("\n");
      const greenGlowLines = lines.filter(
        (line) =>
          (line.includes("0, 255, 0") || line.includes("00ff00")) &&
          (line.includes("text-shadow") || line.includes("box-shadow")) &&
          !line.trim().startsWith("*") &&
          !line.trim().startsWith("/*") &&
          !line.trim().startsWith("//"),
      );
      expect(greenGlowLines).toHaveLength(0);
    });
  });

  describe("White/monochrome glow alternatives", () => {
    it("--glow-white exists as the approved CTA glow effect", () => {
      // White glow is the approved alternative for CTA hover effects
      expect(GLOBALS_CSS).toContain("--glow-white:");
      expect(GLOBALS_CSS).toMatch(
        /--glow-white:.*rgba\(255,\s*255,\s*255/,
      );
    });
  });
});
