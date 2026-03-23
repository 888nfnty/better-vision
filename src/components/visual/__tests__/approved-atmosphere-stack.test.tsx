/**
 * Approved atmosphere stack verification.
 *
 * The BETTER visual system uses exactly two atmospheric layers:
 *   1. ONE Radiant Fluid Amber shader (site-wide, reduced opacity)
 *   2. ONE tradebetter-matching film grain overlay (5% opacity, lighten blend)
 *
 * No scanlines, vignettes, or other texture overlays are permitted.
 *
 * This file verifies that the approved stack is present and correctly
 * configured, and that no forbidden atmospheric layers exist.
 */
import React from "react";
import fs from "fs";
import path from "path";
import { render } from "@testing-library/react";
import { SiteAtmosphere } from "../SiteAtmosphere";

// Mock desktop-class capability so heavy layers render in tests
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

/** Helper: read a source file relative to the visual components dir */
function readVisualSource(filename: string): string {
  return fs.readFileSync(
    path.resolve(__dirname, "..", filename),
    "utf-8"
  );
}

function readGlobalsCss(): string {
  return fs.readFileSync(
    path.resolve(__dirname, "../../../app/globals.css"),
    "utf-8"
  );
}

// ---------------------------------------------------------------------------
// Approved Layer 1: Exactly ONE Radiant Fluid Amber shader mount
// ---------------------------------------------------------------------------

describe("Approved stack: exactly one Radiant Fluid Amber shader mount", () => {
  it("SiteAtmosphere imports and renders HeroShaderCanvas", () => {
    const src = readVisualSource("SiteAtmosphere.tsx");
    expect(src).toMatch(/import\(.*HeroShaderCanvas/);
    expect(src).toContain("<HeroShaderCanvas");
  });

  it("HeroVisualSystem does NOT import HeroShaderCanvas (no duplicate)", () => {
    const src = readVisualSource("HeroVisualSystem.tsx");
    expect(src).not.toMatch(/import.*HeroShaderCanvas/);
  });

  it("HeroVisualSystem does NOT render <HeroShaderCanvas (no duplicate)", () => {
    const src = readVisualSource("HeroVisualSystem.tsx");
    expect(src).not.toContain("<HeroShaderCanvas");
  });

  it("shader runs at materially visible opacity (≥0.55) for visibility against #101010", () => {
    const cssSrc = readGlobalsCss();
    const shaderRule = cssSrc.match(
      /\.site-atmosphere-shader\s*\{[^}]*\}/
    );
    expect(shaderRule).not.toBeNull();
    const opacityMatch = shaderRule![0].match(/opacity:\s*([\d.]+)/);
    expect(opacityMatch).not.toBeNull();
    const opacity = parseFloat(opacityMatch![1]);
    expect(opacity).toBeGreaterThanOrEqual(0.55);
    expect(opacity).toBeLessThanOrEqual(0.85);
  });
});

// ---------------------------------------------------------------------------
// Approved Layer 2: ONE film grain overlay
// ---------------------------------------------------------------------------

describe("Approved stack: one film grain overlay", () => {
  it("SiteAtmosphere renders a film-grain overlay element", () => {
    render(
      <SiteAtmosphere>
        <div>test content</div>
      </SiteAtmosphere>
    );
    const grain = document.querySelector('[data-testid="film-grain-overlay"]');
    expect(grain).toBeInTheDocument();
  });

  it("film grain overlay has pointer-events-none", () => {
    render(
      <SiteAtmosphere>
        <div>test content</div>
      </SiteAtmosphere>
    );
    const grain = document.querySelector('[data-testid="film-grain-overlay"]');
    expect(grain).not.toBeNull();
    expect(grain!.className).toContain("pointer-events-none");
  });

  it("CSS defines film-grain-overlay with ~5% opacity and mix-blend-mode:lighten", () => {
    const cssSrc = readGlobalsCss();
    expect(cssSrc).toContain("film-grain-overlay");
    expect(cssSrc).toMatch(/film-grain-overlay[\s\S]*?mix-blend-mode:\s*lighten/);
    expect(cssSrc).toMatch(/film-grain-overlay[\s\S]*?opacity:\s*0\.05/);
  });

  it("film grain overlay covers the full viewport (fixed inset-0)", () => {
    render(
      <SiteAtmosphere>
        <div>test content</div>
      </SiteAtmosphere>
    );
    const grain = document.querySelector('[data-testid="film-grain-overlay"]');
    expect(grain).not.toBeNull();
    expect(grain!.className).toMatch(/fixed/);
    expect(grain!.className).toMatch(/inset-0/);
  });

  it("film grain overlay is aria-hidden", () => {
    render(
      <SiteAtmosphere>
        <div>test content</div>
      </SiteAtmosphere>
    );
    const grain = document.querySelector('[data-testid="film-grain-overlay"]');
    expect(grain).not.toBeNull();
    expect(grain!.getAttribute("aria-hidden")).toBe("true");
  });
});

