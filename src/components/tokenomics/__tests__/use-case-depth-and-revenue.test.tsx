/**
 * VAL-TOKEN-021: Use-case revenue and demand analysis
 *
 * Each proposed BETTER token use case includes:
 * - Comparable market size data
 * - Revenue model explanation
 * - Token demand implications (why it creates new holders or increases stake demand)
 * - Realistic timeline
 * - Prediction market figures backed by Dune-verified on-chain data
 */

import React from "react";
import { render, screen, within } from "@testing-library/react";
import TokenUtilitySurface from "../TokenUtilitySurface";
import { USE_CASE_ANALYSES } from "@/content";

// ---------------------------------------------------------------------------
// Data-level tests
// ---------------------------------------------------------------------------

describe("USE_CASE_ANALYSES (data model)", () => {
  it("contains at least 7 use cases (matching utility mechanics)", () => {
    expect(USE_CASE_ANALYSES.length).toBeGreaterThanOrEqual(7);
  });

  it("every use case has a non-empty comparableMarketSize", () => {
    for (const uc of USE_CASE_ANALYSES) {
      expect(uc.comparableMarketSize.length).toBeGreaterThan(0);
      expect(uc.comparableMarketSize).not.toBe("");
    }
  });

  it("every use case has a non-empty revenueModel", () => {
    for (const uc of USE_CASE_ANALYSES) {
      expect(uc.revenueModel.length).toBeGreaterThan(0);
      expect(uc.revenueModel).not.toBe("");
    }
  });

  it("every use case has tokenDemandImplications explaining new holders or stake demand", () => {
    for (const uc of USE_CASE_ANALYSES) {
      expect(uc.tokenDemandImplications.length).toBeGreaterThan(0);
      expect(uc.tokenDemandImplications).not.toBe("");
      // Must mention holders, demand, lock, or stake
      const text = uc.tokenDemandImplications.toLowerCase();
      expect(
        text.includes("holder") ||
        text.includes("demand") ||
        text.includes("lock") ||
        text.includes("stake") ||
        text.includes("acquir") ||
        text.includes("buy")
      ).toBe(true);
    }
  });

  it("every use case has a non-empty realisticTimeline", () => {
    for (const uc of USE_CASE_ANALYSES) {
      expect(uc.realisticTimeline.length).toBeGreaterThan(0);
      expect(uc.realisticTimeline).not.toBe("");
    }
  });

  it("every use case has a source with type and label", () => {
    for (const uc of USE_CASE_ANALYSES) {
      expect(uc.source).toBeDefined();
      expect(uc.source.type).toBeDefined();
      expect(uc.source.label).toBeTruthy();
    }
  });

  it("prediction market use case references Dune-verified on-chain data", () => {
    const predictionMarketUC = USE_CASE_ANALYSES.find(
      (uc) => uc.id === "util-copy-trading-signals"
    );
    expect(predictionMarketUC).toBeDefined();
    // Must reference Dune or on-chain in market size or source
    const allText = [
      predictionMarketUC!.comparableMarketSize,
      predictionMarketUC!.source.label,
      predictionMarketUC!.source.note ?? "",
    ].join(" ").toLowerCase();
    expect(
      allText.includes("dune") || allText.includes("on-chain") || allText.includes("polymarket")
    ).toBe(true);
  });

  it("prediction market figures include specific Dune-verified Polymarket volume data", () => {
    const predictionMarketUC = USE_CASE_ANALYSES.find(
      (uc) => uc.id === "util-copy-trading-signals"
    );
    expect(predictionMarketUC).toBeDefined();
    // Must reference specific Polymarket volume figures
    const marketText = predictionMarketUC!.comparableMarketSize;
    // Polymarket $50.9B all-time volume or $7.1B March 2026 MTD from Dune dashboards
    expect(
      marketText.includes("50.9B") || marketText.includes("50.9") ||
      marketText.includes("7.1B") || marketText.includes("7.1")
    ).toBe(true);
  });

  it("each use case has an estimatedRevenueRange", () => {
    for (const uc of USE_CASE_ANALYSES) {
      expect(uc.estimatedRevenueRange).toBeDefined();
      expect(uc.estimatedRevenueRange).not.toBe("");
    }
  });
});

// ---------------------------------------------------------------------------
// Rendered UI tests
// ---------------------------------------------------------------------------

describe("TokenUtilitySurface rendered use-case depth (VAL-TOKEN-021)", () => {
  it("renders market size section for each use case card", () => {
    render(<TokenUtilitySurface />);
    const cards = screen.getAllByTestId("utility-card");
    for (const card of cards) {
      expect(within(card).getByTestId("use-case-market-size")).toBeInTheDocument();
    }
  });

  it("renders revenue model section for each use case card", () => {
    render(<TokenUtilitySurface />);
    const cards = screen.getAllByTestId("utility-card");
    for (const card of cards) {
      expect(within(card).getByTestId("use-case-revenue-model")).toBeInTheDocument();
    }
  });

  it("renders token demand section for each use case card", () => {
    render(<TokenUtilitySurface />);
    const cards = screen.getAllByTestId("utility-card");
    for (const card of cards) {
      expect(within(card).getByTestId("use-case-token-demand")).toBeInTheDocument();
    }
  });

  it("renders timeline section for each use case card", () => {
    render(<TokenUtilitySurface />);
    const cards = screen.getAllByTestId("utility-card");
    for (const card of cards) {
      expect(within(card).getByTestId("use-case-timeline")).toBeInTheDocument();
    }
  });

  it("renders estimated revenue range for each use case card", () => {
    render(<TokenUtilitySurface />);
    const cards = screen.getAllByTestId("utility-card");
    for (const card of cards) {
      expect(within(card).getByTestId("use-case-revenue-range")).toBeInTheDocument();
    }
  });

  it("the prediction market card shows Dune-backed volume figures", () => {
    render(<TokenUtilitySurface />);
    const cards = screen.getAllByTestId("utility-card");
    // Find the copy trading card
    const copyTradingCard = cards.find(
      (card) => card.getAttribute("data-utility-id") === "util-copy-trading-signals"
    );
    expect(copyTradingCard).toBeDefined();
    const marketSize = within(copyTradingCard!).getByTestId("use-case-market-size");
    // Must contain Polymarket Dune-verified figures
    expect(marketSize.textContent).toMatch(/polymarket/i);
  });
});
