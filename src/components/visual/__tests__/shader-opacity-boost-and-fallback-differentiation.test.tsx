/**
 * Tests for shader opacity boost and enhanced-vs-fallback differentiation
 *
 * Feature: redesign-shader-opacity-boost-and-fallback-differentiation
 *
 * VAL-VISUAL-017: Enhanced visual state is dramatically distinct from static fallback.
 * VAL-VISUAL-018: Headed browser validation shows visible background motion.
 *
 * The WebGL shader must be materially visible at ≥0.55 opacity against #101010.
 * The enhanced state (shader animating) must be dramatically distinct from fallback
 * (CSS gradient only). TIME_SCALE increased from 0.15 to 0.25 for more perceptible
 * motion so frame-diff between consecutive animation frames shows >1% pixel change.
 */
import fs from "fs";
import path from "path";
import { render, screen, waitFor } from "@testing-library/react";
import { HeroShaderCanvas } from "../HeroShaderCanvas";
import { VisualEffectsProvider } from "../VisualEffectsProvider";
import { SiteAtmosphere } from "../SiteAtmosphere";
import Home from "@/app/page";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readGlobalsCss(): string {
  return fs.readFileSync(
    path.resolve(__dirname, "../../../app/globals.css"),
    "utf-8"
  );
}

function readShaderSource(): string {
  return fs.readFileSync(
    path.resolve(__dirname, "../radiant-fluid-amber.glsl.ts"),
    "utf-8"
  );
}

function createMockWebGLContext() {
  return {
    createShader: jest.fn().mockReturnValue({}),
    shaderSource: jest.fn(),
    compileShader: jest.fn(),
    getShaderParameter: jest.fn().mockReturnValue(true),
    createProgram: jest.fn().mockReturnValue({}),
    attachShader: jest.fn(),
    linkProgram: jest.fn(),
    getProgramParameter: jest.fn().mockReturnValue(true),
    createBuffer: jest.fn().mockReturnValue({}),
    bindBuffer: jest.fn(),
    bufferData: jest.fn(),
    getAttribLocation: jest.fn().mockReturnValue(0),
    getUniformLocation: jest.fn().mockReturnValue({}),
    useProgram: jest.fn(),
    enableVertexAttribArray: jest.fn(),
    vertexAttribPointer: jest.fn(),
    uniform1f: jest.fn(),
    uniform2f: jest.fn(),
    drawArrays: jest.fn(),
    viewport: jest.fn(),
    deleteProgram: jest.fn(),
    deleteShader: jest.fn(),
    VERTEX_SHADER: 0x8b31,
    FRAGMENT_SHADER: 0x8b30,
    COMPILE_STATUS: 0x8b81,
    LINK_STATUS: 0x8b82,
    ARRAY_BUFFER: 0x8892,
    STATIC_DRAW: 0x88e4,
    FLOAT: 0x1406,
    TRIANGLES: 0x0004,
  };
}

function mockDesktopCapable() {
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
}

beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue(null);
  mockDesktopCapable();
});

// ---------------------------------------------------------------------------
// Shader opacity boost: ≥0.55 so it's materially visible on #101010
// ---------------------------------------------------------------------------

describe("Shader opacity boost to ≥0.55 for material visibility", () => {
  it(".site-atmosphere-shader opacity is at least 0.55", () => {
    const cssSrc = readGlobalsCss();
    const shaderRule = cssSrc.match(
      /\.site-atmosphere-shader\s*\{[^}]*\}/
    );
    expect(shaderRule).not.toBeNull();
    const opacityMatch = shaderRule![0].match(/opacity:\s*([\d.]+)/);
    expect(opacityMatch).not.toBeNull();
    const opacity = parseFloat(opacityMatch![1]);
    expect(opacity).toBeGreaterThanOrEqual(0.55);
    // Should not be fully opaque — still atmospheric
    expect(opacity).toBeLessThanOrEqual(0.85);
  });

  it("shader canvas inline opacity is high enough for material visibility", () => {
    HTMLCanvasElement.prototype.getContext = jest
      .fn()
      .mockReturnValue(createMockWebGLContext());

    render(
      <VisualEffectsProvider>
        <HeroShaderCanvas />
      </VisualEffectsProvider>
    );
    const canvas = screen.getByTestId("hero-shader-canvas");
    const canvasOpacity = parseFloat(canvas.style.opacity || "1");
    // Canvas opacity must remain high for the boosted atmosphere to work
    expect(canvasOpacity).toBeGreaterThanOrEqual(0.85);
  });
});

// ---------------------------------------------------------------------------
// TIME_SCALE increase: 0.25 for more perceptible motion
// ---------------------------------------------------------------------------

