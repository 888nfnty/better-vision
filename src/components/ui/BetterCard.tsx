"use client";

/**
 * BetterCard — shadcn Card wrapper with liquid metal cursor-tracking sheen.
 *
 * Wraps shadcn/ui Card internally and adds:
 * 1. Cursor-tracking metallic sheen via onMouseMove setting --metal-x/--metal-y
 *    CSS properties + radial-gradient
 * 2. Hover state background rgba(255,255,255,0.08)
 * 3. Inner glow box-shadow: inset 0 0 30px rgba(255,255,255,0.03)
 * 4. Smooth transitions (200ms ease)
 * 5. Variant props (default/active/focused) with ring styles
 *
 * VAL-SHADCN-002: Replaces LiquidMetalCard across all production components.
 * VAL-SHADCN-003: Cards are near-transparent glass over shader.
 * VAL-SHADCN-004: Cursor-tracking metallic sheen on shadcn cards.
 */

import React, {
  useRef,
  useCallback,
  useState,
  forwardRef,
  useImperativeHandle,
  type ReactNode,
  type ElementType,
  type HTMLAttributes,
  type MouseEvent,
  type Ref,
} from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BetterCardBaseProps {
  children: ReactNode;
  className?: string;
  /** Visual variant */
  variant?: "default" | "active" | "focused";
  /** Element to render as (polymorphic) */
  as?: ElementType;
  /** External ref */
  ref?: Ref<HTMLElement>;
}

export type BetterCardProps = BetterCardBaseProps &
  Omit<HTMLAttributes<HTMLElement>, keyof BetterCardBaseProps>;

// ---------------------------------------------------------------------------
// Variant classes
// ---------------------------------------------------------------------------

const VARIANT_CLASSES: Record<string, string> = {
  default: "",
  active: "ring-1 ring-[rgba(255,255,255,0.12)]",
  focused:
    "ring-1 ring-[rgba(255,255,255,0.40)] border-[rgba(255,255,255,0.30)]",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const BetterCard = forwardRef<HTMLElement, Omit<BetterCardProps, "ref">>(
  function BetterCard(
    {
      children,
      className,
      variant = "default",
      as: Component = "div",
      ...rest
    },
    externalRef
  ) {
    const internalRef = useRef<HTMLElement | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Expose the internal ref to the external ref
    useImperativeHandle(externalRef, () => internalRef.current!, []);

    // Track cursor position relative to the card for the metallic sheen
    const handleMouseMove = useCallback(
      (e: MouseEvent<HTMLElement>) => {
        const el = internalRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty("--metal-x", `${x}%`);
        el.style.setProperty("--metal-y", `${y}%`);
      },
      []
    );

    const handleMouseEnter = useCallback(() => {
      setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
      setIsHovered(false);
      const el = internalRef.current;
      if (el) {
        el.style.removeProperty("--metal-x");
        el.style.removeProperty("--metal-y");
      }
    }, []);

    // Nearly-transparent glass base + liquid metal sheen via inline style
    // VAL-VISUAL-035 / VAL-SHADCN-003: 0.04 base / 0.08 hover
    const baseBackground = isHovered
      ? "rgba(255, 255, 255, 0.08)"
      : "rgba(255, 255, 255, 0.04)";

    const inlineStyle: React.CSSProperties = {
      background: isHovered
        ? `radial-gradient(circle at var(--metal-x, 50%) var(--metal-y, 50%), rgba(255, 255, 255, 0.38) 0%, rgba(200, 210, 255, 0.12) 40%, transparent 70%), ${baseBackground}`
        : baseBackground,
      border: "1px solid rgba(255, 255, 255, 0.12)",
      // No backdrop-filter — let shader background show through
      boxShadow: isHovered
        ? "inset 0 0 30px rgba(255, 255, 255, 0.03)"
        : "none",
      transition: "background 0.2s ease, box-shadow 0.2s ease",
      ...(rest.style ?? {}),
    };

    // Merge testid: use provided data-testid or default
    const testId =
      (rest as Record<string, unknown>)["data-testid"] ?? "better-card";

    return (
      <Component
        ref={internalRef}
        data-slot="card"
        className={cn(
          "rounded-lg text-card-foreground",
          VARIANT_CLASSES[variant],
          className
        )}
        style={inlineStyle}
        data-testid={testId}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);
