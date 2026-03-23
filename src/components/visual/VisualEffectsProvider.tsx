"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface VisualEffectsState {
  /** Whether the advanced visual effects have finished initializing */
  ready: boolean;
  /** Whether the user prefers reduced motion */
  reducedMotion: boolean;
  /** Whether effects have been disabled due to failure or lack of support */
  fallback: boolean;
  /** Whether the 2D canvas renderer initialized successfully */
  canvasReady: boolean;
  /**
   * Whether the client satisfies desktop-class conditions for heavy layers.
   * Desktop-class = fine pointer + wide viewport (>1024px) + no reduced motion.
   * Mobile/tablet/constrained devices get `false` and skip heavy shader,
   * ASCII-canvas, and continuous-animation layers. (VAL-VISUAL-025)
   */
  isDesktopCapable: boolean;
  /** Signal that effects are ready */
  markReady: () => void;
  /** Signal that effects should fall back */
  triggerFallback: () => void;
  /** Signal that the 2D canvas renderer is ready */
  markCanvasReady: () => void;
}

const defaultState: VisualEffectsState = {
  ready: false,
  reducedMotion: false,
  fallback: false,
  canvasReady: false,
  isDesktopCapable: false,
  markReady: () => {},
  triggerFallback: () => {},
  markCanvasReady: () => {},
};

const VisualEffectsContext = createContext<VisualEffectsState>(defaultState);

// ---------------------------------------------------------------------------
// Hook to detect prefers-reduced-motion
// ---------------------------------------------------------------------------

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: { matches: boolean }) => setReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return reduced;
}

// ---------------------------------------------------------------------------
// Hook to detect desktop-class capability (VAL-VISUAL-025)
// Desktop-class = fine pointer + wide viewport (>1024px) + no reduced motion.
// This composite gate ensures heavy shader, ASCII-canvas, and continuous-
// animation layers only activate on desktop-class clients.
// ---------------------------------------------------------------------------

function useDesktopCapable(reducedMotion: boolean): boolean {
  // Use a dedicated state + effect pattern with an explicit mount trigger.
  // During SSR/static generation, defaults to false (constrained).
  // After hydration, the effect fires and evaluates the real client capability.
  const [capable, setCapable] = useState(false);

  useEffect(() => {
    const check = () => {
      const finePointer = window.matchMedia("(pointer: fine)").matches;
      const wideViewport = window.matchMedia("(min-width: 1025px)").matches;
      setCapable(finePointer && wideViewport && !reducedMotion);
    };
    // Immediate check on mount
    check();
    // Listen for capability changes (e.g., viewport resize, device mode toggle)
    const pointerMql = window.matchMedia("(pointer: fine)");
    const widthMql = window.matchMedia("(min-width: 1025px)");
    const handler = () => check();
    pointerMql.addEventListener("change", handler);
    widthMql.addEventListener("change", handler);
    return () => {
      pointerMql.removeEventListener("change", handler);
      widthMql.removeEventListener("change", handler);
    };
  }, [reducedMotion]);

  return capable;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface ProviderProps {
  children: React.ReactNode;
  /** Force fallback mode (useful for testing) */
  forceFallback?: boolean;
}

export function VisualEffectsProvider({
  children,
  forceFallback = false,
}: ProviderProps) {
  const [ready, setReady] = useState(false);
  const [fallback, setFallback] = useState(forceFallback);
  const [canvasReady, setCanvasReady] = useState(false);
  const reducedMotion = useReducedMotion();
  const isDesktopCapable = useDesktopCapable(reducedMotion);

  const markReady = useCallback(() => setReady(true), []);
  const triggerFallback = useCallback(() => setFallback(true), []);
  const markCanvasReady = useCallback(() => setCanvasReady(true), []);

  const value = useMemo<VisualEffectsState>(
    () => ({ ready, reducedMotion, fallback, canvasReady, isDesktopCapable, markReady, triggerFallback, markCanvasReady }),
    [ready, reducedMotion, fallback, canvasReady, isDesktopCapable, markReady, triggerFallback, markCanvasReady]
  );

  return (
    <VisualEffectsContext.Provider value={value}>
      {children}
    </VisualEffectsContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Consumer hook
// ---------------------------------------------------------------------------

export function useVisualEffects(): VisualEffectsState {
  return useContext(VisualEffectsContext);
}
