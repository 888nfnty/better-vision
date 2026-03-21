/**
 * Seed data: Scenario assumption model.
 *
 * Three projection levels (conservative, base, upside) across five dimensions:
 * - Prediction markets
 * - Hyperliquid / HyperEVM
 * - Social vaults
 * - AI-agent tooling
 * - Enterprise rails
 *
 * Source: Mission roadmap guidance + illustrative assumptions.
 */

import {
  Scenario,
  ScenarioDimension,
  ScenarioLevel,
  DimensionAssumption,
  ProjectionOutput,
  SourceCue,
} from "./types";

// ---------------------------------------------------------------------------
// Assumption Source Cues
// ---------------------------------------------------------------------------

const scenarioSource: SourceCue = {
  type: "scenario_based",
  label: "BETTER Scenario Model",
  note:
    "These are illustrative scenario-based assumptions, not predictions. Actual outcomes depend on market conditions, execution, and adoption.",
};

const externalSource: SourceCue = {
  type: "external",
  label: "Market Research",
  note:
    "Based on publicly available prediction-market and DeFi growth estimates.",
};

// ---------------------------------------------------------------------------
// Scenario Definitions
// ---------------------------------------------------------------------------

function buildAssumptions(
  level: ScenarioLevel,
  values: Record<ScenarioDimension, { value: number; unit: string; description: string }>
): DimensionAssumption[] {
  const dimensions: ScenarioDimension[] = [
    "prediction_markets",
    "hyperliquid_hyperevm",
    "social_vaults",
    "ai_agent_tooling",
    "enterprise_rails",
  ];
  return dimensions.map((dim) => ({
    dimension: dim,
    value: values[dim].value,
    unit: values[dim].unit,
    description: values[dim].description,
    source: dim === "prediction_markets" ? externalSource : scenarioSource,
  }));
}

export const SCENARIOS: Scenario[] = [
  {
    level: "conservative",
    label: "Conservative",
    description:
      "Modest growth: prediction markets grow steadily, BETTER captures a small niche, and advanced infrastructure stays limited.",
    assumptions: buildAssumptions("conservative", {
      prediction_markets: {
        value: 5,
        unit: "$B total market volume (annual)",
        description:
          "Prediction-market total addressable volume stays at ~$5B/year with moderate retail growth.",
      },
      hyperliquid_hyperevm: {
        value: 2,
        unit: "% of Hyperliquid prediction volume",
        description:
          "BETTER captures a small slice of Hyperliquid-native prediction activity.",
      },
      social_vaults: {
        value: 5,
        unit: "$M total vault AUM",
        description:
          "Social vaults attract modest deposits — primarily early community members.",
      },
      ai_agent_tooling: {
        value: 50,
        unit: "active agents",
        description:
          "Limited autonomous agent adoption — mostly power users and internal testing.",
      },
      enterprise_rails: {
        value: 0.5,
        unit: "$M annual enterprise revenue",
        description:
          "Minimal B2B traction — a handful of data licensing pilots.",
      },
    }),
  },
  {
    level: "base",
    label: "Base",
    description:
      "Healthy growth: prediction markets expand meaningfully, BETTER establishes a credible position across products and infrastructure.",
    assumptions: buildAssumptions("base", {
      prediction_markets: {
        value: 15,
        unit: "$B total market volume (annual)",
        description:
          "Prediction markets grow 3x as regulatory clarity and product quality improve.",
      },
      hyperliquid_hyperevm: {
        value: 5,
        unit: "% of Hyperliquid prediction volume",
        description:
          "BETTER becomes a recognizable player in Hyperliquid prediction-market activity.",
      },
      social_vaults: {
        value: 25,
        unit: "$M total vault AUM",
        description:
          "Social vaults gain traction with a growing community of depositors and managers.",
      },
      ai_agent_tooling: {
        value: 500,
        unit: "active agents",
        description:
          "Meaningful agent adoption — community-built strategies and delegated capital flows.",
      },
      enterprise_rails: {
        value: 3,
        unit: "$M annual enterprise revenue",
        description:
          "Multiple enterprise data licensing deals and early API revenue.",
      },
    }),
  },
  {
    level: "upside",
    label: "Upside",
    description:
      "Breakout growth: prediction markets become mainstream, BETTER captures outsized share through agent-native mechanics and infrastructure moats.",
    assumptions: buildAssumptions("upside", {
      prediction_markets: {
        value: 50,
        unit: "$B total market volume (annual)",
        description:
          "Prediction markets reach mainstream adoption, catalyzed by major political and sports events.",
      },
      hyperliquid_hyperevm: {
        value: 12,
        unit: "% of Hyperliquid prediction volume",
        description:
          "BETTER becomes the dominant intelligence layer for Hyperliquid-native predictions.",
      },
      social_vaults: {
        value: 100,
        unit: "$M total vault AUM",
        description:
          "Vaults become a major DeFi primitive with significant community and institutional deposits.",
      },
      ai_agent_tooling: {
        value: 5000,
        unit: "active agents",
        description:
          "Thriving agent ecosystem with autonomous strategies, delegation markets, and cross-platform integrations.",
      },
      enterprise_rails: {
        value: 15,
        unit: "$M annual enterprise revenue",
        description:
          "BETTER's data and model licensing becomes a significant institutional revenue stream.",
      },
    }),
  },
];

