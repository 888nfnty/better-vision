/**
 * Stake-to-vault-capacity modeling for the BETTER ecosystem.
 *
 * Satisfies VAL-TOKEN-016, VAL-TOKEN-017, VAL-TOKEN-018, VAL-TOKEN-019:
 * - $25,000 TOTAL vault cap across ALL users for first vault (per-staker bidding allocation)
 * - √-weighted bidding allocation model with 24hr window
 * - Hard per-staker cap: max(V/N, V × 0.20)
 * - $100 USDC minimum floor per qualifying staker
 * - 100k BETTER universal minimum for quant-team vaults
 * - 25k BETTER minimum for social vaults
 * - Multi-vault progression with case-by-case future caps
 * - User-adjustable inputs with supply-ceiling validation
 * - Uncertainty-aware output with dollar-denominated estimates
 *
 * Reference: /Users/test/better/docs/vault-bidding-allocation-model.md
 */

import type { SourceCue } from "./types";
import { MINTED_SUPPLY } from "./token-tiers";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface VaultCapacityInput {
  /** User's staked BETTER tokens */
  userStake: number;
  /** Total staked BETTER across all participants */
  totalStaked: number;
  /** Total vault capacity in USD */
  vaultCapacityUsd: number;
}

export interface VaultCapacityEstimate {
  /** User's share of total staked pool as percentage */
  sharePercentage: number;
  /** Modeled allocation based on share — low estimate (USD) */
  estimatedAllocationLowUsd: number;
  /** Modeled allocation based on share — high estimate (USD) */
  estimatedAllocationHighUsd: number;
  /** Total vault cap in USD (policy rule) */
  totalVaultCapUsd: number;
  /** Effective deposit: capped by bidding allocation result */
  effectiveDepositUsd: number;
  /** Whether the per-staker cap constrains the modeled allocation */
  capConstrained: boolean;
}

/**
 * Role of an assumption in the vault capacity model.
 *
 * - "calculation_input": The assumption directly feeds into the capacity estimate math.
 * - "informational": The assumption provides market-context framing only.
 */
export type AssumptionRole = "calculation_input" | "informational";

export interface WhaleVaultAssumptions {
  /** Assumed number of whale-tier+ participants */
  assumedWhaleCount: number;
  /** Role of the whale-count assumption in the model */
  whaleCountRole: AssumptionRole;
  /** Human-readable description of assumed stake distribution */
  assumedStakeDistribution: string;
  /** Role of the stake-distribution assumption in the model */
  stakeDistributionRole: AssumptionRole;
  /** Assumed total vault capacity in USD for a modeled whale vault */
  assumedVaultCapacityUsd: number;
  /** Role of the vault-capacity assumption in the model */
  vaultCapacityRole: AssumptionRole;
  /** Source/assumption cue */
  source: SourceCue;
}

// ---------------------------------------------------------------------------
// Bidding Allocation Model Types
// ---------------------------------------------------------------------------

export interface BiddingModelParams {
  /** Tapering exponent (0.5 = square root) */
  alpha: number;
  /** Bidding window duration in hours */
  biddingWindowHours: number;
  /** Minimum USDC allocation per qualifying staker */
  minimumFloorUsd: number;
  /** Maximum share of vault any single staker can receive */
  perStakerCapRatio: number;
  /** Minimum qualifying stake in BETTER */
  minimumStake: number;
  /** Source cue */
  source: SourceCue;
}

export interface SocialVaultParams {
  /** Minimum qualifying stake in BETTER for social vaults */
  minimumStake: number;
  /** Tapering exponent */
  alpha: number;
  /** Minimum USDC allocation per qualifying staker */
  minimumFloorUsd: number;
  /** Maximum share of vault any single staker can receive (tighter for social) */
  perStakerCapRatio: number;
  /** Explanation of why social vault minimum differs */
  differentiationNote: string;
  /** Source cue */
  source: SourceCue;
}

