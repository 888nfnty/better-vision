/**
 * Tests for the vault bidding allocation model.
 *
 * Validates:
 * - VAL-TOKEN-017: Total vault cap ($25k across ALL users, not per-wallet)
 * - VAL-TOKEN-018: √-weighted bidding allocation model with 24hr window, per-staker cap, $100 floor
 * - VAL-TOKEN-019: Social vault 25k BETTER minimum differentiation
 */

import { FIRST_VAULT_POLICY } from "../token-tiers";
import {
  computeBiddingAllocations,
  BIDDING_MODEL_PARAMS,
  SOCIAL_VAULT_PARAMS,
  MULTI_VAULT_PROGRESSION,
  type BiddingAllocationResult,
} from "../vault-capacity";

// ---------------------------------------------------------------------------
// VAL-TOKEN-017: Total Vault Cap ($25k across ALL users, not per-wallet)
// ---------------------------------------------------------------------------

describe("Total Vault Cap — VAL-TOKEN-017", () => {
  it("FIRST_VAULT_POLICY has totalVaultCapUsd of 25,000", () => {
    expect(FIRST_VAULT_POLICY.totalVaultCapUsd).toBe(25_000);
  });

  it("FIRST_VAULT_POLICY does NOT have a perWalletDepositCapUsd field", () => {
    // The old per-wallet cap concept must be removed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((FIRST_VAULT_POLICY as any).perWalletDepositCapUsd).toBeUndefined();
  });

  it("FIRST_VAULT_POLICY.minimumBetter is 100,000 (universal for all quant-team vaults)", () => {
    expect(FIRST_VAULT_POLICY.minimumBetter).toBe(100_000);
  });

  it("FIRST_VAULT_POLICY source mentions total vault cap", () => {
    const note = FIRST_VAULT_POLICY.source.note ?? "";
    expect(note.toLowerCase()).toContain("total");
    // The note should not present per-wallet as an active concept;
    // it may mention "not per-wallet" to clarify, which is acceptable
    expect(note.toLowerCase()).toContain("total vault deposit cap");
  });
});

// ---------------------------------------------------------------------------
// VAL-TOKEN-018: √-weighted Bidding Allocation Model
// ---------------------------------------------------------------------------

