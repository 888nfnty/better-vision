import type { MaturityStatus, SourceCue } from "./types";

export interface SurfaceEnrichment {
  id: string;
  title: string;
  status: MaturityStatus;
  body: string;
  bullets: string[];
  source: SourceCue;
  ctaLabel?: string;
  ctaHref?: string;
}

const TRADEBETTER_X_SOURCE: SourceCue = {
  type: "external",
  label: "@tradebetterapp",
  href: "https://x.com/tradebetterapp",
  asOf: "2026-Q1",
};

export const ARCHITECTURE_SURFACE_ENRICHMENTS: SurfaceEnrichment[] = [
  {
    id: "rust-execution-lane",
    title: "Rust execution lane",
    status: "in_progress",
    body:
      "BETTER frames its execution moat around a Rust engine that removes garbage-collection pauses, keeps sizing deterministic, and stays physically close to the venue.",
    bullets: [
      "0.11ms internal Rust-path latency versus an 8ms Python-style end-to-end path.",
      "Same-rack AWS co-location with the Polymarket CLOB to compress network distance.",
      "FAST15M stays Rust-only so the shortest-horizon lane never waits on a slower runtime.",
    ],
    source: TRADEBETTER_X_SOURCE,
  },
  {
    id: "braid-consensus",
    title: "BRAID 4-way consensus",
    status: "in_progress",
    body:
      "The LONG lane adds BRAID consensus across Grok, Gemini, Opus, and GPT before BETTER commits capital, then hands execution back to deterministic sizing and order routing.",
    bullets: [
      "88% win rate when 3 of 4 models agree.",
      "100% win rate when all 4 models agree.",
      "Consensus is a decision gate, not a discretionary override of the execution engine.",
    ],
    source: TRADEBETTER_X_SOURCE,
  },
];

export const TOKENOMICS_SURFACE_ENRICHMENTS: SurfaceEnrichment[] = [
  {
    id: "arbitrage-flywheel-revenue",
    title: "Arbitrage flywheel revenue",
    status: "planned",
    body:
      "BETTER's Phase 2 tokenomics layer turns vBETTER into an ETF-style premium capture loop that later extends into TRUTH-PERP as the larger synthetic truth index.",
    bullets: [
      "When vBETTER trades above vault NAV, the protocol mints, sells, and captures the arbitrage spread.",
      "30% of net arbitrage profits from vBETTER and later TRUTH-PERP routing go to buy & burn BETTER.",
      "This revenue line sits on top of the current fee stack instead of replacing it.",
    ],
    source: TRADEBETTER_X_SOURCE,
    ctaLabel: "Open TRUTH-PERP node",
    ctaHref: "#graph-truth-perp-flywheel",
  },
  {
    id: "tax-routing-capex",
    title: "Tax routing funds capex",
    status: "live",
    body:
      "Current treasury funding stays simple: 2% buy tax plus 2% sell tax route into treasury so BETTER can finance execution infra, model work, and product capex before the bigger flywheel layers arrive.",
    bullets: [
      "2% buy + 2% sell taxes remain the live treasury rail today.",
      "Treasury routing is framed as capex for infra, research, and product expansion.",
      "The live tax line and the planned arbitrage loop are shown as separate revenue mechanisms.",
    ],
    source: TRADEBETTER_X_SOURCE,
  },
];

export const PROOF_SURFACE_ENRICHMENTS: SurfaceEnrichment[] = [
  {
    id: "terminal-copy-trading-details",
    title: "Terminal execution abstraction",
    status: "live",
    body:
      "BETTER packages prediction-market execution so the user experience reads as one-click copy trading instead of a manual bridge-and-click workflow.",
    bullets: [
      "gas-sponsored execution removes the need for every follower to manage venue gas manually.",
      "UDA (Unified Deposit Account) turns funding into one balance instead of multiple venue-specific wallets.",
      "one-click copy trading wraps Base/ETH to Polygon USDC.e routing behind a single Terminal flow.",
    ],
    source: TRADEBETTER_X_SOURCE,
  },
];
