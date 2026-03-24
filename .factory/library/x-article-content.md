# X Article Content — @tradebetterapp

Condensed reference of key claims, data points, and thesis material from the tradebetter X (Twitter) articles. Workers should cite this when building content surfaces.

**What belongs here:** Factual claims, data points, formulas, and product descriptions sourced from published @tradebetterapp articles.
**What does NOT belong here:** Implementation details, design tokens, or environment config.

---

## Macro Thesis

- **Iran strikes (Feb 28, 2026):** US/Israeli strikes on Iranian military and nuclear targets; Iran retaliates against Kuwait bases, Saudi/Qatar energy infrastructure.
- **Strait of Hormuz:** ~20% of global oil supply flows through this chokepoint — the core geopolitical risk vector.
- **Research sources:** Morgan Stanley research, JP Morgan mid-year outlook, Stimson Center Top 10 Risks 2026.
- **60/40 portfolio failure:** Asset correlations converged toward 1.0, breaking the traditional diversification thesis.
- **BTC as high-beta asset:** Spot ETF institutionalization drove BTC to 97,939 peak, followed by 31.5% crash to 60–66k range. BTC–S&P 500 correlation reached 0.55.
- **Memecoin collapse:** Market cap fell from $150B to $38–42B (61% loss); trading volume down 85%; 82.8% rug-farming rate per Nansen and academic studies.
- **Prediction market superiority:** Polymarket Brier score of 0.0565 (77% more accurate than coin flip). 91.2% accuracy 1 month out, 97% in final hours.
- **Volume growth:** 130× growth from early 2024 to late 2025 ($100M → $13B/month). $140.63B cumulative volume. $847M open interest.
- **Brier score formula:** Mean squared difference between predicted probability and actual binary outcome.
- **High-volume market accuracy:** 0.0256 Brier 12 hours before resolution, 0.0159 Brier 1 day before.
- **Retail loss rate:** 89% of retail Polymarket traders lose money (alpha decay at speed of light).

---

## HFT Edge

- **Rust execution engine:** Garbage collection pauses in Python/Node.js are fatal in HFT. Rust eliminates this.
- **Latency:** 0.11ms (Rust) vs 8ms (Python) on Polygon CLOB — ~73× faster.
- **Co-location:** Same AWS data center as Polymarket CLOB for minimal network latency.
- **Z-Score algorithm:** Surfaces wallets with 35–70× average market returns, Sharpe >40 in Up/Down markets across 5m, 15m, 1H, 4H, 1D timeframes.
- **Pipeline:** Ingestion → BRAID workflows (LONG) → Deterministic gates → Deterministic sizing → Deterministic execution.
- **FAST15M strategy:** Rust-only, short horizon, no LLM. States: Join → Chase → Cross → Abort.
- **LONG strategy:** BRAID + multi-LLM consensus (3-of-4 agreement); execution remains deterministic.
- **Core math:**
  - Effective price: `π_eff = π_ask + c_fee + c_slip`
  - Edge: `e = p − π_eff`
  - Kelly sizing: `f* = max(0, (p − π_eff) / (1 − π_eff))`
  - Deployed fraction: `f_deploy = λ · min(f*, f_max)`
- **Paper trade results:** ~60× ROI, thousands of trades, tight drawdown.
- **Copy trading:** One-click, gas-sponsored, UDA (Unified Deposit Account), Base/ETH → Polygon USDC.e routing.
- **BRAID 4-way consensus:** Grok, Gemini, Opus, GPT — 88% win rate at 3/4 agreement, 100% at 4/4.

---

## LLM Product

- Fine-tuning a prediction-market-focused LLM via reinforcement learning, parameterization, and quantizing.
- BRAID reasoning DAG built directly into the model.
- **$29/mo** standalone API subscription.
- Scaling discounts for larger $BETTER holders.
- OpenRouter credits: access sold for API calls.
- Separate revenue stream from Terminal/Vault — anyone can subscribe.
- Helps others build and improve their own trading strategies.

---

## TRUTH-PERP & Flywheel

### Phases
- **Phase 1 — Tokenizing the Vault (Q1 2026):** Token-gated Terminal + Staking-to-Enable Vault.
- **Phase 2 — Arbitrage Flywheel (Q2 2026):** vBETTER on DEXs, ETF premium arbitrage.
- **Phase 3 — End Game HIP-3 (Q4 2026):** $TRUTH-PERP on Hyperliquid.

### Key Mechanisms
- **HIP-3:** Permissionless perp listing; requires 500,000 HYPE staking ($11M). Creates a competitive moat.
- **vBETTER:** Receipt token for vault shares (enzyme.finance). Liquid staking with LP incentives on Aerodrome/Uniswap.
- **Arbitrage:** When vBETTER trades at premium, protocol mints and sells, capturing spread → buy & burn $BETTER.
- **Buy & burn:** 30% of net arbitrage profits from vBETTER and TRUTH-PERP arb → buy & burn $BETTER.

### Revenue Streams
- 20% performance fee on vault profits.
- B2B ingestion product.
- OpenRouter LLM credits.
- 2% buy / 2% sell tax.

---

*Source: @tradebetterapp X articles. Cross-reference with economics.md for token policy models and tradebetter-comparison-evidence.md for competitive analysis.*
