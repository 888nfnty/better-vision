/**
 * VAL-VISUAL-014: Required Radiant and Hermes adaptations are both traceable
 * in the shipped implementation.
 *
 * These tests verify that the shipped visual system directly adapts concrete
 * implementation resources from both Radiant and Hermes ASCII-video, and that
 * each adaptation corresponds to visible shipped behavior rather than unused
 * reference material or inspiration-only treatment.
 *
 * Source URLs verified:
 *   Radiant: https://radiant-shaders.com/shader/fluid-amber
 *   Radiant: https://radiant-shaders.com/shader/eclipse-glow
 *   Hermes:  https://github.com/NousResearch/hermes-agent/tree/main/skills/creative/ascii-video
 *   Hermes:  https://github.com/NousResearch/hermes-agent/blob/main/skills/creative/ascii-video/references/architecture.md
 *   Hermes:  https://github.com/NousResearch/hermes-agent/blob/main/skills/creative/ascii-video/references/effects.md
 *   Hermes:  https://github.com/NousResearch/hermes-agent/blob/main/skills/creative/ascii-video/references/composition.md
 */
import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import { AsciiBackground } from "../AsciiBackground";
import { VisualEffectsProvider } from "../VisualEffectsProvider";

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

  it("HeroShaderCanvas cites radiant-shaders.com/shader/eclipse-glow as supporting adapted source", () => {
    const src = readSource("HeroShaderCanvas.tsx");
    expect(src).toContain("radiant-shaders.com/shader/eclipse-glow");
  });

  it("shader uses domain warping (Radiant Fluid Amber signature technique)", () => {
    const src = readSource("HeroShaderCanvas.tsx");
    // Domain warping: field1 feeds into field2's coordinates
    expect(src).toContain("field1");
    expect(src).toContain("field2");
    // The domain-warp pattern: one fBM output warps the next
    expect(src).toMatch(/fbm\([\s\S]*\+[\s\S]*field1/);
  });

  it("shader uses fBM with inter-octave rotation (Radiant turbulence technique)", () => {
    const src = readSource("HeroShaderCanvas.tsx");
    expect(src).toContain("fbm");
    // Rotation between octaves
    expect(src).toMatch(/mat2[\s\S]*cos[\s\S]*sin/);
  });

  it("shader uses smoothstepped caustic highlights (Radiant Eclipse Glow adaptation)", () => {
    const src = readSource("HeroShaderCanvas.tsx");
    expect(src).toContain("caustic");
    expect(src).toContain("smoothstep");
  });

  it("shader domain-warp comment explicitly names the adapted technique and source URL", () => {
    const src = readSource("HeroShaderCanvas.tsx");
    // Must contain the explicit domain-warp adaptation note
    expect(src).toMatch(/[Dd]omain.warp/);
    // Must contain Fluid Amber as the named adaptation source
    expect(src).toContain("Fluid Amber");
  });
});

