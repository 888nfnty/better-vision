import { render, screen } from "@testing-library/react";
import Home from "../page";

/**
 * Focused regression tests for shared navigation and layout behavior.
 *
 * Updated for graph-first ordering: the old hero-section is replaced by
 * a compact brand band. The atlas section wraps both the compact brand
 * band and the lazy-loaded graph shell.
 */
describe("Shared navigation regression", () => {
  it("proof section has the #proof anchor", async () => {
    render(<Home />);
    const proofSection = await screen.findByTestId("proof-section");
    expect(proofSection).toBeInTheDocument();
    expect(document.getElementById("proof")).toBeInTheDocument();
  });

  it("atlas section has the #atlas anchor wrapping the graph shell", async () => {
    render(<Home />);
    const section = document.getElementById("atlas");
    expect(section).toBeInTheDocument();
    const graphShell = await screen.findByTestId("graph-shell");
    expect(section!.contains(graphShell)).toBe(true);
  });

  it("graph shell renders all major BETTER surface nodes", async () => {
    render(<Home />);
    await screen.findByTestId("graph-shell");
    const graphNodes = screen.getAllByTestId("graph-node-button");
    expect(graphNodes.length).toBeGreaterThanOrEqual(7);
  });
});

describe("Compact brand band regression", () => {
  it("brand band renders inline live and future status indicators", () => {
    render(<Home />);
    expect(screen.getByTestId("hero-live-status")).toBeInTheDocument();
    expect(screen.getByTestId("hero-future-status")).toBeInTheDocument();
  });

  it("live status indicator carries the live maturity badge", () => {
    render(<Home />);
    const liveStatus = screen.getByTestId("hero-live-status");
    const badge = liveStatus.querySelector('[data-testid="maturity-badge"]');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("data-status", "live");
  });

  it("future status indicator carries a non-live maturity badge", () => {
    render(<Home />);
    const futureStatus = screen.getByTestId("hero-future-status");
    const badge = futureStatus.querySelector('[data-testid="maturity-badge"]');
    expect(badge).toBeInTheDocument();
    expect(badge?.getAttribute("data-status")).not.toBe("live");
  });

  it("brand band includes a caveat frame for future-facing claims", () => {
    render(<Home />);
    const brandBand = screen.getByTestId("compact-brand-band");
    const caveat = brandBand.querySelector('[data-testid="caveat-frame"]');
    expect(caveat).toBeInTheDocument();
  });
});

describe("Graph shell heading and structure regression", () => {
  it("atlas section contains the graph shell and compact brand band", async () => {
    render(<Home />);
    const atlas = document.getElementById("atlas");
    expect(atlas).toBeInTheDocument();
    const graphShell = await screen.findByTestId("graph-shell");
    expect(atlas!.contains(graphShell)).toBe(true);
    const brandBand = screen.getByTestId("compact-brand-band");
    expect(atlas!.contains(brandBand)).toBe(true);
  });

  it("graph overview shows BETTER Atlas labels", async () => {
    render(<Home />);
    await screen.findByTestId("graph-shell");
    const atlasLabels = screen.getAllByText("BETTER Atlas");
    expect(atlasLabels.length).toBeGreaterThanOrEqual(1);
  });

  it("evidence hooks are present in compact brand band", () => {
    render(<Home />);
    const brandBand = screen.getByTestId("compact-brand-band");
    const hooks = brandBand.querySelectorAll('[data-testid="evidence-hook"]');
    expect(hooks.length).toBeGreaterThan(0);
  });
});
