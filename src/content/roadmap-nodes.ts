/**
 * Seed data: Roadmap nodes across all five branch families.
 *
 * Assembled from approved BETTER source materials:
 * - BETTER Terminal docs (live mechanics)
 * - BETTER tokenomics and whitepaper
 * - Mission-specific roadmap expansion guidance
 */

import { RoadmapNode } from "./types";

// ---------------------------------------------------------------------------
// Product Evolution
// ---------------------------------------------------------------------------

const productEvolution: RoadmapNode[] = [
  {
    id: "pe-terminal-beta",
    family: "product_evolution",
    title: "BETTER Terminal (Closed Beta)",
    status: "live",
    summary:
      "AI-powered signal discovery and one/two-click Polymarket copy trading. The core live product today.",
    dependencies: [],
    unlocks:
      "Foundation for all downstream products — signal infrastructure, trade execution, and user base.",
    source: {
      type: "canonical",
      label: "BETTER Docs",
      note: "Terminal is the current production product.",
      asOf: "2026-Q1",
    },
    order: 1,
  },
  {
    id: "pe-terminal-open",
    family: "product_evolution",
    title: "Terminal Open Access",
    status: "in_progress",
    summary:
      "Expand Terminal access beyond closed beta while maintaining token-gated entry.",
    dependencies: ["pe-terminal-beta"],
    unlocks: "Broader user base and increased prediction-market volume.",
    source: {
      type: "canonical",
      label: "BETTER Docs",
      asOf: "2026-Q1",
    },
    confidence: {
      caveat: "Timeline depends on infrastructure scaling readiness.",
    },
    order: 2,
  },
  {
    id: "pe-lite-mode",
    family: "product_evolution",
    title: "Lite Mode",
    status: "live",
    summary:
      "Halves the Terminal token requirement and charges a 2% nominal per-fill fee for lower-commitment access.",
    dependencies: ["pe-terminal-beta"],
    unlocks:
      "Onramp for smaller holders; generates fee revenue from per-fill charges.",
    source: {
      type: "canonical",
      label: "BETTER Docs",
      note: "Lite Mode is live with a 2% per-fill fee.",
      asOf: "2026-Q1",
    },
    order: 3,
  },
  {
    id: "pe-social-vaults",
    family: "product_evolution",
    title: "Social Vaults & vBETTER",
    status: "in_progress",
    summary:
      "Community-managed vaults with vBETTER staking and social coordination for collective alpha.",
    dependencies: ["pe-terminal-beta"],
    unlocks:
      "Social trading layer, vault performance fees, and community engagement loops.",
    source: {
      type: "canonical",
      label: "BETTER Docs & Whitepaper",
      note: "Vaults and vBETTER are in active development.",
      asOf: "2026-Q1",
    },
    confidence: {
      caveat: "Vault mechanics are under active development and may evolve.",
      dependencies: ["pe-terminal-beta"],
    },
    order: 4,
  },
  {
    id: "pe-strategy-agents",
    family: "product_evolution",
    title: "Autonomous Strategy Agents",
    status: "planned",
    summary:
      "AI agents that execute prediction-market strategies autonomously with user-defined risk parameters.",
    dependencies: ["pe-terminal-open", "pe-social-vaults"],
    unlocks:
      "24/7 autonomous trading, agent-native fee streams, and delegation mechanics.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
      note: "Planned product expansion.",
    },
    confidence: {
      caveat:
        "Depends on Terminal open access, vault infrastructure, and agent safety frameworks.",
      dependencies: ["pe-terminal-open", "pe-social-vaults"],
    },
    order: 5,
  },
  {
    id: "pe-b2b-data",
    family: "product_evolution",
    title: "B2B Data & Model Distribution",
    status: "planned",
    summary:
      "License BETTER's prediction-market intelligence and signal models to institutional clients.",
    dependencies: ["pe-terminal-open", "ti-ai-rl-phase2"],
    unlocks:
      "Enterprise revenue stream and broader market intelligence footprint.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
      note: "Future-facing product line.",
    },
    confidence: {
      caveat:
        "Requires mature AI/RL models and sufficient data history for institutional credibility.",
      dependencies: ["pe-terminal-open", "ti-ai-rl-phase2"],
    },
    order: 6,
  },
];

