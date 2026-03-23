"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { VisualEffectsProvider, useVisualEffects } from "./VisualEffectsProvider";

/**
 * Dynamic imports for heavy visual components — aggressive bundle splitting.
 *
 * VAL-VISUAL-027: HeroShaderCanvas (WebGL) is dynamically imported with
 * ssr:false so it does not block first meaningful paint. The CSS-only
 * radiant fallback gradient and scanline overlay render immediately for
 * content-first loading.
 */
const HeroShaderCanvas = dynamic(
  () => import("./HeroShaderCanvas").then((mod) => mod.HeroShaderCanvas),
  { ssr: false }
);

/**
 * SiteAtmosphere — extends the Radiant Fluid Amber immersive background
 * treatment across the entire site shell, not just the hero.
 *
 * VAL-VISUAL-020: Radiant atmosphere remains materially visible across
 * hero, graph rest states, focused detail states, mobile overlay states,
 * and lower-page exploration states.
 *
 * VAL-VISUAL-022: Persistent atmosphere preserves readable copy, controls,
 * and focus states across the full shell.
 *
 * VAL-VISUAL-028: All ASCII layers have been permanently removed.
 * VAL-VISUAL-029: Only ONE Radiant Fluid Amber shader instance runs
 * site-wide. The hero's HeroVisualSystem renders the full-strength shader;
 * this SiteAtmosphere provides the CSS fallback gradient and scanline
 * overlay for continuity below the hero without duplicating the shader.
 *
 * This component wraps the <main> content and renders a persistent
 * atmospheric background:
 *
 *   - Vendored Radiant Fluid Amber WebGL shader (reduced opacity, desktop only)
 *   - CSS radiant fallback gradient (always visible, for WebGL-fail cases)
 *   - Scanline overlay for terminal texture continuity
 *
 * The atmosphere uses pointer-events:none and stays behind content (z-0)
 * so it never blocks interactions or reduces readability.
 */

const emptySubscribe = () => () => {};

export function SiteAtmosphere({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <VisualEffectsProvider>
      <SiteAtmosphereInner>{children}</SiteAtmosphereInner>
    </VisualEffectsProvider>
  );
}

/**
 * Inner component that consumes VisualEffectsProvider context to manage
 * the Radiant atmosphere layers across the full shell.
 */
function SiteAtmosphereInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDesktopCapable } = useVisualEffects();

  // SSR-safe mount detection for client-only layers
  const hasMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  // Device class for capability gating (VAL-VISUAL-025)
  const deviceClass = isDesktopCapable ? "desktop" : "constrained";

  return (
    <div
      data-testid="site-atmosphere"
      data-device-class={deviceClass}
      className="relative"
    >
      {/* Persistent atmospheric background — Radiant shader + CSS layers */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        {/* CSS radiant fallback gradient — always visible on all devices,
            WebGL-fail safety net and constrained-device primary atmosphere */}
        <div className="site-atmosphere-gradient absolute inset-0" />

        {/* Real Radiant shader layer — desktop only (VAL-VISUAL-025)
            Same vendored Fluid Amber asset as hero, reduced opacity */}
        {hasMounted && isDesktopCapable && (
          <div className="site-atmosphere-shader absolute inset-0">
            <HeroShaderCanvas />
          </div>
        )}

        {/* Scanline overlay — lightweight terminal texture (all devices) */}
        <div className="scanline-overlay absolute inset-0 opacity-30" />
      </div>

      {/* Content layer — positioned above the atmosphere */}
      <div data-testid="site-content" className="relative z-10">
        {children}
      </div>
    </div>
  );
}
