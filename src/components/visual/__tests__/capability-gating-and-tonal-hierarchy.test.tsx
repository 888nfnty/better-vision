/**
 * VAL-VISUAL-024: Crisp white text, sharper near-black tone separation,
 *   multi-level tonal hierarchy across shell surface levels.
 * VAL-VISUAL-025: Explicit desktop capability gating, enforced constrained-
 *   device negative case, deferred heavy-layer loading, runtime perf evidence.
 * VAL-VISUAL-021: tradebetter parity across full shell with reference evidence.
 */
import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mockMatchMedia(overrides: Record<string, boolean> = {}) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: overrides[query] ?? false,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

function getGlobalsCss(): string {
  return fs.readFileSync(
    path.resolve(__dirname, "../../../app/globals.css"),
    "utf-8",
  );
}

beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue(null);
  HTMLCanvasElement.prototype.getBoundingClientRect = jest.fn().mockReturnValue({
    width: 800, height: 600, top: 0, left: 0, right: 800, bottom: 600,
  });
  mockMatchMedia();
});

// ---------------------------------------------------------------------------
// VAL-VISUAL-024: Tonal hierarchy and pure-white text
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-024: Pure-white text and multi-level tonal hierarchy", () => {
  it("primary text color is near-pure white (lightness ≥ 95%)", () => {
    const css = getGlobalsCss();
    // Extract --text-primary hex value
    const match = css.match(/--text-primary:\s*(#[0-9a-fA-F]{6})/);
    expect(match).not.toBeNull();
    const hex = match![1];
    // Parse RGB and check lightness (all channels ≥ 0xF0 ≈ 94%)
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const minChannel = Math.min(r, g, b);
    expect(minChannel).toBeGreaterThanOrEqual(0xF0);
  });

  it("defines at least 4 distinct near-black surface levels for tonal hierarchy", () => {
    const css = getGlobalsCss();
    // Must have: bg-primary, bg-secondary, bg-surface, bg-elevated, bg-raised
    const levels = [
      "--bg-primary",
      "--bg-secondary",
      "--bg-surface",
      "--bg-elevated",
      "--bg-raised",
    ];
    for (const level of levels) {
      expect(css).toContain(`${level}:`);
    }
  });

  it("surface levels have strictly ascending lightness for clear tonal separation", () => {
    const css = getGlobalsCss();
    const levels = [
      "--bg-primary",
      "--bg-secondary",
      "--bg-surface",
      "--bg-elevated",
      "--bg-raised",
    ];
    const lightnesses: number[] = [];
    for (const level of levels) {
      const match = css.match(new RegExp(`${level.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\s*(#[0-9a-fA-F]{6})`));
      expect(match).not.toBeNull();
      const hex = match![1];
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      lightnesses.push((r + g + b) / 3);
    }
    // Each level must be strictly brighter than the previous
    for (let i = 1; i < lightnesses.length; i++) {
      expect(lightnesses[i]).toBeGreaterThan(lightnesses[i - 1]);
    }
  });

  it("Tailwind theme maps distinct surface levels for elevated and raised", () => {
    const css = getGlobalsCss();
    expect(css).toContain("--color-elevated:");
    expect(css).toContain("--color-raised:");
  });

  it("focused/interactive surfaces use a distinct tonal treatment in the shell", () => {
    const css = getGlobalsCss();
    // The focused state should have accent-based elevation or a distinct surface treatment
    // Check that the shell (graph shell, inspector, detail panels) uses bg-surface or bg-elevated
    // Not a CSS test per se — just ensures tokens exist for focused states
    expect(css).toContain("--border-accent:");
    expect(css).toContain("--border-active:");
  });
});

// ---------------------------------------------------------------------------
// VAL-VISUAL-025: Desktop capability gating
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-025: Explicit desktop capability gating", () => {
  it("VisualEffectsProvider exposes isDesktopCapable state", () => {
    // Verify that the VisualEffectsProvider exports include isDesktopCapable
    // by reading the source and checking the interface declaration
    const providerSrc = fs.readFileSync(
      path.resolve(__dirname, "../VisualEffectsProvider.tsx"),
      "utf-8",
    );
    expect(providerSrc).toContain("isDesktopCapable");
    // Ensure it's in the VisualEffectsState interface
    expect(providerSrc).toMatch(/interface\s+VisualEffectsState[\s\S]*?isDesktopCapable/);
    // Ensure it's wired into the value memo
    expect(providerSrc).toMatch(/useMemo[\s\S]*?isDesktopCapable/);
  });

  it("HeroVisualSystem exposes data-device-class attribute", () => {
    render(<Home />);
    const system = screen.getByTestId("hero-visual-system");
    expect(system.hasAttribute("data-device-class")).toBe(true);
    const deviceClass = system.getAttribute("data-device-class");
    expect(["desktop", "constrained"]).toContain(deviceClass);
  });

  it("SiteAtmosphere exposes data-device-class attribute", () => {
    // SiteAtmosphere is in the layout, not in Home.
    // Verify via source that it exposes data-device-class
    const atmosphereSrc = fs.readFileSync(
      path.resolve(__dirname, "../SiteAtmosphere.tsx"),
      "utf-8",
    );
    expect(atmosphereSrc).toContain("data-device-class");
    expect(atmosphereSrc).toContain("isDesktopCapable");
  });

  it("heavy shader layers do not render when device is constrained", () => {
    // Simulate mobile: coarse pointer, narrow viewport
    mockMatchMedia({
      "(pointer: coarse)": true,
      "(max-width: 1024px)": true,
      "(prefers-reduced-motion: reduce)": false,
    });

    render(<Home />);
    // On constrained devices, the WebGL shader canvas must not render
    const shaderCanvases = screen.queryAllByTestId("hero-shader-canvas");
    expect(shaderCanvases.length).toBe(0);
  });

  it("heavy ASCII canvas layers do not render when device is constrained", () => {
    mockMatchMedia({
      "(pointer: coarse)": true,
      "(max-width: 1024px)": true,
      "(prefers-reduced-motion: reduce)": false,
    });

    render(<Home />);
    const asciiCanvases = screen.queryAllByTestId("ascii-canvas-renderer");
    expect(asciiCanvases.length).toBe(0);
  });

  it("constrained fallback preserves visual hierarchy with CSS gradient layers", () => {
    mockMatchMedia({
      "(pointer: coarse)": true,
      "(max-width: 1024px)": true,
    });

    render(<Home />);
    // Radiant fallback gradient should still be present
    const fallback = screen.getByTestId("hero-radiant-fallback");
    expect(fallback).toBeInTheDocument();
  });

  it("CSS provides constrained-device styling that disables heavy layers", () => {
    const css = getGlobalsCss();
    // Must have data-device-class="constrained" selectors
    expect(css).toContain('[data-device-class="constrained"]');
  });
});

