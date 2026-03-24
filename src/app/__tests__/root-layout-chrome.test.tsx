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
import { render, screen, within } from "@testing-library/react";
import { NAV_ITEMS } from "@/components/nav-items";
import RootLayout from "../layout";
import Home from "../page";

function renderHomeWithinRootLayout() {
  const layoutElement = RootLayout({
    children: <Home />,
  }) as React.ReactElement<{
    lang?: string;
    className?: string;
    children: React.ReactNode;
  }>;

  expect(layoutElement.type).toBe("html");

  const bodyElement = React.Children.only(
    layoutElement.props.children
  ) as React.ReactElement<{
    className?: string;
    children: React.ReactNode;
  }>;

  expect(bodyElement.type).toBe("body");

  return {
    layoutElement,
    bodyElement,
    ...render(<>{bodyElement.props.children}</>),
  };
}

describe("RootLayout shared chrome — Header", () => {
  it("renders the RootLayout header chrome with graph-first navigation", () => {
    const { layoutElement, bodyElement } = renderHomeWithinRootLayout();

    expect(layoutElement.props.lang).toBe("en");
    expect(layoutElement.props.className).toContain("dark");
    expect(bodyElement.props.className).toContain("flex");
    expect(screen.getByTestId("header-logotype")).toBeInTheDocument();

    const desktopNav = screen.getByTestId("desktop-nav");
    for (const item of NAV_ITEMS) {
      const link = within(desktopNav).getByRole("link", { name: item.label });
      expect(link).toHaveAttribute("href", item.href);
      expect(item.href).toMatch(/^#graph-/);
    }
  });

  it("rendered RootLayout navigation targets valid graph nodes", async () => {
    renderHomeWithinRootLayout();
    // GraphExplorer loads via dynamic import (VAL-VISUAL-027)
    await screen.findByTestId("graph-shell");

    const desktopNav = screen.getByTestId("desktop-nav");
    // Each nav item's graph target should correspond to a graph node button
    const graphNodes = screen.getAllByTestId("graph-node-button");
    const graphNodeLabels = graphNodes.map((n) =>
      n.getAttribute("aria-label")?.toLowerCase()
    );
    for (const item of NAV_ITEMS) {
      expect(
        within(desktopNav).getByRole("link", { name: item.label })
      ).toHaveAttribute("href", item.href);
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
    renderHomeWithinRootLayout();
    const requiredDestinations = [
      "graph-what-is-better",
      "graph-live-now",
      "graph-roadmap",
      "graph-tokenomics",
      "graph-evidence",
      "graph-risks",
    ];
    const navHrefs = within(screen.getByTestId("desktop-nav"))
      .getAllByRole("link")
      .map((item) => item.getAttribute("href")?.replace("#", ""));
    for (const dest of requiredDestinations) {
      expect(navHrefs).toContain(dest);
    }
  });
});

describe("RootLayout shared chrome — Footer", () => {
  it("footer disclaimer renders with maturity labels", () => {
    renderHomeWithinRootLayout();
    expect(
      screen.getByText(
        "This site presents the BETTER ecosystem vision. Maturity labels distinguish live features from planned and speculative roadmap items."
      )
    ).toBeInTheDocument();
  });
});

describe("RootLayout shared chrome — Section structure", () => {
  it("page renders compact brand band, atlas, and proof sections in correct order", async () => {
    renderHomeWithinRootLayout();
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
    renderHomeWithinRootLayout();
    const brandBand = screen.getByTestId("compact-brand-band");
    expect(brandBand).toBeInTheDocument();
    expect(brandBand.textContent).toContain("prediction-market intelligence");
    const liveStatus = brandBand.querySelector('[data-testid="hero-live-status"]');
    const futureStatus = brandBand.querySelector('[data-testid="hero-future-status"]');
    expect(liveStatus).toBeInTheDocument();
    expect(futureStatus).toBeInTheDocument();
  });

  it("atlas section contains the graph shell", async () => {
    renderHomeWithinRootLayout();
    const atlas = document.getElementById("atlas");
    expect(atlas).toBeInTheDocument();
    // GraphExplorer loads via dynamic import (VAL-VISUAL-027)
    const graphShell = await screen.findByTestId("graph-shell");
    expect(atlas!.contains(graphShell)).toBe(true);
  });
});