describe("Bidding Allocation Model — VAL-TOKEN-018", () => {
  describe("model parameters", () => {
    it("uses square root (α = 0.5) tapering exponent", () => {
      expect(BIDDING_MODEL_PARAMS.alpha).toBe(0.5);
    });

    it("has a 24-hour bidding window", () => {
      expect(BIDDING_MODEL_PARAMS.biddingWindowHours).toBe(24);
    });

    it("has a $100 USDC minimum floor", () => {
      expect(BIDDING_MODEL_PARAMS.minimumFloorUsd).toBe(100);
    });

    it("has a 20% per-staker cap ratio", () => {
      expect(BIDDING_MODEL_PARAMS.perStakerCapRatio).toBe(0.20);
    });

    it("minimum qualifying stake is 100,000 BETTER", () => {
      expect(BIDDING_MODEL_PARAMS.minimumStake).toBe(100_000);
    });
  });

  describe("computeBiddingAllocations — 5 stakers (Scenario A)", () => {
    const stakes = [13_000_000, 1_000_000, 500_000, 200_000, 100_000];
    let result: BiddingAllocationResult;

    beforeAll(() => {
      result = computeBiddingAllocations({
        stakes,
        vaultCapUsd: 25_000,
      });
    });

    it("returns exactly 5 allocations", () => {
      expect(result.allocations.length).toBe(5);
    });

    it("total allocations sum to vault cap ($25,000)", () => {
      const total = result.allocations.reduce((s, a) => s + a.allocationUsd, 0);
      expect(Math.abs(total - 25_000)).toBeLessThan(0.01);
    });

    it("no allocation exceeds the per-staker cap", () => {
      for (const a of result.allocations) {
        expect(a.allocationUsd).toBeLessThanOrEqual(result.perStakerCapUsd + 0.01);
      }
    });

    it("no allocation is below the $100 floor", () => {
      for (const a of result.allocations) {
        expect(a.allocationUsd).toBeGreaterThanOrEqual(100 - 0.01);
      }
    });

    it("per-staker cap is max(V/N, V*0.20) = $5,000", () => {
      // max(25000/5, 25000*0.20) = max(5000, 5000) = 5000
      expect(result.perStakerCapUsd).toBe(5_000);
    });

    it("with only 5 stakers, everyone gets $5,000 (equal split)", () => {
      // 5 × $5,000 = $25,000 exactly
      for (const a of result.allocations) {
        expect(a.allocationUsd).toBeCloseTo(5_000, 0);
      }
    });
  });

  describe("computeBiddingAllocations — 20 stakers (Scenario B)", () => {
    const stakes = [
      13_000_000,
      2_000_000, 2_000_000,
      500_000, 500_000, 500_000, 500_000, 500_000,
      200_000, 200_000, 200_000, 200_000, 200_000,
      100_000, 100_000, 100_000, 100_000, 100_000, 100_000, 100_000,
    ];
    let result: BiddingAllocationResult;

    beforeAll(() => {
      result = computeBiddingAllocations({
        stakes,
        vaultCapUsd: 25_000,
      });
    });

    it("returns 20 allocations summing to $25,000", () => {
      expect(result.allocations.length).toBe(20);
      const total = result.allocations.reduce((s, a) => s + a.allocationUsd, 0);
      expect(Math.abs(total - 25_000)).toBeLessThan(0.01);
    });

    it("whale (13M) is capped at $5,000 (20% of vault)", () => {
      const whaleAlloc = result.allocations[0];
      expect(whaleAlloc.allocationUsd).toBeCloseTo(5_000, 0);
    });

    it("minimum stakers (100k) get well above the $100 floor", () => {
      const minStakers = result.allocations.filter((a) => a.stake === 100_000);
      for (const a of minStakers) {
        expect(a.allocationUsd).toBeGreaterThan(100);
      }
    });

    it("larger stakers get more than minimum stakers (stake still matters)", () => {
      const twoMAlloc = result.allocations.find((a) => a.stake === 2_000_000)!;
      const minAlloc = result.allocations.find((a) => a.stake === 100_000)!;
      expect(twoMAlloc.allocationUsd).toBeGreaterThan(minAlloc.allocationUsd);
    });
  });

  describe("computeBiddingAllocations — 50 stakers (Scenario C, no cap/floor needed)", () => {
    const stakes = [
      13_000_000,
      2_000_000, 2_000_000, 2_000_000,
      ...Array(6).fill(750_000),
      ...Array(10).fill(300_000),
      ...Array(12).fill(150_000),
      ...Array(18).fill(100_000),
    ];
    let result: BiddingAllocationResult;

    beforeAll(() => {
      result = computeBiddingAllocations({
        stakes,
        vaultCapUsd: 25_000,
      });
    });

    it("returns 50 allocations summing to $25,000", () => {
      expect(result.allocations.length).toBe(50);
      const total = result.allocations.reduce((s, a) => s + a.allocationUsd, 0);
      expect(Math.abs(total - 25_000)).toBeLessThan(0.01);
    });

    it("all allocations are within [$100, perStakerCap]", () => {
      for (const a of result.allocations) {
        expect(a.allocationUsd).toBeGreaterThanOrEqual(100 - 0.01);
        expect(a.allocationUsd).toBeLessThanOrEqual(result.perStakerCapUsd + 0.01);
      }
    });

    it("whale allocation is materially compressed from pure proportional", () => {
      // Pure proportional would give whale ~50%+; sqrt should compress to ~12.5%
      const whaleAlloc = result.allocations[0];
      expect(whaleAlloc.allocationUsd / 25_000).toBeLessThan(0.20);
    });
  });

  describe("edge cases", () => {
    it("rejects stakes below the minimum qualifying stake", () => {
      expect(() =>
        computeBiddingAllocations({
          stakes: [100_000, 50_000],
          vaultCapUsd: 25_000,
        })
      ).toThrow();
    });

    it("single staker gets the full vault", () => {
      const result = computeBiddingAllocations({
        stakes: [500_000],
        vaultCapUsd: 25_000,
      });
      expect(result.allocations[0].allocationUsd).toBeCloseTo(25_000, 0);
    });

    it("all equal stakes get equal allocations", () => {
      const result = computeBiddingAllocations({
        stakes: Array(10).fill(100_000),
        vaultCapUsd: 25_000,
      });
      for (const a of result.allocations) {
        expect(a.allocationUsd).toBeCloseTo(2_500, 0);
      }
    });

    it("200 stakers triggers floor for minimum stakers", () => {
      const stakes = [
        13_000_000,
        ...Array(4).fill(2_000_000),
        ...Array(15).fill(500_000),
        ...Array(30).fill(200_000),
        ...Array(150).fill(100_000),
      ];
      const result = computeBiddingAllocations({
        stakes,
        vaultCapUsd: 25_000,
      });
      const minStakers = result.allocations.filter((a) => a.stake === 100_000);
      for (const a of minStakers) {
        expect(a.allocationUsd).toBeCloseTo(100, 0);
      }
      const total = result.allocations.reduce((s, a) => s + a.allocationUsd, 0);
      expect(Math.abs(total - 25_000)).toBeLessThan(0.01);
    });

    it("250 stakers — everyone gets exactly $100", () => {
      const result = computeBiddingAllocations({
        stakes: Array(250).fill(100_000),
        vaultCapUsd: 25_000,
      });
      for (const a of result.allocations) {
        expect(a.allocationUsd).toBeCloseTo(100, 0);
      }
    });

    it("oversubscription (>250 stakers at $100 floor) throws", () => {
      expect(() =>
        computeBiddingAllocations({
          stakes: Array(251).fill(100_000),
          vaultCapUsd: 25_000,
        })
      ).toThrow(/oversubscri/i);
    });
  });
});

