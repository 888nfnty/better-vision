/**
 * Hero deduplication, logotype visibility, and graph-first ordering tests.
 *
 * VAL-VISUAL-026: The page does not render a duplicate standalone hero
 * beneath the graph workspace. The BETTER logotype SVG is visible at the
 * top of the graph-first workspace. Only one hero/brand surface exists.
 *
 * Graph-first ordering: GraphExplorer is the primary above-the-fold
 * surface. Only a minimal compact brand treatment (logotype + tagline)
 * exists — no full hero section above the graph workspace.
 */
import { render, screen } from "@testing-library/react";
import Home from "../page";

describe("Hero deduplication (VAL-VISUAL-026)", () => {
  it("does NOT render a standalone hero section — uses compact brand band instead", () => {
    render(<Home />);
    // No standalone hero-section (data-testid="hero-section") should exist.
    // The brand treatment is a compact band (data-testid="compact-brand-band").
    const heroSections = document.querySelectorAll('[data-testid="hero-section"]');
    expect(heroSections.length).toBe(0);
  });

  it("BETTER logotype SVG is prominent at the top of the graph-first workspace", () => {
    render(<Home />);
    const atlas = document.getElementById("atlas");
    expect(atlas).toBeInTheDocument();

    // The logotype should be inside the atlas section (compact brand band)
    const logotype = atlas!.querySelector('img[data-testid="hero-logotype"]');
    expect(logotype).toBeInTheDocument();
    expect(logotype!.getAttribute("src")).toContain("better-logotype");
  });

  it("only one hero/brand surface exists in the entire page", () => {
    render(<Home />);
    // No standalone hero-section should exist
    const heroSections = document.querySelectorAll('[data-testid="hero-section"]');
    expect(heroSections.length).toBe(0);

    // The compact brand band should exist exactly once
    const brandBands = document.querySelectorAll('[data-testid="compact-brand-band"]');
    expect(brandBands.length).toBe(1);
  });

  it("graph-first ordering: compact brand band appears before graph shell, both inside atlas", async () => {
    render(<Home />);
    const atlas = document.getElementById("atlas");
    expect(atlas).toBeInTheDocument();

    const brandBand = screen.getByTestId("compact-brand-band");
    const graphShell = await screen.findByTestId("graph-shell");

    // Both are inside the atlas section
    expect(atlas!.contains(brandBand)).toBe(true);
    expect(atlas!.contains(graphShell)).toBe(true);

    // The compact brand band appears before the graph shell (as a header)
    const position = brandBand.compareDocumentPosition(graphShell);
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("no full hero section exists above the graph workspace", async () => {
    render(<Home />);
    const atlas = document.getElementById("atlas");
    expect(atlas).toBeInTheDocument();

    // No data-testid="hero-section" should exist anywhere in the atlas
    const heroSections = atlas!.querySelectorAll('[data-testid="hero-section"]');
    expect(heroSections.length).toBe(0);
  });
});
