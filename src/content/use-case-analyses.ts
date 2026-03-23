/**
 * Seed data: Use-case depth and revenue analysis (VAL-TOKEN-021).
 *
 * Each proposed BETTER token use case includes:
 * - Comparable market size from live or recently active projects
 * - Revenue model explaining value flow back to BETTER
 * - Token demand implications (new holders or increased stake demand)
 * - Realistic timeline with dependency awareness
 * - Estimated annual revenue range
 *
 * Prediction market figures are backed by Dune-verified on-chain data:
 * - Polymarket all-time volume: $50.9B (Dune dashboard: polymarket/polymarket)
 * - Polymarket March 2026 MTD volume: $7.1B (Dune dashboard: polymarket/polymarket)
 *
 * Source: /Users/test/vision/.factory/library/use-case-analysis.md
 */

import type { UseCaseAnalysis } from "./types";

export const USE_CASE_ANALYSES: UseCaseAnalysis[] = [
  // -----------------------------------------------------------------------
  // 1. Prediction Market Copy Trading / Signal Following (Live)
  // -----------------------------------------------------------------------
  {
    id: "util-copy-trading-signals",
    comparableMarketSize:
      "Prediction markets: $63.5B total volume in 2025 (4× YoY surge). Polymarket: $50.9B all-time volume, $7.1B March 2026 MTD (Dune-verified on-chain data from Polymarket dashboards). Social/copy trading platforms: $3.77B–$10.16B market by 2026, growing to $19.81B by 2035 at 7.4% CAGR. eToro (copy-trading pioneer): $931M revenue in 2024, $20.8B AUA, 3.73M funded accounts. 170+ tools and bots built around Polymarket ecosystem.",
    revenueModel:
      "2% per-fill fee on every Lite Mode copied trade routed through BETTER infrastructure. Token-gated access requires 50,000 BETTER (Lite) or 100,000 BETTER (Standard Terminal), creating sustained buy-side demand. Premium signal subscriptions at higher tiers could command additional fees.",
    estimatedRevenueRange: "$2–20M+ annualized (scenario-dependent)",
    tokenDemandImplications:
      "Every new copy-trader must acquire 50,000–100,000 BETTER to access signals, creating a direct demand sink. Copy-trading creates sticky retention — users maintain holdings to keep signal access. Successful copy-traders attract followers, creating a network effect: more holders → more volume → more fees. Prediction markets are the #1 crypto growth narrative, making new prediction-market users a natural on-ramp to BETTER token acquisition.",
    realisticTimeline:
      "Live now: Lite Mode copy trading with 2% per-fill fee is the current core product. Q2 2026: Enhanced signal-following features and wallet-basket strategies. Q3–Q4 2026: Premium signal channels with whale-tier gating.",
    keyDependencies: [
      "Polymarket continued growth and regulatory clarity (CFTC guidance positive as of Mar 2026)",
      "Quality of signal generation and trader performance data",
      "Competitive pressure from 170+ Polymarket ecosystem tools",
    ],
    source: {
      type: "external",
      label: "Dune Analytics / Polymarket On-Chain Data",
      href: "https://dune.com/polymarket/polymarket",
      asOf: "2026-03-23",
      note:
        "Polymarket volume figures ($50.9B all-time, $7.1B March 2026 MTD) are Dune-verified on-chain data from the Polymarket dashboard. Social trading market data from GlobeNewsWire and Business Research Insights. eToro figures from Q3 2025 earnings.",
    },
  },

  // -----------------------------------------------------------------------
  // 2. AI-Powered Trading Strategy Agents (Planned)
  // -----------------------------------------------------------------------
  {
    id: "util-strategy-agents",
    comparableMarketSize:
      "AI agent crypto sector: multi-billion-dollar combined market cap. Virtuals Protocol (VIRTUAL): $574M market cap with $79.83M daily volume. Blockchain AI market: $0.7B in 2025, projected to reach $1.88B by 2029 at 28% CAGR. Multiple major exchanges (Bybit, Kraken) launched AI agent trading tools in early 2026.",
    revenueModel:
      "Agent transaction fees (same 2% Lite fill fee or reduced Whale-tier rates). Tier-gated agent slot monetization — Lite: 1 agent, Standard: 2, Whale: 5, Apex: 10 — creates demand for higher token holdings. Agent compute credits and bonded agent deposits paid in BETTER tokens. Performance fees on agent-managed capital.",
    estimatedRevenueRange: "$0.1–10M+ annualized (scenario-dependent)",
    tokenDemandImplications:
      "Multiplicative demand: each agent requires its operator to hold BETTER for the tier gate + bond stake + operational credits. A Whale-tier user running 5 agents could lock 500K+ BETTER indefinitely. Agents trade 24/7, generating fees around the clock. Agent operators are a new holder category — infrastructure-level participants who need BETTER to operate, not speculate.",
    realisticTimeline:
      "Q2 2026 (Planned): Agent infrastructure launch and basic agent framework. Q3–Q4 2026: Agent marketplace, bonded registry, delegation mechanics. 2027: Mature autonomous agent ecosystem with third-party agent builders.",
    keyDependencies: [
      "Agent framework development and testing (internal build, AI-compressible)",
      "AI model reliability and safety audits",
      "Smart contract security for agent wallets and bonding mechanisms",
      "Regulatory clarity on autonomous trading agents",
    ],
    source: {
      type: "external",
      label: "Industry Research / CoinDesk / Gate.io",
      asOf: "2026-03-23",
      note:
        "AI agent market data from Research and Markets ($0.7B→$1.88B by 2029). Virtuals Protocol market cap from Gate.io (Jan 2026). CoinDesk reports AI agents are 'quietly rewriting prediction market trading' via protocols like Olas.",
    },
  },

  // -----------------------------------------------------------------------
  // 3. Social Vaults / Community-Created Strategy Vaults (In Progress)
  // -----------------------------------------------------------------------
  {
    id: "util-social-vaults",
    comparableMarketSize:
      "DeFi vault TVL: surpassed $15B in 2025. Total DeFi TVL: approaching $300B in 2026. On-chain revenue hit $20B in 2025 with 41% surge in fees to $9.7B in H1 2025. Kraken launched DeFi Earn (routing CEX deposits to on-chain vaults) attracting tens of millions within weeks. Prediction-market vaults are a novel category — no direct comparable at scale.",
    revenueModel:
      "20% performance fee on vault profits (split between vault manager and protocol). Wallet-level high-water mark ensures fees only on real profits. Token-gated participation: 25,000 BETTER minimum for social vaults (¼ of the 100,000 BETTER standard quant-team minimum). Community managers earn performance fees, creating a supply-side marketplace of strategists.",
    estimatedRevenueRange: "$0.5–20M+ annualized (scenario-dependent)",
    tokenDemandImplications:
      "Large-scale token lock: every vault participant must hold ≥25,000 BETTER (social) or ≥100,000 BETTER (quant-team). If 1,000 standard participants hold 100K each = 100M BETTER locked (14% of minted supply). Whales holding 500K+ get priority allocation via √-weighted bidding, creating incentive to hold above minimum. Vault managers likely hold Whale/Apex tier to demonstrate commitment. Social vaults are inherently viral — successful managers attract depositors who must all acquire BETTER.",
    realisticTimeline:
      "Q1 2026 (In Progress): First vault with $25K total deposit cap and 100K BETTER minimum. Q2–Q3 2026: Social vault framework launch with community vault creation tools. Q4 2026: Scaled vault marketplace with leaderboards and performance history.",
    keyDependencies: [
      "Smart contract audit completion for vault infrastructure",
      "Regulatory clarity on pooled investment vehicles",
      "Quality vault managers building track records",
      "Integration with prediction market venues (Polymarket, Kalshi)",
    ],
    source: {
      type: "external",
      label: "Lagoon Finance / TheDefiant / DeFiPrime",
      asOf: "2026-03-23",
      note:
        "Vault TVL from Lagoon Finance 'State of Onchain Vaults' (Mar 2026). Total DeFi TVL from TechBullion. On-chain revenue from TheDefiant/1kx (Oct 2025).",
    },
  },

  // -----------------------------------------------------------------------
  // 4. Personal AI-Crafted Vaults (Planned — Whale Exclusive)
  // -----------------------------------------------------------------------
  {
    id: "util-personal-ai-vaults",
    comparableMarketSize:
      "Crypto quant strategies: $15–30B AUM across 11+ crypto trading teams tracked by 1Token. Robo-advisory market: projected to surpass $30B in revenue by 2027. DeFi structured product vaults (Ribbon Finance, Friktion): peaked at $500M+ TVL. Personalized AI financial advisors: emerging category expanding from traditional (Wealthfront, Betterment) to crypto.",
    revenueModel:
      "Higher performance fees for Whale-tier exclusive product (modeled at 25–30% vs. 20% for social vaults). AI compute premium: custom strategy generation requires significant AI compute — paid in BETTER tokens. Monthly/quarterly subscription for continuous optimization and rebalancing. Bespoke configurations for Apex Whale holders.",
    estimatedRevenueRange: "$0.5–10M+ annualized (scenario-dependent)",
    tokenDemandImplications:
      "Highest per-user token demand: Whale tier (500K BETTER) is the minimum, Apex (2M BETTER) gets bespoke configurations. Premium retention: users receiving personalized AI strategies are the stickiest holders — switching costs are high. Aspirational demand driver: the existence of personal AI vaults gives Standard-tier holders a clear incentive to acquire more tokens toward Whale tier.",
    realisticTimeline:
      "Q3–Q4 2026 (Planned): Initial personal AI vault offering for Whale tier. H1 2027: Enhanced AI models with backtesting and custom parameter tuning. H2 2027: Full bespoke agent configurations for Apex tier.",
    keyDependencies: [
      "AI model quality and reliability for financial strategy generation",
      "Sufficient data from social vaults and terminal to train personalization models",
      "Whale-tier user base reaching critical mass (est. 200+ Whale holders)",
      "Regulatory framework for AI-managed investment products",
    ],
    source: {
      type: "external",
      label: "1Token Research / Industry Reports",
      asOf: "2026-03-23",
      note:
        "Crypto quant AUM from 1Token (Jan 2026). Robo-advisory projections from industry reports. DeFi structured products from Ribbon Finance/Friktion TVL data.",
    },
  },

  // -----------------------------------------------------------------------
  // 5. Research & Data Bounties (Planned)
  // -----------------------------------------------------------------------
  {
    id: "util-data-bounties",
    comparableMarketSize:
      "Blockchain data/analytics market: $1B+ annual revenue (Chainalysis $538M funding, Dune Analytics, Nansen, Messari, Amberdata). Crypto research platforms (Token Metrics, CoinGecko, CoinMarketCap): premium subscriptions $100–$2,000/month. Bug bounty precedent: Immunefi facilitated $100M+ in payouts. Broader blockchain market: $31–57B in 2025, growing at 50–80% CAGR.",
    revenueModel:
      "Bounty posting fees: 5–10% of bounty value as a listing fee. Data marketplace commissions: 10–20% on research signal sales, strategy backtests, and model outputs. Token-gated premium data access for higher-tier BETTER holders. Two-sided marketplace creating sustainable transaction volume.",
    estimatedRevenueRange: "$0.5–10M+ annualized (scenario-dependent)",
    tokenDemandImplications:
      "Two-sided demand: both data producers (researchers) and data consumers (traders) need BETTER to participate. New holder segment: data scientists, quant researchers, and analysts — a professional segment distinct from retail traders. Active bounties lock BETTER in escrow until fulfillment, reducing circulating supply.",
    realisticTimeline:
      "Q4 2026 (Planned): Basic data marketplace with prediction-market research outputs. H1 2027: Research bounty system with escrow and quality scoring. H2 2027: Full marketplace with peer review, reputation systems, and institutional feeds.",
    keyDependencies: [
      "Sufficient data generation from live products (terminal, vaults, agents)",
      "Quality control and peer review infrastructure (internal build)",
      "Researcher/analyst community building",
      "Data privacy and IP protection frameworks (legal review)",
    ],
    source: {
      type: "external",
      label: "Tracxn / Fortune Business Insights",
      asOf: "2026-03-23",
      note:
        "Chainalysis funding from Tracxn (Dec 2025). Blockchain market size from Fortune Business Insights ($31.18B in 2025). Bug bounty data from Immunefi.",
    },
  },

  // -----------------------------------------------------------------------
  // 6. Premium API & Agent Lanes (Planned)
  // -----------------------------------------------------------------------
  {
    id: "util-premium-lanes",
    comparableMarketSize:
      "API management market: projected at $25B+ by 2028. Institutional crypto infrastructure: Tradeweb led a $31M Series B at $200M valuation for Crossover Markets. Premium institutional crypto data APIs: $1,000–$10,000/month. Real-time trading APIs with priority access: $50,000+/year. CoinGecko, Amberdata, and Kaiko demonstrate enterprise willingness to pay for high-quality crypto data.",
    revenueModel:
      "Tiered API subscriptions: Free (rate-limited) → Standard (BETTER gate) → Premium (Whale/Apex gate + USDC subscription). Per-call pricing for burst capacity above tier limits. Token-gated priority lanes: Apex Whale holders (2M+ BETTER) get dedicated endpoints with lowest latency and highest rate limits. SLA-backed institutional pricing.",
    estimatedRevenueRange: "$0.5–15M+ annualized (scenario-dependent)",
    tokenDemandImplications:
      "Institutional-grade demand: institutions acquiring BETTER for API access represent large, stable holdings (Whale/Apex tier). Non-speculative holding: API access is an operational need — institutions hold BETTER as a cost of doing business. Sticky demand: once integrated, API switching costs are high, making institutional holders long-term.",
    realisticTimeline:
      "Q2–Q3 2026 (Planned): Basic API with token-gated rate limiting. Q4 2026: Premium API lanes with SLAs for institutional clients. H1 2027: Full B2B API suite with custom endpoints, data feeds, and priority support.",
    keyDependencies: [
      "API infrastructure build and documentation (internal, AI-compressible)",
      "Sufficient unique data moat (prediction-market signals, vault performance, agent data)",
      "Enterprise sales and partnership development",
      "SLA and uptime guarantees (99.9%+)",
    ],
    source: {
      type: "external",
      label: "CoinTelegraph / Industry Reports",
      asOf: "2026-03-23",
      note:
        "Crossover Markets funding from CoinTelegraph (Mar 2026). API economy projections from industry reports. Institutional data pricing from CoinGecko, Amberdata, Kaiko.",
    },
  },

  // -----------------------------------------------------------------------
  // 7. LLM & Inference Credits (Speculative)
  // -----------------------------------------------------------------------
  {
    id: "util-llm-credits",
    comparableMarketSize:
      "AI inference market: projected at $30B+ by 2027. LLM API costs declining rapidly (GPT-4-class models: $0.50–$3.00 per million tokens). Token-gated AI compute precedents: Render Network ($RNDR), Akash ($AKT), Bittensor ($TAO). Crypto-specific AI tools growing with sentiment analysis, on-chain pattern detection, and predictive modeling.",
    revenueModel:
      "Users burn BETTER tokens (or vBETTER credits) for AI-powered analysis: market summaries, strategy suggestions, risk assessments, research synthesis. Tiered access: Explorer: 0 credits, Lite: basic summaries, Standard: full analysis, Whale: unlimited, Apex: custom model access. Third-party AI models can sell analysis through BETTER's marketplace.",
    estimatedRevenueRange: "$1–12M+ annualized (scenario-dependent)",
    tokenDemandImplications:
      "Consumptive demand: unlike holding-based utility, LLM credits create ongoing consumptive demand — users must continuously acquire BETTER to use AI features. Usage-correlated demand: more active traders use more AI analysis → more BETTER consumption → natural demand scaling with engagement. Low barrier entry: even small LLM credit acquisitions bring new users into the BETTER ecosystem as new token holders.",
    realisticTimeline:
      "Q2–Q3 2026: Basic AI-powered analysis features integrated into Terminal. Q4 2026: Tiered LLM credit system with per-query pricing. H1 2027: Full AI analysis marketplace with third-party model integration.",
    keyDependencies: [
      "AI infrastructure (model hosting, inference scaling)",
      "Cost management (LLM inference costs vs. revenue per query)",
      "Quality of AI outputs (hallucination risk in financial analysis)",
      "Integration with OpenServ/BRAID for agent-native AI access",
    ],
    source: {
      type: "external",
      label: "Forbes / LLM Stats / Industry Reports",
      asOf: "2026-03-23",
      note:
        "AI inference market projections from industry research. LLM cost data from LLM Stats (Mar 2026). Forbes: 'AI advantage defined by how intelligently organizations allocate tokens, compute and energy' (Mar 2026).",
    },
  },

  // -----------------------------------------------------------------------
  // 8. Bonded Agent Registry (Planned)
  // -----------------------------------------------------------------------
  {
    id: "util-bonded-agents",
    comparableMarketSize:
      "Staking/security deposit models: $66.86B in liquid staking TVL. EigenLayer (restaking): $15B+ TVL in 2025. Agent registry precedents: Olas operates an on-chain agent registry with bonding mechanics; Virtuals Protocol uses token-based agent deployment gates. Academic research (arXiv, Mar 2026) formally catalogs trust boundaries as critical gaps for autonomous blockchain agents.",
    revenueModel:
      "Bond deposit requirement: 10,000–100,000 BETTER per agent depending on risk tier. Registration fees: one-time or annual fee in BETTER for each registry entry. Slashing revenue: misbehaving agents lose a portion of their bond, flowing to treasury or affected users. Insurance pool option: higher bond levels provide enhanced insurance for vault depositors.",
    estimatedRevenueRange: "$0.1–2M+ annualized (scenario-dependent)",
    tokenDemandImplications:
      "Permanent lock demand: bonded BETTER is locked for the lifetime of agent registration, reducing circulating supply. Professional operator demand: agent operators are a new holder class — they need BETTER for infrastructure access, not trading. Trust signal: higher bonds signal more trustworthy agents, creating incentive to over-collateralize. Multiplicative with agents: each agent × bond requirement = linear scaling of locked BETTER.",
    realisticTimeline:
      "Q3–Q4 2026 (Planned): Basic bonded agent registry with static bond requirements. H1 2027: Dynamic bonding based on agent risk scores and track records. H2 2027: Full insurance/slashing model with dispute resolution.",
    keyDependencies: [
      "Smart contract security for bonding/slashing mechanics (audit required)",
      "Agent performance scoring and monitoring infrastructure",
      "Legal framework for agent liability and bond forfeiture",
      "Sufficient agent ecosystem to justify registry infrastructure",
    ],
    source: {
      type: "external",
      label: "BingX / EigenLayer / arXiv Research",
      asOf: "2026-03-23",
      note:
        "Liquid staking TVL from BingX (Jan 2026). EigenLayer TVL from industry tracking. arXiv: 'Autonomous Agents on Blockchains' formally catalogs trust boundaries (Mar 2026).",
    },
  },

  // -----------------------------------------------------------------------
  // 9. Agent Delegation & Backing (Planned)
  // -----------------------------------------------------------------------
  {
    id: "util-delegation",
    comparableMarketSize:
      "Liquid staking/delegation: $66.86B TVL. Lido: $25B+ in delegated ETH. Pendle introduced sPENDLE governance token (Jan 2026). EigenLayer restaking: $15B+ TVL demonstrating massive demand for security-deposit-based delegation. eToro CopyTrading (TradFi delegation equivalent): significant share of $931M annual revenue.",
    revenueModel:
      "Delegation fees: 1–5% of delegation amount annually. Delegator reward share: delegators earn agent/vault performance minus delegation fee — protocol takes a cut. vBETTER (vault-share token): delegated BETTER could mint a liquid derivative usable in DeFi, creating additional protocol fee opportunities.",
    estimatedRevenueRange: "$0.5–5M+ annualized (scenario-dependent)",
    tokenDemandImplications:
      "Capital efficiency: delegation allows smaller holders to participate in whale-tier products by pooling tokens, broadening the holder base significantly. Reduced selling pressure: delegated BETTER earns yield, reducing incentive to sell. New holder segment: passive investors who want yield on BETTER holdings without active trading. Network effect: more delegation options → more attractive yield → more buyers → more delegatable capital.",
    realisticTimeline:
      "Q3–Q4 2026 (Planned): Basic delegation to vault managers and agents. H1 2027: vBETTER liquid delegation derivative. H2 2027: Cross-protocol delegation for use across multiple venues.",
    keyDependencies: [
      "Smart contract architecture for delegation/undelegation (audit required)",
      "Economic model balancing delegator returns vs. protocol fees",
      "Regulatory clarity on delegation as a financial product",
      "Sufficient yield opportunities to make delegation attractive",
    ],
    source: {
      type: "external",
      label: "BingX / Lido / Pendle / EigenLayer",
      asOf: "2026-03-23",
      note:
        "Liquid staking TVL from BingX (Jan 2026). Lido TVL from industry tracking. Pendle sPENDLE from DeFi research (Jan 2026). EigenLayer restaking TVL from multiple sources.",
    },
  },

  // -----------------------------------------------------------------------
  // 10. Whale Exclusive Products (Speculative)
  // -----------------------------------------------------------------------
  {
    id: "util-whale-exclusives",
    comparableMarketSize:
      "Enterprise blockchain market: projected to reach $287.8B by 2032 at 47.5% CAGR. Crypto data platforms (Chainalysis: $200M+ ARR; Nansen, Messari, Glassnode, Amberdata): $1B+ combined revenue. Financial data industry (Bloomberg: $11B+, Refinitiv: $6B, S&P: $4B+). CoinGecko Pro, CoinMarketCap Enterprise, and Kaiko demonstrate premium crypto data demand.",
    revenueModel:
      "Data licensing subscriptions: institutions pay monthly/annual fees for BETTER's unique prediction-market data, vault performance metrics, agent behavior data. Custom data packages for hedge funds, trading desks, academic researchers. Licensed AI models trained on BETTER's proprietary data, sold as SaaS. Token-gated access requiring BETTER holding or staking.",
    estimatedRevenueRange: "$0.5–15M+ annualized (scenario-dependent)",
    tokenDemandImplications:
      "BETTER-as-credential: enterprise API keys require BETTER holding or staking, creating institutional-grade demand for large, stable positions. Indirect demand: enterprise adoption validates BETTER's data quality, attracting retail users who follow institutional signals. Non-speculative stability: enterprise license revenue is recurring and predictable, supporting BETTER's fundamental valuation and attracting new long-term holders.",
    realisticTimeline:
      "Q4 2026 (Planned): Initial enterprise data products (prediction-market analytics, vault performance feeds). H1 2027: Custom data packages and institutional API access. H2 2027–2028: Full B2B data licensing with model distribution.",
    keyDependencies: [
      "Sufficient proprietary data accumulation from live products",
      "Enterprise sales infrastructure and legal frameworks",
      "Data privacy and compliance (GDPR, financial regulations)",
      "Competitive differentiation vs. Chainalysis, Dune, Nansen",
    ],
    source: {
      type: "external",
      label: "Market.us / Tracxn / Industry Reports",
      asOf: "2026-03-23",
      note:
        "Enterprise blockchain market from Market.us (Feb 2024). Chainalysis ARR from Tracxn (Dec 2025). Financial data industry revenue from public filings. BETTER's unique data moat: prediction-market copy-trading signals, vault strategies, and agent behavior data unavailable elsewhere.",
    },
  },
];
