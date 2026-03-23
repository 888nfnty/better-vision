/**
 * Conservative stage-based valuation corridors for the BETTER ecosystem.
 *
 * Satisfies VAL-TOKEN-015:
 * - Conservative stage-based corridor ranges with explicit numeric lower/upper bounds
 * - Each corridor maps to explicit milestone proof gates
 * - Comparable-category labels for each corridor
 * - A live anchor corridor reflecting present-day observable market state
 * - Consistent valuation basis (FDV) and supply basis (minted) across all corridors
 * - Implied per-token value reconciliation using declared basis
 *
 * These are planning corridors tied to milestone proof gates, NOT promises
 * or price targets. See source cues for framing.
 */

import type { SourceCue } from "./types";
import { MINTED_SUPPLY } from "./token-tiers";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ValuationCorridor {
  /** Stable unique identifier */
  id: string;
  /** Display label for this corridor stage */
  label: string;
  /** Short description of this stage */
  description: string;
  /** Order for sorting (ascending) */
  order: number;
  /** Lower bound in $M (FDV) */
  lowerBoundM: number;
  /** Upper bound in $M (FDV) */
  upperBoundM: number;
  /** Valuation basis — what the bounds represent */
  valuationBasis: string;
  /** Supply basis — which supply figure is used */
  supplyBasis: string;
  /** Whether this is the present-day live anchor corridor */
  isLiveAnchor: boolean;
  /** Milestone proof gates that must be passed for this corridor */
  proofGates: string[];
  /** Public comparable categories or reference baskets */
  comparableCategories: string[];
  /** Source/assumption cue */
  source: SourceCue;
}

// ---------------------------------------------------------------------------
// Shared basis declarations
// ---------------------------------------------------------------------------

/**
 * All corridors use the same valuation and supply basis so they are
 * directly comparable. This avoids silently switching framing.
 */
const VALUATION_BASIS = "Fully Diluted Valuation (FDV)";
const SUPPLY_BASIS = `Minted supply: ${MINTED_SUPPLY.toLocaleString("en-US")} BETTER (Base contract)`;

// ---------------------------------------------------------------------------
// Corridor Data
// ---------------------------------------------------------------------------

