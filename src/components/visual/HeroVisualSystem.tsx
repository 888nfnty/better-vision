"use client";

import { useSyncExternalStore } from "react";
import { VisualEffectsProvider } from "./VisualEffectsProvider";
import { HeroShaderCanvas } from "./HeroShaderCanvas";
import { AsciiBackground } from "./AsciiBackground";

/**
 * HeroVisualSystem — immersive BETTER atmosphere for the hero section.
 *
 * Visual layers (back to front):
 * 1. Vendored Radiant Fluid Amber shader canvas — real Radiant asset (WebGL, client-only)
 *    Vendored asset: radiant-fluid-amber.glsl.ts
 *    Original source: https://github.com/pbakaus/radiant/blob/main/static/fluid-amber.html
 *    Site reference: https://radiant-shaders.com/shader/fluid-amber
 *    License: MIT (Copyright (c) 2025 Paul Bakaus)
 * 2. Hermes ASCII-video–adapted terminal atmosphere — structured text overlay
 *    Source: https://github.com/NousResearch/hermes-agent/tree/main/skills/creative/ascii-video
 * 3. Scanline overlay — CSS-only terminal texture
 * 4. Vignette gradient — readability protection for hero content
 *
 * Motion strategy (VAL-VISUAL-011): exactly 3 intentional motions:
 *   M1 — Shader canvas: slow organic drift (TIME_SCALE 0.15, Radiant convention)
 *   M2 — ASCII layer: sparse character transitions (~4fps, 5% of chars per cycle, Hermes convention)
 *   M3 — Hero entrance: content fades in on mount via CSS (one-shot, no loop)
 *
 * Content-first (VAL-VISUAL-001): children render at z-10 immediately.
 * CSS-only layers render on server; WebGL/ASCII mount after hydration.
 *
 * Reduced-motion (VAL-VISUAL-003): all 3 motions stop; static layers persist.
 * Fallback (VAL-VISUAL-004): WebGL failure → CSS gradient + static ASCII remain.
 *
 * Provenance (VAL-VISUAL-014, VAL-VISUAL-015):
 *   Radiant adaptation: vendored Radiant Fluid Amber shader asset
 *     → radiant-fluid-amber.glsl.ts (simplex noise, mod289/permute, q→r→f domain warp)
 *     → HeroShaderCanvas.tsx (WebGL renderer using vendored asset)
 *   Hermes adaptation: PAL_BOX + PAL_BLOCKS palettes, GridLayer layout, layer hierarchy,
 *     temporal coherence model → AsciiBackground.tsx
 */

const emptySubscribe = () => () => {};

export function HeroVisualSystem({
  children,
}: {
  children: React.ReactNode;
}) {
  // SSR-safe mount detection for client-only layers
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
        {/* Layer 0: CSS-only radiant fallback gradient (always visible, no JS) */}
        <div
          className="hero-radiant-fallback absolute inset-0"
          aria-hidden="true"
          data-testid="hero-radiant-fallback"
        />

        {/* Layer 1: WebGL Radiant shader (client-only, graceful fallback) */}
        {hasMounted && <HeroShaderCanvas />}

        {/* Layer 2: Hermes ASCII terminal atmosphere (client-only) */}
        {hasMounted && <AsciiBackground />}

        {/* Layer 3: CSS scanline overlay — terminal texture */}
        <div
          className="scanline-overlay absolute inset-0 z-[3]"
          aria-hidden="true"
        />

        {/* Layer 4: Vignette + readability gradient */}
        <div
          className="hero-vignette absolute inset-0 z-[4]"
          aria-hidden="true"
        />

        {/* Layer 10: Content — M3 entrance animation via CSS */}
        <div
          data-testid="hero-content"
          className="hero-entrance relative z-10"
        >
          {children}
        </div>
      </div>
    </VisualEffectsProvider>
  );
}
