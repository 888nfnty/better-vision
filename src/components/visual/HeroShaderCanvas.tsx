"use client";

import { useCallback, useEffect, useRef } from "react";
import { useVisualEffects } from "./VisualEffectsProvider";

// ---------------------------------------------------------------------------
// GLSL Shaders — premium dark terminal / HFT grid effect
// ---------------------------------------------------------------------------

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;

  // Pseudo-random hash
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;

    // Dark terminal grid lines
    float gridX = smoothstep(0.0, 0.002, abs(fract(uv.x * 40.0) - 0.5) - 0.49);
    float gridY = smoothstep(0.0, 0.002, abs(fract(uv.y * 25.0) - 0.5) - 0.49);
    float grid = max(gridX, gridY) * 0.08;

    // Slow moving scanline
    float scanline = smoothstep(0.0, 0.01, abs(fract(uv.y * 200.0 - u_time * 0.05) - 0.5) - 0.48) * 0.03;

    // Subtle data flow — moving dots along grid
    float flowX = hash(floor(vec2(uv.x * 40.0, uv.y * 25.0)) + floor(u_time * 0.3));
    float flow = step(0.97, flowX) * 0.15;

    // Vignette: darken edges
    float vignette = 1.0 - length((uv - 0.5) * 1.4);
    vignette = smoothstep(0.0, 0.7, vignette);

    // Accent color: BETTER green (#00ff88) → rgb(0, 1, 0.533)
    vec3 accentColor = vec3(0.0, 1.0, 0.533);

    // Compose: dark base with green accent grid, scanlines, and data flow
    vec3 color = vec3(0.039, 0.039, 0.059); // ~#0a0a0f
    color += accentColor * grid;
    color += accentColor * scanline;
    color += accentColor * flow;
    color *= vignette;

    // Very low opacity — this is a subtle background, not overpowering
    gl_FragColor = vec4(color, 1.0);
  }
`;

// ---------------------------------------------------------------------------
// WebGL helpers
// ---------------------------------------------------------------------------

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HeroShaderCanvas() {
  const { reducedMotion, fallback, markReady, triggerFallback } =
    useVisualEffects();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      triggerFallback();
      return;
    }

    const webgl = gl as WebGLRenderingContext;

    const vert = createShader(webgl, webgl.VERTEX_SHADER, VERTEX_SHADER);
    const frag = createShader(webgl, webgl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vert || !frag) {
      triggerFallback();
      return;
    }

    const program = createProgram(webgl, vert, frag);
    if (!program) {
      triggerFallback();
      return;
    }

    // Full-screen quad
    const positionBuffer = webgl.createBuffer();
    webgl.bindBuffer(webgl.ARRAY_BUFFER, positionBuffer);
    webgl.bufferData(
      webgl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      webgl.STATIC_DRAW
    );

    const posLoc = webgl.getAttribLocation(program, "a_position");
    const timeLoc = webgl.getUniformLocation(program, "u_time");
    const resLoc = webgl.getUniformLocation(program, "u_resolution");

    webgl.useProgram(program);
    webgl.enableVertexAttribArray(posLoc);
    webgl.bindBuffer(webgl.ARRAY_BUFFER, positionBuffer);
    webgl.vertexAttribPointer(posLoc, 2, webgl.FLOAT, false, 0, 0);

    const startTime = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      webgl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const time = (performance.now() - startTime) / 1000;
      webgl.uniform1f(timeLoc, time);
      webgl.uniform2f(resLoc, canvas.width, canvas.height);
      webgl.drawArrays(webgl.TRIANGLES, 0, 6);
      animFrameRef.current = requestAnimationFrame(render);
    };

    markReady();
    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
      webgl.deleteProgram(program);
      webgl.deleteShader(vert);
      webgl.deleteShader(frag);
    };
  }, [markReady, triggerFallback]);

  useEffect(() => {
    if (reducedMotion || fallback) return;
    const cleanup = initWebGL();
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      cleanup?.();
    };
  }, [reducedMotion, fallback, initWebGL]);

  // Don't render canvas in reduced-motion or fallback mode
  if (reducedMotion || fallback) return null;

  return (
    <canvas
      ref={canvasRef}
      data-testid="hero-shader-canvas"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      style={{ opacity: 0.6 }}
    />
  );
}
