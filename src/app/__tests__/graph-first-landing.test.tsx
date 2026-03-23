/**
 * Tests for graph-first default landing.
 *
 * The root load should land on a genuinely graph-first workspace
 * with the interactive graph as the primary visible surface.
 * A compact brand band (logotype + tagline) is integrated at the top
 * of the atlas section, not as a full hero section. (VAL-VISUAL-026)
 *
 * VAL-ROADMAP-014: Default loaded state is a pure graph workspace
 * VAL-CROSS-014: Graph workspace with investor-path entry, no separate handoff
 * VAL-VISUAL-026: Single compact brand surface, no full hero section
 */
import { render, screen } from "@testing-library/react";
import Home from "../page";

describe("Graph-first default landing", () => {
  it("atlas section contains the compact brand band and graph shell as one workspace", async () => {
    render(<Home />);
    const atlas = document.getElementById("atlas");
    expect(atlas).toBeInTheDocument();

    // Both the brand band and graph shell are INSIDE the atlas section
    const graphShell = await screen.findByTestId("graph-shell");
    const brandBand = screen.getByTestId("compact-brand-band");
    expect(atlas!.contains(graphShell)).toBe(true);
    expect(atlas!.contains(brandBand)).toBe(true);
  });

  it("compact brand band appears before the graph shell inside the atlas (VAL-VISUAL-026)", async () => {
    render(<Home />);
    const brandBand = screen.getByTestId("compact-brand-band");
    const graphShell = await screen.findByTestId("graph-shell");

    // The compact brand band should come BEFORE the graph shell in DOM order
    const position = brandBand.compareDocumentPosition(graphShell);
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("no full hero section exists — only a compact brand band", () => {
    render(<Home />);
    const heroSections = document.querySelectorAll('[data-testid="hero-section"]');
    expect(heroSections.length).toBe(0);
    const brandBands = document.querySelectorAll('[data-testid="compact-brand-band"]');
    expect(brandBands.length).toBe(1);
  });

  it("the atlas is the topmost content section", async () => {
    render(<Home />);
    const atlas = document.getElementById("atlas");
    const proof = await screen.findByTestId("proof-section");

    expect(atlas).toBeInTheDocument();
    // Atlas should come before the proof section in DOM order
    const position = atlas!.compareDocumentPosition(proof);
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("investor-path entry affordance is visible in the first graph workspace", async () => {
    render(<Home />);
    const startAffordance = await screen.findByTestId("investor-path-start");
    expect(startAffordance).toBeInTheDocument();
  });
});
