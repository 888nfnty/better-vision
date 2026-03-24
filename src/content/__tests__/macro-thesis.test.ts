import { GRAPH_NODES } from "../graph-nodes";
import { MACRO_THESIS_CONTENT } from "../macro-thesis";

describe("Macro Thesis content model", () => {
  it("registers the Macro Thesis graph node with the required related edges", () => {
    const node = GRAPH_NODES.find((entry) => entry.id === "macro-thesis");

    expect(node).toBeDefined();
    expect(node?.label).toBe("Macro Thesis");
    expect(node?.related).toEqual(
      expect.arrayContaining(["what-is-better", "tokenomics"])
    );
    expect(node?.dominantStatus).toBe("live");
  });

  it("captures the exact macro and crypto dislocation figures", () => {
    const serialized = JSON.stringify(MACRO_THESIS_CONTENT);

    expect(serialized).toContain("Feb 28, 2026");
    expect(serialized).toContain("20%");
    expect(serialized).toContain("Morgan Stanley");
    expect(serialized).toContain("JP Morgan");
    expect(serialized).toContain("Stimson Center");
    expect(serialized).toContain("97,939");
    expect(serialized).toContain("31.5%");
    expect(serialized).toMatch(/60.?66k/);
    expect(serialized).toContain("0.55");
    expect(serialized).toContain("$150B");
    expect(serialized).toMatch(/\$38.?42B/);
    expect(serialized).toContain("61%");
    expect(serialized).toContain("82.8%");
    expect(serialized).toContain("89%");
  });

  it("captures the exact prediction-market accuracy and scale figures", () => {
    const serialized = JSON.stringify(MACRO_THESIS_CONTENT);

    expect(serialized).toContain("0.0565");
    expect(serialized).toContain("77%");
    expect(serialized).toContain("91.2%");
    expect(serialized).toContain("97%");
    expect(serialized).toContain("130x");
    expect(serialized).toContain("$13B/month");
    expect(serialized).toContain("$140.63B");
    expect(serialized).toContain("$847M");
    expect(serialized).toContain("0.0256");
    expect(serialized).toContain("0.0159");
  });

  it("attributes every claim block to @tradebetterapp and keeps the maturity live", () => {
    for (const claim of MACRO_THESIS_CONTENT.claims) {
      expect(claim.status).toBe("live");
      expect(claim.source.label).toContain("@tradebetterapp");
    }
  });
});
