/**
 * Tokenomics regression: rendered scarcity and preview-eligibility copy
 * for each eligible tier.
 *
 * Verifies that the rendered tokenomics UI explicitly asserts scarcity
 * and preview-eligibility copy for each tier that has preview access.
 *
 * This covers the feature requirement:
 *   "Tokenomics regression coverage explicitly asserts rendered scarcity
 *    and preview-eligibility copy for each eligible tier"
 */

import React from "react";
import { render, screen, within } from "@testing-library/react";
import TierLadder from "../TierLadder";
import ScarcityExplainer from "../ScarcityExplainer";
import { getTiersSorted } from "@/content";

function getTierDetailCard(tierId: string) {
  const card = screen
    .getAllByTestId("tier-detail-card")
    .find((element) => element.getAttribute("data-tier-id") === tierId);

  expect(card).toBeDefined();
  return card as HTMLElement;
}

function getBenefitField(card: HTMLElement, label: string) {
  const labelElement = within(card).getByText(label);
  const field = labelElement.closest('[data-slot="card"]');

  expect(field).not.toBeNull();
  return field as HTMLElement;
}

function getPreviewPriorityField(tierId: string) {
  return getBenefitField(getTierDetailCard(tierId), "Preview Priority");
}

function getScarcityRule(title: string) {
  const rule = screen
    .getAllByTestId("scarcity-rule")
    .find((element) => within(element).queryByText(title));

  expect(rule).toBeDefined();
  return rule as HTMLElement;
}

// ---------------------------------------------------------------------------
// Preview-eligibility copy per tier in the tier ladder
// ---------------------------------------------------------------------------

describe("Tier ladder preview-eligibility rendering", () => {
  it("binds every tier's preview eligibility to its rendered Preview Priority field", () => {
    render(<TierLadder />);

    for (const tier of getTiersSorted()) {
      const previewField = getPreviewPriorityField(tier.id);
      const expectedValue =
        tier.previewPriority === 0 ? "None" : `Level ${tier.previewPriority}`;

      expect(within(previewField).getByText(expectedValue)).toBeInTheDocument();
    }
  });

  it("renders Whale and Apex Whale copy in their own Preview Priority fields", () => {
    render(<TierLadder />);

    expect(
      within(getPreviewPriorityField("tier-whale")).getByText("Level 3")
    ).toBeInTheDocument();
    expect(
      within(getPreviewPriorityField("tier-apex")).getByText("Level 5")
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Scarcity copy per eligible tier
// ---------------------------------------------------------------------------

describe("Scarcity preview-eligibility copy consistency", () => {
  it("binds the rendered Strategy Preview Slots rule to explicit Whale and Apex copy", () => {
    render(<ScarcityExplainer />);
    const previewRule = getScarcityRule("Strategy Preview Slots");

    expect(previewRule).toHaveTextContent(
      "Apex Whales get first access, then Whales, then Standard holders, then Lite holders."
    );
    expect(previewRule).toHaveTextContent(
      "Only Explorer tier (non-holders) is ineligible for preview access."
    );
  });
});
