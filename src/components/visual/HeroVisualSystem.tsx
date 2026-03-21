"use client";

import { useSyncExternalStore } from "react";
import { VisualEffectsProvider } from "./VisualEffectsProvider";
import { HeroShaderCanvas } from "./HeroShaderCanvas";
import { AsciiBackground } from "./AsciiBackground";

/**
 * HeroVisualSystem — immersive visual layer for the hero section.
 *
 * Renders:
 * 1. CSS grid pattern background (always visible, no JS needed)
 * 2. ASCII-video-inspired background (always visible, static if reduced-motion)
 * 3. WebGL shader-driven grid overlay (hidden if reduced-motion or WebGL unsupported)
 * 4. Scanline overlay (CSS-only, always present)
 * 5. Gradient overlay for text readability
 *
 * Content-first approach: children (hero content) render immediately at z-10,
 * while visual layers are decorative backgrounds at z-0/z-1.
 *
 * Reduced-motion: disables shader canvas and freezes ASCII animation.
 * Fallback: if WebGL fails, only CSS + static ASCII + grid remain — no blank surfaces.
 */

const emptySubscribe = () => () => {};

export function HeroVisualSystem({
  children,
}: {
  children: React.ReactNode;
}) {
  // SSR-safe mount detection. Advanced effects only render after client mount
  // to prevent hydration mismatches (SSR has no WebGL/matchMedia).
  // CSS-only layers (grid pattern, scanlines, vignette) render immediately.
  const hasMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  return (
    <VisualEffectsProvider>
      <div
        data-testid="hero-visual-system"
        className="relative overflow-hidden"
      >
        {/* Layer 0: CSS-only grid pattern (always visible, no JS) */}
        <div
          className="hero-grid-pattern absolute inset-0"
          aria-hidden="true"
        />

        {/* Layer 0.5: ASCII-video-inspired background (client-only) */}
        {hasMounted && <AsciiBackground />}

        {/* Layer 1: WebGL shader-driven grid (client-only, graceful fallback) */}
        {hasMounted && <HeroShaderCanvas />}

        {/* Layer 2: CSS scanline overlay */}
        <div
          className="scanline-overlay absolute inset-0 z-[1]"
          aria-hidden="true"
        />

        {/* Layer 3: Vignette + gradient overlay for text readability */}
        <div
          className="hero-vignette absolute inset-0 z-[2]"
          aria-hidden="true"
        />

        {/* Layer 10: Content (always renders first, always readable) */}
        <div data-testid="hero-content" className="relative z-10">
          {children}
        </div>
      </div>
    </VisualEffectsProvider>
  );
}