export interface BiddingAllocationInput {
  /** Array of BETTER stake amounts per bidder */
  stakes: number[];
  /** Total vault cap in USDC */
  vaultCapUsd: number;
  /** Optional override for minimum stake (defaults to BIDDING_MODEL_PARAMS.minimumStake) */
  minimumStake?: number;
  /** Optional override for α */
  alpha?: number;
  /** Optional override for cap ratio */
  capRatio?: number;
  /** Optional override for floor */
  floorUsd?: number;
}

export interface StakerAllocation {
  /** Original stake amount in BETTER */
  stake: number;
  /** √-weighted effective weight */
  weight: number;
  /** Allocated USDC amount */
  allocationUsd: number;
  /** Percentage of total vault */
  percentOfVault: number;
  /** Whether this staker hit the cap */
  capped: boolean;
  /** Whether this staker hit the floor */
  floored: boolean;
}

export interface BiddingAllocationResult {
  /** Per-staker allocations */
  allocations: StakerAllocation[];
  /** Dynamic per-staker cap: max(V/N, V × capRatio) */
  perStakerCapUsd: number;
  /** Total vault cap in USDC */
  vaultCapUsd: number;
  /** Number of qualifying stakers */
  stakerCount: number;
  /** Maximum possible stakers at this floor/cap */
  maxStakersAtFloor: number;
}

// ---------------------------------------------------------------------------
// Multi-Vault Progression Types
// ---------------------------------------------------------------------------

export interface VaultProgressionStage {
  /** Stage label */
  label: string;
  /** Total vault cap in USD for this stage */
  totalCapUsd: number;
  /** Description */
  description: string;
  /** Maturity */
  maturity: "live" | "in_progress" | "planned" | "speculative";
}

