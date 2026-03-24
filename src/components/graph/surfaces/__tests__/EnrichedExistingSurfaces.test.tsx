import React from "react";
import { render, screen, within } from "@testing-library/react";
import { ArchitectureSurface } from "../ArchitectureSurface";
import { TokenomicsSurface } from "../TokenomicsSurface";
import { ProofSurface } from "../ProofSurface";

describe("Enriched existing graph surfaces", () => {
  it("adds Rust execution and BRAID consensus highlights to the architecture surface", () => {
    render(<ArchitectureSurface />);

    const enrichment = screen.getByTestId("architecture-enrichments");

    expect(enrichment).toHaveTextContent("Rust");
    expect(enrichment).toHaveTextContent("0.11ms");
    expect(enrichment).toHaveTextContent("8ms");
    expect(enrichment).toHaveTextContent("BRAID");
    expect(enrichment).toHaveTextContent("88%");
    expect(enrichment).toHaveTextContent("100%");
    expect(within(enrichment).getAllByTestId("maturity-badge").length).toBeGreaterThanOrEqual(2);
    expect(within(enrichment).getAllByTestId("evidence-hook").length).toBeGreaterThanOrEqual(2);
    expect(enrichment.querySelectorAll('[data-slot="card"]').length).toBeGreaterThanOrEqual(2);
  });

  it("adds arbitrage flywheel and tax-routing details to the tokenomics surface", () => {
    render(<TokenomicsSurface />);

    const enrichment = screen.getByTestId("tokenomics-enrichments");

    expect(enrichment).toHaveTextContent("arbitrage");
    expect(enrichment).toHaveTextContent("TRUTH-PERP");
    expect(enrichment).toHaveTextContent("2% buy");
    expect(enrichment).toHaveTextContent("2% sell");
    expect(enrichment).toHaveTextContent("treasury");
    expect(enrichment).toHaveTextContent("capex");
    expect(within(enrichment).getAllByTestId("maturity-badge").length).toBeGreaterThanOrEqual(2);
    expect(within(enrichment).getAllByTestId("evidence-hook").length).toBeGreaterThanOrEqual(2);
    expect(within(enrichment).getByRole("link", { name: /truth-perp/i })).toHaveAttribute(
      "href",
      "#graph-truth-perp-flywheel"
    );
    expect(enrichment.querySelectorAll('[data-slot="card"]').length).toBeGreaterThanOrEqual(2);
  });

  it("adds gas-sponsored, UDA, and one-click terminal details to the proof surface", () => {
    render(<ProofSurface />);

    const enrichment = screen.getByTestId("proof-terminal-details");

    expect(enrichment).toHaveTextContent("gas-sponsored");
    expect(enrichment).toHaveTextContent("UDA");
    expect(enrichment).toHaveTextContent("one-click");
    expect(enrichment).toHaveTextContent("copy trading");
    expect(within(enrichment).getAllByTestId("maturity-badge").length).toBeGreaterThanOrEqual(1);
    expect(within(enrichment).getAllByTestId("evidence-hook").length).toBeGreaterThanOrEqual(1);
    expect(enrichment.querySelectorAll('[data-slot="card"]').length).toBeGreaterThanOrEqual(1);
  });
});
