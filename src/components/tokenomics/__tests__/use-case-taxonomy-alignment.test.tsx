/**
 * Use-case taxonomy alignment tests.
 *
 * Ensures that:
 * 1. Enterprise/API data-licensing analysis appears on its own utility card,
 *    NOT on the Whale Exclusive Products card.
 * 2. The Whale Exclusive Products card only shows whale-premium-product
 *    analysis (private alpha, personal AI vaults, OTC, bespoke configs).
 * 3. The use-case-to-card mapping is correctly aligned — each USE_CASE_ANALYSES
 *    entry's id matches a corresponding UTILITY_MECHANICS entry in the surface.
 */

import React from "react";
import { render, screen, within } from "@testing-library/react";
import TokenUtilitySurface from "../TokenUtilitySurface";
import { USE_CASE_ANALYSES } from "@/content";

// ---------------------------------------------------------------------------
// Data-level tests: use-case taxonomy correctness
// ---------------------------------------------------------------------------

describe("Use-case taxonomy alignment (data model)", () => {
  it("has a separate enterprise data-licensing use-case analysis entry", () => {
    const enterprise = USE_CASE_ANALYSES.find(
      (uc) => uc.id === "util-enterprise-data-licensing"
    );
    expect(enterprise).toBeDefined();
    expect(enterprise!.comparableMarketSize).toBeTruthy();
    expect(enterprise!.revenueModel).toBeTruthy();
  });

  it("enterprise data-licensing analysis references enterprise/B2B/data-licensing market", () => {
    const enterprise = USE_CASE_ANALYSES.find(
      (uc) => uc.id === "util-enterprise-data-licensing"
    );
    expect(enterprise).toBeDefined();
    const text = (
      enterprise!.comparableMarketSize +
      " " +
      enterprise!.revenueModel
    ).toLowerCase();
    // Must reference enterprise blockchain or data licensing concepts
    expect(
      text.includes("enterprise") ||
        text.includes("data licens") ||
        text.includes("b2b") ||
        text.includes("institutional")
    ).toBe(true);
  });

  it("whale-exclusives analysis does NOT contain enterprise/data-licensing content", () => {
    const whaleExcl = USE_CASE_ANALYSES.find(
      (uc) => uc.id === "util-whale-exclusives"
    );
    expect(whaleExcl).toBeDefined();
    const text = (
      whaleExcl!.comparableMarketSize +
      " " +
      whaleExcl!.revenueModel
    ).toLowerCase();
    // Whale-exclusives must NOT reference enterprise data licensing, Chainalysis, Bloomberg, B2B data
    expect(text).not.toMatch(/\bdata licens/);
    expect(text).not.toMatch(/\bchainalysis\b/);
    expect(text).not.toMatch(/\bbloomberg\b/);
    expect(text).not.toMatch(/\bb2b data\b/);
  });

  it("whale-exclusives analysis focuses on whale-premium products", () => {
    const whaleExcl = USE_CASE_ANALYSES.find(
      (uc) => uc.id === "util-whale-exclusives"
    );
    expect(whaleExcl).toBeDefined();
    const text = (
      whaleExcl!.comparableMarketSize +
      " " +
      whaleExcl!.revenueModel +
      " " +
      whaleExcl!.tokenDemandImplications
    ).toLowerCase();
    // Must reference whale-premium concepts
    expect(
      text.includes("whale") ||
        text.includes("premium") ||
        text.includes("exclusive") ||
        text.includes("alpha") ||
        text.includes("bespoke") ||
        text.includes("otc")
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Rendered UI tests: card-level taxonomy alignment
// ---------------------------------------------------------------------------

describe("Use-case taxonomy alignment (rendered cards)", () => {
  it("renders an enterprise data-licensing utility card", () => {
    render(<TokenUtilitySurface />);
    const cards = screen.getAllByTestId("utility-card");
    const enterpriseCard = cards.find(
      (card) =>
        card.getAttribute("data-utility-id") === "util-enterprise-data-licensing"
    );
    expect(enterpriseCard).toBeDefined();
  });

  it("enterprise card title references enterprise or data licensing", () => {
    render(<TokenUtilitySurface />);
    const cards = screen.getAllByTestId("utility-card");
    const enterpriseCard = cards.find(
      (card) =>
        card.getAttribute("data-utility-id") === "util-enterprise-data-licensing"
    );
    expect(enterpriseCard).toBeDefined();
    const title = enterpriseCard!.textContent?.toLowerCase() ?? "";
    expect(
      title.includes("enterprise") || title.includes("data licens")
    ).toBe(true);
  });

  it("whale-exclusives card does NOT show enterprise data-licensing content", () => {
    render(<TokenUtilitySurface />);
    const cards = screen.getAllByTestId("utility-card");
    const whaleCard = cards.find(
      (card) =>
        card.getAttribute("data-utility-id") === "util-whale-exclusives"
    );
    expect(whaleCard).toBeDefined();
    const marketSection = within(whaleCard!).getByTestId("use-case-market-size");
    const marketText = marketSection.textContent?.toLowerCase() ?? "";
    // Must NOT contain enterprise blockchain market or data licensing content
    expect(marketText).not.toMatch(/enterprise blockchain market/);
    expect(marketText).not.toMatch(/\$287\.8b/);
    expect(marketText).not.toMatch(/\bdata licens/);
    expect(marketText).not.toMatch(/\bchainalysis\b/);
  });

  it("whale-exclusives card shows whale-premium-product analysis", () => {
    render(<TokenUtilitySurface />);
    const cards = screen.getAllByTestId("utility-card");
    const whaleCard = cards.find(
      (card) =>
        card.getAttribute("data-utility-id") === "util-whale-exclusives"
    );
    expect(whaleCard).toBeDefined();
    const whaleText = whaleCard!.textContent?.toLowerCase() ?? "";
    // Must contain whale/premium product references
    expect(
      whaleText.includes("whale") ||
        whaleText.includes("premium") ||
        whaleText.includes("exclusive") ||
        whaleText.includes("alpha") ||
        whaleText.includes("bespoke")
    ).toBe(true);
  });

  it("enterprise card and whale-exclusives card are both present and distinct", () => {
    render(<TokenUtilitySurface />);
    const cards = screen.getAllByTestId("utility-card");
    const enterpriseCard = cards.find(
      (card) =>
        card.getAttribute("data-utility-id") === "util-enterprise-data-licensing"
    );
    const whaleCard = cards.find(
      (card) =>
        card.getAttribute("data-utility-id") === "util-whale-exclusives"
    );
    expect(enterpriseCard).toBeDefined();
    expect(whaleCard).toBeDefined();
    expect(enterpriseCard).not.toBe(whaleCard);
  });
});