// ---------------------------------------------------------------------------
// Token Utility & Access Tiers
// ---------------------------------------------------------------------------

const tokenUtility: RoadmapNode[] = [
  {
    id: "tu-access-gate",
    family: "token_utility",
    title: "Token Access Gate",
    status: "live",
    summary:
      "Minimum BETTER token holding required to access the Terminal. Gate threshold governed by the FDV ratchet.",
    dependencies: [],
    unlocks: "Demand-side token utility and access scarcity.",
    source: {
      type: "canonical",
      label: "BETTER Docs",
      note: "Access gate is the current live gating mechanism.",
      asOf: "2026-Q1",
    },
    order: 1,
  },
  {
    id: "tu-fdv-ratchet",
    family: "token_utility",
    title: "Permanent FDV Ratchet",
    status: "live",
    summary:
      "Access threshold permanently lowers when BETTER reaches a new FDV band. Once lowered, the threshold never increases — even if FDV later declines.",
    dependencies: ["tu-access-gate"],
    unlocks:
      "Permanent accessibility improvement for qualifying users at new FDV milestones.",
    source: {
      type: "canonical",
      label: "BETTER Docs",
      note: "FDV ratchet is the current live mechanism.",
      asOf: "2026-Q1",
    },
    order: 2,
  },
  {
    id: "tu-whale-tiers",
    family: "token_utility",
    title: "Whale-First Tier Ladder",
    status: "in_progress",
    summary:
      "Multi-tier access structure where higher holdings unlock better access priority, allocation priority, preview priority, higher agent limits, and fee advantages.",
    dependencies: ["tu-access-gate"],
    unlocks:
      "Whale retention, premium product demand, and tiered monetization.",
    source: {
      type: "canonical",
      label: "BETTER Tokenomics",
      note: "Tier structure is being finalized.",
      asOf: "2026-Q1",
    },
    confidence: {
      caveat: "Exact thresholds and tier benefits are subject to adjustment.",
    },
    order: 3,
  },
  {
    id: "tu-nonlinear-allocation",
    family: "token_utility",
    title: "Non-Linear Vault Allocation",
    status: "planned",
    summary:
      "Vault allocation formulas that reward whale tiers disproportionately using mathematically optimized non-linear curves.",
    dependencies: ["tu-whale-tiers", "pe-social-vaults"],
    unlocks:
      "Incentive alignment for large holders without linear dilution of retail access.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
      note: "Allocation formula design is in progress.",
    },
    confidence: {
      caveat:
        "Non-linear mechanics require careful calibration to avoid excessive centralization.",
      dependencies: ["tu-whale-tiers", "pe-social-vaults"],
    },
    order: 4,
  },
  {
    id: "tu-agent-utility",
    family: "token_utility",
    title: "Agent-Native Token Utility",
    status: "planned",
    summary:
      "BETTER tokens used for agent bonding, delegation, LLM/inference credits, premium API lanes, and research bounties.",
    dependencies: ["pe-strategy-agents", "tu-whale-tiers"],
    unlocks:
      "Token velocity from autonomous agents and agent-economy transaction fees.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
      note: "Agent-native utility is a planned expansion of token demand sinks.",
    },
    confidence: {
      caveat:
        "Depends on strategy agent infrastructure and market demand for autonomous prediction-market trading.",
      dependencies: ["pe-strategy-agents", "tu-whale-tiers"],
    },
    order: 5,
  },
  {
    id: "tu-exclusive-whale",
    family: "token_utility",
    title: "Exclusive Whale Products",
    status: "speculative",
    summary:
      "Premium-only products available exclusively to top-tier whale holders: private alpha signals, early vault previews, OTC facilitation, and bespoke agent configurations.",
    dependencies: ["tu-whale-tiers", "pe-strategy-agents"],
    unlocks:
      "Ultimate whale retention and high-margin premium revenue.",
    source: {
      type: "illustrative",
      label: "BETTER Vision",
      note: "Speculative product concepts for maximum whale utility.",
    },
    confidence: {
      caveat:
        "These products are exploratory ideas — none are committed to a timeline.",
      dependencies: ["tu-whale-tiers", "pe-strategy-agents"],
    },
    order: 6,
  },
];

