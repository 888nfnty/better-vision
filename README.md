# BETTER Vision

BETTER Vision is a graph-first Next.js site for the BETTER ecosystem. It packages the investor story, product proof, roadmap, tokenomics, architecture, and evidence surfaces into one explorable workspace.

## Content Sections

- **What is BETTER** — brand framing, mission, and product promise
- **Macro Thesis** — geopolitical risk, prediction-market accuracy, and market opportunity
- **Proof & Trust / Live Now** — current product proof, maturity framing, and live cues
- **Roadmap** — graph-first roadmap exploration with execution plans and proof gates
- **Tokenomics & Valuation** — minted supply, whale-first access, vault modeling, and valuation corridors
- **Architecture** — stack layers, infrastructure sequencing, and BETTER flywheel context
- **HFT Edge** — Rust execution, co-location, latency, sizing, and copy-trading mechanics
- **LLM Product** — BRAID-backed prediction-market model product and subscription framing
- **TRUTH-PERP & Flywheel** — Hyperliquid moat, vBETTER arbitrage, and buy-and-burn loop
- **Evidence & Risks** — evidence hooks, source paths, caveats, and dependency framing

## Project Structure

- `src/app` — App Router entrypoints, layout, and global styles
- `src/components` — graph shell, proof surfaces, tokenomics, architecture, and shared UI
- `src/content` — typed content/data models for roadmap, tokenomics, valuation, and new deep-dive surfaces

## Local Development

```bash
npm install
npm run dev -- --hostname 127.0.0.1 --port 3100
```

Open `http://127.0.0.1:3100`.

## Validation

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```

## Production Preview

```bash
npm run build
HOSTNAME=127.0.0.1 PORT=3100 npm run start -- --hostname 127.0.0.1 --port 3100
```
