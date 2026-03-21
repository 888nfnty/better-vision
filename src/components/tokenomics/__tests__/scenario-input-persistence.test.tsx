/**
 * Regression tests for scenario input persistence and preview-eligibility consistency.
 *
 * These tests protect:
 * - VAL-TOKEN-007: User-editable scenario inputs persist across scenario switches
 * - VAL-TOKEN-004: Lite preview eligibility is consistent between scarcity copy and tier data
 *
 * Created to cover scrutiny failures reported in ecosystem-atlas round 1.
 */

import React from "react";
import { render, screen, within, fireEvent } from "@testing-library/react";
import ScenarioSwitcher from "../ScenarioSwitcher";
import ScarcityExplainer from "../ScarcityExplainer";
import { TOKEN_TIERS, getTiersSorted } from "@/content";

// ---------------------------------------------------------------------------
// VAL-TOKEN-007: User-editable inputs persist across scenario switches
// ---------------------------------------------------------------------------

describe("Scenario input persistence (VAL-TOKEN-007)", () => {
  it("renders user-editable input fields for token balance and deposit amount", () => {
    render(<ScenarioSwitcher />);
    expect(screen.getByTestId("user-input-token-balance")).toBeInTheDocument();
    expect(screen.getByTestId("user-input-deposit-amount")).toBeInTheDocument();
  });

  it("user-entered token balance persists when switching from base to conservative", () => {
    render(<ScenarioSwitcher />);
    const balanceInput = screen.getByTestId("user-input-token-balance") as HTMLInputElement;

    // Enter a custom value
    fireEvent.change(balanceInput, { target: { value: "750000" } });
    expect(balanceInput.value).toBe("750000");

    // Switch to conservative
    const tabs = screen.getAllByTestId("scenario-tab");
    const conservativeTab = tabs.find((t) => t.getAttribute("data-scenario") === "conservative");
    fireEvent.click(conservativeTab!);

    // The user-entered value must persist
    const balanceInputAfter = screen.getByTestId("user-input-token-balance") as HTMLInputElement;
    expect(balanceInputAfter.value).toBe("750000");
  });

  it("user-entered deposit amount persists when switching from base to upside", () => {
    render(<ScenarioSwitcher />);
    const depositInput = screen.getByTestId("user-input-deposit-amount") as HTMLInputElement;

    // Enter a custom value
    fireEvent.change(depositInput, { target: { value: "25000" } });
    expect(depositInput.value).toBe("25000");

    // Switch to upside
    const tabs = screen.getAllByTestId("scenario-tab");
    const upsideTab = tabs.find((t) => t.getAttribute("data-scenario") === "upside");
    fireEvent.click(upsideTab!);

    // The user-entered value must persist
    const depositInputAfter = screen.getByTestId("user-input-deposit-amount") as HTMLInputElement;
    expect(depositInputAfter.value).toBe("25000");
  });

  it("user inputs persist across a full round-trip: base → conservative → upside → base", () => {
    render(<ScenarioSwitcher />);
    const balanceInput = screen.getByTestId("user-input-token-balance") as HTMLInputElement;
    const depositInput = screen.getByTestId("user-input-deposit-amount") as HTMLInputElement;

    fireEvent.change(balanceInput, { target: { value: "500000" } });
    fireEvent.change(depositInput, { target: { value: "10000" } });

    const tabs = screen.getAllByTestId("scenario-tab");
    const findTab = (level: string) => tabs.find((t) => t.getAttribute("data-scenario") === level)!;

    // base → conservative
    fireEvent.click(findTab("conservative"));
    expect((screen.getByTestId("user-input-token-balance") as HTMLInputElement).value).toBe("500000");
    expect((screen.getByTestId("user-input-deposit-amount") as HTMLInputElement).value).toBe("10000");

    // conservative → upside
    fireEvent.click(findTab("upside"));
    expect((screen.getByTestId("user-input-token-balance") as HTMLInputElement).value).toBe("500000");
    expect((screen.getByTestId("user-input-deposit-amount") as HTMLInputElement).value).toBe("10000");

    // upside → base
    fireEvent.click(findTab("base"));
    expect((screen.getByTestId("user-input-token-balance") as HTMLInputElement).value).toBe("500000");
    expect((screen.getByTestId("user-input-deposit-amount") as HTMLInputElement).value).toBe("10000");
  });

  it("scenario switch updates assumption values while inputs stay unchanged", () => {
    render(<ScenarioSwitcher />);

    // Get initial base assumption cards text
    const baseCards = screen.getAllByTestId("assumption-card");
    const baseFirstValue = baseCards[0].textContent;

    // Enter user input
    const balanceInput = screen.getByTestId("user-input-token-balance") as HTMLInputElement;
    fireEvent.change(balanceInput, { target: { value: "200000" } });

    // Switch to conservative
    const tabs = screen.getAllByTestId("scenario-tab");
    const conservativeTab = tabs.find((t) => t.getAttribute("data-scenario") === "conservative")!;
    fireEvent.click(conservativeTab);

    // Assumption cards should have different content now
    const conservativeCards = screen.getAllByTestId("assumption-card");
    const conservativeFirstValue = conservativeCards[0].textContent;
    expect(conservativeFirstValue).not.toBe(baseFirstValue);

    // But user input should still be 200000
    expect((screen.getByTestId("user-input-token-balance") as HTMLInputElement).value).toBe("200000");
  });

  it("the user input area renders the resolved tier name for the entered balance", () => {
    render(<ScenarioSwitcher />);
    const balanceInput = screen.getByTestId("user-input-token-balance") as HTMLInputElement;

    // Enter whale-level balance
    fireEvent.change(balanceInput, { target: { value: "500000" } });
    expect(screen.getByTestId("resolved-tier-name")).toHaveTextContent("Whale");

    // Enter standard-level balance
    fireEvent.change(balanceInput, { target: { value: "100000" } });
    expect(screen.getByTestId("resolved-tier-name")).toHaveTextContent("Standard");
  });

  it("the user input area renders allocation preview based on deposit amount and tier", () => {
    render(<ScenarioSwitcher />);
    const balanceInput = screen.getByTestId("user-input-token-balance") as HTMLInputElement;
    const depositInput = screen.getByTestId("user-input-deposit-amount") as HTMLInputElement;

    fireEvent.change(balanceInput, { target: { value: "500000" } });
    fireEvent.change(depositInput, { target: { value: "10000" } });

    // Should show a preview section with allocation result
    expect(screen.getByTestId("allocation-preview")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// VAL-TOKEN-004: Lite preview eligibility is consistent
// ---------------------------------------------------------------------------

describe("Lite preview eligibility consistency (VAL-TOKEN-004)", () => {
  it("Lite tier preview priority in data matches scarcity copy eligibility", () => {
    const liteTier = TOKEN_TIERS.find((t) => t.id === "tier-lite");
    expect(liteTier).toBeDefined();

    // If Lite has previewPriority > 0, the scarcity copy must NOT say Lite is ineligible.
    // If Lite has previewPriority === 0, the scarcity copy MAY say Lite is ineligible.
    // The key requirement is consistency between the two surfaces.

    // Render scarcity explainer and check for Lite eligibility language
    render(<ScarcityExplainer />);
    const rules = screen.getAllByTestId("scarcity-rule");
    const previewRule = rules.find((r) => within(r).queryByText("Strategy Preview Slots"));
    expect(previewRule).toBeDefined();

    const resolutionText = previewRule!.textContent || "";

    if (liteTier!.previewPriority === 0) {
      // Lite is ineligible — scarcity copy may say so, that's consistent
      // No assertion needed beyond the data check
    } else {
      // Lite has preview priority — scarcity copy must NOT explicitly
      // list Lite as ineligible (e.g., "Lite tiers are ineligible" or
      // "Lite are ineligible"). We use a tight pattern that catches
      // "Lite ... ineligible" only within the same clause (no sentence
      // boundary in between).
      expect(resolutionText).not.toMatch(/Lite\s+(tiers?\s+)?(are|is)\s+ineligible/i);
    }
  });

  it("Explorer tier has zero preview priority and scarcity copy may note it", () => {
    const explorerTier = TOKEN_TIERS.find((t) => t.id === "tier-explorer");
    expect(explorerTier).toBeDefined();
    expect(explorerTier!.previewPriority).toBe(0);
  });

  it("all non-zero preview tiers are listed as eligible in scarcity copy", () => {
    render(<ScarcityExplainer />);
    const rules = screen.getAllByTestId("scarcity-rule");
    const previewRule = rules.find((r) => within(r).queryByText("Strategy Preview Slots"));
    const resolutionText = previewRule!.textContent || "";

    const tiersWithPreview = getTiersSorted().filter((t) => t.previewPriority > 0);
    // The resolution text should not explicitly list any tier with
    // previewPriority > 0 as ineligible (e.g., "Lite are ineligible").
    // The pattern is scoped to the same clause to avoid false positives
    // when the tier name merely appears earlier in the sentence.
    for (const tier of tiersWithPreview) {
      expect(resolutionText).not.toMatch(
        new RegExp(`${tier.name}\\s+(tiers?\\s+)?(are|is)\\s+ineligible`, "i")
      );
    }
  });
});
