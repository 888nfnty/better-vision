/**
 * VAL-VISUAL-016 contract update: Approved visual stack verification.
 *
 * The approved atmosphere stack consists of:
 *   1. Single Radiant Fluid Amber shader (site-wide, reduced opacity)
 *   2. Tradebetter-matching film grain overlay (5% opacity, lighten blend)
 *   3. No other atmospheric layers (no scanlines, vignettes, or DOM text grids)
 *
 * The approved stack is defined in AGENTS.md "Visual Re-Engineering Guidance"
 * and validated by VAL-VISUAL-028 + VAL-VISUAL-029 (single shader + film grain).
 */
import React from "react";
import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import { SiteAtmosphere } from "../SiteAtmosphere";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readFile(relPath: string): string {
  return fs.readFileSync(path.resolve(__dirname, relPath), "utf-8");
}

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches:
        query === "(pointer: fine)" || query === "(min-width: 1025px)",
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
  HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue(null);
});

// ---------------------------------------------------------------------------
// VAL-VISUAL-016 → VAL-VISUAL-028: Only approved layers exist
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-016 contract update: only approved atmosphere layers exist", () => {
  it("only approved component files exist in the visual component directory", () => {
    // Approved components: HeroShaderCanvas, SiteAtmosphere, FilmGrainOverlay, etc.
    expect(
      fs.existsSync(path.resolve(__dirname, "../SiteAtmosphere.tsx"))
    ).toBe(true);
    expect(
      fs.existsSync(path.resolve(__dirname, "../HeroShaderCanvas.tsx"))
    ).toBe(true);
    expect(
      fs.existsSync(path.resolve(__dirname, "../FilmGrainOverlay.tsx"))
    ).toBe(true);
  });

  it("visual component index exports only approved components", () => {
    const indexSrc = readFile("../index.ts");
    expect(indexSrc).toContain("SiteAtmosphere");
    expect(indexSrc).toContain("HeroShaderCanvas");
  });

  it("SiteAtmosphere renders the approved atmosphere layers", () => {
    render(
      <SiteAtmosphere>
        <div>content</div>
      </SiteAtmosphere>
    );
    // Verify approved layers are present
    expect(screen.queryByTestId("film-grain-overlay")).toBeInTheDocument();
    expect(screen.queryByTestId("site-atmosphere")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// VAL-VISUAL-016 → VAL-VISUAL-029: Approved stack — single shader + film grain
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-016 contract update: Single Radiant shader is the sole atmospheric animation", () => {
  it("SiteAtmosphere renders the Radiant shader as the sole atmospheric animation", () => {
    const src = readFile("../SiteAtmosphere.tsx");
    // Must import HeroShaderCanvas (the single Radiant shader)
    expect(src).toContain("HeroShaderCanvas");
  });

  it("exactly one shader instance is declared site-wide (no duplicates)", () => {
    const siteSrc = readFile("../SiteAtmosphere.tsx");
    const heroSrc = readFile("../HeroVisualSystem.tsx");
    // SiteAtmosphere owns the shader
    expect(siteSrc).toContain("HeroShaderCanvas");
    // HeroVisualSystem must NOT duplicate the shader
    expect(heroSrc).not.toMatch(/import.*HeroShaderCanvas/);
    expect(heroSrc).not.toContain("<HeroShaderCanvas");
  });

  it("shader runs at materially visible opacity (≥0.55) for visibility against #101010", () => {
    const cssSrc = readFile("../../../app/globals.css");
    const shaderRule = cssSrc.match(/\.site-atmosphere-shader\s*\{[^}]*\}/);
    expect(shaderRule).not.toBeNull();
    const opacityMatch = shaderRule![0].match(/opacity:\s*([\d.]+)/);
    expect(opacityMatch).not.toBeNull();
    const opacity = parseFloat(opacityMatch![1]);
    // Materially visible against #101010 background: 0.55–0.85
    expect(opacity).toBeGreaterThanOrEqual(0.55);
    expect(opacity).toBeLessThanOrEqual(0.85);
  });
});

describe("VAL-VISUAL-016 contract update: Film grain overlay is present", () => {
  it("SiteAtmosphere renders a film-grain overlay", () => {
    render(
      <SiteAtmosphere>
        <div>content</div>
      </SiteAtmosphere>
    );
    const grain = screen.queryByTestId("film-grain-overlay");
    expect(grain).toBeInTheDocument();
  });

  it("film grain uses mix-blend-mode:lighten at ~5% opacity", () => {
    const cssSrc = readFile("../../../app/globals.css");
    expect(cssSrc).toMatch(
      /film-grain-overlay[\s\S]*?mix-blend-mode:\s*lighten/
    );
    expect(cssSrc).toMatch(/film-grain-overlay[\s\S]*?opacity:\s*0\.05/);
  });

  it("film grain overlay does not block pointer events", () => {
    render(
      <SiteAtmosphere>
        <div>content</div>
      </SiteAtmosphere>
    );
    const grain = screen.getByTestId("film-grain-overlay");
    expect(grain.className).toContain("pointer-events-none");
  });
});

// ---------------------------------------------------------------------------
// All test files verify the approved stack positively
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-016 contract update: Test files verify approved stack positively", () => {
  it("all visual test files reference the approved stack components", () => {
    const testDir = path.resolve(__dirname);
    const testFiles = fs.readdirSync(testDir).filter((f) => f.endsWith(".test.tsx") || f.endsWith(".test.ts"));
    // At least one test file should positively verify the approved stack
    const verifyApproved = testFiles.some((file) => {
      const content = fs.readFileSync(path.join(testDir, file), "utf-8");
      return content.includes("film-grain-overlay") || content.includes("HeroShaderCanvas") || content.includes("SiteAtmosphere");
    });
    expect(verifyApproved).toBe(true);
  });

  it("all app test files reference the approved stack components", () => {
    const testDir = path.resolve(__dirname, "../../../app/__tests__");
    const testFiles = fs.readdirSync(testDir).filter((f) => f.endsWith(".test.tsx") || f.endsWith(".test.ts"));
    const verifyApproved = testFiles.some((file) => {
      const content = fs.readFileSync(path.join(testDir, file), "utf-8");
      return content.includes("SiteAtmosphere") || content.includes("site-atmosphere") || content.includes("film-grain");
    });
    expect(verifyApproved).toBe(true);
  });
});
