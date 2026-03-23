/**
 * RootLayout shared-chrome regression tests.
 *
 * Updated for graph-first shell: navigation now uses #graph-<id> hashes
 * that target the graph shell's focus states rather than section anchors.
 * The hero, proof, and atlas sections are always rendered on the page.
 *
 * Updated for dynamic imports (VAL-VISUAL-027): GraphExplorer and ProofModule
 * are dynamically imported, so tests use async findBy* queries.
 *
 * VAL-NARR-004: Navigation opens graph destinations and focus states
 * VAL-NARR-005: Navigation labels are understandable
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { NAV_ITEMS } from "@/components/nav-items";
import Home from "../page";

describe("RootLayout shared chrome — Header", () => {
  it("navigation items use graph-first hash destinations", () => {
    // All nav items should use #graph-<id> format
    for (const item of NAV_ITEMS) {
      expect(item.href).toMatch(/^#graph-/);
    }
  });

  it("graph node IDs in navigation match valid graph nodes", async () => {
    render(<Home />);
    // GraphExplorer loads via dynamic import (VAL-VISUAL-027)
    await screen.findByTestId("graph-shell");
    // Each nav item's graph target should correspond to a graph node button
    const graphNodes = screen.getAllByTestId("graph-node-button");
    const graphNodeLabels = graphNodes.map((n) =>
      n.getAttribute("aria-label")?.toLowerCase()
    );
    for (const item of NAV_ITEMS) {
      // Nav label should match a graph node label
      expect(
        graphNodeLabels.some((label) => label?.includes(item.label.toLowerCase()))
      ).toBe(true);
    }
  });

  it("navigation labels are understandable without insider context (VAL-NARR-005)", () => {
    const insiderPatterns = [/^BRAID$/i, /^vBETTER$/i, /^HyperEVM$/i, /^FDV$/i, /^TAM$/i];
    for (const item of NAV_ITEMS) {
      for (const pattern of insiderPatterns) {
        expect(item.label).not.toMatch(pattern);
      }
    }
  });

  it("navigation covers required destinations: what, live, roadmap, tokenomics, evidence, risks (VAL-NARR-004)", () => {
    const requiredDestinations = [
      "graph-what-is-better",
      "graph-live-now",
      "graph-roadmap",
      "graph-tokenomics",
      "graph-evidence",
      "graph-risks",
    ];
    const navHrefs = NAV_ITEMS.map((item) => item.href.replace("#", ""));
    for (const dest of requiredDestinations) {
      expect(navHrefs).toContain(dest);
    }
  });
});

describe("RootLayout shared chrome — Footer", () => {
  it("footer disclaimer mentions maturity labels", () => {
    const expectedFooterText =
      "This site presents the BETTER ecosystem vision. Maturity labels distinguish live features from planned and speculative roadmap items.";
    expect(expectedFooterText.toLowerCase()).toContain("maturity labels");
    expect(expectedFooterText.toLowerCase()).toContain("live");
    expect(expectedFooterText.toLowerCase()).toContain("planned");
    expect(expectedFooterText.toLowerCase()).toContain("speculative");
  });
});

describe("RootLayout shared chrome — Section structure", () => {
  it("page renders compact brand band, atlas, and proof sections in correct order", async () => {
    render(<Home />);
    const brandBand = screen.getByTestId("compact-brand-band");
    const proof = await screen.findByTestId("proof-section");
    const atlas = document.getElementById("atlas");

    expect(brandBand).toBeInTheDocument();
    expect(proof).toBeInTheDocument();
    expect(atlas).toBeInTheDocument();

    // Atlas contains the brand band; proof follows atlas.
    expect(atlas!.contains(brandBand)).toBe(true);
    expect(brandBand.compareDocumentPosition(proof) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("brand band explains BETTER before requiring scroll (VAL-CROSS-001)", () => {
    render(<Home />);
    const brandBand = screen.getByTestId("compact-brand-band");
    expect(brandBand).toBeInTheDocument();
    expect(brandBand.textContent).toContain("prediction-market intelligence");
    const liveStatus = brandBand.querySelector('[data-testid="hero-live-status"]');
    const futureStatus = brandBand.querySelector('[data-testid="hero-future-status"]');
    expect(liveStatus).toBeInTheDocument();
    expect(futureStatus).toBeInTheDocument();
  });

  it("atlas section contains the graph shell", async () => {
    render(<Home />);
    const atlas = document.getElementById("atlas");
    expect(atlas).toBeInTheDocument();
    // GraphExplorer loads via dynamic import (VAL-VISUAL-027)
    const graphShell = await screen.findByTestId("graph-shell");
    expect(atlas!.contains(graphShell)).toBe(true);
  });
});
