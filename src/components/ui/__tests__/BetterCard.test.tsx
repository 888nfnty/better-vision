import fs from "fs";
import path from "path";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BetterCard } from "../BetterCard";

/**
 * Tests for the BetterCard component — shadcn Card wrapper with liquid metal sheen.
 *
 * VAL-SHADCN-002: Replaces LiquidMetalCard across all production components.
 * VAL-SHADCN-003: Cards are near-transparent glass over shader.
 * VAL-SHADCN-004: Cursor-tracking metallic sheen on shadcn cards.
 */

// ---------------------------------------------------------------------------
// Verify BetterCard wraps shadcn Card primitive internally
// ---------------------------------------------------------------------------
jest.mock("../card", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ReactMod = require("react");
  // Track whether shadcn Card was rendered
  const CardMock = ReactMod.forwardRef(function CardMock(
    props: Record<string, unknown>,
    ref: React.Ref<HTMLDivElement>
  ) {
    return ReactMod.createElement("div", {
      ...props,
      ref,
      "data-slot": "card",
      "data-shadcn-card": "true",
    });
  });
  CardMock.displayName = "Card";
  return {
    __esModule: true,
    Card: CardMock,
    CardHeader: (props: Record<string, unknown>) =>
      ReactMod.createElement("div", { ...props, "data-slot": "card-header" }),
    CardContent: (props: Record<string, unknown>) =>
      ReactMod.createElement("div", { ...props, "data-slot": "card-content" }),
    CardFooter: (props: Record<string, unknown>) =>
      ReactMod.createElement("div", { ...props, "data-slot": "card-footer" }),
    CardTitle: (props: Record<string, unknown>) =>
      ReactMod.createElement("div", { ...props, "data-slot": "card-title" }),
    CardDescription: (props: Record<string, unknown>) =>
      ReactMod.createElement("div", { ...props, "data-slot": "card-description" }),
    CardAction: (props: Record<string, unknown>) =>
      ReactMod.createElement("div", { ...props, "data-slot": "card-action" }),
  };
});

