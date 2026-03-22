import { render, screen, within } from "@testing-library/react";
import Home from "../page";

/**
 * Proof-led landing sequence and CTA flow tests.
 *
 * VAL-NARR-013: Proof surface appears before dense roadmap exposition.
 * VAL-CROSS-001: First-visit flow explains BETTER, proof, and current maturity quickly.
 * VAL-CROSS-009: Landing-page section hierarchy is proof-led and single-purpose.
 * VAL-CROSS-010: Primary CTA follows live or proof path first.
 * VAL-CROSS-011: CTA promises stay consistent across surfaces.
 */

describe("Proof-before-density ordering (VAL-NARR-013)", () => {
  it("renders a proof/trust surface with a testid", () => {
    render(<Home />);
    const proof = screen.getByTestId("proof-section");
    expect(proof).toBeInTheDocument();
  });

  it("proof section appears before the roadmap section in DOM order", () => {
    render(<Home />);
    const proof = screen.getByTestId("proof-section");
    const roadmap = document.getElementById("roadmap");
    expect(proof).toBeInTheDocument();
    expect(roadmap).toBeInTheDocument();
    // proof should precede roadmap in DOM order
    const comparison = proof.compareDocumentPosition(roadmap!);
    // Node.DOCUMENT_POSITION_FOLLOWING = 4
    expect(comparison & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("proof section appears after the hero section in DOM order", () => {
    render(<Home />);
    const hero = screen.getByTestId("hero-section");
    const proof = screen.getByTestId("proof-section");
    const comparison = hero.compareDocumentPosition(proof);
    expect(comparison & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("proof section contains trust cues or live product evidence", () => {
    render(<Home />);
    const proof = screen.getByTestId("proof-section");
    // Should contain at least one proof item
    const proofItems = within(proof).getAllByTestId("proof-item");
    expect(proofItems.length).toBeGreaterThan(0);
  });

  it("proof section contains at least one evidence hook", () => {
    render(<Home />);
    const proof = screen.getByTestId("proof-section");
    const hooks = proof.querySelectorAll('[data-testid="evidence-hook"]');
    expect(hooks.length).toBeGreaterThan(0);
  });
});

describe("Section hierarchy is proof-led and single-purpose (VAL-CROSS-009)", () => {
  it("landing page sections appear in proof-before-density order", () => {
    render(<Home />);
    const hero = screen.getByTestId("hero-section");
    const proof = screen.getByTestId("proof-section");
    const liveNow = document.getElementById("live-now");
    const roadmap = document.getElementById("roadmap");

    // Hero → Proof → Live Now → Roadmap
    expect(hero.compareDocumentPosition(proof) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(proof.compareDocumentPosition(liveNow!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(liveNow!.compareDocumentPosition(roadmap!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("proof section has a single dominant job (proof/trust)", () => {
    render(<Home />);
    const proof = screen.getByTestId("proof-section");
    // Should NOT contain roadmap atlas or tokenomics content
    const atlasInProof = proof.querySelectorAll('[data-testid="roadmap-atlas"]');
    expect(atlasInProof.length).toBe(0);
    const tokenomicsInProof = proof.querySelectorAll('[data-testid="tokenomics-section"]');
    expect(tokenomicsInProof.length).toBe(0);
  });
});

describe("Primary CTA follows live/proof path first (VAL-CROSS-010)", () => {
  it("hero primary CTA points to a live or proof-oriented destination", () => {
    render(<Home />);
    const primaryCta = screen.getByTestId("cta-primary");
    const href = primaryCta.getAttribute("href");
    // Should point to live-now, proof, or a live external destination
    expect(href).toMatch(/#live-now|#proof|https:\/\/.*betteragent|https:\/\/.*tradebetter/);
  });

  it("hero primary CTA label mentions live, proof, or product reality", () => {
    render(<Home />);
    const primaryCta = screen.getByTestId("cta-primary");
    expect(primaryCta.textContent).toMatch(/live|proof|product|see|try|trade/i);
  });

  it("hero secondary CTA is for exploration, not the primary action", () => {
    render(<Home />);
    const secondaryCta = screen.getByTestId("cta-secondary");
    expect(secondaryCta.textContent).toMatch(/explore|roadmap|vision|deep/i);
  });
});

describe("CTA promises stay consistent across surfaces (VAL-CROSS-011)", () => {
  it("proof section CTA is consistent with hero primary CTA direction", () => {
    render(<Home />);
    const proof = screen.getByTestId("proof-section");
    const proofCtas = proof.querySelectorAll("a[href]");
    // Proof CTAs should lead to live destinations or deeper live evidence
    const proofHrefs = Array.from(proofCtas).map(a => a.getAttribute("href"));
    // At least one CTA in proof section should lead to live content
    const hasLiveDirection = proofHrefs.some(
      href =>
        href?.includes("#live-now") ||
        href?.includes("betteragent") ||
        href?.includes("tradebetter") ||
        href?.includes("docs.betteragent")
    );
    expect(hasLiveDirection).toBe(true);
  });

  it("roadmap section CTAs do not claim to be live destinations", () => {
    render(<Home />);
    const roadmap = document.getElementById("roadmap");
    expect(roadmap).toBeInTheDocument();
    // The roadmap heading should frame itself as exploration, not live product
    const roadmapHeading = within(roadmap!).getByText("Ecosystem Roadmap");
    expect(roadmapHeading).toBeInTheDocument();
  });
});

describe("First-visit comprehension flow (VAL-CROSS-001)", () => {
  it("first sections explain BETTER, show proof, then show current maturity", () => {
    render(<Home />);
    // Hero: what BETTER is
    const hero = screen.getByTestId("hero-section");
    expect(hero.textContent).toMatch(/BETTER/);
    expect(hero.textContent).toMatch(/prediction-market/i);

    // Proof: why to trust BETTER
    const proof = screen.getByTestId("proof-section");
    expect(proof).toBeInTheDocument();

    // Live Now: what is current maturity
    const liveNow = document.getElementById("live-now");
    expect(liveNow).toBeInTheDocument();
    expect(liveNow!.textContent).toMatch(/live/i);
  });

  it("proof surface is visible without extensive scrolling past dense content", () => {
    render(<Home />);
    const proof = screen.getByTestId("proof-section");
    const hero = screen.getByTestId("hero-section");
    // Proof is the immediate next major section after hero
    const comparison = hero.compareDocumentPosition(proof);
    expect(comparison & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
