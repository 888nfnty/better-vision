/**
 * RisksSurface — the "Risks & Caveats" graph surface content.
 */
import { BetterCard } from "@/components/ui/BetterCard";

export function RisksSurface() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-white">
        This site represents BETTER&apos;s vision — not a guarantee. Here are the key uncertainties.
      </p>

      <div className="space-y-4">
        <RiskItem
          title="Roadmap items are not guarantees"
          body="Items labeled Planned or Speculative represent directional ambitions. Timelines, scope, and feasibility depend on market conditions, technical execution, and resource availability."
        />
        <RiskItem
          title="Projections are scenario-based, not predictions"
          body="All projection numbers are derived from explicit assumption sets (conservative, base, upside). They illustrate possibility ranges — actual outcomes will differ."
        />
        <RiskItem
          title="Token thresholds may change"
          body="Access gate thresholds, tier boundaries, and fee structures are subject to FDV ratchet adjustments and governance decisions. Current values reflect the latest published state."
        />
        <RiskItem
          title="External dependencies exist"
          body="BETTER's roadmap depends on external platforms (Polymarket, Hyperliquid, Polygon, OpenServ) whose availability, economics, and APIs may change independently."
        />
        <RiskItem
          title="Regulatory environment is evolving"
          body="Prediction markets and DeFi operate in a rapidly evolving regulatory landscape. Changes in regulation could affect product availability, geographic access, or feature scope."
        />
      </div>

      <p className="text-center text-xs text-white/70">
        For the latest verified information, always refer to{" "}
        <a
          href="https://docs.tradebetter.app"
          target="_blank"
          rel="noopener noreferrer"
          className="underline transition-colors hover:text-white/70"
        >
          docs.tradebetter.app
        </a>
        {" "}as the canonical source of truth.
      </p>
    </div>
  );
}

function RiskItem({ title, body }: { title: string; body: string }) {
  return (
    <BetterCard
      className="p-4"
      data-testid="risk-item"
    >
      <h3 className="mb-1 text-sm font-semibold text-white">{title}</h3>
      <p className="text-sm text-white">{body}</p>
    </BetterCard>
  );
}