describe("BetterCard", () => {
  it("renders the shadcn Card primitive as its root element", () => {
    render(<BetterCard>Card content</BetterCard>);
    const card = screen.getByTestId("better-card");
    // The mock adds data-shadcn-card="true" when the real shadcn Card is used
    expect(card).toHaveAttribute("data-shadcn-card", "true");
  });

  it("renders with glass-morphism base styles and data-slot='card'", () => {
    render(<BetterCard>Card content</BetterCard>);
    const card = screen.getByTestId("better-card");
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass("text-card-foreground");
    expect(card).toHaveAttribute("data-slot", "card");
    expect(card.textContent).toContain("Card content");
  });

  it("applies data-testid attribute", () => {
    render(<BetterCard data-testid="custom-card">Test</BetterCard>);
    expect(screen.getByTestId("custom-card")).toBeInTheDocument();
  });

  it("accepts custom className", () => {
    render(<BetterCard className="my-custom-class">Test</BetterCard>);
    const card = screen.getByTestId("better-card");
    expect(card).toHaveClass("my-custom-class");
  });

  it("always renders a div via shadcn Card (not polymorphic element)", () => {
    render(<BetterCard>Default div</BetterCard>);
    const card = screen.getByTestId("better-card");
    expect(card.tagName.toLowerCase()).toBe("div");
  });

  it("handles onClick events on the card", () => {
    const handleClick = jest.fn();
    render(
      <BetterCard onClick={handleClick}>
        Clickable card
      </BetterCard>
    );
    const card = screen.getByTestId("better-card");
    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("has inline style for glass-morphism background", () => {
    render(<BetterCard>Styled</BetterCard>);
    const card = screen.getByTestId("better-card");
    expect(card.style.background).toBeTruthy();
  });

  it("updates radial gradient position on mouse move", () => {
    render(<BetterCard>Interactive</BetterCard>);
    const card = screen.getByTestId("better-card");

    fireEvent.mouseEnter(card);
    fireEvent.mouseMove(card, { clientX: 100, clientY: 50 });

    const style = card.style;
    expect(style.getPropertyValue("--metal-x")).toBeTruthy();
    expect(style.getPropertyValue("--metal-y")).toBeTruthy();
  });

  it("resets metallic sheen on mouse leave", () => {
    render(<BetterCard>Interactive</BetterCard>);
    const card = screen.getByTestId("better-card");

    fireEvent.mouseEnter(card);
    fireEvent.mouseMove(card, { clientX: 100, clientY: 50 });
    fireEvent.mouseLeave(card);

    const style = card.style;
    expect(style.getPropertyValue("--metal-x")).toBe("");
  });

  it("supports the active variant with ring styles", () => {
    render(<BetterCard variant="active">Active</BetterCard>);
    const card = screen.getByTestId("better-card");
    expect(card.className).toContain("ring");
  });

  it("supports the focused variant with stronger ring", () => {
    render(<BetterCard variant="focused">Focused</BetterCard>);
    const card = screen.getByTestId("better-card");
    expect(card.className).toContain("ring");
    expect(card.className).toContain("0.40");
  });

  it("uses the softened 8px shadcn radius contract", () => {
    const cardSource = fs.readFileSync(
      path.resolve(__dirname, "../card.tsx"),
      "utf-8"
    );
    expect(cardSource).toContain("rounded-lg");
    expect(cardSource).not.toContain("rounded-xl");
  });

  // ---------------------------------------------------------------------------
  // VAL-SHADCN-004: Cursor-tracking metallic sheen
  // ---------------------------------------------------------------------------

  it("hover sheen center highlight stays at or below 0.18 opacity — VAL-SHADCN-004", () => {
    render(<BetterCard>Sheen test</BetterCard>);
    const card = screen.getByTestId("better-card");

    fireEvent.mouseEnter(card);
    fireEvent.mouseMove(card, { clientX: 50, clientY: 50 });

    const bg = card.style.background;
    const rgbaMatch = bg.match(
      /radial-gradient\(.*?rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*([\d.]+)\s*\)/
    );
    expect(rgbaMatch).not.toBeNull();
    const opacity = parseFloat(rgbaMatch![1]);
    expect(opacity).toBeLessThanOrEqual(0.18);
  });

  it("hover sheen includes a low-contrast secondary metallic ring capped at 0.08 — VAL-SHADCN-004", () => {
    render(<BetterCard>Ring test</BetterCard>);
    const card = screen.getByTestId("better-card");

    fireEvent.mouseEnter(card);
    fireEvent.mouseMove(card, { clientX: 50, clientY: 50 });

    const bg = card.style.background;
    const rgbaMatch = bg.match(
      /rgba\(\s*200\s*,\s*210\s*,\s*255\s*,\s*([\d.]+)\s*\)/
    );
    expect(rgbaMatch).not.toBeNull();
    const opacity = parseFloat(rgbaMatch![1]);
    expect(opacity).toBeLessThanOrEqual(0.08);
  });

  it("sheen radial-gradient stays supportive instead of flashing above the hover base — VAL-SHADCN-004", () => {
    render(<BetterCard>Contrast test</BetterCard>);
    const card = screen.getByTestId("better-card");

    fireEvent.mouseEnter(card);
    fireEvent.mouseMove(card, { clientX: 50, clientY: 50 });

    const bg = card.style.background;
    const rgbaMatch = bg.match(
      /radial-gradient\(.*?rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*([\d.]+)\s*\)/
    );
    expect(rgbaMatch).not.toBeNull();
    const sheenOpacity = parseFloat(rgbaMatch![1]);
    const hoverBase = 0.07;
    expect(sheenOpacity - hoverBase).toBeLessThanOrEqual(0.11);
  });

  // ---------------------------------------------------------------------------
  // VAL-SHADCN-003: Nearly transparent glass cards
  // ---------------------------------------------------------------------------

  it("base background is rgba(255,255,255,0.04) — VAL-SHADCN-003", () => {
    render(<BetterCard>Transparent base</BetterCard>);
    const card = screen.getByTestId("better-card");
    expect(card.style.background).toContain("rgba(255, 255, 255, 0.04)");
  });

  it("hover background stays in the softened 0.06-0.08 range — VAL-SHADCN-003", () => {
    render(<BetterCard>Hover check</BetterCard>);
    const card = screen.getByTestId("better-card");
    fireEvent.mouseEnter(card);
    expect(card.style.background).toContain("rgba(255, 255, 255, 0.07)");
  });

  it("border uses rgba(255,255,255,0.12) — VAL-SHADCN-003", () => {
    render(<BetterCard>Border check</BetterCard>);
    const card = screen.getByTestId("better-card");
    expect(card.style.border).toContain("rgba(255, 255, 255, 0.12)");
  });

  it("does NOT apply backdrop-filter blur — VAL-SHADCN-003", () => {
    render(<BetterCard>No blur</BetterCard>);
    const card = screen.getByTestId("better-card");
    expect(card.style.backdropFilter).toBeFalsy();
    expect(card.style.getPropertyValue("-webkit-backdrop-filter")).toBeFalsy();
  });

  it("hover state keeps any inner glow very restrained — VAL-SHADCN-003", () => {
    render(<BetterCard>Glow check</BetterCard>);
    const card = screen.getByTestId("better-card");
    fireEvent.mouseEnter(card);
    if (card.style.boxShadow) {
      expect(card.style.boxShadow).toContain("inset");
      expect(card.style.boxShadow).toContain("18px");
      expect(card.style.boxShadow).toContain("0.02");
    } else {
      expect(card.style.boxShadow).toBe("");
    }
  });

  it("no inner glow in default (non-hover) state", () => {
    render(<BetterCard>No glow default</BetterCard>);
    const card = screen.getByTestId("better-card");
    expect(card.style.boxShadow).not.toContain("inset");
  });

  it("transitions are 200ms ease", () => {
    render(<BetterCard>Transition check</BetterCard>);
    const card = screen.getByTestId("better-card");
    expect(card.style.transition).toContain("0.2s ease");
  });
});