// ---------------------------------------------------------------------------
// Revenue Expansion
// ---------------------------------------------------------------------------

const revenueExpansion: RoadmapNode[] = [
  {
    id: "re-trading-tax",
    family: "revenue_expansion",
    title: "Trading Tax (Buy/Sell)",
    status: "live",
    summary:
      "2% buy tax and 2% sell tax on the Aerodrome LP path. Primary current revenue mechanism for the treasury.",
    dependencies: [],
    unlocks: "Baseline treasury funding from every token transaction.",
    source: {
      type: "canonical",
      label: "BETTER Docs",
      note: "2% buy / 2% sell tax on Aerodrome LP.",
      asOf: "2026-Q1",
    },
    order: 1,
  },
  {
    id: "re-lite-mode-fees",
    family: "revenue_expansion",
    title: "Lite Mode Per-Fill Fees",
    status: "live",
    summary:
      "2% nominal per-fill fee charged to Lite Mode users for each prediction-market fill.",
    dependencies: ["pe-lite-mode"],
    unlocks: "Volume-based revenue from the accessible Lite Mode entry point.",
    source: {
      type: "canonical",
      label: "BETTER Docs",
      note: "Lite Mode charges a 2% per-fill fee.",
      asOf: "2026-Q1",
    },
    order: 2,
  },
  {
    id: "re-vault-performance",
    family: "revenue_expansion",
    title: "Vault Performance Fees",
    status: "in_progress",
    summary:
      "Performance-based fees on social vault profits. Aligns vault manager incentives with depositor outcomes.",
    dependencies: ["pe-social-vaults"],
    unlocks: "Revenue scaling with vault AUM and performance.",
    source: {
      type: "canonical",
      label: "BETTER Docs",
      note: "Vault performance fees are part of the vault design.",
      asOf: "2026-Q1",
    },
    confidence: {
      caveat: "Vault fee structure is being finalized alongside vault launch.",
    },
    order: 3,
  },
  {
    id: "re-whale-premium",
    family: "revenue_expansion",
    title: "Whale Premium Subscriptions",
    status: "planned",
    summary:
      "Monthly or annual premium access for whale-tier features beyond the base token gate.",
    dependencies: ["tu-whale-tiers"],
    unlocks: "Recurring high-margin revenue from top-tier holders.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
    },
    confidence: {
      caveat: "Pricing and feature bundling have not been finalized.",
      dependencies: ["tu-whale-tiers"],
    },
    order: 4,
  },
  {
    id: "re-agent-fees",
    family: "revenue_expansion",
    title: "Agent Transaction & Delegation Fees",
    status: "planned",
    summary:
      "Fees on autonomous agent transactions, delegation bonds, and agent registry operations.",
    dependencies: ["pe-strategy-agents", "tu-agent-utility"],
    unlocks:
      "Revenue directly proportional to agent ecosystem activity volume.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
    },
    confidence: {
      caveat:
        "Depends on strategy agent adoption and autonomous trading volume.",
      dependencies: ["pe-strategy-agents"],
    },
    order: 5,
  },
  {
    id: "re-enterprise-data",
    family: "revenue_expansion",
    title: "Enterprise Data & API Licensing",
    status: "planned",
    summary:
      "B2B licensing of BETTER's prediction-market intelligence, signal models, and proprietary data feeds.",
    dependencies: ["pe-b2b-data", "ti-data-pipeline-phase2"],
    unlocks:
      "High-value enterprise contracts with institutional-grade SLAs.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
    },
    confidence: {
      caveat:
        "Enterprise revenue requires mature models and sufficient data credibility.",
      dependencies: ["pe-b2b-data"],
    },
    order: 6,
  },
  {
    id: "re-infra-services",
    family: "revenue_expansion",
    title: "Infrastructure-as-a-Service Revenue",
    status: "speculative",
    summary:
      "Revenue from shared infrastructure services: Polygon validator rewards, low-latency execution for partners, and LLM inference marketplace.",
    dependencies: [
      "ti-polygon-phase2",
      "ti-low-latency-phase2",
      "ti-ai-rl-phase3",
    ],
    unlocks:
      "Diversified infrastructure revenue beyond core product fees.",
    source: {
      type: "illustrative",
      label: "BETTER Vision",
      note: "Speculative long-range revenue diversification.",
    },
    confidence: {
      caveat:
        "Depends on significant infrastructure maturity and market demand for BETTER-operated services.",
    },
    order: 7,
  },
];