// ---------------------------------------------------------------------------
// VAL-TOKEN-019: Social Vault Minimum Differentiation
// ---------------------------------------------------------------------------

describe("Social Vault Parameters — VAL-TOKEN-019", () => {
  it("social vault minimum stake is 25,000 BETTER", () => {
    expect(SOCIAL_VAULT_PARAMS.minimumStake).toBe(25_000);
  });

  it("social vault minimum is exactly 1/4 of standard quant-team minimum", () => {
    expect(SOCIAL_VAULT_PARAMS.minimumStake).toBe(BIDDING_MODEL_PARAMS.minimumStake / 4);
  });

  it("social vault has a tighter per-staker cap ratio (15%)", () => {
    expect(SOCIAL_VAULT_PARAMS.perStakerCapRatio).toBe(0.15);
  });

  it("social vault uses the same α (sqrt) tapering", () => {
    expect(SOCIAL_VAULT_PARAMS.alpha).toBe(0.5);
  });

  it("social vault has the same $100 floor", () => {
    expect(SOCIAL_VAULT_PARAMS.minimumFloorUsd).toBe(100);
  });

  it("social vault has an explanation of why the threshold differs", () => {
    expect(SOCIAL_VAULT_PARAMS.differentiationNote.length).toBeGreaterThan(20);
    expect(SOCIAL_VAULT_PARAMS.differentiationNote.toLowerCase()).toContain("community");
  });
});

// ---------------------------------------------------------------------------
// Multi-Vault Progression
// ---------------------------------------------------------------------------

describe("Multi-Vault Progression", () => {
  it("documents that future vault caps are case-by-case", () => {
    expect(MULTI_VAULT_PROGRESSION.futureCapPolicy.toLowerCase()).toContain("case-by-case");
  });

  it("100k BETTER is universal for all quant-team vaults", () => {
    expect(MULTI_VAULT_PROGRESSION.universalMinimumBetter).toBe(100_000);
  });

  it("includes at least two vault progression stages", () => {
    expect(MULTI_VAULT_PROGRESSION.stages.length).toBeGreaterThanOrEqual(2);
  });

  it("first stage is the first vault with $25k total cap", () => {
    expect(MULTI_VAULT_PROGRESSION.stages[0].totalCapUsd).toBe(25_000);
  });
});
