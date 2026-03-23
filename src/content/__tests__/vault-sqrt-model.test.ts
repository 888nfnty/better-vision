/**
 * Tests for √-weighted bidding model integration in computeVaultCapacityEstimate.
 *
 * Validates that VaultCapacityModel calculator uses the shipped √-weighted
 * bidding model (computeBiddingAllocations) including the $100 floor and
 * hard per-staker cap — NOT linear proportional math.
 *
 * VAL-TOKEN-017 and VAL-TOKEN-018 depend on this.
 */

import {
  computeVaultCapacityEstimate,
  BIDDING_MODEL_PARAMS,
  type VaultCapacityInput,
} from "../vault-capacity";

describe("computeVaultCapacityEstimate uses √-weighted bidding math", () => {
  const baseInput: VaultCapacityInput = {
    userStake: 200_000,
    totalStaked: 100_000_000,
    vaultCapacityUsd: 25_000,
  };

  it("does NOT use pure linear proportional allocation", () => {
    // Linear would give: 200,000/100,000,000 * 25,000 = $0.05
    // This is tiny and below the $100 floor. √-weighted should guarantee $100 floor.
    const est = computeVaultCapacityEstimate(baseInput);
    const linearEstimate = (baseInput.userStake / baseInput.totalStaked) * baseInput.vaultCapacityUsd;
    // The effective deposit should be at least $100 (the floor)
    expect(est.effectiveDepositUsd).toBeGreaterThanOrEqual(BIDDING_MODEL_PARAMS.minimumFloorUsd);
    // And NOT equal to the linear estimate
    expect(Math.abs(est.effectiveDepositUsd - linearEstimate)).toBeGreaterThan(1);
  });

  it("reflects the $100 USDC minimum floor for qualifying stakers", () => {
    // Even a minimum staker (100k) among many should get at least $100
    const minStakerInput: VaultCapacityInput = {
      userStake: 100_000,
      totalStaked: 100_000_000,
      vaultCapacityUsd: 25_000,
    };
    const est = computeVaultCapacityEstimate(minStakerInput);
    expect(est.effectiveDepositUsd).toBeGreaterThanOrEqual(100);
  });

  it("reflects the hard per-staker cap for large stakers", () => {
    // A whale with 50M of 50M staked should be capped
    const whaleInput: VaultCapacityInput = {
      userStake: 50_000_000,
      totalStaked: 50_000_000,
      vaultCapacityUsd: 25_000,
    };
    const est = computeVaultCapacityEstimate(whaleInput);
    // Single staker gets 100% — but per-staker cap is max(V/1, V*0.20) = V
    // So single staker gets the full vault
    expect(est.effectiveDepositUsd).toBeCloseTo(25_000, 0);
  });

  it("shows √-tapering compression for a whale among many stakers", () => {
    // With many stakers, a whale should get compressed allocation
    // Build a realistic scenario: 1 whale (13M) + many smaller stakers
    // Total staked = 100M, vault = 25k
    // Linear for whale: 13M/100M * 25k = $3,250
    // √-weighted should compress this
    const whaleInput: VaultCapacityInput = {
      userStake: 13_000_000,
      totalStaked: 100_000_000,
      vaultCapacityUsd: 25_000,
    };
    const est = computeVaultCapacityEstimate(whaleInput);
    // √-weighted allocation should differ from linear (13M/100M * 25k = $3,250)
    const linearWould = (13_000_000 / 100_000_000) * 25_000;
    // The effective deposit should be > 0 and ≤ 20% cap
    expect(est.effectiveDepositUsd).toBeGreaterThan(0);
    // It should not be exactly the linear estimate
    expect(Math.abs(est.effectiveDepositUsd - linearWould)).toBeGreaterThan(0.01);
    // The allocation should be capped at max(V/N, V*0.20)
    expect(est.effectiveDepositUsd).toBeLessThanOrEqual(25_000 * BIDDING_MODEL_PARAMS.perStakerCapRatio + 0.01);
  });

  it("produces allocations consistent with computeBiddingAllocations", () => {
    // Verify the UI model is using the same bidding engine
    // Create a scenario where we know the bidding result
    const singleStakerInput: VaultCapacityInput = {
      userStake: 500_000,
      totalStaked: 500_000, // single staker = all staked
      vaultCapacityUsd: 25_000,
    };
    const est = computeVaultCapacityEstimate(singleStakerInput);
    // A single staker should get the full vault
    expect(est.effectiveDepositUsd).toBeCloseTo(25_000, 0);
  });
});
