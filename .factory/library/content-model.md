# Content Model

Source-of-truth guidance for structured content, roadmap nodes, token tiers, and scenario data.

**What belongs here:** Required branch families, shared fields, taxonomy expectations, scenario dimensions.

---

## Required roadmap branch families
- Product evolution
- Token utility and access tiers
- Revenue expansion
- Technical infrastructure
- Social / agent ecosystem expansion

## Shared content fields
Each roadmap or economics item should have typed fields for:
- stable id
- title
- maturity/status
- plain-language summary
- dependency or prerequisite notes
- unlock/outcome notes
- evidence/source or assumption cue
- confidence framing when future-facing

## Dependency conventions
- Narrative `ConfidenceFrame.dependencies` values are rendered directly to users, so they must stay as readable user-facing notes rather than internal IDs.
- Roadmap node `dependencies` are typed as stable roadmap-node IDs and should be resolved to readable labels in the UI.
- Architecture cost-band phase `dependencies` are typed as stable phase IDs in `src/content/types.ts`; keep them ID-backed rather than label-backed if future work touches that model.

## Narrative surface
- Narrative content is a first-class typed surface alongside roadmap, tokenomics, projections, and architecture content.
- Seed narrative blocks currently live in `src/content/narrative.ts` and drive the `hero`, `current_scope`, and `vision` surfaces.
- Narrative blocks should carry a stable id, surface, order, title, body, maturity/status, source cue, and confidence framing when future-facing.
- `src/components/CaveatFrame.tsx` renders `ConfidenceFrame.dependencies` directly to users, so dependency values must be readable user-facing notes rather than internal roadmap IDs.

## Scenario model dimensions
The scenario system should expose assumptions for:
- prediction-market growth
- Hyperliquid / HyperEVM adoption
- social-vault participation
- AI-agent tooling usage
- enterprise rails / B2B demand

## Token tier model dimensions
Each tier should capture:
- threshold and qualification basis
- access priority
- allocation priority
- preview priority
- agent limits
- fee advantage
- exclusive products or capabilities