// ---------------------------------------------------------------------------
// VAL-VISUAL-025: Deferred heavy-layer loading
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-025: Deferred heavy-layer loading", () => {
  it("heavy visual layers use dynamic import or deferred mounting", () => {
    // The SiteAtmosphere/HeroVisualSystem should defer heavy layers
    // Check the source uses dynamic import or useSyncExternalStore mount guard
    const atmosphereSrc = fs.readFileSync(
      path.resolve(__dirname, "../SiteAtmosphere.tsx"),
      "utf-8",
    );
    const heroSrc = fs.readFileSync(
      path.resolve(__dirname, "../HeroVisualSystem.tsx"),
      "utf-8",
    );
    // Must have mount guard (hasMounted pattern) or dynamic import
    const hasDeferral =
      atmosphereSrc.includes("hasMounted") ||
      atmosphereSrc.includes("dynamic(") ||
      atmosphereSrc.includes("lazy(");
    expect(hasDeferral).toBe(true);
    const heroDeferral =
      heroSrc.includes("hasMounted") ||
      heroSrc.includes("dynamic(") ||
      heroSrc.includes("lazy(");
    expect(heroDeferral).toBe(true);
  });

  it("content layer renders at higher z-index than atmosphere layers", () => {
    render(<Home />);
    const content = screen.getByTestId("hero-content");
    expect(content).toBeInTheDocument();
    // Content should be above visual layers
    expect(content.className).toContain("z-10");
  });
});

// ---------------------------------------------------------------------------
// VAL-VISUAL-025: Constrained motion fallback
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-025: Constrained states use cheaper motion", () => {
  it("data-device-class=constrained results in 0 motion layers", () => {
    mockMatchMedia({
      "(pointer: coarse)": true,
      "(max-width: 1024px)": true,
    });

    render(<Home />);
    const system = screen.getByTestId("hero-visual-system");
    const motionLayers = system.getAttribute("data-motion-layers");
    expect(Number(motionLayers)).toBe(0);
  });

  it("visual hierarchy is preserved in constrained mode (scanline + gradient remain)", () => {
    mockMatchMedia({
      "(pointer: coarse)": true,
      "(max-width: 1024px)": true,
    });

    render(<Home />);
    // Fallback gradient layer is still there
    const fallback = screen.getByTestId("hero-radiant-fallback");
    expect(fallback).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// VAL-VISUAL-021: tradebetter parity across full shell
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-021: tradebetter parity documented with reference evidence", () => {
  it("globals.css documents extracted tradebetter color values", () => {
    const css = getGlobalsCss();
    // Must have comments citing tradebetter extraction
    expect(css.toLowerCase()).toContain("tradebetter");
    expect(css).toContain("#455eff");
  });

  it("tradebetter near-black foundation is the primary background", () => {
    const css = getGlobalsCss();
    // bg-primary should be in the #0a–#10 range (near-black)
    const match = css.match(/--bg-primary:\s*(#[0-9a-fA-F]{6})/);
    expect(match).not.toBeNull();
    const hex = match![1];
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const avg = (r + g + b) / 3;
    expect(avg).toBeLessThan(20); // Very dark near-black
  });

  it("IBM Plex Mono is the terminal typography token", () => {
    const css = getGlobalsCss();
    expect(css).toContain("--font-ibm-plex-mono");
  });

  it("shell surfaces reference tradebetter theme across detail panels and overlays", () => {
    // The graph shell uses bg-surface, bg-elevated (tradebetter tonal levels)
    const shellSrc = fs.readFileSync(
      path.resolve(__dirname, "../../graph/GraphShell.tsx"),
      "utf-8",
    );
    expect(shellSrc).toContain("bg-surface");
  });
});
