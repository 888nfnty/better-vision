import { render, screen, fireEvent } from "@testing-library/react";
import { BetterCard } from "../BetterCard";

/**
 * Tests for the BetterCard component — shadcn Card wrapper with liquid metal sheen.
 *
 * VAL-SHADCN-002: Replaces LiquidMetalCard across all production components.
 * VAL-SHADCN-003: Cards are near-transparent glass over shader.
 * VAL-SHADCN-004: Cursor-tracking metallic sheen on shadcn cards.
 */
describe("BetterCard", () => {
  it("renders with glass-morphism base styles and data-slot='card'", () => {
    render(<BetterCard>Card content</BetterCard>);
    const card = screen.getByTestId("better-card");
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass("rounded-lg");
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

  it("renders as a button when as='button'", () => {
    const handleClick = jest.fn();
    render(
      <BetterCard as="button" onClick={handleClick}>
        Clickable card
      </BetterCard>
    );
    const card = screen.getByTestId("better-card");
    expect(card.tagName.toLowerCase()).toBe("button");
    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders as a div by default", () => {
    render(<BetterCard>Default div</BetterCard>);
    const card = screen.getByTestId("better-card");
    expect(card.tagName.toLowerCase()).toBe("div");
  });

  it("renders as specified element type", () => {
    render(<BetterCard as="article">Article card</BetterCard>);
    const card = screen.getByTestId("better-card");
    expect(card.tagName.toLowerCase()).toBe("article");
  });

  it("renders as 'li' element", () => {
    render(
      <ul>
        <BetterCard as="li">List item card</BetterCard>
      </ul>
    );
    const card = screen.getByTestId("better-card");
    expect(card.tagName.toLowerCase()).toBe("li");
  });

  it("renders as 'details' element", () => {
    render(<BetterCard as="details">Details card</BetterCard>);
    const card = screen.getByTestId("better-card");
    expect(card.tagName.toLowerCase()).toBe("details");
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

  it("has 8px border-radius (rounded-lg)", () => {
    render(<BetterCard>Radius check</BetterCard>);
    const card = screen.getByTestId("better-card");
    expect(card).toHaveClass("rounded-lg");
  });

  // ---------------------------------------------------------------------------
  // VAL-SHADCN-004: Cursor-tracking metallic sheen
  // ---------------------------------------------------------------------------

  it("hover sheen center highlight is at least 0.35 opacity — VAL-SHADCN-004", () => {
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
    expect(opacity).toBeGreaterThanOrEqual(0.35);
  });

  it("hover sheen includes a secondary metallic ring for depth — VAL-SHADCN-004", () => {
    render(<BetterCard>Ring test</BetterCard>);
    const card = screen.getByTestId("better-card");

    fireEvent.mouseEnter(card);
    fireEvent.mouseMove(card, { clientX: 50, clientY: 50 });

    const bg = card.style.background;
    expect(bg).toMatch(/rgba\(\s*200\s*,\s*210\s*,\s*255/);
  });

  it("sheen radial-gradient is materially distinct from hover base — VAL-SHADCN-004", () => {
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
    const hoverBase = 0.08;
    expect(sheenOpacity - hoverBase).toBeGreaterThanOrEqual(0.25);
  });

  // ---------------------------------------------------------------------------
  // VAL-SHADCN-003: Nearly transparent glass cards
  // ---------------------------------------------------------------------------

  it("base background is rgba(255,255,255,0.04) — VAL-SHADCN-003", () => {
    render(<BetterCard>Transparent base</BetterCard>);
    const card = screen.getByTestId("better-card");
    expect(card.style.background).toContain("rgba(255, 255, 255, 0.04)");
  });

  it("hover background is rgba(255,255,255,0.08) — VAL-SHADCN-003", () => {
    render(<BetterCard>Hover check</BetterCard>);
    const card = screen.getByTestId("better-card");
    fireEvent.mouseEnter(card);
    expect(card.style.background).toContain("rgba(255, 255, 255, 0.08)");
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

  it("hover state includes subtle inner glow box-shadow — VAL-SHADCN-003", () => {
    render(<BetterCard>Glow check</BetterCard>);
    const card = screen.getByTestId("better-card");
    fireEvent.mouseEnter(card);
    expect(card.style.boxShadow).toContain("inset");
    expect(card.style.boxShadow).toContain("30px");
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