// ---------------------------------------------------------------------------
// Hermes provenance — ASCII atmosphere implementation
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-014: Hermes ASCII-video adaptation is traceable", () => {
  it("AsciiBackground cites the Hermes ascii-video repository as adapted source", () => {
    const src = readSource("AsciiBackground.tsx");
    expect(src).toContain(
      "https://github.com/NousResearch/hermes-agent/tree/main/skills/creative/ascii-video"
    );
  });

  it("AsciiBackground cites Hermes architecture.md for character palettes", () => {
    const src = readSource("AsciiBackground.tsx");
    expect(src).toContain("architecture.md");
    expect(src).toContain("PAL_BOX");
  });

  it("AsciiBackground cites Hermes PAL_BLOCKS palette adaptation", () => {
    const src = readSource("AsciiBackground.tsx");
    expect(src).toContain("PAL_BLOCKS");
  });

  it("AsciiBackground cites Hermes PAL_HERMES project-specific palette", () => {
    const src = readSource("AsciiBackground.tsx");
    expect(src).toContain("PAL_HERMES");
  });

  it("AsciiBackground uses box-drawing characters from Hermes PAL_BOX", () => {
    const src = readSource("AsciiBackground.tsx");
    // PAL_BOX characters: ─│┌┐└┘├┤┬┴┼
    expect(src).toContain("┌");
    expect(src).toContain("┐");
    expect(src).toContain("└");
    expect(src).toContain("┘");
    expect(src).toContain("│");
    expect(src).toContain("─");
  });

  it("AsciiBackground uses block elements from Hermes PAL_BLOCKS", () => {
    const src = readSource("AsciiBackground.tsx");
    // PAL_BLOCKS characters: ░▒▓
    expect(src).toContain("░");
    expect(src).toContain("▒");
    expect(src).toContain("▓");
  });

  it("AsciiBackground cites Hermes layer hierarchy (composition.md)", () => {
    const src = readSource("AsciiBackground.tsx");
    expect(src).toContain("composition.md");
    expect(src).toMatch(/layer hierarchy/i);
  });

  it("AsciiBackground cites Hermes temporal coherence model", () => {
    const src = readSource("AsciiBackground.tsx");
    expect(src).toMatch(/temporal coherence/i);
  });

  it("rendered ASCII grid uses correct bottom-border glyphs (└┘┴, not ┌┐┬)", () => {
    render(
      <VisualEffectsProvider>
        <AsciiBackground />
      </VisualEffectsProvider>
    );
    const bg = screen.getByTestId("ascii-background");
    const text = bg.textContent ?? "";
    const lines = text.split("\n");
    const lastLine = lines[lines.length - 1];

    // Bottom border must start with └ and end with ┘
    expect(lastLine.startsWith("└")).toBe(true);
    expect(lastLine.endsWith("┘")).toBe(true);

    // Bottom border must NOT contain top-only glyphs
    expect(lastLine).not.toContain("┌");
    expect(lastLine).not.toContain("┐");
    expect(lastLine).not.toContain("┬");

    // Bottom border should contain ┴ (bottom T-junction) or ─ (horizontal)
    expect(lastLine).toMatch(/[┴─]/);
  });

  it("rendered ASCII grid uses correct top-border glyphs (┌┐┬)", () => {
    render(
      <VisualEffectsProvider>
        <AsciiBackground />
      </VisualEffectsProvider>
    );
    const bg = screen.getByTestId("ascii-background");
    const text = bg.textContent ?? "";
    const lines = text.split("\n");
    const firstLine = lines[0];

    // Top border must start with ┌ and end with ┐
    expect(firstLine.startsWith("┌")).toBe(true);
    expect(firstLine.endsWith("┐")).toBe(true);

    // Top border must NOT contain bottom-only glyphs
    expect(firstLine).not.toContain("└");
    expect(firstLine).not.toContain("┘");
    expect(firstLine).not.toContain("┴");
  });
});

// ---------------------------------------------------------------------------
// HeroVisualSystem provenance — both sources documented
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-014: HeroVisualSystem documents both adapted sources", () => {
  it("HeroVisualSystem cites Radiant adaptation in its docblock", () => {
    const src = readSource("HeroVisualSystem.tsx");
    expect(src).toContain("radiant-shaders.com");
  });

  it("HeroVisualSystem cites Hermes ascii-video adaptation in its docblock", () => {
    const src = readSource("HeroVisualSystem.tsx");
    expect(src).toContain(
      "github.com/NousResearch/hermes-agent"
    );
  });

  it("HeroVisualSystem docblock mentions both Radiant and Hermes provenance for VAL-VISUAL-014", () => {
    const src = readSource("HeroVisualSystem.tsx");
    expect(src).toContain("VAL-VISUAL-014");
    expect(src).toMatch(/Radiant adaptation/i);
    expect(src).toMatch(/Hermes adaptation/i);
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