export const VALUATION_CORRIDORS: ValuationCorridor[] = [
  {
    id: "vc-live-anchor",
    label: "Current State (Live Anchor)",
    description:
      "Present-day observable market state: Terminal in closed beta, Aerodrome LP trading live, first vault not yet launched.",
    order: 0,
    lowerBoundM: 3,
    upperBoundM: 8,
    valuationBasis: VALUATION_BASIS,
    supplyBasis: SUPPLY_BASIS,
    isLiveAnchor: true,
    proofGates: [
      "Terminal accepts live copy trades on Polymarket mainnet",
      "BETTER token trades on Aerodrome DEX with buy/sell tax mechanics",
      "Minted supply of 709,001,940 BETTER verified on Base contract",
    ],
    comparableCategories: [
      "Early-stage prediction-market tooling",
      "Pre-revenue crypto copy-trading platforms",
    ],
    source: {
      type: "canonical",
      label: "Observable Market State",
      note:
        "FDV corridor reflects recent on-chain trading ranges for BETTER on Aerodrome. This is not a target — it is a grounded starting reference for planning purposes.",
      asOf: "2026-Q1",
    },
  },
  {
    id: "vc-product-proof",
    label: "Product Proof",
    description:
      "First vault live on Base mainnet, open Terminal access, demonstrable user growth and trading volume.",
    order: 1,
    lowerBoundM: 10,
    upperBoundM: 30,
    valuationBasis: VALUATION_BASIS,
    supplyBasis: SUPPLY_BASIS,
    isLiveAnchor: false,
    proofGates: [
      "First social vault accepts deposits on Base mainnet",
      "Terminal transitions from closed beta to open access",
      "Monthly active Terminal users exceed 2,000",
      "On-chain trading volume sustains above $1M/week",
    ],
    comparableCategories: [
      "Prediction-market infrastructure with live product",
      "Early-revenue DeFi copy-trading protocols",
      "AI-native finance tools with traction proof",
    ],
    source: {
      type: "scenario_based",
      label: "BETTER Valuation Model",
      note:
        "Corridor reflects comparable FDVs for prediction-market and copy-trading protocols that have shipped a live vault product with measurable user traction. Not a promise or price target.",
    },
  },
  {
    id: "vc-revenue-proof",
    label: "Revenue Proof",
    description:
      "Audited vault infrastructure, demonstrable protocol revenue from multiple product lines, growing social vault AUM.",
    order: 2,
    lowerBoundM: 30,
    upperBoundM: 80,
    valuationBasis: VALUATION_BASIS,
    supplyBasis: SUPPLY_BASIS,
    isLiveAnchor: false,
    proofGates: [
      "Vault smart contracts pass independent security audit",
      "Annualized protocol revenue exceeds $1M from at least two product lines",
      "Social vault total AUM exceeds $5M",
      "Whale-tier retention rate demonstrates stickiness above 70% quarterly",
    ],
    comparableCategories: [
      "Revenue-generating DeFi protocols",
      "Prediction-market platforms with audit-backed infrastructure",
      "AI-powered trading platforms with recurring revenue",
    ],
    source: {
      type: "scenario_based",
      label: "BETTER Valuation Model",
      note:
        "Corridor reflects comparable FDVs for DeFi and AI-trading protocols with audited infrastructure and >$1M annualized revenue. Achieving this corridor requires passing all proof gates — it is planning logic, not a guarantee.",
    },
  },
  {
    id: "vc-multi-venue",
    label: "Multi-Venue Expansion",
    description:
      "HyperEVM live, multiple prediction-market venue integrations, strategy agent ecosystem growing, enterprise data licensing underway.",
    order: 3,
    lowerBoundM: 80,
    upperBoundM: 250,
    valuationBasis: VALUATION_BASIS,
    supplyBasis: SUPPLY_BASIS,
    isLiveAnchor: false,
    proofGates: [
      "BETTER contracts deployed and operational on HyperEVM",
      "Strategy agents process autonomous trades across at least two venues",
      "Enterprise data licensing generates ≥$500K annualized revenue",
      "Monthly active Terminal users exceed 10,000",
    ],
    comparableCategories: [
      "Multi-venue DeFi infrastructure protocols",
      "AI-native trading platforms with cross-chain presence",
      "Crypto data and software businesses with B2B traction",
    ],
    source: {
      type: "scenario_based",
      label: "BETTER Valuation Model",
      note:
        "Corridor reflects comparable FDVs for multi-venue DeFi protocols with cross-chain infrastructure, agent ecosystems, and early enterprise revenue. Highly dependent on external integration timelines.",
    },
  },
  {
    id: "vc-ecosystem-scale",
    label: "Ecosystem Scale",
    description:
      "Full autonomous agent ecosystem, recurring enterprise revenue, institutional vault products, and strong network-effect moats.",
    order: 4,
    lowerBoundM: 250,
    upperBoundM: 750,
    valuationBasis: VALUATION_BASIS,
    supplyBasis: SUPPLY_BASIS,
    isLiveAnchor: false,
    proofGates: [
      "Active autonomous agents exceed 500 with delegation and bonding mechanics live",
      "Annualized protocol revenue exceeds $8M across consumer, whale, and enterprise lines",
      "Total vault AUM exceeds $25M across social and strategy vaults",
      "Institutional or enterprise partnerships generate recurring software/data revenue",
    ],
    comparableCategories: [
      "Scaled DeFi infrastructure protocols with network effects",
      "AI-powered finance platforms with institutional adoption",
      "Crypto SaaS businesses with recurring B2B revenue",
    ],
    source: {
      type: "scenario_based",
      label: "BETTER Valuation Model",
      note:
        "Corridor reflects aspirational but comparable FDVs for scaled DeFi + AI finance platforms with strong network effects and institutional revenue. This is the most speculative corridor — many external dependencies and proof gates must be cleared.",
    },
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Get a corridor by ID */
export function getCorridorById(id: string): ValuationCorridor | undefined {
  return VALUATION_CORRIDORS.find((c) => c.id === id);
}

/** Get the live anchor corridor */
export function getLiveAnchorCorridor(): ValuationCorridor | undefined {
  return VALUATION_CORRIDORS.find((c) => c.isLiveAnchor);
}

/**
 * Compute implied per-token price from an FDV in $M.
 * Uses the declared minted supply basis.
 */
export function computeImpliedTokenPrice(fdvMillions: number): number {
  return (fdvMillions * 1_000_000) / MINTED_SUPPLY;
}

/**
 * Validate structural integrity of valuation corridors:
 * - At least 3 corridors
 * - Exactly one live anchor
 * - All share consistent basis
 * - Bounds are valid (upper > lower > 0)
 * - Corridors are sorted by ascending lower bound
 * - Each has proof gates and comparable categories
 */
export function validateValuationCorridors(
  corridors: ValuationCorridor[]
): boolean {
  if (corridors.length < 3) return false;

  // Exactly one live anchor
  const anchors = corridors.filter((c) => c.isLiveAnchor);
  if (anchors.length !== 1) return false;

  // Consistent basis
  const bases = new Set(corridors.map((c) => c.valuationBasis));
  const supplyBases = new Set(corridors.map((c) => c.supplyBasis));
  if (bases.size !== 1 || supplyBases.size !== 1) return false;

  // Bounds validity and ordering
  for (let i = 0; i < corridors.length; i++) {
    const c = corridors[i];
    if (c.lowerBoundM <= 0 || c.upperBoundM <= c.lowerBoundM) return false;
    if (c.proofGates.length === 0) return false;
    if (c.comparableCategories.length === 0) return false;
    if (i > 0 && c.lowerBoundM < corridors[i - 1].lowerBoundM) return false;
  }

  return true;
}
