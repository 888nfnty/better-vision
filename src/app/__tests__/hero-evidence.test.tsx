import { render, screen, within } from "@testing-library/react";
import Home from "../page";

/**
 * Focused regression tests for hero evidence framing.
 *
 * VAL-NARR-008: The hero status framing must render visible evidence hooks
 * using the structured source metadata in the content layer.
 *
 * VAL-NARR-009: Dependencies shown in caveat frames must use readable
 * labels, not raw internal IDs.
 *
 * Updated for the redesigned poster-like hero: evidence hooks and caveats
 * are now in the condensed inline status framing, not split cards.
 */
describe("Hero evidence framing", () => {
  it("renders evidence hooks in the hero status framing", () => {
    render(<Home />);
    const statusFraming = screen.getByTestId("hero-status-framing");
    const hooks = within(statusFraming).getAllByTestId("evidence-hook");
    expect(hooks.length).toBeGreaterThan(0);
  });

  it("live status indicator has an evidence hook with source label", () => {
    render(<Home />);
    const liveStatus = screen.getByTestId("hero-live-status");
    const hookInLive = within(liveStatus).getByTestId("evidence-hook");
    expect(hookInLive).toBeInTheDocument();
    // The source label should be "BETTER Docs" per narrative.ts hero-live-today block
    expect(hookInLive.textContent).toContain("BETTER Docs");
  });

  it("future status indicator has an evidence hook with source label", () => {
    render(<Home />);
    const futureStatus = screen.getByTestId("hero-future-status");
    const hookInFuture = within(futureStatus).getByTestId("evidence-hook");
    expect(hookInFuture).toBeInTheDocument();
    // The source label should be "BETTER Roadmap" per narrative.ts hero-vision block
    expect(hookInFuture.textContent).toContain("BETTER Roadmap");
  });

  it("both live and future status indicators have evidence hooks", () => {
    render(<Home />);
    const liveStatus = screen.getByTestId("hero-live-status");
    expect(
      within(liveStatus).getByTestId("evidence-hook")
    ).toBeInTheDocument();

    const futureStatus = screen.getByTestId("hero-future-status");
    expect(
      within(futureStatus).getByTestId("evidence-hook")
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

  it("hero caveat frame dependencies render as readable text", () => {
    render(<Home />);
    const heroSection = screen.getByTestId("hero-section");
    const caveatFrame = within(heroSection).getByTestId("caveat-frame");
    const text = caveatFrame.textContent ?? "";
    // Should contain readable labels, not IDs like pe-terminal-open
    expect(text).not.toContain("pe-terminal-open");
    expect(text).not.toContain("pe-social-vaults");
    expect(text).not.toContain("ti-hyperevm-phase1");
    // Should contain dependency info
    expect(text).toContain("Depends on:");
  });
});
