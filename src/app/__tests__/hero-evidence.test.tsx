import { render, screen, within } from "@testing-library/react";
import Home from "../page";

/**
 * Focused regression tests for brand band evidence framing.
 *
 * VAL-NARR-008: The status framing must render visible evidence hooks
 * using the structured source metadata in the content layer.
 *
 * VAL-NARR-009: Dependencies shown in caveat frames must use readable
 * labels, not raw internal IDs.
 *
 * Updated for graph-first ordering: the old hero-section is replaced by
 * a compact brand band (data-testid="compact-brand-band").
 */
describe("Brand band evidence framing", () => {
  it("renders evidence hooks in the status framing", () => {
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
    expect(hookInLive.textContent).toContain("BETTER Docs");
  });

  it("future status indicator has an evidence hook with source label", () => {
    render(<Home />);
    const futureStatus = screen.getByTestId("hero-future-status");
    const hookInFuture = within(futureStatus).getByTestId("evidence-hook");
    expect(hookInFuture).toBeInTheDocument();
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

  it("caveat frame does not contain raw internal dependency IDs", () => {
    render(<Home />);
    const caveats = screen.getAllByTestId("caveat-frame");
    const internalIdPattern = /\b[a-z]{2}-[a-z]+-[a-z]+(?:-[a-z0-9]+)*\b/;
    for (const caveat of caveats) {
      const text = caveat.textContent ?? "";
      expect(text).not.toMatch(internalIdPattern);
    }
  });

  it("brand band caveat frame dependencies render as readable text", () => {
    render(<Home />);
    const brandBand = screen.getByTestId("compact-brand-band");
    const caveatFrame = within(brandBand).getByTestId("caveat-frame");
    const text = caveatFrame.textContent ?? "";
    expect(text).not.toContain("pe-terminal-open");
    expect(text).not.toContain("pe-social-vaults");
    expect(text).not.toContain("ti-hyperevm-phase1");
    expect(text).toContain("Depends on:");
  });
});