export interface MultiVaultProgression {
  /** Universal minimum BETTER for all quant-team vaults */
  universalMinimumBetter: number;
  /** Future vault cap policy */
  futureCapPolicy: string;
  /** Progression stages */
  stages: VaultProgressionStage[];
  /** Source cue */
  source: SourceCue;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Default total staked reference — a sensible starting point.
 *
 * Based on comparable DeFi staking participation rates (10-20% of circulating
 * supply) applied to the minted supply. We use ~14% as a moderate default.
 */
export const DEFAULT_TOTAL_STAKED = 100_000_000;

/**
 * Uncertainty band factor applied to the share-based allocation.
 * The low estimate is 80% of the point estimate, high is 120%.
 */
const UNCERTAINTY_LOW_FACTOR = 0.8;
const UNCERTAINTY_HIGH_FACTOR = 1.2;

/**
 * Standard quant-team vault bidding model parameters.
 *
 * Reference: /Users/test/better/docs/vault-bidding-allocation-model.md
 */
export const BIDDING_MODEL_PARAMS: BiddingModelParams = {
  alpha: 0.5,
  biddingWindowHours: 24,
  minimumFloorUsd: 100,
  perStakerCapRatio: 0.20,
  minimumStake: 100_000,
  source: {
    type: "canonical" as const,
    label: "BETTER Vault Bidding Model",
    note:
      "√-weighted bidding allocation with 24hr commitment window, hard per-staker cap of max(V/N, V×0.20), and $100 USDC minimum floor. Allocations are computed after the bidding window closes.",
    asOf: "2026-Q1",
  },
};

/**
 * Social vault parameters — lower minimum, tighter cap.
 *
 * Social vaults (community-created strategy vaults) require only 25,000 BETTER
 * to qualify, which is one quarter of the standard 100,000 BETTER minimum for
 * quant-team vaults. The lower barrier reflects the community-first nature of
 * social vaults while maintaining meaningful participation requirements.
 */
export const SOCIAL_VAULT_PARAMS: SocialVaultParams = {
  minimumStake: 25_000,
  alpha: 0.5,
  minimumFloorUsd: 100,
  perStakerCapRatio: 0.15,
  differentiationNote:
    "Social vaults (community-created strategy vaults) require only 25,000 BETTER — one quarter of the standard 100,000 BETTER minimum for quant-team vaults. The lower barrier reflects the community-first, accessible nature of social vaults while still requiring meaningful BETTER participation. The tighter 15% per-staker cap (vs 20% for standard vaults) prevents any single participant from dominating a community vault.",
  source: {
    type: "canonical" as const,
    label: "BETTER Social Vault Policy",
    note:
      "Social vault minimum is 25,000 BETTER (¼ of standard). Tighter 15% per-staker cap for community fairness.",
    asOf: "2026-Q1",
  },
};

/**
 * Multi-vault progression — documents how vault sizing evolves.
 */
export const MULTI_VAULT_PROGRESSION: MultiVaultProgression = {
  universalMinimumBetter: 100_000,
  futureCapPolicy:
    "Future quant-team vault deposit caps are decided on a case-by-case basis depending on strategy complexity, liquidity requirements, risk parameters, and team capacity. The $25,000 total cap is specific to the first vault only.",
  stages: [
    {
      label: "First Vault (Q1 2026)",
      totalCapUsd: 25_000,
      description:
        "The inaugural quant-team vault with a conservative $25,000 total deposit cap across all qualifying stakers. Designed to validate the bidding allocation model and vault infrastructure with limited risk exposure.",
      maturity: "in_progress",
    },
    {
      label: "Subsequent Quant-Team Vaults",
      totalCapUsd: 0, // case-by-case
      description:
        "Future quant-team vaults will have individually determined total caps based on strategy-specific parameters, available liquidity, risk limits, and team sizing. Each vault's total cap is set before its bidding window opens.",
      maturity: "planned",
    },
    {
      label: "Scaled Institutional Vaults",
      totalCapUsd: 0, // case-by-case
      description:
        "As the platform matures, larger institutional-grade vaults with higher total caps and stricter qualification gates may be introduced. These are directional and depend on audit completion, regulatory clarity, and institutional demand.",
      maturity: "speculative",
    },
  ],
  source: {
    type: "canonical" as const,
    label: "BETTER Vault Progression",
    note:
      "100,000 BETTER is the universal minimum for all quant-team vaults. Future vault caps are case-by-case — only the first vault has a fixed $25,000 total cap.",
    asOf: "2026-Q1",
  },
};

/**
 * Explicit whale-vault modeling assumptions.
 */
export const WHALE_VAULT_ASSUMPTIONS: WhaleVaultAssumptions = {
  assumedWhaleCount: 50,
  whaleCountRole: "informational",
  assumedStakeDistribution:
    "Modeled as a concentrated distribution where the top 50 whale-tier holders (≥500,000 BETTER each) collectively stake ~40% of total staked BETTER. Remaining 60% is distributed among Standard and Lite-tier holders.",
  stakeDistributionRole: "informational",
  assumedVaultCapacityUsd: 5_000_000,
  vaultCapacityRole: "calculation_input",
  source: {
    type: "scenario_based" as const,
    label: "BETTER Vault Capacity Model",
    note:
      "Whale count and stake distribution are informational-only context assumptions — they do not drive the capacity estimate calculation. Vault capacity directly feeds the model. Actual values will depend on market conditions, participation rates, and vault sizing decisions.",
  },
};

/**
 * First-vault modeling defaults — packaged for the UI.
 * Updated: uses total vault cap with per-staker bidding allocation.
 */
export const FIRST_VAULT_DEFAULTS = {
  vaultCapacityUsd: 25_000,
  source: {
    type: "canonical" as const,
    label: "BETTER First Vault Policy",
    note:
      "The first vault has a total deposit cap of $25,000 USDC across all qualifying stakers. Individual allocations within that cap are determined by the √-weighted bidding model.",
    asOf: "2026-Q1",
  },
};

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/**
 * Validate that total staked BETTER does not exceed the minted supply ceiling
 * and is positive.
 */
export function validateTotalStaked(totalStaked: number): boolean {
  return totalStaked > 0 && totalStaked <= MINTED_SUPPLY;
}

// ---------------------------------------------------------------------------
// Bidding Allocation Computation
// ---------------------------------------------------------------------------

/**
 * Compute √-weighted bidding allocations for a vault.
 *
 * Implements the iterative algorithm from the vault bidding allocation model:
 * 1. Compute √-weights for all stakers
 * 2. Calculate dynamic per-staker cap: max(V/N, V × capRatio)
 * 3. Iteratively assign allocations, locking capped and floored stakers
 * 4. Redistribute remaining pool until convergence
 *
 * Throws if any stake is below minimum or if oversubscribed (N > V/floor).
 */
export function computeBiddingAllocations(
  input: BiddingAllocationInput
): BiddingAllocationResult {
  const {
    stakes,
    vaultCapUsd,
    minimumStake = BIDDING_MODEL_PARAMS.minimumStake,
    alpha = BIDDING_MODEL_PARAMS.alpha,
    capRatio = BIDDING_MODEL_PARAMS.perStakerCapRatio,
    floorUsd = BIDDING_MODEL_PARAMS.minimumFloorUsd,
  } = input;

  const N = stakes.length;

  // Validate all stakes meet minimum
  for (let i = 0; i < N; i++) {
    if (stakes[i] < minimumStake) {
      throw new Error(
        `Stake at index ${i} (${stakes[i]} BETTER) is below the minimum qualifying stake of ${minimumStake} BETTER`
      );
    }
  }

  // Oversubscription check
  const maxStakers = Math.floor(vaultCapUsd / floorUsd);
  if (N > maxStakers) {
    throw new Error(
      `Oversubscription: ${N} stakers × $${floorUsd} floor = $${N * floorUsd} > $${vaultCapUsd} vault cap. Max stakers at this floor: ${maxStakers}`
    );
  }

  // Dynamic per-staker cap
  const perStakerCapUsd = Math.max(vaultCapUsd / N, vaultCapUsd * capRatio);

  // Compute √-weights
  const weights = stakes.map((s) => Math.pow(s, alpha));

  // Iterative allocation
  const allocations = new Array(N).fill(0);
  const locked = new Array(N).fill(false);
  const capped = new Array(N).fill(false);
  const floored = new Array(N).fill(false);

  for (let iter = 0; iter < N; iter++) {
    const freeIndices = [];
    for (let i = 0; i < N; i++) {
      if (!locked[i]) freeIndices.push(i);
    }
    if (freeIndices.length === 0) break;

    let lockedTotal = 0;
    for (let i = 0; i < N; i++) {
      if (locked[i]) lockedTotal += allocations[i];
    }
    const pool = vaultCapUsd - lockedTotal;

    let wFree = 0;
    for (const i of freeIndices) {
      wFree += weights[i];
    }

    let changed = false;
    for (const i of freeIndices) {
      const raw = (weights[i] / wFree) * pool;

      if (raw > perStakerCapUsd) {
        allocations[i] = perStakerCapUsd;
        locked[i] = true;
        capped[i] = true;
        changed = true;
      } else if (raw < floorUsd) {
        allocations[i] = floorUsd;
        locked[i] = true;
        floored[i] = true;
        changed = true;
      }
    }

    if (!changed) {
      // Assign final allocations to remaining free stakers
      for (const i of freeIndices) {
        allocations[i] = (weights[i] / wFree) * pool;
      }
      break;
    }
  }

  // Rounding adjustment — ensure total exactly equals vaultCapUsd
  const total = allocations.reduce((s: number, a: number) => s + a, 0);
  if (Math.abs(total - vaultCapUsd) > 0.001) {
    const diff = vaultCapUsd - total;
    // Add difference to the largest allocation
    let maxIdx = 0;
    for (let i = 1; i < N; i++) {
      if (allocations[i] > allocations[maxIdx]) maxIdx = i;
    }
    allocations[maxIdx] += diff;
  }

  // Build result
  const stakerAllocations: StakerAllocation[] = stakes.map((stake, i) => ({
    stake,
    weight: weights[i],
    allocationUsd: allocations[i],
    percentOfVault: (allocations[i] / vaultCapUsd) * 100,
    capped: capped[i],
    floored: floored[i],
  }));

  return {
    allocations: stakerAllocations,
    perStakerCapUsd,
    vaultCapUsd,
    stakerCount: N,
    maxStakersAtFloor: maxStakers,
  };
}

// ---------------------------------------------------------------------------
// Vault Capacity Estimate (uses √-weighted bidding model)
// ---------------------------------------------------------------------------

/**
 * Compute a vault capacity estimate from explicit inputs.
 *
 * Uses computeBiddingAllocations internally with the shipped √-weighted
 * bidding model — NOT linear proportional math. The function synthesises a
 * representative staker pool from totalStaked so it can run the bidding
 * engine for the user's stake in context.
 *
 * The $100 USDC minimum floor and hard per-staker cap are enforced by the
 * bidding engine automatically.
 */
export function computeVaultCapacityEstimate(
  input: VaultCapacityInput
): VaultCapacityEstimate {
  const { userStake, totalStaked, vaultCapacityUsd } = input;

  // Validate constraints
  if (!validateTotalStaked(totalStaked)) {
    throw new Error(
      `Total staked (${totalStaked}) exceeds minted supply ceiling (${MINTED_SUPPLY}) or is non-positive`
    );
  }
  if (userStake > totalStaked) {
    throw new Error(
      `User stake (${userStake}) cannot exceed total staked (${totalStaked})`
    );
  }

  // Handle zero user stake
  if (userStake <= 0) {
    return {
      sharePercentage: 0,
      estimatedAllocationLowUsd: 0,
      estimatedAllocationHighUsd: 0,
      totalVaultCapUsd: vaultCapacityUsd,
      effectiveDepositUsd: 0,
      capConstrained: false,
    };
  }

  // Share of staked pool (linear, for display purposes)
  const sharePercentage = (userStake / totalStaked) * 100;

  // Build a representative staker pool for the bidding engine.
  // We model the remaining staked BETTER as evenly distributed among
  // qualifying stakers at the minimum stake level.
  const minStake = BIDDING_MODEL_PARAMS.minimumStake;
  const remainingStaked = totalStaked - userStake;
  const otherStakerCount = Math.max(0, Math.floor(remainingStaked / minStake));

  // Build stakes array: user + representative others
  const stakes: number[] = [userStake];
  for (let i = 0; i < otherStakerCount; i++) {
    stakes.push(minStake);
  }

  // Ensure we don't exceed max stakers for the vault floor
  const maxStakers = Math.floor(vaultCapacityUsd / BIDDING_MODEL_PARAMS.minimumFloorUsd);
  if (stakes.length > maxStakers) {
    // Trim to max stakers, keeping user at index 0
    stakes.length = maxStakers;
  }

  // Edge case: if user is the only staker
  if (stakes.length === 0) {
    stakes.push(userStake);
  }

  // Run the √-weighted bidding allocation engine
  const biddingResult = computeBiddingAllocations({
    stakes,
    vaultCapUsd: vaultCapacityUsd,
  });

  // User's allocation is always the first in the result
  const userAllocation = biddingResult.allocations[0];

  // Build uncertainty band around the bidding-model point estimate
  const pointEstimateUsd = userAllocation.allocationUsd;
  const estimatedAllocationLowUsd = pointEstimateUsd * UNCERTAINTY_LOW_FACTOR;
  const estimatedAllocationHighUsd = pointEstimateUsd * UNCERTAINTY_HIGH_FACTOR;

  // Effective deposit respects the per-staker cap from the bidding model
  const effectiveDepositUsd = Math.min(estimatedAllocationHighUsd, biddingResult.perStakerCapUsd);
  const capConstrained = estimatedAllocationHighUsd > biddingResult.perStakerCapUsd;

  return {
    sharePercentage,
    estimatedAllocationLowUsd,
    estimatedAllocationHighUsd,
    totalVaultCapUsd: vaultCapacityUsd,
    effectiveDepositUsd,
    capConstrained,
  };
}
