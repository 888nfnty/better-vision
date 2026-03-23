import { render, screen } from "@testing-library/react";
import Home from "../page";

describe("Home page", () => {
  // VAL-NARR-001: Brand band explains BETTER in plain language
  it("renders a plain-language definition of BETTER in the brand band", () => {
    render(<Home />);
    const heroLogotype = screen.getByTestId("hero-logotype");
    expect(heroLogotype).toBeInTheDocument();
    expect(heroLogotype.getAttribute("alt")).toContain("BETTER");
    const matches = screen.getAllByText(/prediction-market intelligence/i);
    expect(matches.length).toBeGreaterThan(0);
    expect(
      screen.getByText(/prediction-market intelligence platform that combines/i)
    ).toBeInTheDocument();
  });

  // VAL-NARR-002: Brand band separates live product reality from future vision
  it("separates live product from future vision before scroll", () => {
    render(<Home />);
    expect(screen.getByTestId("hero-live-status")).toBeInTheDocument();
    expect(screen.getByTestId("hero-future-status")).toBeInTheDocument();
  });

  // VAL-NARR-006: Narrative shell visibly carries maturity labels
  it("renders maturity badges on proof and brand content", () => {
    render(<Home />);
    const badges = screen.getAllByTestId("maturity-badge");
    expect(badges.length).toBeGreaterThan(0);
    const statuses = badges.map((b) => b.getAttribute("data-status"));
    expect(statuses).toContain("live");
  });

  // VAL-NARR-008: Aggressive claims expose evidence hooks
  it("renders evidence hooks on brand band and proof content", () => {
    render(<Home />);
    const hooks = screen.getAllByTestId("evidence-hook");
    expect(hooks.length).toBeGreaterThan(0);
  });

  // VAL-NARR-009: Aggressive and future-facing claims carry nearby caveats
  it("renders caveat frames on future-facing brand content", () => {
    render(<Home />);
    const caveats = screen.getAllByTestId("caveat-frame");
    expect(caveats.length).toBeGreaterThan(0);
  });

  // VAL-NARR-010: CTAs are honest about destination — live path is primary
  it("renders honest CTAs with graph-first destinations", () => {
    render(<Home />);
    const primaryCta = screen.getByTestId("cta-primary");
    expect(primaryCta).toHaveAttribute("href", "#graph-proof");
    expect(primaryCta.textContent).toMatch(/live/i);

    const secondaryCta = screen.getByTestId("cta-secondary");
    expect(secondaryCta).toHaveAttribute("href", "#graph-roadmap");
    expect(secondaryCta.textContent).toMatch(/atlas|roadmap/i);
  });

  // VAL-NARR-013: Proof section is present (below graph shell)
  it("renders proof section", async () => {
    render(<Home />);
    const proof = await screen.findByTestId("proof-section");
    expect(proof).toBeInTheDocument();
  });

  // VAL-ROADMAP-001: Graph-first shell is the primary exploration surface
  it("renders the graph-first exploration shell", async () => {
    render(<Home />);
    const graphShell = await screen.findByTestId("graph-shell");
    expect(graphShell).toBeInTheDocument();
    const graphNodes = screen.getAllByTestId("graph-node-button");
    expect(graphNodes.length).toBeGreaterThanOrEqual(7);
  });

  // The atlas section wraps the brand band and graph shell (VAL-VISUAL-026)
  it("atlas section contains the compact brand band and graph shell", async () => {
    render(<Home />);
    const atlas = document.getElementById("atlas");
    expect(atlas).toBeInTheDocument();
    const graphShell = await screen.findByTestId("graph-shell");
    expect(atlas!.contains(graphShell)).toBe(true);
    const brandBand = screen.getByTestId("compact-brand-band");
    expect(atlas!.contains(brandBand)).toBe(true);
  });
});