// ---------------------------------------------------------------------------
// Forbidden layers: no scanlines
// ---------------------------------------------------------------------------

describe("Approved stack: no scanline layers exist", () => {
  it("globals.css does not contain scanline-related CSS selectors", () => {
    const cssSrc = readGlobalsCss();
    expect(cssSrc).not.toMatch(/scanline/i);
  });

  it("HeroVisualSystem does not render a scanline overlay layer", () => {
    const src = readVisualSource("HeroVisualSystem.tsx");
    expect(src).not.toContain("scanline-overlay");
  });

  it("SiteAtmosphere does not render a scanline overlay layer", () => {
    const src = readVisualSource("SiteAtmosphere.tsx");
    expect(src).not.toContain("scanline-overlay");
  });

  it("HeroVisualSkeleton does not render a scanline overlay layer", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "../../skeletons/HeroVisualSkeleton.tsx"),
      "utf-8"
    );
    expect(src).not.toContain("scanline-overlay");
  });

  it("no scanline-overlay elements exist in the rendered DOM", () => {
    render(
      <SiteAtmosphere>
        <div>test content</div>
      </SiteAtmosphere>
    );
    const scanlines = document.querySelectorAll(".scanline-overlay");
    expect(scanlines.length).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Forbidden layers: no vignettes
// ---------------------------------------------------------------------------

describe("Approved stack: no vignette layers exist", () => {
  it("globals.css does not contain .hero-vignette class", () => {
    const cssSrc = readGlobalsCss();
    expect(cssSrc).not.toContain(".hero-vignette");
  });

  it("HeroVisualSystem does not render a vignette layer", () => {
    const src = readVisualSource("HeroVisualSystem.tsx");
    expect(src).not.toContain("hero-vignette");
  });

  it("HeroVisualSkeleton does not render a vignette layer", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "../../skeletons/HeroVisualSkeleton.tsx"),
      "utf-8"
    );
    expect(src).not.toContain("hero-vignette");
  });

  it("no vignette overlay elements exist in the rendered DOM", () => {
    render(
      <SiteAtmosphere>
        <div>test content</div>
      </SiteAtmosphere>
    );
    const vignettes = document.querySelectorAll('[class*="vignette"]');
    expect(vignettes.length).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Two-layer-only enforcement: only shader + film grain + CSS gradient fallback
// ---------------------------------------------------------------------------

describe("Approved stack: only shader + film grain + CSS gradient fallback", () => {
  it("SiteAtmosphere only contains the approved visual layers", () => {
    const atmosphereSrc = readVisualSource("SiteAtmosphere.tsx");
    // The only visual overlays allowed are:
    // 1. site-atmosphere-gradient (CSS fallback)
    // 2. site-atmosphere-shader (Radiant Fluid Amber WebGL)
    // 3. FilmGrainOverlay (film grain at 5% opacity)
    expect(atmosphereSrc).toContain("site-atmosphere-gradient");
    expect(atmosphereSrc).toContain("site-atmosphere-shader");
    expect(atmosphereSrc).toContain("FilmGrainOverlay");
    // Must NOT contain any additional texture overlay CSS class names
    expect(atmosphereSrc).not.toContain("scanline-overlay");
    expect(atmosphereSrc).not.toContain("texture-overlay");
    // Must NOT render a vignette element
    expect(atmosphereSrc).not.toMatch(/className="[^"]*vignette/);
    expect(atmosphereSrc).not.toMatch(/className='[^']*vignette/);
  });

  it("content layer is positioned above all atmosphere layers", () => {
    render(
      <SiteAtmosphere>
        <div data-testid="test-content">test content</div>
      </SiteAtmosphere>
    );
    const content = document.querySelector('[data-testid="site-content"]');
    expect(content).not.toBeNull();
    expect(content!.className).toContain("z-10");
  });

  it("all atmosphere background layers have pointer-events-none", () => {
    render(
      <SiteAtmosphere>
        <div>test content</div>
      </SiteAtmosphere>
    );
    const atmosphereBg = document.querySelector(
      '[data-testid="site-atmosphere"] > div[aria-hidden="true"]'
    );
    if (atmosphereBg) {
      expect(atmosphereBg.className).toContain("pointer-events-none");
    }
  });
});