describe("TIME_SCALE increased to 0.25 for perceptible motion", () => {
  it("vendored shader uses TIME_SCALE = 0.25", () => {
    const shaderSource = readShaderSource();
    expect(shaderSource).toMatch(/TIME_SCALE\s*=\s*0\.25/);
  });

  it("HeroShaderCanvas comment documents the increased TIME_SCALE", () => {
    const heroSrc = fs.readFileSync(
      path.resolve(__dirname, "../HeroShaderCanvas.tsx"),
      "utf-8"
    );
    expect(heroSrc).toContain("TIME_SCALE");
    expect(heroSrc).toContain("0.25");
  });
});

// ---------------------------------------------------------------------------
// Enhanced vs fallback dramatic differentiation
// ---------------------------------------------------------------------------

describe("Enhanced state is dramatically distinct from fallback", () => {
  it("enhanced state dims the CSS fallback gradient (shader is the primary visual)", () => {
    const cssSrc = readGlobalsCss();
    const enhancedFallback = cssSrc.match(
      /\[data-visual-state="enhanced"\]\s+\.hero-radiant-fallback[\s\S]*?\}/
    );
    expect(enhancedFallback).not.toBeNull();
    // Enhanced dims the CSS gradient because the WebGL shader provides the depth
    const opacityMatch = enhancedFallback![0].match(/opacity:\s*([\d.]+)/);
    expect(opacityMatch).not.toBeNull();
    const enhancedOpacity = parseFloat(opacityMatch![1]);
    expect(enhancedOpacity).toBeLessThanOrEqual(0.3);
  });

  it("fallback state uses full-strength CSS gradient (no shader behind it)", () => {
    const cssSrc = readGlobalsCss();
    const fallbackRule = cssSrc.match(
      /\[data-visual-state="fallback"\]\s+\.hero-radiant-fallback[\s\S]*?\}/
    );
    expect(fallbackRule).not.toBeNull();
    const opacityMatch = fallbackRule![0].match(/opacity:\s*([\d.]+)/);
    expect(opacityMatch).not.toBeNull();
    const fallbackOpacity = parseFloat(opacityMatch![1]);
    // Fallback should be much stronger than enhanced since it's the only atmosphere
    expect(fallbackOpacity).toBeGreaterThanOrEqual(0.8);
  });

  it("shader atmosphere opacity is dramatically higher than enhanced-state CSS fallback", () => {
    const cssSrc = readGlobalsCss();

    // Get shader opacity from .site-atmosphere-shader
    const shaderRule = cssSrc.match(/\.site-atmosphere-shader\s*\{[^}]*\}/);
    expect(shaderRule).not.toBeNull();
    const shaderOpacityMatch = shaderRule![0].match(/opacity:\s*([\d.]+)/);
    const shaderOpacity = parseFloat(shaderOpacityMatch![1]);

    // Get enhanced-state CSS gradient opacity
    const enhancedFallback = cssSrc.match(
      /\[data-visual-state="enhanced"\]\s+\.hero-radiant-fallback[\s\S]*?\}/
    );
    expect(enhancedFallback).not.toBeNull();
    const enhancedOpacityMatch = enhancedFallback![0].match(/opacity:\s*([\d.]+)/);
    const enhancedGradientOpacity = parseFloat(enhancedOpacityMatch![1]);

    // The shader should be at least 3x more visible than the dimmed CSS gradient in enhanced mode
    expect(shaderOpacity / enhancedGradientOpacity).toBeGreaterThanOrEqual(3);
  });

  it("data-visual-state=enhanced is exposed when WebGL succeeds", async () => {
    HTMLCanvasElement.prototype.getContext = jest
      .fn()
      .mockImplementation((type: string) => {
        if (type === "webgl" || type === "experimental-webgl") {
          return createMockWebGLContext();
        }
        if (type === "2d") {
          return {
            clearRect: jest.fn(),
            fillRect: jest.fn(),
            fillText: jest.fn(),
            drawImage: jest.fn(),
            measureText: jest.fn().mockReturnValue({ width: 8 }),
            canvas: {
              width: 800,
              height: 600,
              getBoundingClientRect: () => ({
                width: 800,
                height: 600,
                top: 0,
                left: 0,
                right: 800,
                bottom: 600,
              }),
            },
            globalAlpha: 1,
            globalCompositeOperation: "source-over",
            font: "",
            textBaseline: "top",
            fillStyle: "#ffffff",
          };
        }
        return null;
      });
    HTMLCanvasElement.prototype.getBoundingClientRect = jest
      .fn()
      .mockReturnValue({
        width: 800,
        height: 600,
        top: 0,
        left: 0,
        right: 800,
        bottom: 600,
      });

    render(
      <SiteAtmosphere>
        <Home />
      </SiteAtmosphere>
    );
    await waitFor(() => {
      const system = screen.getByTestId("hero-visual-system");
      expect(system.getAttribute("data-visual-state")).toBe("enhanced");
    });
  });

  it("data-visual-state=fallback is exposed when WebGL fails", () => {
    HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue(null);

    render(
      <SiteAtmosphere>
        <Home />
      </SiteAtmosphere>
    );
    const system = screen.getByTestId("hero-visual-system");
    expect(system.getAttribute("data-visual-state")).toBe("fallback");
  });
});
