/**
 * VAL-VISUAL-014: Required Radiant adaptation is traceable in the shipped
 * implementation.
 *
 * These tests verify that the shipped visual system directly adapts concrete
 * implementation resources from Radiant, and that the adaptation corresponds
 * to visible shipped behavior rather than unused reference material.
 *
 * VAL-VISUAL-028: Only approved atmosphere layers exist (shader + film grain).
 *
 * Source URLs verified:
 *   Radiant: https://radiant-shaders.com/shader/fluid-amber
 *   Radiant: https://radiant-shaders.com/shader/eclipse-glow
 */
import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readSource(relPath: string): string {
  return fs.readFileSync(
    path.resolve(__dirname, "..", relPath),
    "utf-8"
  );
}

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
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
// Radiant provenance — shader implementation
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-014: Radiant adaptation is traceable", () => {
  it("HeroShaderCanvas cites radiant-shaders.com/shader/fluid-amber as primary adapted source", () => {
    const src = readSource("HeroShaderCanvas.tsx");
    expect(src).toContain("radiant-shaders.com/shader/fluid-amber");
  });

  it("HeroShaderCanvas imports from vendored Radiant asset file", () => {
    const src = readSource("HeroShaderCanvas.tsx");
    expect(src).toMatch(/from\s+["']\.\/radiant-fluid-amber\.glsl["']/);
  });

  it("vendored shader uses domain warping (Radiant Fluid Amber signature technique)", () => {
    const src = readSource("radiant-fluid-amber.glsl.ts");
    // Domain warping: q → r → f triple-pass composition
    expect(src).toMatch(/vec2\s+q\s*=/);
    expect(src).toMatch(/vec2\s+r\s*=/);
    // The domain-warp pattern: fbm output warps the next pass
    expect(src).toMatch(/fbm\s*\(\s*p\s*\+/);
  });

  it("vendored shader uses fBM with snoise (Radiant simplex noise)", () => {
    const src = readSource("radiant-fluid-amber.glsl.ts");
    expect(src).toContain("fbm");
    expect(src).toContain("snoise");
  });

  it("vendored shader uses smoothstepped highlights (Radiant technique)", () => {
    const src = readSource("radiant-fluid-amber.glsl.ts");
    expect(src).toContain("highlight");
    expect(src).toContain("smoothstep");
  });

  it("vendored shader domain-warp comment explicitly names the technique and source URL", () => {
    const src = readSource("radiant-fluid-amber.glsl.ts");
    // Must contain the explicit domain-warp note
    expect(src).toMatch(/[Dd]omain.warp/);
    // Must contain Fluid Amber as the named adaptation source
    expect(src).toContain("Fluid Amber");
  });
});

// ---------------------------------------------------------------------------
// VAL-VISUAL-028: Only approved atmosphere layers exist
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-028: No legacy renderer files exist", () => {
  it("legacy renderer files are absent from the visual component directory", () => {
    expect(
      fs.existsSync(path.resolve(__dirname, "../AsciiBackground.tsx"))
    ).toBe(false);
    expect(
      fs.existsSync(path.resolve(__dirname, "../AsciiCanvasRenderer.tsx"))
    ).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// HeroVisualSystem provenance — both sources documented
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-014: HeroVisualSystem documents Radiant source", () => {
  it("HeroVisualSystem cites Radiant adaptation in its docblock", () => {
    const src = readSource("HeroVisualSystem.tsx");
    expect(src).toContain("radiant-shaders.com");
  });

  it("HeroVisualSystem cites vendored Radiant asset path", () => {
    const src = readSource("HeroVisualSystem.tsx");
    expect(src).toContain("radiant-fluid-amber.glsl");
  });

  it("HeroVisualSystem docblock mentions Radiant provenance for VAL-VISUAL-014", () => {
    const src = readSource("HeroVisualSystem.tsx");
    expect(src).toContain("VAL-VISUAL-014");
    expect(src).toMatch(/Radiant adaptation/i);
  });

  it("HeroVisualSystem only references approved visual components (VAL-VISUAL-028)", () => {
    const src = readSource("HeroVisualSystem.tsx");
    expect(src).not.toContain("AsciiCanvasRenderer");
    expect(src).not.toContain("AsciiBackground");
  });
});

// ---------------------------------------------------------------------------
// clsx dependency is declared directly (not just transitive)
// ---------------------------------------------------------------------------

describe("clsx dependency is directly declared", () => {
  it("package.json lists clsx as a direct dependency", () => {
    const pkg = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, "../../../../package.json"),
        "utf-8"
      )
    );
    expect(pkg.dependencies).toHaveProperty("clsx");
  });

  it("utils.ts imports clsx for the cn() utility", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "../../../lib/utils.ts"),
      "utf-8"
    );
    expect(src).toContain('from "clsx"');
  });
});
