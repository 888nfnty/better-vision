import { GRAPH_NODES } from "../graph-nodes";
import { LLM_PRODUCT_CONTENT } from "../llm-product";

describe("LLM Product content model", () => {
  it("registers the LLM Product graph node with the required related edges", () => {
    const node = GRAPH_NODES.find((entry) => entry.id === "llm-product");

    expect(node).toBeDefined();
    expect(node?.label).toBe("LLM Product");
    expect(node?.related).toEqual(
      expect.arrayContaining(["architecture", "tokenomics"])
    );
    expect(node?.dominantStatus).toBe("planned");
  });

  it("captures the exact methodology and pricing language", () => {
    const serialized = JSON.stringify(LLM_PRODUCT_CONTENT);

    expect(serialized).toContain("reinforcement learning");
    expect(serialized).toContain("parameterization");
    expect(serialized).toContain("quantizing");
    expect(serialized).toContain("BRAID");
    expect(serialized).toContain("reasoning DAG");
    expect(serialized).toContain("$29/mo");
    expect(serialized).toContain("standalone API subscription");
    expect(serialized).toContain("$BETTER");
    expect(serialized).toContain("OpenRouter");
  });

  it("keeps BRAID in progress while the surrounding monetization is planned", () => {
    const braidSection = LLM_PRODUCT_CONTENT.sections.find((section) =>
      section.title.includes("BRAID")
    );

    expect(braidSection?.status).toBe("in_progress");
    expect(
      LLM_PRODUCT_CONTENT.sections.some((section) => section.status === "planned")
    ).toBe(true);
  });

  it("positions the LLM as a separate revenue stream from Terminal and Vault", () => {
    const serialized = JSON.stringify(LLM_PRODUCT_CONTENT);

    expect(serialized).toContain("separate revenue stream");
    expect(serialized).toContain("Terminal");
    expect(serialized).toContain("Vault");
    expect(LLM_PRODUCT_CONTENT.source.label).toContain("@tradebetterapp");

    for (const section of LLM_PRODUCT_CONTENT.sections) {
      expect(section.source.label).toContain("@tradebetterapp");
    }
  });
});
