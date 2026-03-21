import { render, screen, within } from "@testing-library/react";
import Home from "../page";

/**
 * Focused regression tests for hero evidence framing.
 *
 * VAL-NARR-008: The hero 'The Vision Ahead' card must render a visible
 * evidence hook using the structured source metadata in the content layer.
 *
 * VAL-NARR-009: Dependencies shown in caveat frames must use readable
 * labels, not raw internal IDs.
 */
describe("Hero evidence framing", () => {
  it("renders an evidence hook on the 'The Vision Ahead' hero card", () => {
    render(<Home />);
    // Find the vision card by its title text
    const visionTitle = screen.getByText("The Vision Ahead");
    // The evidence hook should be within the same card container
    const card = visionTitle.closest("[class*='rounded-lg']")!;
    expect(card).toBeTruthy();
    const hookInCard = within(card as HTMLElement).getByTestId("evidence-hook");
    expect(hookInCard).toBeInTheDocument();
  });

  it("the vision hero evidence hook carries the source label from content", () => {
    render(<Home />);
    const visionTitle = screen.getByText("The Vision Ahead");
    const card = visionTitle.closest("[class*='rounded-lg']")!;
    const hookInCard = within(card as HTMLElement).getByTestId("evidence-hook");
    // The source label should be "BETTER Roadmap" per narrative.ts hero-vision block
    expect(hookInCard.textContent).toContain("BETTER Roadmap");
  });

  it("both hero split cards (Live Today and Vision Ahead) have evidence hooks", () => {
    render(<Home />);
    const liveTitle = screen.getByText("Live Today");
    const liveCard = liveTitle.closest("[class*='rounded-lg']")!;
    expect(
      within(liveCard as HTMLElement).getByTestId("evidence-hook")
    ).toBeInTheDocument();

    const visionTitle = screen.getByText("The Vision Ahead");
    const visionCard = visionTitle.closest("[class*='rounded-lg']")!;
    expect(
      within(visionCard as HTMLElement).getByTestId("evidence-hook")
    ).toBeInTheDocument();
  });

  it("hero caveat frame does not contain raw internal dependency IDs", () => {
    render(<Home />);
    const caveats = screen.getAllByTestId("caveat-frame");
    // Internal IDs follow the pattern: two-letter prefix, dash, kebab-case slug
    const internalIdPattern = /\b[a-z]{2}-[a-z]+-[a-z]+(?:-[a-z0-9]+)*\b/;
    for (const caveat of caveats) {
      const text = caveat.textContent ?? "";
      expect(text).not.toMatch(internalIdPattern);
    }
  });

  it("hero vision card caveat dependencies render as readable text", () => {
    render(<Home />);
    const visionTitle = screen.getByText("The Vision Ahead");
    const card = visionTitle.closest("[class*='rounded-lg']")!;
    const caveatFrame = within(card as HTMLElement).getByTestId("caveat-frame");
    const text = caveatFrame.textContent ?? "";
    // Should contain readable labels, not IDs like pe-terminal-open
    expect(text).not.toContain("pe-terminal-open");
    expect(text).not.toContain("pe-social-vaults");
    expect(text).not.toContain("ti-hyperevm-phase1");
    // Should contain dependency info
    expect(text).toContain("Depends on:");
  });
});
