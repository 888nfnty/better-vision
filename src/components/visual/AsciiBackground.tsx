"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useVisualEffects } from "./VisualEffectsProvider";

// ---------------------------------------------------------------------------
// ASCII character palette — terminal / HFT / data-stream aesthetic
// ---------------------------------------------------------------------------

const ASCII_CHARS = "01▓░▒│─┌┐└┘├┤┬┴┼●◆◇$>_";
const COLS = 80;
const ROWS = 24;

/** Generate a static grid of ASCII characters */
function generateStaticGrid(): string[] {
  const grid: string[] = [];
  for (let r = 0; r < ROWS; r++) {
    let line = "";
    for (let c = 0; c < COLS; c++) {
      // Use a deterministic pattern for the static grid
      const idx = (r * COLS + c) % ASCII_CHARS.length;
      line += ASCII_CHARS[idx];
    }
    grid.push(line);
  }
  return grid;
}

/** Generate a single frame with time-varying characters */
function generateAnimatedFrame(time: number): string[] {
  const grid: string[] = [];
  for (let r = 0; r < ROWS; r++) {
    let line = "";
    for (let c = 0; c < COLS; c++) {
      // Pseudo-random index that shifts with time
      const hash =
        Math.sin(r * 127.1 + c * 311.7 + time * 0.8) * 43758.5453;
      const idx = Math.abs(Math.floor(hash)) % ASCII_CHARS.length;
      line += ASCII_CHARS[idx];
    }
    grid.push(line);
  }
  return grid;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AsciiBackground() {
  const { reducedMotion, fallback } = useVisualEffects();
  const animFrameRef = useRef<number>(0);
  const [lines, setLines] = useState<string[]>(() => generateStaticGrid());

  const isStatic = reducedMotion || fallback;

  const staticGrid = useMemo(() => generateStaticGrid(), []);

  useEffect(() => {
    if (isStatic) return;

    const startTime = performance.now();

    const animate = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      setLines(generateAnimatedFrame(elapsed));
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isStatic]);

  // Use static grid when in reduced-motion or fallback mode
  const displayLines = isStatic ? staticGrid : lines;

  return (
    <div
      data-testid="ascii-background"
      aria-hidden="true"
      className={`ascii-background absolute inset-0 overflow-hidden select-none ${
        isStatic ? "ascii-bg-static" : "ascii-bg-animated"
      }`}
    >
      <pre className="ascii-text font-terminal text-[8px] leading-[10px] sm:text-[10px] sm:leading-[12px] text-accent/[0.04] whitespace-pre pointer-events-none">
        {displayLines.join("\n")}
      </pre>
    </div>
  );
}