// ---------------------------------------------------------------------------
// Technical Infrastructure
// ---------------------------------------------------------------------------

const technicalInfrastructure: RoadmapNode[] = [
  {
    id: "ti-polymarket-integration",
    family: "technical_infrastructure",
    title: "Polymarket Integration Layer",
    status: "live",
    summary:
      "Current integration enabling prediction-market trading via BETTER Terminal. Polygon-based with funding from Ethereum/Base.",
    dependencies: [],
    unlocks: "Core trading capability for all BETTER products.",
    source: {
      type: "canonical",
      label: "BETTER Docs",
      asOf: "2026-Q1",
    },
    order: 1,
  },
  {
    id: "ti-hyperevm-phase1",
    family: "technical_infrastructure",
    title: "HyperEVM Integration (Phase 1)",
    status: "in_progress",
    summary:
      "Deploy BETTER contracts on HyperEVM for Hyperliquid-native prediction markets and cross-chain execution.",
    dependencies: ["ti-polymarket-integration"],
    unlocks:
      "Access to Hyperliquid liquidity and HyperEVM composability.",
    source: {
      type: "canonical",
      label: "BETTER Docs & Whitepaper",
      asOf: "2026-Q1",
    },
    confidence: {
      caveat: "HyperEVM deployment timeline depends on chain readiness.",
      dependencies: ["ti-polymarket-integration"],
    },
    order: 2,
  },
  {
    id: "ti-ai-rl-phase1",
    family: "technical_infrastructure",
    title: "AI/RL Signal Models (Phase 1: Foundation)",
    status: "live",
    summary:
      "Current signal generation models powering Terminal predictions. Foundational ML/RL pipeline.",
    dependencies: [],
    unlocks: "Signal-driven trading intelligence for all products.",
    source: {
      type: "canonical",
      label: "BETTER Docs",
      asOf: "2026-Q1",
    },
    order: 3,
  },
  {
    id: "ti-ai-rl-phase2",
    family: "technical_infrastructure",
    title: "AI/RL Models (Phase 2: Proprietary Training)",
    status: "planned",
    summary:
      "Proprietary model training on BETTER's accumulated prediction-market data for improved signal accuracy and new market coverage.",
    dependencies: ["ti-ai-rl-phase1"],
    unlocks:
      "Differentiated intelligence that cannot be replicated by competitors without equivalent data.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
    },
    confidence: {
      caveat:
        "Requires sufficient data accumulation and compute investment.",
      dependencies: ["ti-ai-rl-phase1"],
    },
    order: 4,
  },
  {
    id: "ti-ai-rl-phase3",
    family: "technical_infrastructure",
    title: "AI/RL Models (Phase 3: Full-Stack Intelligence)",
    status: "speculative",
    summary:
      "Full-stack proprietary AI across prediction markets, agent optimization, and cross-market intelligence. LLM crediting and inference marketplace.",
    dependencies: ["ti-ai-rl-phase2"],
    unlocks:
      "BETTER as a platform intelligence provider beyond its own products.",
    source: {
      type: "illustrative",
      label: "BETTER Vision",
    },
    confidence: {
      caveat:
        "Highly ambitious — depends on Phase 2 success and significant capital deployment.",
      dependencies: ["ti-ai-rl-phase2"],
    },
    order: 5,
  },
  {
    id: "ti-polygon-phase1",
    family: "technical_infrastructure",
    title: "Polygon Node Operations (Phase 1)",
    status: "planned",
    summary:
      "Run Polygon full nodes for direct chain access, reduced latency, and independent verification.",
    dependencies: ["ti-polymarket-integration"],
    unlocks:
      "Infrastructure independence and reduced reliance on third-party RPC providers.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
    },
    confidence: {
      caveat: "Requires operational investment and node management expertise.",
    },
    order: 6,
  },
  {
    id: "ti-polygon-phase2",
    family: "technical_infrastructure",
    title: "Polygon Validator Operations (Phase 2)",
    status: "speculative",
    summary:
      "Operate Polygon validators for staking rewards and deeper network participation.",
    dependencies: ["ti-polygon-phase1"],
    unlocks:
      "Validator rewards revenue and protocol-level influence.",
    source: {
      type: "illustrative",
      label: "BETTER Vision",
    },
    confidence: {
      caveat:
        "Validator economics and staking requirements must justify the capital commitment.",
      dependencies: ["ti-polygon-phase1"],
    },
    order: 7,
  },
  {
    id: "ti-low-latency-phase1",
    family: "technical_infrastructure",
    title: "Low-Latency Execution (Phase 1: Colo)",
    status: "planned",
    summary:
      "Co-located execution infrastructure for reduced latency on prediction-market order routing.",
    dependencies: ["ti-polymarket-integration", "ti-hyperevm-phase1"],
    unlocks: "Meaningful execution speed advantage for BETTER agents.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
    },
    confidence: {
      caveat:
        "Colo investment justified only after sufficient trading volume.",
      dependencies: ["ti-polymarket-integration"],
    },
    order: 8,
  },
  {
    id: "ti-low-latency-phase2",
    family: "technical_infrastructure",
    title: "Low-Latency Execution (Phase 2: FPGA)",
    status: "speculative",
    summary:
      "FPGA-accelerated execution for ultra-low-latency prediction-market trading and agent operations.",
    dependencies: ["ti-low-latency-phase1"],
    unlocks:
      "HFT-grade execution speed — structural advantage for BETTER's agent fleet.",
    source: {
      type: "illustrative",
      label: "BETTER Vision",
    },
    confidence: {
      caveat:
        "FPGA investment is speculative and depends on Phase 1 colo proving sufficient volume advantage.",
      dependencies: ["ti-low-latency-phase1"],
    },
    order: 9,
  },
  {
    id: "ti-data-pipeline-phase1",
    family: "technical_infrastructure",
    title: "Data Pipeline (Phase 1: Core Collection)",
    status: "live",
    summary:
      "Current data collection and signal processing pipeline supporting Terminal intelligence.",
    dependencies: [],
    unlocks: "Raw data foundation for all intelligence products.",
    source: {
      type: "canonical",
      label: "BETTER Docs",
      asOf: "2026-Q1",
    },
    order: 10,
  },
  {
    id: "ti-data-pipeline-phase2",
    family: "technical_infrastructure",
    title: "Data Pipeline (Phase 2: Enterprise-Grade)",
    status: "planned",
    summary:
      "Enterprise-grade data pipeline with institutional SLAs, audit trails, and API distribution for B2B clients.",
    dependencies: ["ti-data-pipeline-phase1", "ti-ai-rl-phase2"],
    unlocks:
      "Institutional-quality data products for enterprise licensing.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
    },
    confidence: {
      caveat: "Requires Phase 1 data maturity and B2B demand validation.",
      dependencies: ["ti-data-pipeline-phase1"],
    },
    order: 11,
  },
];

