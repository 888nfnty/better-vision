/**
 * Tests verifying that ALL visible "per-wallet" phrasing is removed from UI copy.
 *
 * VAL-TOKEN-017 requires: "No reference to per-wallet caps exists anywhere on the site."
 * This test ensures that rendered UI text uses "per-staker" terminology instead.
 */

import React from "react";
import { render } from "@testing-library/react";
import VaultCapacityModel from "../VaultCapacityModel";
import FirstVaultPolicy from "../FirstVaultPolicy";

describe("per-wallet wording purge from visible UI", () => {
  describe("VaultCapacityModel", () => {
    it("does NOT contain 'per-wallet' in any rendered text", () => {
      const { container } = render(<VaultCapacityModel />);
      const allText = container.textContent ?? "";
      expect(allText.toLowerCase()).not.toContain("per-wallet");
    });

    it("uses 'per-staker' terminology instead", () => {
      const { container } = render(<VaultCapacityModel />);
      const allText = container.textContent ?? "";
      expect(allText.toLowerCase()).toContain("per-staker");
    });
  });

  describe("FirstVaultPolicy", () => {
    it("does NOT contain 'per-wallet' in any rendered text", () => {
      const { container } = render(<FirstVaultPolicy />);
      const allText = container.textContent ?? "";
      expect(allText.toLowerCase()).not.toContain("per-wallet");
    });

    it("uses 'per-staker' terminology instead of 'per-wallet'", () => {
      const { container } = render(<FirstVaultPolicy />);
      const allText = container.textContent ?? "";
      expect(allText.toLowerCase()).toContain("per-staker");
    });
  });
});
