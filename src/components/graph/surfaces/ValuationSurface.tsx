/**
 * ValuationSurface — the "Valuation" graph surface content.
 * Renders valuation corridors and vault-capacity modeling when
 * focused via the graph shell.
 *
 * This surface is the target for the Valuation gate in the
 * investor pitch path (gate-valuation → valuation node).
 */
import ValuationCorridors from "@/components/tokenomics/ValuationCorridors";
import VaultCapacityModel from "@/components/tokenomics/VaultCapacityModel";

export function ValuationSurface() {
  return (
    <div className="space-y-10">
      <p className="text-sm text-white">
        Conservative stage-based valuation corridors tied to milestone proof
        gates and comparable categories, plus rigorous vault-capacity modeling
        for stake-to-deposit-share estimation.
      </p>

      {/* VAL-TOKEN-015: Conservative stage-based valuation corridors */}
      <ValuationCorridors />

      {/* VAL-TOKEN-016: Stake-to-vault capacity modeling */}
      <VaultCapacityModel />
    </div>
  );
}