// ---------------------------------------------------------------------------
// Social & Agent Ecosystem
// ---------------------------------------------------------------------------

const socialAgentEcosystem: RoadmapNode[] = [
  {
    id: "sa-community-signals",
    family: "social_agent_ecosystem",
    title: "Community Signal Sharing",
    status: "live",
    summary:
      "Current community-driven signal sharing and social coordination around BETTER Terminal predictions.",
    dependencies: ["pe-terminal-beta"],
    unlocks:
      "Social proof layer and community engagement around trading intelligence.",
    source: {
      type: "canonical",
      label: "BETTER Docs",
      asOf: "2026-Q1",
    },
    order: 1,
  },
  {
    id: "sa-openserv-integration",
    family: "social_agent_ecosystem",
    title: "OpenServ / BRAID Integration",
    status: "in_progress",
    summary:
      "Integration with OpenServ for agent interoperability and BRAID coordination frameworks.",
    dependencies: ["pe-terminal-beta"],
    unlocks:
      "Cross-platform agent ecosystem and standardized agent communication.",
    source: {
      type: "canonical",
      label: "BETTER Docs & Whitepaper",
      asOf: "2026-Q1",
    },
    confidence: {
      caveat: "OpenServ integration scope depends on partner API stability.",
    },
    order: 2,
  },
  {
    id: "sa-bonded-agents",
    family: "social_agent_ecosystem",
    title: "Bonded Agent Registry",
    status: "planned",
    summary:
      "Agent quality control via bonding requirements — agents must stake BETTER tokens to operate, with bonds slashed for poor performance.",
    dependencies: ["pe-strategy-agents", "tu-agent-utility"],
    unlocks:
      "Agent quality assurance and economic alignment between agents and delegators.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
    },
    confidence: {
      caveat:
        "Bonding mechanics need careful design to avoid discouraging legitimate agents.",
      dependencies: ["pe-strategy-agents"],
    },
    order: 3,
  },
  {
    id: "sa-delegation",
    family: "social_agent_ecosystem",
    title: "Agent Delegation & Backing",
    status: "planned",
    summary:
      "Users can delegate capital to autonomous agents and back agent strategies, sharing in profits and risks.",
    dependencies: ["sa-bonded-agents", "pe-social-vaults"],
    unlocks:
      "Capital-efficient agent ecosystem where users participate without running agents.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
    },
    confidence: {
      caveat:
        "Delegation mechanics depend on bonded agent registry and vault infrastructure.",
      dependencies: ["sa-bonded-agents"],
    },
    order: 4,
  },
  {
    id: "sa-research-bounties",
    family: "social_agent_ecosystem",
    title: "Research & Data Bounties",
    status: "planned",
    summary:
      "Bounty system where community members and agents earn BETTER tokens for contributing prediction-market research and data.",
    dependencies: ["sa-community-signals", "tu-agent-utility"],
    unlocks:
      "Crowdsourced intelligence improvement and community-driven data enrichment.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
    },
    confidence: {
      caveat: "Bounty economics need careful calibration to maintain quality.",
    },
    order: 5,
  },
  {
    id: "sa-premium-api",
    family: "social_agent_ecosystem",
    title: "Premium API & Agent Lanes",
    status: "planned",
    summary:
      "Dedicated high-throughput API lanes for whale-tier agents and premium integrations.",
    dependencies: ["tu-whale-tiers", "ti-data-pipeline-phase2"],
    unlocks:
      "Differentiated infrastructure access for power users and institutional agents.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
    },
    confidence: {
      caveat: "Requires enterprise data pipeline readiness.",
      dependencies: ["tu-whale-tiers", "ti-data-pipeline-phase2"],
    },
    order: 6,
  },
  {
    id: "sa-prediction-social",
    family: "social_agent_ecosystem",
    title: "Prediction-Market Social Loops",
    status: "speculative",
    summary:
      "Gamified social coordination: leaderboards, prediction tournaments, social scoring, and community-curated markets.",
    dependencies: ["pe-social-vaults", "sa-community-signals"],
    unlocks:
      "Viral community growth mechanics and prediction-market engagement flywheel.",
    source: {
      type: "illustrative",
      label: "BETTER Vision",
    },
    confidence: {
      caveat:
        "Speculative social mechanics — no committed timeline or design.",
    },
    order: 7,
  },
];

// ---------------------------------------------------------------------------
// Combined Export
// ---------------------------------------------------------------------------

export const ROADMAP_NODES: RoadmapNode[] = [
  ...productEvolution,
  ...tokenUtility,
  ...revenueExpansion,
  ...technicalInfrastructure,
  ...socialAgentEcosystem,
];

/** Get all nodes for a specific branch family */
export function getNodesByFamily(
  family: RoadmapNode["family"]
): RoadmapNode[] {
  return ROADMAP_NODES.filter((n) => n.family === family).sort(
    (a, b) => a.order - b.order
  );
}

/** Get a node by its ID */
export function getNodeById(id: string): RoadmapNode | undefined {
  return ROADMAP_NODES.find((n) => n.id === id);
}

/** Get all nodes that depend on a given node */
export function getDependents(nodeId: string): RoadmapNode[] {
  return ROADMAP_NODES.filter((n) => n.dependencies.includes(nodeId));
}