// ---------------------------------------------------------------------------
// Projection Outputs
// ---------------------------------------------------------------------------

/**
 * Projection outputs derived from scenario assumptions.
 * Conservative ≤ Base ≤ Upside ordering is enforced by validation.
 */
export const PROJECTION_OUTPUTS: ProjectionOutput[] = [
  {
    metric: "Annualized Protocol Revenue",
    unit: "$M",
    conservative: 1.2,
    base: 8.5,
    upside: 45,
    dependsOn: [
      "re-trading-tax",
      "re-lite-mode-fees",
      "re-vault-performance",
      "re-agent-fees",
    ],
    source: {
      type: "scenario_based",
      label: "BETTER Scenario Model",
      note:
        "Sum of trading tax, Lite Mode fees, vault performance fees, and agent fees under each scenario.",
    },
  },
  {
    metric: "Monthly Active Terminal Users",
    unit: "users",
    conservative: 2_000,
    base: 15_000,
    upside: 80_000,
    dependsOn: ["pe-terminal-open", "pe-lite-mode"],
    source: {
      type: "scenario_based",
      label: "BETTER Scenario Model",
      note: "Projected Terminal MAU post open access.",
    },
  },
  {
    metric: "Total Vault AUM",
    unit: "$M",
    conservative: 5,
    base: 25,
    upside: 100,
    dependsOn: ["pe-social-vaults"],
    source: {
      type: "scenario_based",
      label: "BETTER Scenario Model",
      note: "Total deposits across all social vaults.",
    },
  },
  {
    metric: "Active Autonomous Agents",
    unit: "agents",
    conservative: 50,
    base: 500,
    upside: 5_000,
    dependsOn: ["pe-strategy-agents", "sa-bonded-agents"],
    source: {
      type: "scenario_based",
      label: "BETTER Scenario Model",
      note: "Registered and active agents in the BETTER ecosystem.",
    },
  },
  {
    metric: "Enterprise Revenue",
    unit: "$M",
    conservative: 0.5,
    base: 3,
    upside: 15,
    dependsOn: ["re-enterprise-data", "pe-b2b-data"],
    source: {
      type: "scenario_based",
      label: "BETTER Scenario Model",
      note: "Annual B2B data licensing and API revenue.",
    },
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Get a scenario by level */
export function getScenario(level: ScenarioLevel): Scenario {
  const scenario = SCENARIOS.find((s) => s.level === level);
  if (!scenario) throw new Error(`Unknown scenario level: ${level}`);
  return scenario;
}

/** Get the assumption for a specific dimension within a scenario */
export function getAssumption(
  level: ScenarioLevel,
  dimension: ScenarioDimension
): DimensionAssumption {
  const scenario = getScenario(level);
  const assumption = scenario.assumptions.find(
    (a) => a.dimension === dimension
  );
  if (!assumption) {
    throw new Error(
      `Missing assumption for ${dimension} in ${level} scenario`
    );
  }
  return assumption;
}

/** Get all projection outputs for a specific scenario level */
export function getProjectionValues(
  level: ScenarioLevel
): Array<{ metric: string; value: number; unit: string }> {
  return PROJECTION_OUTPUTS.map((p) => ({
    metric: p.metric,
    value: p[level],
    unit: p.unit,
  }));
}
