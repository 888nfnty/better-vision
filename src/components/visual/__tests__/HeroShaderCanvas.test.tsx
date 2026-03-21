import { render, screen, waitFor } from "@testing-library/react";
import { HeroShaderCanvas } from "../HeroShaderCanvas";
import { VisualEffectsProvider, useVisualEffects } from "../VisualEffectsProvider";

/** Minimal mock WebGL context that satisfies shader initialization */
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

describe("HeroShaderCanvas", () => {
  afterEach(() => {
    // Reset getContext to null (no WebGL) after each test
    HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue(null);
    // Reset matchMedia
    (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  it("renders a canvas element with aria-hidden when WebGL is available", () => {
    HTMLCanvasElement.prototype.getContext = jest
      .fn()
      .mockReturnValue(createMockWebGLContext());

    render(
      <VisualEffectsProvider>
        <HeroShaderCanvas />
      </VisualEffectsProvider>
    );
    const canvas = screen.getByTestId("hero-shader-canvas");
    expect(canvas).toBeInTheDocument();
    expect(canvas.getAttribute("aria-hidden")).toBe("true");
  });

  it("does not render when reduced motion is active", () => {
    (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(
      <VisualEffectsProvider>
        <HeroShaderCanvas />
      </VisualEffectsProvider>
    );
    expect(screen.queryByTestId("hero-shader-canvas")).not.toBeInTheDocument();
  });

  it("does not render when in fallback mode", () => {
    render(
      <VisualEffectsProvider forceFallback>
        <HeroShaderCanvas />
      </VisualEffectsProvider>
    );
    expect(screen.queryByTestId("hero-shader-canvas")).not.toBeInTheDocument();
  });

  it("triggers fallback when WebGL context is unavailable", async () => {
    // getContext returns null (default global mock)
    HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue(null);

    function FallbackChecker() {
      const ctx = useVisualEffects();
      return <span data-testid="is-fallback">{String(ctx.fallback)}</span>;
    }

    render(
      <VisualEffectsProvider>
        <HeroShaderCanvas />
        <FallbackChecker />
      </VisualEffectsProvider>
    );
    // The fallback triggers inside useEffect, so wait for the re-render
    await waitFor(() => {
      expect(screen.getByTestId("is-fallback")).toHaveTextContent("true");
    });
  });
});
