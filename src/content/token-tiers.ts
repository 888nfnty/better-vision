/**
 * Seed data: Whale-first token tier ladder.
 *
 * Tiers are intentionally whale-first: higher tiers monotonically improve
 * all privileges (access, allocation, preview, agents, fees, exclusives).
 *
 * Source: BETTER tokenomics docs + mission roadmap expansion guidance.
 */

import { TokenTier } from "./types";

export const TOKEN_TIERS: TokenTier[] = [
  {
    id: "tier-explorer",
    name: "Explorer",
    threshold: 0,
    qualificationBasis: "Any wallet — no token holding required.",
    accessPriority: 1,
    allocationPriority: 1,
    previewPriority: 0,
    agentLimit: 0,
    feeMultiplier: 1.0,
    exclusiveProducts: [],
    source: {
      type: "canonical",
      label: "BETTER Docs",
      note: "Base tier for non-holders. Read-only or limited access.",
      asOf: "2026-Q1",
    },
    order: 0,
  },
  {
    id: "tier-lite",
    name: "Lite",
    threshold: 50_000,
    qualificationBasis:
      "Hold ≥ 50,000 BETTER tokens (Lite Mode threshold — half of standard Terminal requirement).",
    accessPriority: 2,
    allocationPriority: 2,
    previewPriority: 1,
    agentLimit: 1,
    feeMultiplier: 1.0,
    exclusiveProducts: ["Lite Mode Terminal access"],
    source: {
      type: "canonical",
      label: "BETTER Docs",
      note:
        "Lite Mode halves the Terminal requirement. Exact threshold subject to FDV ratchet.",
      asOf: "2026-Q1",
    },
    order: 1,
  },
  {
    id: "tier-standard",
    name: "Standard",
    threshold: 100_000,
    qualificationBasis:
      "Hold ≥ 100,000 BETTER tokens (standard Terminal access gate).",
    accessPriority: 3,
    allocationPriority: 3,
    previewPriority: 2,
    agentLimit: 2,
    feeMultiplier: 1.0,
    exclusiveProducts: ["Full Terminal access", "Vault participation"],
    source: {
      type: "canonical",
      label: "BETTER Docs",
      note:
        "Standard access gate threshold. Subject to FDV ratchet adjustments.",
      asOf: "2026-Q1",
    },
    order: 2,
  },
  {
    id: "tier-whale",
    name: "Whale",
    threshold: 500_000,
    qualificationBasis: "Hold ≥ 500,000 BETTER tokens.",
    accessPriority: 4,
    allocationPriority: 5,
    previewPriority: 3,
    agentLimit: 5,
    feeMultiplier: 0.85,
    exclusiveProducts: [
      "Priority vault allocation",
      "Early strategy previews",
      "Enhanced agent slots",
    ],
    source: {
      type: "scenario_based",
      label: "BETTER Tokenomics",
      note:
        "Whale tier thresholds are illustrative — final values depend on token economics and FDV.",
    },
    order: 3,
  },
  {
    id: "tier-apex",
    name: "Apex Whale",
    threshold: 2_000_000,
    qualificationBasis: "Hold ≥ 2,000,000 BETTER tokens.",
    accessPriority: 5,
    allocationPriority: 7,
    previewPriority: 5,
    agentLimit: 10,
    feeMultiplier: 0.75,
    exclusiveProducts: [
      "Maximum vault allocation priority",
      "Private alpha signals",
      "Early vault previews",
      "Bespoke agent configurations",
      "OTC facilitation access",
      "Premium API lanes",
    ],
    source: {
      type: "scenario_based",
      label: "BETTER Tokenomics",
      note:
        "Apex tier is the highest planned tier. Thresholds and benefits are illustrative.",
    },
    order: 4,
  },
];

/** Get tiers sorted by ascending threshold */
export function getTiersSorted(): TokenTier[] {
  return [...TOKEN_TIERS].sort((a, b) => a.threshold - b.threshold);
}

/** Get a tier by ID */
export function getTierById(id: string): TokenTier | undefined {
  return TOKEN_TIERS.find((t) => t.id === id);
}

/** Get the tier for a given token balance */
export function getTierForBalance(balance: number): TokenTier {
  const sorted = getTiersSorted();
  let tier = sorted[0];
  for (const t of sorted) {
    if (balance >= t.threshold) {
      tier = t;
    }
  }
  return tier;
}

/**
 * BETTER Total Supply — canonical value from docs.
 */
export const TOTAL_SUPPLY = 1_000_000_000;

/**
 * Token allocation breakdown.
 * All percentages must sum to 100.
 */
export interface TokenAllocation {
  label: string;
  percentage: number;
  tokens: number;
  source: {
    type: "canonical" | "scenario_based" | "illustrative";
    label: string;
    note?: string;
  };
}

export const TOKEN_ALLOCATIONS: TokenAllocation[] = [
  {
    label: "Community & Ecosystem",
    percentage: 40,
    tokens: 400_000_000,
    source: {
      type: "canonical",
      label: "BETTER Tokenomics",
      note: "Allocated for community rewards, airdrops, ecosystem growth.",
    },
  },
  {
    label: "Team & Advisors",
    percentage: 20,
    tokens: 200_000_000,
    source: {
      type: "canonical",
      label: "BETTER Tokenomics",
      note: "Subject to vesting schedule.",
    },
  },
  {
    label: "Treasury",
    percentage: 15,
    tokens: 150_000_000,
    source: {
      type: "canonical",
      label: "BETTER Tokenomics",
      note: "Protocol-controlled treasury for operations and growth.",
    },
  },
  {
    label: "Liquidity",
    percentage: 15,
    tokens: 150_000_000,
    source: {
      type: "canonical",
      label: "BETTER Tokenomics",
      note: "DEX liquidity and market-making reserves.",
    },
  },
  {
    label: "Strategic Partnerships",
    percentage: 10,
    tokens: 100_000_000,
    source: {
      type: "canonical",
      label: "BETTER Tokenomics",
      note: "Allocated for strategic integrations and partnerships.",
    },
  },
];

/** Validate that token allocations sum to 100% and reconcile with total supply */
export function validateAllocations(): {
  valid: boolean;
  totalPercentage: number;
  totalTokens: number;
} {
  const totalPercentage = TOKEN_ALLOCATIONS.reduce(
    (sum, a) => sum + a.percentage,
    0
  );
  const totalTokens = TOKEN_ALLOCATIONS.reduce(
    (sum, a) => sum + a.tokens,
    0
  );
  return {
    valid:
      Math.abs(totalPercentage - 100) < 0.001 && totalTokens === TOTAL_SUPPLY,
    totalPercentage,
    totalTokens,
  };
}
